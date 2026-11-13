#!/usr/bin/env python3
"""Measure one rendered page for a migration: screenshots at 390 and 1440 px plus the inventory of inspect-page.js.

Usage:
    python3 inspect-page.py https://www.old-site.example/offer/ --out analysis/old-home [--check-links] [--widths 390,1440]
    python3 inspect-page.py "<signed preview URL>" --out analysis/new-home        # the same for the new page

Writes into the --out directory:
    page-<width>.png   full-page screenshot per width (lazy content is scrolled into view first)
    first-screen-<width>.png   the first viewport per width

Long pages: Chrome cannot capture more than 16384 px in one full-page screenshot; beyond that it silently repeats
earlier content. A page taller than LONG_PAGE_PX is therefore captured viewport by viewport while scrolling (fixed and
sticky elements hidden after the first shot, so floating bars and widgets do not repeat) and stitched into
page-<width>.png with Pillow. Without Pillow (pip install pillow) the parts stay as page-<width>-<n>.png, top to bottom,
and a warning is printed.
    inspect.json       {"url", "widths": {"390": <inventory>, "1440": <inventory>}, "links": [...]}
The inventory (see inspect-page.js): sections in order, every call to action classified (payment, booking, anchor,
placeholder, legal, internal, external, mailto, tel, chat, button), forms with provider, fields, labels, hidden
fields and whether they sit in a modal, modals, embedded videos and maps, tracking scripts with their ids, computed
fonts and colours of body, headings, links and buttons, loaded font faces, images with natural sizes, CSS background
images, testimonial texts, placeholder texts and the numbers the page shows.

--check-links requests every distinct http(s) link once (HEAD, then GET) and reports its status; nothing is submitted.

Needs a headless browser: python `playwright` (pip install playwright && playwright install chromium), else the
`agent-browser` CLI. Without either, paste inspect-page.js into your browser tool's JavaScript console and take the
screenshots there. Python 3.9+.
"""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
JS = (HERE / "inspect-page.js").read_text(encoding="utf-8")
USER_AGENT = "Mozilla/5.0 (compatible; WebsiteMigrationInspector/1.0)"
SCROLL_JS = """(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 600) { window.scrollTo({top: y, left: 0, behavior: "instant"}); await new Promise(r => setTimeout(r, 120)); } window.scrollTo({top: 0, left: 0, behavior: "instant"}); return true; })()"""

# Chrome's limit for one capture is 16384 px (GPU texture size); stay clearly below it.
LONG_PAGE_PX = 16000
HEIGHT_JS = "Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0)"
# behavior "instant": pages with html { scroll-behavior: smooth } (every vocavo theme) would otherwise still be at the
# old position when scrollY is read, and the stitching would stop after the first screen.
SCROLL_TO_JS = "(() => { window.scrollTo({top: %d, left: 0, behavior: 'instant'}); return window.scrollY; })()"
# Opacity as well as visibility: a child with its own `visibility: visible` (widgets do that) would stay visible.
HIDE_FLOATING_JS = """(() => { let n = 0; for (const el of document.querySelectorAll('body *')) { if (el.hasAttribute('data-inspect-style')) continue; const p = getComputedStyle(el).position; if (p === 'fixed' || p === 'sticky') { el.setAttribute('data-inspect-style', el.getAttribute('style') ?? '\\u0000'); el.style.setProperty('visibility', 'hidden', 'important'); el.style.setProperty('opacity', '0', 'important'); n++; } } return n; })()"""
SHOW_FLOATING_JS = """(() => { for (const el of document.querySelectorAll('[data-inspect-style]')) { const s = el.getAttribute('data-inspect-style'); if (s === '\\u0000') el.removeAttribute('style'); else el.setAttribute('style', s); el.removeAttribute('data-inspect-style'); } return true; })()"""


def capture_full_page(path: Path, viewport_height: int, evaluate, viewport_shot, full_shot, wait) -> None:
    """page-<width>.png: one native full-page shot up to LONG_PAGE_PX, else viewport shots while scrolling, stitched."""
    total = int(evaluate(HEIGHT_JS) or 0)

    if total <= LONG_PAGE_PX:
        full_shot(path)
        return

    parts: list[tuple[Path, int]] = []
    y = 0
    try:
        while True:
            scrolled = int(evaluate(SCROLL_TO_JS % y) or 0)
            wait(250)
            part = path.with_name(f"{path.stem}-{len(parts) + 1}.png")
            viewport_shot(part)
            parts.append((part, scrolled))
            # After every shot, so a widget that appears late (on scroll) is caught too.
            evaluate(HIDE_FLOATING_JS)
            total = max(total, int(evaluate(HEIGHT_JS) or 0))
            if scrolled + viewport_height >= total or (len(parts) > 1 and scrolled <= parts[-2][1]):
                break
            y = scrolled + viewport_height
    finally:
        evaluate(SHOW_FLOATING_JS)
        evaluate(SCROLL_TO_JS % 0)

    try:
        from PIL import Image
    except ImportError:
        print(f"Warning: {path.name}: the page is {total} px high, above {LONG_PAGE_PX} px (Chrome captures at most 16384 px at once); "
              f"Pillow is missing (pip install pillow), so it is kept in {len(parts)} parts {path.stem}-1.png … "
              f"{path.stem}-{len(parts)}.png, top to bottom.", file=sys.stderr)
        return

    images = [Image.open(part) for part, _ in parts]
    scale = images[0].height / viewport_height  # device pixels per CSS pixel
    bottom = parts[-1][1] + viewport_height
    sheet = Image.new("RGB", (images[0].width, round(bottom * scale)), "white")
    for image, (_, scrolled) in zip(images, parts):
        sheet.paste(image.convert("RGB"), (0, round(scrolled * scale)))
        image.close()
    sheet.save(path)
    for part, _ in parts:
        part.unlink()


def with_playwright(url: str, widths: list[int], out: Path) -> dict:
    from playwright.sync_api import sync_playwright

    results = {}
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        try:
            for width in widths:
                height = 844 if width < 800 else 900
                page = browser.new_page(viewport={"width": width, "height": height}, user_agent=USER_AGENT)
                page.goto(url, wait_until="networkidle", timeout=45000)
                page.evaluate(SCROLL_JS)
                page.wait_for_timeout(800)
                capture_full_page(
                    out / f"page-{width}.png", height, page.evaluate,
                    lambda path: page.screenshot(path=str(path), full_page=False),
                    lambda path: page.screenshot(path=str(path), full_page=True),
                    page.wait_for_timeout,
                )
                page.screenshot(path=str(out / f"first-screen-{width}.png"), full_page=False)
                results[str(width)] = json.loads(page.evaluate(JS))
                page.close()
        finally:
            browser.close()
    return results


def with_agent_browser(url: str, widths: list[int], out: Path) -> dict:
    def run(*args: str, timeout: float = 60) -> str:
        return subprocess.run(["agent-browser", *args], capture_output=True, text=True, timeout=timeout, check=True).stdout.strip()

    results = {}
    try:
        for width in widths:
            height = 844 if width < 800 else 900
            run("set", "viewport", str(width), str(height))
            run("open", url)
            try:
                run("wait", "--load", "networkidle")
            except (subprocess.SubprocessError, OSError):
                run("wait", "2000")
            run("eval", SCROLL_JS)
            run("wait", "800")
            run("screenshot", str(out / f"first-screen-{width}.png"))
            capture_full_page(
                out / f"page-{width}.png", height,
                lambda js: json.loads(run("eval", js) or "null"),
                lambda path: run("screenshot", str(path)),
                lambda path: run("screenshot", "--full", str(path)),
                lambda ms: run("wait", str(int(ms))),
            )
            value = json.loads(run("eval", JS))
            results[str(width)] = json.loads(value) if isinstance(value, str) else value
    finally:
        try:
            run("close")
        except (subprocess.SubprocessError, OSError):
            pass
    return results


def check_links(inventories: dict) -> list[dict]:
    hrefs = set()
    for inventory in inventories.values():
        for cta in inventory.get("ctas", []):
            href = cta.get("href") or ""
            if href.startswith("http"):
                hrefs.add(href)
            elif href.startswith("/"):
                hrefs.add(inventory["url"].split("/", 3)[0] + "//" + inventory["url"].split("/", 3)[2] + href)
    rows = []
    for href in sorted(hrefs):
        status, final, error = None, None, None
        for method in ("HEAD", "GET"):
            try:
                request = urllib.request.Request(href, method=method, headers={"User-Agent": USER_AGENT})
                with urllib.request.urlopen(request, timeout=15) as response:
                    status, final = response.status, response.geturl()
                break
            except urllib.error.HTTPError as exc:
                status, final = exc.code, href
                if method == "GET" or exc.code not in (403, 405, 501):
                    break
            except (urllib.error.URLError, TimeoutError, OSError) as exc:
                error = str(exc)
        rows.append({"url": href, "status": status, "final_url": final, "error": error, "broken": error is not None or (status or 0) >= 400})
    return rows


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    parser.add_argument("url")
    parser.add_argument("--out", required=True, help="Output directory (screenshots and inspect.json)")
    parser.add_argument("--widths", default="390,1440", help="Viewport widths, comma-separated (default 390,1440)")
    parser.add_argument("--check-links", action="store_true", help="Request every linked URL once and report its status")
    args = parser.parse_args()

    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    widths = [int(w) for w in args.widths.split(",") if w.strip()]

    try:
        import playwright.sync_api  # noqa: F401

        runner = with_playwright
    except ImportError:
        runner = with_agent_browser if shutil.which("agent-browser") else None

    if runner is None:
        print("No headless browser: `pip install playwright && playwright install chromium`, or `npm i -g agent-browser && agent-browser install`. "
              "Or paste scripts/inspect-page.js into your browser tool and take the screenshots there.", file=sys.stderr)
        return 2

    inventories = runner(args.url, widths, out)
    result = {"url": args.url, "widths": inventories}
    if args.check_links:
        result["links"] = check_links(inventories)

    (out / "inspect.json").write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    desktop = inventories.get(str(max(widths)), {})
    kinds: dict[str, int] = {}
    for cta in desktop.get("ctas", []):
        kinds[cta["kind"]] = kinds.get(cta["kind"], 0) + 1
    print(f"{args.url}: {len(desktop.get('sections', []))} sections, {len(desktop.get('forms', []))} forms, "
          f"{len(desktop.get('embeds', []))} embeds, tracking {[t['name'] for t in desktop.get('tracking', [])]}, ctas {kinds}")
    if desktop.get("placeholders") or desktop.get("problems", {}).get("placeholder_links"):
        print(f"Placeholders: {desktop.get('placeholders')} / links to '#': {desktop['problems']['placeholder_links']}")
    if args.check_links:
        broken = [row for row in result["links"] if row["broken"]]
        print(f"Links: {len(result['links'])} checked, {len(broken)} broken")
    print(f"Wrote {out}/inspect.json and screenshots page-<width>.png, first-screen-<width>.png")
    return 0


if __name__ == "__main__":
    sys.exit(main())

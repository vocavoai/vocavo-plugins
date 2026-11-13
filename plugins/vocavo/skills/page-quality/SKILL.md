---
name: page-quality
description: 'The quality gate before the owner sees a page and before any traffic goes to it: run the automatic page check (load speed, image and video weight on a phone, overlapping or cut-off elements on mobile, links, forms), fix what is wrong yourself, check again, then show screenshots and the remaining notes in plain words. Use for "Ist die Seite gut?", "Qualitätscheck", "Seite prüfen", "lädt die Seite schnell?", "sieht das auf dem Handy gut aus?", "ist alles bereit für Traffic?", "check the page", "quality check".'
---

# Page quality gate

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`.

**Rule: a page is never shown as ready while its latest report is a fail or `stale` (the page changed after the check).** "Ready" means: a report with verdict "pass" or "pass-with-notes", made after the last edit, and you looked at its screenshots.

Run it: before the owner sees a new or changed page (also every variant of a test), before ads or a campaign link point to it, and when the owner asks.

## 1. Check

Find the page: `manage-site` `list` (resource `page`) by title or slug; ask when two fit. `manage-quality` `check-page` with `page_id` (or `path`) and `state: "draft"` (the default: an unpublished change is what will go live) or `state: "live"`. It renders the page in a real browser at phone (390 px, slow network) and desktop size and takes 30 to 120 seconds; with `queue: true` it returns at once and `manage-quality` `get-report` (`report_id`) is polled while the status is queued or running.

The report: `verdict` ("fail" on any blocker, "pass-with-notes" with majors or minors, else "pass"), `findings` (severity blocker, major, minor or info, a message in the website's language, the element, a close-up screenshot), `metrics` per viewport (LCP, CLS, transfer size), `screenshots` (first screen and full page per viewport, the first screens also inline), `summary_for_owner`, `stale` (true once the page changed after the check) and `since_previous` (fixed and new against the last report). Earlier reports: `manage-quality` `list-reports`. Before and after, or a variant against its control: `manage-quality` `compare` (`report_id` and `other_report_id`, or `page_id` and `other_page_id`). A whole website: `manage-quality` `check-website` (queued, one report per published page, at most 25).

`QUALITY_BROWSER_UNAVAILABLE`: the check cannot run on this server. Say so, do the manual checks below, never call the page checked, and offer `send-feedback`.

Add what the check does not cover: `manage-seo` `inspect-page` (`page_id`, `draft: true`) and `manage-site` `preview-page` for the signed preview link.

## 2. Fix, then check again

Fix every blocker and every major finding yourself before the owner sees the page, then run `manage-quality` `check-page` again; fix a minor one when it is quick. At most three fix-and-check rounds; what is still open after that goes to the owner with the reason.

These are draft edits: nothing is live, so layout and technical fixes need no yes (moving a badge below a button, a lighter image, a missing alt text). Anything a visitor would read differently needs the owner: texts, claims, prices, removing an element, brand colours. The playbook's design rules always apply.

| Finding (plain words) | Usual fix |
|---|---|
| Slow first screen on a phone (`lcp_slow`), heavy hero image (`image_oversized`, `page_heavy`) | a lighter source through `manage-site` `import-media-from-url` (`url` of the owner's original export, or of one you made if this session can resize images); none at hand: ask the owner for one and say what the heavy image costs the visitor |
| A video that loads megabytes before anyone clicks (`video_bytes_before_interaction`, `video_autoplay_heavy`) | a `video` block (YouTube or Vimeo, loads after the click) instead of a file; never autoplay a large video above the fold |
| Something covers a button or field on mobile (`covered_cta`, a badge, a sticky bar, a chat bubble) | move or shrink the element in the blocks, or a theme fix (`theme-authoring`); re-check at 390 px |
| Text cut off, horizontal scrolling, a tap target too small | block settings or theme CSS; never hide the content |
| Low contrast, unreadable text on an image | theme tokens or an overlay; ask before changing brand colours (the playbook may set them) |
| Broken link, a button to `#` (`link_placeholder`), a form that cannot be sent | fix the target; ask the owner when the right target is unknown |
| Missing title, description or share image | `manage-site` `update-page`, `manage-seo` `inspect-page` |

Changes to texts, claims, prices or the offer are never "fixes": ask the owner.

## 3. Show the owner

1. The screenshots of the latest report (phone first; as links when the client cannot show images) and the preview link.
2. The verdict in one sentence and every remaining note in plain words, each with what it means for a visitor: "Das Bild oben lädt auf dem Handy 1,8 s; gut wäre unter 1 s. Ich kann es kleiner machen." Use the numbers the latest report returned (before and after: `manage-quality` `compare`), never estimated ones.
3. What the check cannot see: the offer, the wording, whether the page matches the ad's promise, Safari quirks, a form actually sent (it never submits forms: the test lead of `tracking-check` does). The numbers are one lab load, not real visitors; Google's view: `manage-seo` `run-pagespeed`.
4. Ask for the thumbs up. A "nein" with reasons: change, run the gate again, show again.

## Never

- Presenting a page as ready on a "fail" or a report older than the last change.
- Publishing because the check passed: publishing is its own yes (or the playbook's "pages" scope). A "schalte sie live" said before the owner saw the checked page is asked again after they saw it.
- Turning a finding into a content change without asking.
- Saying "schnell" or "mobil optimiert" without the report's numbers behind it.

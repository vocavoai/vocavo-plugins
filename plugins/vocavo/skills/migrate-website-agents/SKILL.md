---
name: migrate-website-agents
description: 'How to run migrate-website with subagents: which phases run in parallel, which model does what, the plan file contract (account, mode, sections, calls to action, lead forms, tracking) and the approval rules. Detail guide of migrate-website.'
---

# Migrate a website with subagents

For clients that can start subagents with a model choice. The steps and rules of `migrate-website` stay the same; this page only says who does them and in which order. Without subagents, follow `migrate-website` step by step and do the review yourself in a fresh pass against `migrate-website-review`, as if someone else had built the site.

## Roles

- **Main session:** the only one that talks to the operator. Picks the account, asks the questions, shows previews, gets every yes, sets the host and the lead recipient, publishes, imports redirects, hands over. Reads the agents' short results, not their raw material.
- **Strongest model:** thinking. Brand brief, site plan, content and design concept, the review.
- **Fast model:** volume. Crawling and measuring the old site, building pages and theme files, translations.

Every agent gets the `account` slug and the website id and passes `account` on every call.

## Phases

| Phase | Agents | Model | Writes |
|---|---|---|---|
| 1. Analysis | 3–5 in parallel: brand brief (strongest) · crawl with `crawl-site.py` and provider inventory · per page type `inspect-page.py` at 390 and 1440 px, sections inventory, call-to-action map, forms, tracking, problems · design tokens and assets (fonts, colours, logos, testimonial photos, videos) | fast | `analysis/*` in the migration folder |
| 2. Questions | main | – | `answers.json` |
| 3. Plan | main or one agent | strongest | `plan.json` |
| 4a. Theme | one builds, the strongest reviews the preview and the overrides | fast | theme draft, per `theme-authoring` |
| 4b. Pages | main first creates every page empty and writes each `page_id` into the plan; then one agent per page or cluster | fast | blocks of its own draft pages only |
| 4c. Translations | after the first language is approved, one agent per page writing all its locales | fast | drafts |
| 5. Review | one reviewer that built nothing, per `migrate-website-review`, with the old and new screenshots | strongest | issue list per page |
| 6. Finish | main | – | host, navigation, lead recipient and webhook, tracking, preview with the operator, `publish-all`, `import-redirects`, hand-over |

Working folder: `migration/<account>/<website>/`. Start agents of one phase in one message; a later phase starts only when every agent of the previous one has reported.

**One owner per shared thing.** Brand colours and fonts belong to the theme agent. Navigation, settings, host, lead recipient, webhook, tracking and redirects belong to the main session.

## Plan file (`plan.json`)

The plan is the single source of truth; agents get their slice, never the whole conversation.

```json
{
  "account": "psa-marketing",
  "website_id": 1,
  "mode": "1:1",
  "label": "masterclass",
  "locales": ["de"],
  "brand": {"brief": "analysis/brand-story.md", "must_keep": [], "voice": "du"},
  "design": {"tokens": {}, "fonts": [], "measured": "analysis/old-home/inspect.json#/widths/1440/styles"},
  "pages": [
    {"key": "start", "title": {"de": "Online-Arbitrage Masterclass"}, "slug": {"de": ""}, "type": "landing", "template": "campaign",
     "id_prefix": "st", "brief": "Sales page, goal: buy or book a call",
     "sections": [
       {"old": 0, "block": {"type": "hero", "id": "st-hero"}, "content": "headline verbatim, subline, video", "source": "analysis/old-home/inspect.json#/widths/1440/sections/0"}
     ],
     "page_id": null, "links": [], "screenshots": {"390": "analysis/old-home/page-390.png", "1440": "analysis/old-home/page-1440.png"}}
  ],
  "ctas": [
    {"text": "Jetzt sofortigen Zugang erhalten", "kind": "payment", "target": "https://buy.stripe.com/…", "new_tab": true, "where": ["st-hero", "st-offer"]},
    {"text": "Jetzt kostenlos herunterladen", "kind": "modal", "target": "#st-ebook", "where": ["st-bonus"]}
  ],
  "lead_forms": [
    {"id": "st-ebook", "form_key": "ebook", "display": "link",
     "fields": [{"key": "first_name", "label": "Dein Vorname", "type": "text", "required": true}, {"key": "email", "label": "E-Mail Adresse", "type": "email", "required": true}],
     "submit_label": "Jetzt E-Book sichern", "success_message": "verbatim, or thank_you_page: <page key>", "tags": "ebook",
     "source": "analysis/old-home/inspect.json#/widths/1440/forms/0"}
  ],
  "tracking": [{"service": "google-ads", "id": "AW-…", "decision": "keep, operator confirmed"}],
  "problems": [{"what": "placeholder [enter lead magnet name here] in the popup", "decision": "operator: E-Book title"}],
  "navigation": {"main": [], "legal": ["https://www.company.example/impressum"]},
  "redirects": []
}
```

- Every page has its own `id_prefix`, so page agents never collide on block ids.
- `sections` keeps the old order; `old` is the index in the old `inspect.json`.
- `ctas` and `lead_forms` are the approved maps: a page agent links exactly these targets and builds exactly these fields.
- Content outlines name the facts and their source. Page agents write text, they never invent facts.

## Briefing the analysis agents

Give each its URLs and output folder, and these rules: run `scripts/crawl-site.py` or `scripts/inspect-page.py` as `migrate-website` step 1 says; copy texts verbatim with their source; mark every placeholder, dead link and broken link; never visit a payment page further than its URL, never submit a form on the old site. Return only file paths and a ten-line summary.

## Briefing the theme agent

Give it `plan.design`, the measured styles, the screenshots, the logos and font notes, and these rules:

1. Start as a child: `fork-theme` of `basis` with `copy_files: false`. Tokens from the measured values first, then `css/theme`.
2. No override of `layout/base`, `partial/header`, `partial/footer` for looks alone. In a 1:1 move an override is allowed when the markup must match; each goes into the overrides table with its reason.
3. Apply the design rules of `migrate-website-review` on the first pass.
4. Write only theme files and tokens: never `publish-theme`, `switch-theme`, pages, navigation or settings. Never ask the operator: list open points.
5. Self-check: `validate-theme` without errors, `preview-page` (`theme_id`, `theme_draft: true`), `inspect-page.py` of the preview at 390 and 1440 px, compared with the old screenshots.
6. Return only: theme id and key, preview links, the overrides table (`file | reason`), measured differences that remain, open points. No file contents.

## Briefing a page agent

Give it its `pages[]` entry, the `ctas` and `lead_forms` rows it uses, the sources it names, and these rules:

1. Check fields with `describe` `block:<key>` (lead forms: `block:lead_form`) and areas with `describe` `template:<key>`.
2. Build the sections in the old order; texts verbatim in 1:1 and keep the look. `meta_title`, `meta_description`, alt texts in every locale, one h1.
3. Fill your existing draft page with `set-blocks` or `add-block`; the operator's yes to the plan covers draft writes, so send them with `confirmed: true`. Never `publish-page`, never navigation, settings, host, leads, tracking, redirects or other pages.
4. Block ids start with your `id_prefix`. Every button links its `ctas` target; a popup button links to `#<block id>` of its `lead_form` block (`display: "link"`), which opens the dialog.
5. Images only through `import-media-from-url` from the old page's URLs; videos as `video` blocks.
6. Never ask the operator: list open points. Never invent a fact, a number or a testimonial.
7. Fix every issue of `preview-page`; never `acknowledge-seo-issue` yourself.
8. Return only: page id, block ids, preview link, remaining issues, open points. No page text.

## Briefing the reviewer

Give it the plan, the old screenshots and `inspect.json`, the new preview links, and `migrate-website-review`. It built nothing, writes nothing, and returns the issue list (P1 blocks the operator, P2 visible defect, P3 polish) with page, viewport and screenshot. The main session fixes through the page or theme agent and asks for a second pass.

## Approval rules

- The operator's yes to the plan (page list, call-to-action map, lead forms, design direction) lets agents write drafts without a further preview round.
- Only the main session, each after its own preview and yes: `publish-page`, `publish-all`, `publish-theme`, `switch-theme`, `import-redirects`, `update-website`, `assign-host`, `set-recipient`, `set-webhook`, `configure-tracking`, `approve-consent-banner`.
- A plan change after approval goes back to the operator first.

## Failure handling

| Problem | Do |
|---|---|
| An agent reports an error it cannot fix | Main fixes the plan slice or asks the operator, then restarts that agent only |
| Two agents need the same record | Never in parallel: the main session does it after the phase |
| Parallel locale writes on one block | Never: `update-block` replaces lists as a whole. One agent per page writes every locale |
| A long raw result | Ask for the short format; do not paste raw material into the main context |

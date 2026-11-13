---
name: migrate-website
description: 'Move an existing website, landing page or sales funnel (WordPress, Elementor, OptimizePress, Wix, Webflow, a funnel builder, a static site) into an vocavo account without losing a lead, a link or a ranking: pick the account, inventory and measure the old pages, choose 1:1, keep the look or redesign, map every call to action and form (lead forms become lead_form blocks, payment and booking links stay), handle tracking through consent, compare old and new side by side at 390 and 1440 px, plan redirects, have it reviewed, pass the quality gate, hand over the preview link and offer an improved challenger next to a 1:1 page. Use for "Website umziehen", "Landingpage umziehen", "Funnel übernehmen", "Verkaufsseite übernehmen", "1:1 übernehmen", "Website migrieren", "von WordPress wechseln", "migrate my website", "move my landing page".'
---

# Migrate a website or landing page

Move an existing site into vocavo. The visitor of the old page must find the same offer, the same proof and the same next step on the new one, and every lead must arrive. A site with no predecessor: `build-website`; a new single page: `landing-page`; design work in detail: `theme-authoring`.

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`.

**Core principle: nothing is invented and nothing is lost silently.** Every text, number, testimonial, price and date comes from the old page or from the operator. Everything the old page does (a button, a form, a popup, a tracking tag, a video, a legal link) gets a decision that the operator can see. Placeholders and broken links of the old page are reported, never copied.

**Calls.** Everything goes through the vocavo MCP tools. Every tool takes `account` (the account slug; optional when the user has exactly one). `manage-site` takes its fields inside `params`; every write answers with a preview until the same call comes with `confirmed: true`. Show the operator the preview in plain language and, after their yes, repeat it confirmed. Field reference: `manage-site` `describe` (`subject`: actions, parameters, settings, blocks, `block:<key>`, `template:<key>`, theme-chain, twig-context).

**Subagents.** If your client can start them, run the phases as `migrate-website-agents` describes; the review is always done by an agent that did not build.

**Scope.** Ends with an approved site whose pages are published in the engine, reachable on its preview link and its platform host `<label>.<site domain>`, redirects imported, the lead path tested. Own domain, DNS switch and the checks around going live: `go-live` (vocavo checks DNS and issues the certificate itself; the owner sets one or two records). Never change DNS yourself.

**What the engine does not have.** No file upload (images come through a public URL), no SVG import, no self-hosted video files (YouTube and Vimeo work through the `video` block), no shop or checkout, no booking calendar, no member area, no countdown that resets per visitor, no custom scripts in themes. Say so early when the old page depends on one, propose the closest way (an external link stays an external link), and let the operator decide.

## 0. Account and website

1. `list-accounts`. One account: use it. Several: ask which one, recommended first (the one whose name matches the business). None: follow `onboard-account` first.
2. `manage-billing` `status`. A trial that ended or a read-only account refuses writes: say so before any work and offer `manage-billing` `checkout-link` to subscribe. An account whose website limit is reached refuses `create-website`: migrate into an existing website instead (as landing pages).
3. `manage-site` `overview` shows the account's websites. Migrating a second site into the same account is a new website, never pages mixed into another site.

## 1. Inventory and measure the old site

Work in a folder per migration (`migration/<account>/<website>/`). Nothing is built before the inventory is summarised.

1. **Every URL.** `python3 scripts/crawl-site.py https://www.old-site.example --out urls.json` (sitemaps first, else it follows links; per page title, description, h1, hreflang, JSON-LD types, images, forms). Read `warnings` and `external`. A one-page funnel often has no sitemap: the crawl follows its links, the thank-you and legal pages included. JavaScript builders: `--render`; blocked crawls: `--delay 2`.
2. **Measure every page type in a real browser.** `python3 scripts/inspect-page.py <url> --out analysis/old-<page> --check-links` writes full-page and first-screen screenshots at 390 and 1440 px and `inspect.json`: sections in order, every call to action classified, forms with their fields and provider, popups, embeds, tracking scripts with ids, computed fonts and colours of body, headings, links and buttons, loaded font faces, images with natural sizes, CSS backgrounds, testimonials, placeholders, the numbers the page shows and link status. Without playwright or the agent-browser CLI, run `scripts/inspect-page.js` in your browser tool and take the screenshots there. Pages taller than 16000 px are captured viewport by viewport and stitched with Pillow (Chrome repeats content beyond 16384 px in one shot); without Pillow the parts stay as `page-<width>-<n>.png`. The screenshots are the reference for every later comparison.
3. **Sections inventory.** One row per section of each page, in order: position, heading (verbatim), purpose (hero, problem, offer, proof, modules, bonus, about, guarantee, pricing, FAQ, final call), content outline, images and videos in it, its calls to action. A sales page keeps its order in 1:1 and keep-the-look; a redesign changes the order only with a reason the operator approved.
4. **Call-to-action map.** Every button and link of `ctas` gets one row: text verbatim, where it sits, kind, target, decision.

   | Old kind | New |
   |---|---|
   | `payment` (Stripe, PayPal, Digistore24, CopeCart, ablefy …) | stays the same external link, same text, opens the same way. vocavo never handles the payment. An embedded Stripe Pricing Table (`<stripe-pricing-table pricing-table-id="prctbl_…" publishable-key="pk_…">`, no static URL) becomes a `stripe_pricing_table` block at the same position (step 5.7) |
   | `booking` (Calendly, HubSpot Meetings, cal.com …) | stays the same external link or embed decision |
   | `modal` with a form inside (e-book, webinar, waitlist, newsletter, call request) | a `lead_form` block with the same fields and `display: "link"`: nothing shows on the page, every button that opened the popup links to `#<block id>` and opens the dialog, as on the old page. `display: "modal"` only when the popup had exactly one button of its own at the block's position |
   | a form on the page | a `lead_form` block (`display: "inline"`) at the same position, same fields, same labels, same button text |
   | `anchor` | the same anchor on the new page (block id), never a dead `#` |
   | `placeholder` (`#`, empty, `javascript:`) | reported to the operator: what should it do? Never copied as a dead link |
   | `chat`, `mailto`, `tel` | kept as written |
   | `legal` | see step 1.9 |
   | `internal`, `external` | the new page or the same external target; broken ones (`links` with `broken: true`) are reported |

5. **Forms.** Per form: provider (`forms[].provider`), every visible field with name, type, label, required, every select option, hidden fields (UTM, placement, lead source), consent checkboxes and their text, the submit text, the success message or thank-you page, and where the old provider sent the lead (newsletter tool, CRM, webinar tool). The new form keeps the same fields and labels; hidden UTM fields need no copy (vocavo stores UTM, landing page and referrer with every lead). The old automation behind the form (e-mail sequence, e-book delivery, webinar registration) does not move by itself: it continues through the lead webhook (`leads`, `manage-leads` `set-webhook`) or by a mail the operator sends; decide it with the operator before going live.
6. **Media.** Images beyond `<img>` (CSS backgrounds, sliders, lazy backgrounds), logos (header, footer, press and client logo strips, "bekannt aus"), testimonial photos and screenshots, the portrait of the person behind the offer, embedded videos (`embeds`: YouTube, Vimeo, Wistia, video files) with their position. Every image gets a decision.
7. **Tracking.** `tracking` lists what the old page loads (Google Ads with its `AW-` id, Google Analytics, Tag Manager, Meta pixel, TikTok, LinkedIn, Hotjar, Clarity, a cookie banner). Make a table: service, id, purpose the operator names. Nothing is copied into the new site's code; step 6 decides each one.
8. **Design measured, not guessed.** From `styles`: font families, sizes, weights, line heights and letter spacing of body, h1, h2, h3 and buttons at 390 and 1440 px; colours as hex of text, backgrounds, buttons and links; radius and shadows of buttons and cards; `fonts_loaded` and `font_sources` with the licence (Google Fonts are fine to self-host; a commercial font needs the operator's licence). Note the first screen at 390×844 and 1440×900: what is visible above the fold.
9. **Legal.** Impressum, Datenschutz, AGB, Widerruf, cookie settings: where they are linked and whether they live on this site or on another domain of the same company. Links to another domain of the company may stay external links; pages on the old site move with their text. An Impressum that is missing or incomplete is an open question, never filled in by guessing.
10. **Numbers and claims.** `numbers_on_page` and the testimonials list every figure the page states (revenue, participants, years, ratings). They are copied verbatim with their context, never rounded up, combined or updated.
11. **Problems of the old page.** Placeholders (`placeholders`, also hidden ones in popups such as "[enter lead magnet name here]"), links to `#`, broken links, a button without a target, an expired date or countdown, a missing legal page, contradicting prices. List them for the operator with the proposed fix; the new site gets the fix only after their answer.
12. **Third-party providers.** From `external` and the pages: payment, booking, webinar, community, newsletter, chat, review widgets. Per provider: category, name, URL, where it is linked. Default: keep every provider as it is, linked the same way.
13. **Brand brief before any design:** people and roles, the offer and its price as stated, positioning, voice with verbatim samples, proof (results, press, logos), a ranked "must not get lost" list and a "fix, don't copy" list, each fact with its source.
14. **Baseline:** `manage-seo` `run-pagespeed` with `url` of the old page and `label: "baseline"`, only if a PageSpeed key is configured and the operator agreed. Without one, say that there is no baseline.

Summarise the inventory for the operator: page list, sections per page, the call-to-action map, forms, tracking, problems found.

## 2. Ask

Read `migrate-website-questions` and ask as written there, never what the inventory already answered. The answers and the inventory become `plan.json` (`migrate-website-agents`); get a yes to the page list, the mapping of calls to action and forms, and the design direction before building.

## 3. Website, host, lead recipient, facts

1. No website yet: `manage-site` `create-website` (`name`, `default_locale`, `locales`): it creates the home page, Impressum and Datenschutz, in draft. A one-page funnel uses its home page as the sales page, or a page with the old path when the old URL had one.
2. **Host.** A new website gets its platform host `<label>.<site domain>` automatically (label = the website slug). `manage-account` `list-hosts` (`website_id`) shows it. When the operator wants another label (short, lowercase, the brand or the offer, as agreed in the questions): `manage-account` `assign-host` (`website_id`, `label`). The label is unique on the platform; a taken one gets a proposal of two alternatives.
3. `manage-site` `update-website` `settings`: `brand`, `contact`, `legal`, `social`, `seo`; `describe` subject `settings` lists every key. A legal fact you could not find goes on the block as `clarifications` (`{field, question, suggestion}`): the page refuses to publish until the operator answered. Never guess a register number or VAT id.
4. **Leads.** Leads are mailed to the account owner unless the website has its own recipient: ask, and set another address with `manage-leads` `set-recipient` (`email`). A webhook to the operator's CRM or newsletter tool: `manage-leads` `set-webhook`, then `manage-leads` `test-webhook`; details in `leads`.

## 4. Theme

Follow `theme-authoring`. `manage-site` `fork-theme` (`key`, `name`, `parent_key: "basis"`, `copy_files: false`), then tokens from the measured values of step 1.8, then `css/theme`, then overrides of single blocks.

| Mode | Theme |
|---|---|
| 1:1 | Measured fonts, sizes, colours, radius and spacing as tokens; markup overrides where the old look needs them, each with a written reason. The new page should be hard to tell from the old one at 390 and 1440 px |
| Keep the look | Fonts, colours, photos and voice stay; layout, spacing and components follow `basis` and the review rules |
| Redesign | New direction from the brand brief, mobile first, one clear call to action per screen |

Check with `manage-site` `validate-theme` and `manage-site` `preview-page` (`theme_id`, `theme_draft: true`). `manage-site` `publish-theme` and `manage-site` `switch-theme` need the operator's yes.

## 5. Content

1. **Images and logos.** `manage-site` `import-media-from-url` per image: `url` (public), `alt` per locale or `is_decorative: true`, `use` (hero, share, content, logo). Testimonial photos and screenshots, client and press logos, the founder's portrait included. Act on `warnings`: `IMAGE_TOO_SMALL` ask for the original, `LIKELY_STOCK_PHOTO` check the licence. An SVG is refused: use a PNG or WebP export.
2. **Pages.** `manage-site` `create-page` (`title`, `slug`, `type`, `template`, `meta_title`, `meta_description`, `noindex?`); a sales page from ads uses template `campaign` (no navigation, small footer, usually `noindex: true`) or `landing` when it should rank. Blocks with `manage-site` `set-blocks` in the order of the sections inventory. Check fields with `describe` `block:<key>` and areas with `describe` `template:<key>`; the hero in area `hero` carries the h1.
3. **Texts verbatim** in 1:1 and keep-the-look: headings, bullet lists, guarantees, FAQ answers, the signature of the person. Bold and highlighted words stay highlighted. A redesign may shorten and reorder, never add claims.
4. **Testimonials** with name, role, photo and the exact quote in `reviews_slider` or `quote`; video testimonials in `video`. Never a rating the old page did not show.
5. **Videos.** Each YouTube or Vimeo embed becomes a `video` block at the same position (the player loads after a click, so no consent is needed before). Wistia, Vidyard or own video files: engine gap; ask the operator for a YouTube or Vimeo link, else link out.
6. **Lead forms.** Reference: `describe` `block:lead_form`. Per old form one `lead_form` block:
   - `form_key` naming the offer (`ebook`, `masterclass`, `callback`: lowercase letters, numbers, `-` and `_`); it is stored on every lead and is the conversion goal `form:<form_key>`;
   - `fields` in the old order, each `key` (snake_case; `name`, `email`, `phone`, `company`, `message` fill the lead's own columns, `first_name` and others go into its `fields`), `label` verbatim, `type` (text, email, tel, textarea, select, checkbox), `required`, `options` for a select; at most 12;
   - `heading`, `text`, `submit_label` verbatim; `consent_text` as the old form said it (a required checkbox, stored with the lead), else ask; `privacy_page` when the Datenschutz is not this website's own page;
   - `success_message` verbatim, or `thank_you_page` when the old form went to a thank-you page (build that page first);
   - `tags` for what the operator's tools need to tell forms apart (`masterclass, ebook`);
   - `display: "link"` for a popup form: the block shows nothing on the page, every link to `#<block id>` opens it as a dialog (also from an ad or mail: `https://<site>/<page>#<block id>`), without JavaScript; `trigger_label` is not used. `display: "inline"` for a form on the page; variant `card` between other blocks. `display: "modal"` (the block's own button, `trigger_label`) only for a single popup button at the form's position.
   A popup opened from several buttons: `display: "link"`, and every one of those buttons links to `#<block id>`. No parity difference: the buttons open the dialog as before, and success or errors after sending show in the reopened dialog. The engine `form` block (`form_type: "contact"`) is only for a plain contact page; its messages also arrive as leads.
7. **Calls to action.** Every row of the map gets its link now: payment and booking links verbatim (same target, same new-tab behaviour), an embedded Stripe Pricing Table as a `stripe_pricing_table` block (reference: `describe` `block:stripe_pricing_table`; `pricing_table_id` and `publishable_key` copied from the embed code, `heading`/`text` verbatim; it loads Stripe only after the visitor's click, so no consent is needed before) with every button that jumped to the table linking to `#<block id>`, which also loads it, anchors to block ids, popup buttons to `#<block id>` of their `lead_form` block (`display: "link"`). Click through the map on the preview.
8. **Navigation.** `manage-site` `set-navigation` (`key`: main, footer, legal, header_cta). A sales page usually has none in `main`; `legal` always holds Impressum and Datenschutz (own pages or the company's external URLs, as decided in 1.9).
9. **Legal.** Fill `legal_text` on Impressum and Datenschutz from the old texts and the operator's facts; the Datenschutz names the lead form, the webhook receiver and every tracking service kept. Nobody reviewed them legally: say so.
10. **Translations.** Per added locale through `manage-site` `update-block` and `manage-site` `update-page`; `manage-site` `translation-status` lists what is missing.

## 6. Tracking and consent

Per row of the tracking table, with the operator (`consent-tracking`):

- Google Ads, Google Analytics, Meta pixel: `manage-tracking` `configure-tracking` with `google-ads`, `google-analytics` or `meta-pixel` and the id from the old page, only after the operator confirms the id is theirs and still wanted. Conversions: each lead form is the goal `form:<form_key>` (`manage-tracking` `list-goals`); it gets the Google Ads label the operator gives.
- Tag Manager, TikTok, LinkedIn, Hotjar, Clarity and other services the engine does not offer: not added, never through a theme. List them as a gap; the operator decides whether they are needed.
- The banner: `manage-tracking` `approve-consent-banner` after the operator read it on the preview. Without approval nothing loads.
- Campaign links for the ad channels the old page received traffic from: `manage-campaign-links` `save-campaign-link` (see `landing-page`).

## 7. Redirects

Needed when the old domain or paths will lead to the new site. Every URL of `urls.json` gets a 301, a 410 or an ignore mark with a reason:

- Same content → `page:<id>`. A thank-you page → its new thank-you page. Nothing fitting → ask the operator about 410.
- Never everything to `/`. No rows for paths the engine answers (`/robots.txt`, `/sitemap.xml`, `/llms.txt`).
- Show the table (old → new → type) and get approval; `manage-site` `import-redirects` (`redirects`: `[{from, to, status_code?, note?}]`) without `confirmed`, fix every error row, then `confirmed: true`.
- Keep the 301 rows as `redirects.csv` (`old,new`) for `go-live` (its `verify-redirects.py` checks them on the new domain).

## 8. Check: side by side

1. `manage-site` `preview-page` per page (`version: "draft"`): a signed link plus issues; fix them.
2. **Acceptance check.** `python3 scripts/inspect-page.py "<signed preview link>" --out analysis/new-<page> --check-links` and put old and new screenshots side by side at 390 and 1440 px (first screen and full page). Walk the sections inventory row by row: same order, same heading, same proof, same call to action. Compare `ctas`, `forms` and `embeds` of old and new `inspect.json`: every payment and booking link present with the same target, every old form present as a lead form with the same fields, no `placeholder` link left, no broken link. For 1:1 compare fonts and colours of `styles`. List every difference with its reason or fix it.
3. `manage-seo` `seo-audit` with `draft: true`: fix errors and warnings.
4. `manage-site` `search-content` for every old host name, placeholder text and old phone number; replace stale hits.
5. **Independent review.** A reviewer that did not build walks `migrate-website-review` and returns P1/P2/P3 issues. Fix P1 and P2, then a second pass.
6. **Quality gate.** `page-quality` on every page (draft): load speed, image and video weight on a phone, overlaps on mobile. `manage-quality` `compare` against the old page shows what got better or worse. Only then does the operator see the site.
7. **Lead path.** `manage-leads` `test-webhook` checks the webhook without a real lead. With the operator's yes, send one test lead through each lead form on the preview: `manage-leads` `summary` counts it under its `form_key` and the recipient gets the mail. Then set it to `lost` with a note (`manage-model` on the lead) or tell the operator which test leads are in the list.

## 9. Publish and hand over

1. With the operator's yes: `manage-site` `publish-all` (or `manage-site` `publish-page`), `manage-site` `publish-theme` and `manage-site` `switch-theme` if not done.
2. Hand over the signed preview link and the platform host `https://<label>.<site domain>`, which serves the site once the operator switches it live (`manage-site` `update-website` `status: "live"`, only with their yes). Moving the old domain over: `go-live`.
3. Report: what moved, the call-to-action map with the new targets, forms and where their leads go, tracking decisions, the problems of the old page and how each was decided, parity gaps, open questions, PageSpeed before and now if measured (never estimate a number).
4. **Offer the challenger.** For a page moved 1:1, propose one improved variant next to it: the single change the inventory, the quality report and the review point to most (a clearer hero promise, a shorter form, proof next to the button, a fixed mobile problem the old page had). With a yes, `landing-page-tests` builds it as a draft and shows both side by side; the test starts once the 1:1 page is live and the owner agrees.
5. Before ads point to the new page: `tracking-check` and, for a CRM, `lead-handoff`.

## Safety rules

- Never publish pages, switch themes, import redirects, set tracking ids or a webhook without an explicit yes.
- Never invent texts, numbers, testimonials, prices, dates, scarcity or guarantees. A countdown or "only 3 places left" is copied only when the operator confirms it is true.
- Never copy a placeholder, a dead link or a broken form silently.
- Never move payment into vocavo, never change a payment or booking link without the operator.
- Never copy texts, photos or fonts without rights: ask.
- Legal pages stay working drafts until the operator confirms a review.

## Failure handling

| Problem | Do |
|---|---|
| Few URLs (JavaScript site) or crawler blocked | `--render`, `--delay 2`, links from the inspected page, an export from the operator |
| `inspect-page.py` has no browser | Run `scripts/inspect-page.js` in the browser tool, screenshots by hand at 390 and 1440 |
| A write is refused because of billing | `manage-billing` `status`, offer `manage-billing` `checkout-link` |
| The label is taken | Propose two alternatives, `manage-account` `assign-host` again |
| `import-redirects` row errors | Fix or drop the row with the operator |
| `REVISION_CONFLICT` | Re-read with `manage-site` `get` resource `block`, merge, resend |
| `CLARIFICATIONS_OPEN` on publish | Ask the operator, then clear with `clarifications: []` |
| An engine bug or gap | Report it; it is fixed in the package, never with a workaround in the site |

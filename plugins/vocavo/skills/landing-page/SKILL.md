---
name: landing-page
description: 'Build a landing page that brings leads: one goal, one audience, a lead form (inline or as a modal) whose leads go to the right inbox or webhook, a tracked campaign link per channel, then measure it. Use for "Landingpage bauen", "Kampagnenseite", "Lead-Seite", "E-Book-Seite", "Webinar-Anmeldung", "Formular für Anfragen", "Kampagnenlink", "QR-Code-Link", "UTM-Link", "landing page", "lead form", "campaign link".'
---

# Landing page with a lead form and a campaign link

**Core principle:** one page, one goal, one form. Every text, number and testimonial comes from the operator or their existing material; never invented numbers, reviews or scarcity.

All calls take `account` (the account slug; optional with one account). Writes preview until the same call comes with `confirmed: true`.

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`. A page that will be advertised: `launch-campaign` leads and calls this skill for the page.

## Page

1. **Clarify** in one round, recommended option first: the goal (a call request, a quote, an e-book download, a webinar seat, a booking), the audience, the channel (ads, mail, social, print), the offer behind the form, what happens after the form (thank-you text or page, a download link, a mail from the operator, their CRM by webhook).
2. **Template.**
   - `landing`: with site navigation, for search traffic ("service in region").
   - `campaign`: no navigation and a small footer, for ads and mails. Usually `noindex: true`.
   Both have areas `hero` (only the `hero` block, it carries the h1) and `main`.
3. `manage-site` `create-page` (`title`, `slug`, `type: "landing"`, `template`, `meta_title`, `meta_description`, `noindex?`), then `manage-site` `set-blocks`. Typical `main`: `features` (the benefits), `reviews_slider` with real quotes, `faq`, `cta_banner`, and the lead form.
4. **Lead form.** A `lead_form` block; reference: `describe` `block:lead_form`. Set:
   - `form_key` naming the offer (`ebook`, `callback`, `webinar`): stored on every lead, and the conversion goal `form:<form_key>`;
   - `fields`: what the goal needs and no more (`name` and `email` for a download; `phone` and `message` for a call request), each `key`, `label`, `type` (text, email, tel, textarea, select, checkbox), `required`, `options` for a select;
   - `heading`, `text`, `submit_label`;
   - `success_message`, or `thank_you_page` (a page of this site the visitor goes to after sending);
   - `display: "inline"`; or `display: "link"` for a popup: nothing shows on the page, every button linking to `#<block id>` opens the form in a dialog (works without JavaScript, also from an ad or mail link ending in `#<block id>`); or `display: "modal"` with `trigger_label`: the block shows its own button that opens the dialog; variant `card` between other blocks;
   - `consent_text` when the operator wants a consent checkbox (newsletter, follow-up mails), else a privacy note shows under the button; `tags` for the operator's tools.
   The engine `form` block (`form_type: "contact"`) is the plain contact form of a contact page; its messages arrive as leads too.
5. **Buttons.** Hero and `cta_banner` buttons link to the lead form block (`#<block id>`; with `display: "link"` that opens the dialog); payment and booking links of the operator stay external links, unchanged.
6. **Where leads go.** Leads are mailed to the website's recipient, by default the account owner; another address: `manage-leads` `set-recipient`. A CRM or newsletter tool: `manage-leads` `set-webhook`, then `manage-leads` `test-webhook` (see `leads`).
7. Link it from a matching page, unless it is `noindex` (`orphan_page` in the audit otherwise).
8. **Payment.** When the goal is a purchase, a `stripe_pricing_table` block (reference: `describe` `block:stripe_pricing_table`; `pricing_table_id` and `publishable_key` from the owner's Stripe embed code) or the owner's Stripe payment link as an external button. vocavo never handles the payment. Purchases are counted only once `manage-conversions` `configure-purchase-tracking` is set up and proven (`tracking-check`).
9. **Quality gate.** `page-quality`: the automatic check on the draft, fixes, check again, then screenshots to the owner. `manage-site` `preview-page` and `manage-seo` `inspect-page` (`page_id`, `draft: true`) on top. The page is not shown as ready while its latest report is a fail or older than the last change.
10. With a yes, send one test lead on the preview and check it in `manage-leads` `summary` (counted under its `form_key`). Then `manage-site` `publish-page` with a yes (or the playbook's "pages" scope). A page on a website in draft is not public yet.

## Campaign link

Ads on Facebook and Instagram carry their UTM values as URL parameters on the ad (scheme in `launch-campaign`), not a campaign link.

`manage-campaign-links` `save-campaign-link`: `name`, target `page_id` or an own `path`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, optional `token`, `active`. Preview, yes, `confirmed: true`. It returns the short URL `/l/<token>`. UTM values take letters, digits and `. _ ~ -`; use lowercase and one spelling per channel. Only own targets: there is no open redirect.

One link per channel and creative, so they stay comparable (`utm_source=flyer`, `utm_medium=print`). Every lead stores its UTM values, landing page and referrer. Change a link with `id`; `active: false` stops it. Deleting (`manage-campaign-links` `delete-campaign-link`) sends a printed QR code to the home page, so prefer to leave it.

## Tracking

Ad conversions: `consent-tracking`. `manage-tracking` `configure-tracking` with `google-ads` or `meta-pixel` and the operator's ids; each lead form is the goal `form:<form_key>` in `manage-tracking` `list-goals` and gets its conversion label there. Nothing loads before consent. Server events to Meta and Stripe purchases, and the proof that all of it works: `tracking-check`.

## Measure

- `manage-leads` `summary` (`days`): leads per status, form and source.
- `manage-campaign-links` `list-campaign-links`: visits per link.
- `manage-tracking` `analytics-report` (`days`, `goal`): sources, pages and conversions. See `analytics-report`.
- How the ads did, cost per lead and per customer: `performance-review`.
- A variant of the page: `landing-page-tests`.

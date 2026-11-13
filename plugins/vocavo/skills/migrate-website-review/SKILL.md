---
name: migrate-website-review
description: 'Rules and review checklist for a migrated or newly built website or landing page (side-by-side comparison with the old page at 390 and 1440 px, sections, calls to action, payment and booking links, lead forms and modals, tracking and consent, placeholders, header, hero, headings, contrast, buttons, images, testimonials, videos, legal pages, share images, fonts, facts and numbers). Builders apply it on the first pass, an independent reviewer walks it before the operator sees the site.'
---

# Migration rules and review checklist

The builder applies the rules while building; an independent reviewer, not the builder, walks the checklist. A defect that would hit any site gets one fix in the package, never a copy in a theme.

## Rules

**Parity with the old page**

1. **Side by side.** Old and new at 390 and 1440 px, first screen and full page, next to each other (`scripts/inspect-page.py` of `migrate-website` for both). In a 1:1 move a visitor should not notice a difference in order, wording, proof or call to action; every visible difference has a reason in the review notes.
2. **Sections.** Every row of the sections inventory has its section on the new page, in the same order (1:1, keep the look) or in the approved new order (redesign). No section silently dropped, none added without the operator.
3. **First screen.** At 390×844 and 1440×900 the headline, the promise and the first call to action are visible as on the old page; a video in the old hero stays in the hero.
4. **Calls to action.** Every row of the call-to-action map is clicked on the preview: payment and booking links lead to exactly the old target and open the same way, anchors land on their section, popup buttons open their `lead_form` dialog (`#<block id>`). No link to `#`, no button without a target, no broken link (`inspect.json` `links`).
5. **Lead forms.** Every old form has its `lead_form` block with the same fields, labels, required marks, select options, submit text and consent text, and a `form_key` per offer; a popup form is `display: "link"` and every old popup button links to `#<block id>` (or `display: "modal"` when it had one button of its own, carrying that button's text). The success message or thank-you page matches what the operator approved. Reviewers do not submit forms; the main session sends the approved test lead.
6. **Placeholders.** No placeholder text of the old page (also hidden ones in popups), no "Lorem ipsum", no "[…]" reached the new page; each finding was decided by the operator.
7. **Tracking.** Only the services the operator approved are configured, with their ids; nothing loads before consent; services the engine does not offer are listed as gaps, never added through a theme.

**Design**

8. **Header.** Nav links and dropdown items at least 4.5:1 against their real background. Mobile: the main call to action stays reachable next to the burger. A sales page without navigation keeps its logo and, if it had one, its header button.
9. **Hero.** A scrim strong enough for the text, light enough that the photo still reads. Decorative art never overlaps text on phones (check at 390 px).
10. **Headings.** One h1 per page. A line height that umlauts do not collide in, balanced wrapping, long German words with hyphenation at 390 px. No h2 that repeats the h1.
11. **Fonts.** The measured families and weights of the old page in 1:1 and keep the look. Display and heading fonts swap with a metric-adjusted fallback (layout shift about 0); only body fonts may be optional. Cold load with the cache off: the brand font appears.
12. **Contrast.** Measure against the rendered pixels, not the base colour. A component that paints its own surface sets its own foreground; `validate-theme` must show no `css.color_token_remap` or `css.surface_without_foreground`.
13. **Buttons.** The measured colours, radius and text of the old buttons in 1:1; calm surfaces and centred labels, the same in hero, sections, modals and mobile.
14. **Images.** No delayed reveal above the fold. The largest original and correct sizes. Every image of the old page is used or explained.
15. **Logos.** Client, press and partner logos keep their strip and order; every logo checked for an opaque background and its size on every surface.

**Facts and voice**

16. **Facts only from migrated content.** Every claim rests on a text of the old page or a statement of the operator.
17. **Numbers verbatim.** Every figure (revenue, results, participants, years, ratings, prices, discounts) appears exactly as on the old page, with its context and its qualifier ("bis zu", "im Schnitt"). Never rounded, combined, updated or added.
18. **Testimonials.** Name, role, photo and quote exactly as before; no rating stars the old page did not show; video testimonials keep their video.
19. **Scarcity and deadlines.** A countdown, a deadline, "only X places" only when the operator confirmed it is true today; an expired date is an open question.
20. **Signed and first-person text stays verbatim.** Fix contradictions as questions to the operator, never by editing. A signed text keeps its portrait.
21. **No invented policies, guarantees or services.** Never merge two separate statements into one sentence: joined they become a new fact.
22. **One fact, one value.** Price, guarantee period, address and phone are the same everywhere, modals included.
23. **Prominence.** For each "must not get lost" item note the old position and the new one at 390 px; a drop of more than about three sections needs a reason.
24. **Short paragraphs** in a redesign: at most two sentences per paragraph, split at sentence boundaries without changing a word. In a 1:1 move the old paragraphs stay.

**Functions**

25. **Third-party providers.** Every provider of the inventory has a home on the new site, or the operator decided to drop it.
26. **Videos.** Every old video has its `video` block at the same position, or an approved replacement; the poster shows before the click.
27. **Landing pages need facts.** A page without enough real content starts `noindex` and out of the navigation, and goes to the open questions.
28. **Currency and number format** of the audience's country, also in forms.
29. **Back-translation.** Check every locale for meaning, one form of address per locale (du or Sie as the old page), meta texts and buttons included.

**Legal and SEO**

30. **Legal links.** Impressum and Datenschutz reachable from every page, modals included; AGB and Widerruf where the old page linked them; external legal links of the company lead to a working page. The Datenschutz names the lead form, the webhook receiver and every tracking service kept. Nobody reviewed the texts legally: say so.
31. **Share images.** `og:image` from `og_image_media_id` or `settings.brand.share_image_media_id`; check on every landing page (1200×630, legible).
32. **Redirects.** No rows for paths the engine answers, no chain, nothing that sends everything to `/`.
33. **Structured data comes only from the engine.** No JSON-LD, microdata or rating markup in a theme.

## Review loop

The reviewer screenshots every page at 390 and 1440 px and returns issues by priority (P1 blocks the operator, P2 visible defect, P3 polish) with page, viewport and screenshot.

- [ ] Old and new side by side at 390 and 1440 px, first screen and full page, for every page (rules 1–3).
- [ ] Call-to-action map clicked through, `inspect.json` of old and new compared: links, forms, embeds (rules 4–5).
- [ ] No placeholder, no dead or broken link (rule 6).
- [ ] Tracking table and the banner on the preview (rule 7).
- [ ] Header, hero, headings, fonts, contrast, buttons, images, logos per rules 8–15.
- [ ] Facts, numbers and testimonials per rules 16–23, each number found on the old page.
- [ ] Every page and sub-page, thank-you pages, the legal pages, the 404.
- [ ] `manage-seo` `seo-audit` (`draft: true`) has no errors; `manage-site` `translation-status` shows nothing missing.
- [ ] `manage-site` `search-content` finds no old host names, placeholder texts or old phone numbers.
- [ ] Open questions listed.

The orchestrator fixes P1 and P2, sends generic defects to the package, and shows the operator only after a clean second pass.

---
name: build-website
description: 'Build a new website with this engine from nothing: questions, settings, theme, images, pages, navigation, check, publish. Use for "Website erstellen", "neue Website", "neue Homepage", "Website aufbauen", "build a website". Moving an existing site: migrate-website.'
---

# Build a website

**Core principle:** every fact (register, VAT id, addresses, people, numbers) is copied verbatim or asked, never invented, and nothing goes live without the operator's yes on a preview link.

Not this skill: an existing site that moves → `migrate-website`; changing a live site → `edit-website`.

## Quick reference

All `manage-site`, fields inside `params`; writes preview until `confirmed: true`.

| Need | Call |
|---|---|
| Where do we stand | `manage-site` `overview` |
| Every action and field | `manage-site` `describe` (`subject`: actions, parameters, settings, blocks, `block:<key>`, `template:<key>`, theme-chain, twig-context) |
| Create the website | `manage-site` `create-website` (`name`, `default_locale`, `locales`): home page, Impressum, Datenschutz |
| Brand, contact, legal data | `manage-site` `update-website` `settings` (deep patch) |
| Theme | `manage-site` `fork-theme`, `manage-site` `update-theme-tokens`, `manage-site` `validate-theme`, `manage-site` `publish-theme`, `manage-site` `switch-theme` |
| Pages and blocks | `manage-site` `create-page`, `manage-site` `set-blocks`, `manage-site` `add-block`, `manage-site` `update-block` |
| Images | `manage-site` `import-media-from-url` |
| Navigation | `manage-site` `set-navigation` |
| Check and publish | `manage-site` `preview-page`, `manage-site` `publish-page`, `manage-site` `publish-all` |

## Steps

1. **State.** `manage-site` `overview`. Read what the operator already gave, so you ask nothing twice.
2. **Questions.** One round, at most four, recommended option first, skip what is known: who the site should reach, what a visitor should do first, which languages, which pages. Then show the page list and the main navigation and get a yes.
3. **Website and facts.** `manage-site` `create-website`, then `manage-site` `update-website` `settings`: `brand`, `contact`, `legal`, `social`, `seo` (`description`, `services`, `regions`, `organization_type`), `form_recipient_email`. A legal fact you do not have goes on the block as `clarifications` (`{field, question, suggestion}`); the page refuses to publish until it is answered.
4. **Theme.** `manage-site` `fork-theme` (`parent_key: "basis"`, `copy_files: false`). Looks from tokens first (`theme-authoring`). `manage-site` `validate-theme` until 0 errors, `manage-site` `preview-page` with `theme_id` and `theme_draft: true`, then with a yes `manage-site` `publish-theme` and `manage-site` `switch-theme`.
5. **Images.** `manage-site` `import-media-from-url` per image used (`use`: logo, hero, share, content; `alt` per locale or `is_decorative: true`). Act on `IMAGE_TOO_SMALL` and `LIKELY_STOCK_PHOTO`, prefer real photos. Then `settings.brand.logo_media_id`.
6. **Pages.** `manage-site` `create-page` (`title`, `slug`, `type`: page or landing, `template`, `meta_title` at most 60 characters, `meta_description` at most 155), filled with `manage-site` `set-blocks` (`{"main": [{type, variant, data}]}`). Fields: `describe` `block:<type>`; areas: `describe` `template:<name>`.

   | Page | Typical blocks |
   |---|---|
   | Home | hero (h1 = what and where), features, text_image, reviews_slider, badges, faq, cta_banner |
   | Service or offer | hero, text_image, features, faq, form |
   | About | hero, text, team, quote |
   | Contact | contact, map, form |
   | Impressum, Datenschutz | legal_text |

   Translatable values: a string (default locale) or `{"de": "…", "en": "…"}`.
7. **Navigation.** `manage-site` `set-navigation`: `main` (5 to 7 items), `footer`, `legal` (Impressum, Datenschutz), optional `header_cta`. Targets `page:<id>`, `#anchor`, `tel:`, `mailto:`.
8. **Check.** `manage-site` `preview-page` per page, fix the issues, look at 390 and 1440 px. `manage-seo` `seo-audit` with `draft: true`. `manage-site` `translation-status`. Rules: `migrate-website-review`.
9. **Publish.** Show the preview links and ask once. On a yes `manage-site` `publish-all`. That does not make the website public: going live is `go-live-checklist`.

## Traps

| Tempting | What's true |
|---|---|
| Filling the Impressum from a similar company | Register and VAT id are legal facts of this company. Unknown → `clarifications` |
| `REVISION_CONFLICT` means retry | Someone changed the block. `manage-site` `get` resource `block`, merge, resend with the new revision |
| `publish-page` makes the site public | A website in draft stays offline. `manage-site` `update-website` `status: "live"` is the separate last switch |
| A theme fork per wish | Tokens and blocks cover most looks; every forked file stops receiving `basis` fixes |

## Output

Report in the operator's language: preview links, one line per page, open `clarifications`, theme and every overridden file with its reason, next steps.

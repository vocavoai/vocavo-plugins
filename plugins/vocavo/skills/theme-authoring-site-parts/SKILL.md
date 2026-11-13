---
name: theme-authoring-site-parts
description: 'Theme authoring details for navigation levels, contact and legal data, forms, social links, video and campaign layouts. Detail guide of theme-authoring.'
---

# Theme authoring: site parts

- **Navigation.** `nav(key)` with `main`, `footer`, `legal`, `header_cta` returns items with `label`, `url`, `active`, `active_trail`, `description`, `icon`, `children`, `is_mega`, `columns`, `featured`. Highlight the parent through `active_trail` with an aria-current attribute. Mobile uses a `<details>` per parent. The contents come from `manage-site` `set-navigation`; never hard-code a link list in a theme.
- **Header buttons.** `header_cta` holds up to two buttons, the last is filled; they also open the mobile menu.
- **Contact and legal data.** `contact()` gives company, street, zip, city, address, phone, email, website, maps_url, hours; `legal()` register, vat_id, managing_director. They come from `settings.contact` and `settings.legal` or the host's `ContactProvider`. Never type them into a theme. The Impressum takes its facts from `legal()`.
- **Phone links.** Build them from `contact()`; the engine's phone data is the source. `phone_unknown` in the audit means a link differs from the contact number.
- **Forms.** `form("contact")` returns the fields and the signed tokens. Keep the `data-*` hooks and the hidden fields of `partial/form_field` and `basis/block/form` (`form.hidden_missing`). Recipient: `settings.form_recipient_email`, or the host's `FormSubmissionHandler`. Submissions record the goal `form:contact`.
- **Social links.** `social()` from `settings.social`; render with `partial/social_links` or `partial/social_icon`. Links carry `rel="noopener me"`, a name and a tap target of at least 44 px.
- **Map.** The `map` block uses the contact address and links out; no embed, so nothing needs consent. Never hard-code map URLs.
- **Video.** The `video` block takes `youtube_id` or `vimeo_id` and a `poster`. The player loads after a click, without JavaScript it opens a new tab. Never embed an iframe yourself: it bypasses consent. A theme-specific block (a hero, a testimonial row with one video per item) may render the same click-to-load facade as basis `video`: `<a href="…" data-video-embed="https://www.youtube-nocookie.com/embed/<id>" data-video-provider="youtube" data-video-title="…">` (Vimeo: `https://player.vimeo.com/video/<id>`, provider `vimeo`), as long as the field holding the id is named `youtube_id` or `vimeo_id`, top level or inside repeater items. The engine finds those keys in published block data and loads the consent island; a differently named field gets no island and the click only opens a new tab.
- **Campaign layout.** `template/campaign` on `layout/campaign`: no navigation, a small footer, areas `hero` and `main`. See `landing-page`.
- **Consent and statistics.** `body_end()` prints the islands. A theme never adds scripts of its own for tracking: `consent-tracking`.
- **Legal pages.** `template/legal` with the block `legal_text`; keep the prose wrapper classes of `basis` (`legal.prose_wrapper_missing`, `legal.block_class_missing`).

## Articles

A published page with template `article_index` is the root of the article URLs; without it the module does not exist on a website. Records: `article`, article-category (manage-model). URLs never carry a date: `<root>/<slug>`, `<root>/<settings.articles.category_segment>/<slug>`, `<root>/<settings.articles.page_segment>/<n>`. Settings `articles`: `per_page`, `intro` (per locale), `cta_target.

- template/article_index` gets `listing`: `lead`, `items`, `categories` (with `count`, `active`), `category`, `all_active`, `pagination` (`next_url` …), `heading`, `intro`, `index_url`, `search_url`, `cta_target.
- template/article` gets `article`: `title`, `body` (or `body_first` + `body_rest`, split at the h2 nearest the middle; rest is empty below three sections), `toc`, `reading_minutes`, `date_label`, `category`, `author`, `image_id`, `faq_selection` (pass it to `faq()`), `related_pages`, `related_articles`, `share`, `cta_target.
- The article text goes in a Tailwind prose` element: the typography plugin is part of every theme bundle, and themes tune it with prose-* modifiers. Tables come in .article-table: give it overflow-x: auto.
- Hooks of the script (only on these pages, works without tracking): data-article-list around a list; data-article-grid + a[data-article-more] load the next page in place; a hidden form[data-article-search=<listing.search_url>] with data-article-search-input, data-article-browse, data-article-results, data-article-results-list, data-article-results-empty, data-article-results-status and template[data-article-card] make the search; [data-article-toc] marks the current heading; button[data-article-copy=<url>] copies a link.
- Never show an author, a date or a number the record does not hold. `review_required` is for editors and seo-audit, not for the page.

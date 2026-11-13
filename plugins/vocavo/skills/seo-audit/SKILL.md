---
name: seo-audit
description: 'Check the SEO of the website and measure PageSpeed: page audit, one page, internal links, acknowledged findings, PageSpeed reports. Use for "SEO prüfen", "SEO-Audit", "PageSpeed messen", "warum rankt die Seite nicht", "Ladezeit", "seo audit".'
---

# SEO audit and PageSpeed

## Audit

1. `manage-seo` `seo-audit`: every published page; `draft: true` checks the draft blocks; `locales` narrows it. It returns a summary and the issues.
2. One page: `manage-seo` `inspect-page` (`page_id`, `draft?`). Who links to a page: `manage-seo` `internal-links` (`page_id`); without it, the orphans.
3. Fix in this order:

| Severity | Codes | Fix |
|---|---|---|
| Error | `h1_count`, `meta_title_missing`, `translation_missing`, `duplicate_meta_title`, `redirect_chain` | One h1 per page (a hero on template `landing` in area `hero`); `manage-site` `update-page` for titles; `manage-site` `translation-status`; flatten redirects |
| Warning | `meta_title_length`, `meta_description_length`, `meta_description_missing`, `image_alt_missing`, `slug_untranslated`, `thin_content`, `orphan_page`, `duplicate_meta_description`, `og_image_size`, `sitemap_excluded` | Title at most 60 characters, description at most 155; alt per locale; real content, or `noindex` until there is some; link the page from a hub |
| Info | `phone_unknown`, `meta_description_fallback` | Check; a deliberate value can be acknowledged |

4. A finding that is right on purpose: `manage-seo` `acknowledge-seo-issue` (`code`, `page_id?`, `value` = its `ack_value`, `note`), with the operator's yes. Never to get a clean report.
5. Site facts for head, JSON-LD and `llms.txt`: `manage-site` `update-website` `settings.seo` (`description`, `services`, `regions`, `organization_type`). Canonical, hreflang, Open Graph, sitemap and robots come from the engine.

Then report: pages, issues per severity, what was fixed, what needs the operator. Never claim a ranking effect.

## PageSpeed

Every measurement calls Google. It needs a key (host config `integrations.pagespeed.key`, else `PAGESPEED_DISABLED`) and the operator's agreement, and it is limited per hour.

- `manage-seo` `run-pagespeed`: `url` (public) or `page_id` with `version` live or draft, `theme_id`, `theme_draft`, `locale`; `strategy` mobile, desktop or both; `label`. Without `confirmed: true` it only says what it would do. It takes 20 to 60 seconds. Local hosts are refused.
- A draft is noindex, so its SEO score is capped: judge SEO on the live site.
- History: `manage-seo` `list-pagespeed-reports` (`page_id?`, `limit?`).
- Bar: mobile Performance, Accessibility and Best Practices at least 95. Report the numbers as returned, never estimate one.
- Usual fixes: the hero image with correct sizes and not lazy, fonts with a fallback (no layout shift), contrast, one h1, heading order, tap targets of 44 px. Fix in the theme: `theme-authoring`.

---
name: search-integrations
description: 'Connect Google Search Console and Bing Webmaster Tools, verify the site, submit the sitemap, announce changed URLs through IndexNow and read search performance. Use for "Search Console einrichten", "Bing Webmaster", "IndexNow", "Sitemap einreichen", "Suchanfragen", "search performance".'
---

# Search Console, Bing and IndexNow

Every call except `list-integrations` reaches an external account, so each needs the operator's yes. The credentials live in the host (`website-engine.integrations`, from the host's environment or its `IntegrationCredentials`), never in a skill, a chat or a repository.

## Connect

1. `manage-integrations` `list-integrations`: connected or not, verified sites.
2. **With a storing credentials binding in the host:** `manage-integrations` `connect-search-console` or `manage-integrations` `connect-bing-webmaster` returns a one-time consent link (15 minutes) for the account owner. `NOT_CONFIGURED` means the host has no `client_id`.
3. **Read-only standard:** the host sets `client_id`, `client_secret` and `refresh_token` in its environment; then it counts as connected without a link. The consent link answers with a 409, since nothing can be stored.

Which binding a host has, and the redirect URL (route `website-engine.integrations.callback`), is a host decision. Provider settings the operator changes go into their own register.

## Verify and submit

Needs a live website on its real domain. `manage-integrations` `sync-search-console` and `manage-integrations` `sync-bing-webmaster` verify every live website and submit its sitemap; the result names verified, submitted and errors. The ownership files are served by the engine. Report errors as returned; a draft website cannot be verified. Hosts schedule `website-engine:search-console-sync` and `website-engine:bing-sync` daily.

## Performance

`manage-integrations` `search-console-performance` and `manage-integrations` `bing-webmaster-performance`: `days` (7, 28, 90), `dimension` (query, page, device, country, date; Bing query, page, date), `limit`. `NOT_VERIFIED`: sync first. Search data lags about two days. Report totals against the previous period; never read cause into them.

## IndexNow

`manage-seo` `submit-indexnow` announces changed URLs (`everything: true` all); the preview lists them and says whether pings are on. It needs `WEBSITE_ENGINE_INDEXNOW_KEY` and, outside production, `WEBSITE_ENGINE_INDEXNOW_ENABLED`, else `INDEXNOW_OFF`. The key file is served by the engine. Pings per change need a real queue; with a `sync` queue announce through this action or `website-engine:indexnow-submit`. `INDEXNOW_RATE_LIMITED`: wait as told.

## Disconnect

`manage-integrations` `disconnect-integration` (`integration`) with a yes.

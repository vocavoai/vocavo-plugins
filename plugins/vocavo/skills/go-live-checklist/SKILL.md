---
name: go-live-checklist
description: 'The checks before and after a website goes live: content, SEO, legal, consent, redirects, deployment, domain, search engines. Use for "Go-Live", "Website live schalten", "live gehen", "Domain umstellen", "Checkliste vor dem Livegang", "go live".'
---

# Go-live checklist

Go-live is the operator's decision. Deployment, DNS and the status switch happen only after their explicit yes to exactly that step. Work down the list, report each point with its evidence, and stop at the first failing blocker. Never tick what you did not check.

## Before: inside the engine

- [ ] `manage-site` `overview`: all pages published, `draft_changed` false, the right theme.
- [ ] `manage-site` `validate-theme`: 0 errors; the theme is published and switched.
- [ ] `manage-seo` `seo-audit`: no errors, warnings decided.
- [ ] `manage-site` `translation-status`: nothing missing for any enabled locale.
- [ ] `manage-site` `search-content`: no old host names or phone numbers, no placeholder text.
- [ ] No open `clarifications` (`CLARIFICATIONS_OPEN` on publish).
- [ ] Impressum and Datenschutz filled with this company's facts and read by the operator. Nobody reviewed them legally.
- [ ] Form: `settings.form_recipient_email` set, or the host's handler. Send one test on the preview only with a yes.
- [ ] `manage-tracking` `list-tracking`: decided per `consent-tracking`; the policy names the services. Cookie-free counting decided.
- [ ] Redirects: `manage-site` `list` resource `redirect` matches the approved table.
- [ ] Reviewed per `migrate-website-review` at 390 and 1440 px, approved by the operator on a phone.
- [ ] Baseline of the old site saved, if one exists and a PageSpeed key is available.

## Before: host (needs a yes)

- [ ] `APP_URL` and `WEBSITE_ENGINE_SITE_URL` are the real domain; preview links and absolute URLs use them.
- [ ] `php artisan migrate --force`, `storage:link`, `website-engine:publish-basis`, `website-engine:tailwind-install`.
- [ ] Scheduler runs `website-engine:analytics-aggregate` every 15 minutes; a real queue if IndexNow should ping per change.
- [ ] Mail configured for forms. Secrets only in the server's environment.
- [ ] MCP on production: a token and a deliberate decision on `MCP_ALLOW_REMOTE` or the host's own auth.
- [ ] The website's data is on the server. The engine has no export: moving the data is a planned step of its own.

## Switch (each step: a yes)

1. Deploy the host. Check the site on its server, while it is still in draft, with a signed preview.
2. `manage-site` `update-website` `status: "live"`: preview, then `confirmed: true`. The home page must be published (`HOME_NOT_PUBLISHED`).
3. Domain and DNS: the operator or their provider, with a noted TTL. The engine manages no domains. Note the old records for a rollback. TLS must be valid before the switch.

## After

- [ ] Home and every page type answer 200 on the real domain, without `noindex`: read the head.
- [ ] `/robots.txt` allows, `/sitemap.xml` lists the real domain, canonical points at it.
- [ ] Redirects: `python3 scripts/verify-redirects.py redirects.csv --base https://www.domain.example` (the `redirects.csv` from the migration): exactly one 301 per URL, target 200. Fix every failure.
- [ ] Old hosts and `www` variants lead to the canonical domain (server or DNS, not the engine).
- [ ] A real form submission arrives, with the operator's yes.
- [ ] Consent on the live page: nothing loads before a choice.
- [ ] `manage-integrations` `sync-search-console`, `manage-integrations` `sync-bing-webmaster`, `manage-seo` `submit-indexnow` with `everything: true`, each with a yes: `search-integrations`.
- [ ] `manage-seo` `run-pagespeed` with `url` and `label: "after live"`, mobile and desktop, with a yes.
- [ ] After a day: `manage-tracking` `analytics-report` has data, no 404 cluster, forms arrive.

## Rollback

`manage-site` `update-website` `status: "draft"` takes the site offline (every page 404, `robots.txt` disallow). Old DNS records bring back the old site. A page: `manage-site` `restore-page-version`. A theme: `manage-site` `switch-theme`.

## Report

What was checked with what result, what the operator still has to do, and every open point. Never "live and fine" without the checks above.

---
name: go-live
description: 'Take a finished vocavo website or landing page live on the owner''s own domain: readiness (quality gate, tracking, legal pages, lead hand-off), connect the domain with the exact DNS records for the registrar, wait and verify, switch the main address, redirects from the old site, after-launch checks (404s, a real test lead, ads pointing at the new domain). Replaces the engine''s go-live checklist. Use for "live gehen", "online gehen", "eigene Domain", "Domain verbinden", "DNS umstellen", "go.firma.de soll auf die Landingpage zeigen", "Website live schalten", "Checkliste vor dem Livegang", "go live", "connect my domain".'
---

# Go live

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`.

A page that is finished and approved on its platform host (`https://<label>.<site domain>`) moves to the owner's own domain (`go.firma.de`, `firma.de`) without downtime and without losing a ranking. vocavo does the server side by itself: DNS check, HTTPS certificate, redirects. The owner (or whoever runs their DNS) sets one or two DNS records once. Reached from `launch-campaign` (before gate 10), `migrate-website` (hand-over) or `onboard-account`; also on its own ("verbinde go.firma.de").

Every switch below needs the owner's yes to exactly that step: switching the website live, adding the domain, the main address, ads' new URLs. Going live on a domain is never covered by an approval mode (`playbook`).

```
Live auf go.firma.de – Stand
[x] 1 Bereit: Seiten, Qualität, Tracking, Recht, Leads   alles grün
[x] 2 Adresse und DNS-Zuständigkeit geklärt               go.firma.de, Inhaber selbst
[ ] 3 Domain angelegt, DNS-Einträge übergeben             –
[ ] 4 DNS gesetzt, geprüft, HTTPS aktiv                   –
[ ] 5 Hauptadresse und Weiterleitungen                    –
[ ] 6 Nach dem Start: 404, Test-Lead, Anzeigen-URLs       –
```

## 1. Readiness

Read, then show a short table. A red row goes back to the skill that owns it; never skip one silently.

| Check | How | Owner skill |
|---|---|---|
| Pages that get traffic are published, no draft change the owner expects live | `manage-site` `overview` | `edit-website`, `landing-page` |
| Quality gate passed on each page that gets traffic | `manage-quality` `check-page` (or `check-website`), verdict pass | `page-quality` |
| Tracking proven stage by stage | `manage-conversions` `status` | `tracking-check` |
| Legal pages of the customer's site: Impressum and Datenschutz exist on the website (system pages, published) or are linked in its legal navigation (another domain of the company is fine), filled with this company's facts and read by the owner. Nobody here reviews them legally; say so | `manage-site` `list` with `resource: "page"`, `manage-site` `get` with `resource: "navigation"` | `edit-website` |
| Consent: banner approved, nothing loads before a choice | `manage-tracking` `list-tracking` | `consent-tracking` |
| Lead hand-off tested: a test lead reached the CRM or the mail recipient | `manage-lead-sync` `status` (last delivery) or `manage-leads` `summary` | `lead-handoff` |
| SEO: no errors left | `manage-seo` `seo-audit` | `seo-audit` |
| Old site moved (migrations only): every old URL has a 301, 410 or ignore mark | `manage-site` `list` with `resource: "redirect"` against the migration's `redirects.csv` | `migrate-website` |
| Billing allows writes | `manage-billing` `status` | — |

The website itself must be live (`manage-site` `update-website` with `status: "live"`, preview, then the owner's yes): an own domain serves only a live website. While DNS still points to the old site, going live in vocavo changes nothing for visitors.

## 2. Questions (one round, recommended answer first)

| # | Ask when | Question | Options |
|---|---|---|---|
| Q1 | address not known | „Unter welcher Adresse soll die Seite laufen?" | the address the old page used, so links and rankings stay **(Empfohlen)** · a subdomain such as `go.firma.de` for landing pages · the main domain `firma.de` (with `www`) · free text (a new domain: buy it at a registrar first) |
| Q2 | always | „Wer setzt die DNS-Einträge?" | **Ich selbst (Empfohlen)**: records and click path for the provider · **Agentur oder IT**: you write the text to forward |
| Q3 | the main domain or `www` | „Laufen E-Mails über diese Domain?" | E-Mail bleibt, wie sie ist: we change only the website records, never MX or TXT **(Empfohlen)** |
| Q4 | always | „Soll die vocavo-Adresse danach auf die neue Domain weiterleiten?" | **Ja (Empfohlen)**: one address for Google; signed previews keep working · Nein, als Vorschau-Adresse behalten |

Main domain or subdomain: the main domain (`firma.de`) is usually the company's existing site; a landing page goes on a subdomain (`go.firma.de`, `angebot.firma.de`), which leaves the main site and the e-mail untouched. Pick as main address the host the old page answered on (`www.firma.de` or `firma.de`), so old links need only one redirect.

## 3. Add the domain

`manage-account` `add-custom-domain` (`website_id`, `domain`, `redirect_platform_host` from Q4; `www: false` only when the owner wants no `www` companion). Show the preview (hosts and records), then confirm on the yes. The result has:

- `dns_records`: the exact records. A subdomain gets `CNAME <name> → <vocavo target>`; the main domain gets `A @ → <server IP>` plus `CNAME www → <vocavo target>` for its companion. Show them as a table, every name and value in code so one tap copies it:

  | Typ | Name | Wert | TTL |
  |---|---|---|---|
  | CNAME | `go` | `sites.vocavo.pro` | 300 |

- `instructions`: the same in plain German; give it as it is to an agency (Q2).

The rules for whoever sets them: exactly these records; delete other A, AAAA or CNAME records with the same name (they belong to the old site); never touch MX, TXT (SPF, DKIM, verifications) or other names. Click paths, short:

- **IONOS**: Domains & SSL → Domain → DNS → Eintrag hinzufügen (CNAME: Hostname `go`, Zeigt auf …).
- **Strato**: Domainverwaltung → Domain → DNS → CNAME-Record verwalten (subdomain first under „Subdomain anlegen").
- **GoDaddy**: Meine Produkte → Domain → DNS → Hinzufügen.
- **Cloudflare**: DNS → Records → Add record, and switch the proxy off (grey cloud, „DNS only"); an orange cloud hides the record from vocavo and blocks the certificate.
- **United Domains, Hetzner, All-Inkl, others**: DNS settings of the domain → new record; ask for a screenshot when unsure.

A CAA record that names other certificate authorities needs `0 issue "letsencrypt.org"` added (the check says so).

## 4. Wait and verify

DNS changes take minutes, sometimes a few hours. vocavo re-checks pending domains every five minutes by itself and switches to HTTPS on its own; tell the owner so. When they say the records are set: `manage-account` `verify-domain` (`domain`). It answers at once with what is wrong, in German, for example „CNAME von go.firma.de zeigt auf firma.wpengine.com, erwartet sites.vocavo.pro." Pass the sentence on and the record to change. Then `manage-account` `domain-status` (`domain`) until `status: "active"`:

| Status | Meaning | What you do |
|---|---|---|
| `status: "pending"` | waiting for the records | show the problem; ask again later |
| `status: "dns-ok"`, `status: "certificate-requested"` | DNS right, Let's Encrypt is issuing (1–3 minutes) | wait, read `domain-status` again |
| `status: "active"` | served over HTTPS | step 5 |
| `status: "failed"` | the certificate could not be issued; `failure_reason` says why (proxy in front, CAA, port 80 blocked) | fix that, then `verify-domain` starts over |

Nothing is served on the domain before `active`; until then the old site (or nothing) answers there. Never set the website back to draft because DNS is slow.

## 5. Main address and redirects

For the website's first own domain the main address switches by itself once the domain is active: canonical URLs, `sitemap.xml`, `robots.txt`, Open Graph and the lead form's links use it; the `www`/apex companion and other own domains answer 301 to it with path and query; the platform host too when Q4 was yes. To change it later: `manage-account` `set-primary-domain` (`domain`, `redirect_platform_host`), preview first. Back to the platform host: `set-primary-domain` with the platform host.

Old URLs: when the domain served the old site, its paths now reach vocavo. The redirects of the migration (`manage-site` `import-redirects`) take them to the new pages. Check with this skill's script, every old URL exactly one 301 to a page that answers 200:

```bash
python3 scripts/verify-redirects.py redirects.csv --base https://go.firma.de
```

Consent and the cookie-free counting are per host: visitors choose once more on the new domain. Nothing else changes.

## 6. After the start

- [ ] `https://<domain>/` and every page that gets traffic answer 200 without `noindex`; the platform host answers 301 (or 200 when kept as preview). `manage-seo` `inspect-page` on the live URL: canonical and OG name the domain.
- [ ] A real test lead through the live form on the new domain, with the owner's yes (an address like `vorname+test@firma.de`), arrives in the CRM or the mailbox: `manage-lead-sync` `deliveries` or `manage-leads` `summary`.
- [ ] Ads: in the ads connector, every ad that leads to the page gets the new URL with the same URL parameters. Changing live ads needs the owner's yes; list each ad with old and new URL first. Campaign links stored in vocavo: `manage-campaign-links` `list-campaign-links`, save them again with the new page URL (`save-campaign-link`).
- [ ] Search: `manage-integrations` `connect-search-console` for the new domain, then `manage-seo` `submit-indexnow` with `everything: true` (each with a yes; see `search-integrations`).
- [ ] After a day and after a week: 404s and visits on the new domain (`manage-tracking` `analytics-report`), leads arriving. New old-URL 404s get a redirect.

## Rollback

`manage-account` `set-primary-domain` back to the platform host, or `manage-account` `remove-domain` (takes the domain and its certificate off the server; the owner's old DNS records then bring back the old site). The website stays on its platform host throughout.

## Report

What was checked with what result, the domain's status, what the owner still has to do (DNS records, ads), and every open point. Never "live and fine" without the checks of step 6.

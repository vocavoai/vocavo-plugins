# vocavo – plugin for Claude & ChatGPT

**Deutsche Version: [README.md](README.md)**

**vocavo** builds and runs websites and landing pages that bring leads, for service businesses. There is no admin UI: you build, migrate and maintain everything by talking to Claude or ChatGPT, with a preview before every change. Leads from your forms are stored in vocavo, mailed to you and, if you like, sent to your webhook.

This directory is the plugin marketplace `vocavo`. The plugin `vocavo` brings the vocavo MCP server (`https://vocavo.pro/mcp`) and **skills** that react to plain sentences ("Move my landing page to vocavo", "Which leads are new?").

> **Generated** by `php artisan vocavo:build-plugin`. Changes by hand are overwritten by the next build.

Version: **1.4.0**

## Install

### Claude Code

```
/plugin marketplace add https://vocavo.pro/plugins/marketplace.json
/plugin install vocavo@vocavo
```

From a local build: `/plugin marketplace add <path to this directory>`.

Sign in: in a session `/mcp` → **vocavo** → **Authenticate**. The browser opens vocavo, you sign in and allow access. A token never goes into the plugin.

Update: `/plugin marketplace update vocavo`, then `/plugin update vocavo@vocavo`.

### Claude Desktop and claude.ai (connector)

**Settings → Connectors → Add custom connector** with the URL

```
https://vocavo.pro/mcp
```

Sign-in through OAuth. All tools are available afterwards. In Claude Desktop you can also install this plugin for its skills (same marketplace address as above).

### ChatGPT and Codex

- **ChatGPT:** Settings → Apps & Connectors → Advanced → Developer mode, then **Create connector** with the URL `https://vocavo.pro/mcp` and authentication **OAuth**.
- **Codex:** `codex plugin marketplace add <path or repository>`, then `codex plugin add vocavo@vocavo` and `codex mcp login vocavo`. Without the plugin: `codex mcp add vocavo --url https://vocavo.pro/mcp`.

## Skills

| Skill | Use |
|---|---|
| `ab-test` | Create, run and evaluate a page A/B test: variant pages, goal, start, report, winner. Use for "A/B-Test anlegen", "Variante testen", "welche Version ist besser", "Test auswerten", "Gewinner übernehmen", "ab test". |
| `ad-creatives` | Plan and build Facebook and Instagram ad creatives that cannot embarrass the owner: formats and safe zones per placement, nothing cropped, text readable on a phone, sound only on purpose, one message per ad, honest claims within Meta's rules, a landing page that repeats the promise, a naming scheme and a test matrix; turn raw video into short ad cuts; always a preview before anything is created, and ads are created paused. Use for "neue Creatives", "ich bin bereit, neue Creatives zu testen", "Anzeigenbilder", "Anzeigentext", "aus dem Video Anzeigen schneiden", "Reels-Anzeige", "Bild oder Video?", "new ad creatives", "cut ads from this video". |
| `analytics-report` | Evaluate the website statistics: visitors, page views, sources, devices, goals, conversions, comparison with the previous period. Use for "Website-Statistik", "wie viele Besucher", "Conversions", "woher kommen die Besucher", "Analytics auswerten", "analytics report". |
| `build-website` | Build a new website with this engine from nothing: questions, settings, theme, images, pages, navigation, check, publish. Use for "Website erstellen", "neue Website", "neue Homepage", "Website aufbauen", "build a website". Moving an existing site: migrate-website. |
| `consent-tracking` | Configure consent and tracking: which services load, the IDs, the banner approval, what the privacy policy must name. Use for "Cookie-Banner", "Consent einrichten", "Google Analytics einbauen", "Meta Pixel", "Google Ads Tag", "Tracking konfigurieren", "consent". |
| `edit-website` | Change an existing website through the engine: texts, images, blocks, pages, navigation, redirects, then preview and publish. Use for "Text ändern", "Bild austauschen", "neue Seite", "Menüpunkt", "Weiterleitung anlegen", "Website bearbeiten", "edit the website". |
| `go-live` | Take a finished vocavo website or landing page live on the owner's own domain: readiness (quality gate, tracking, legal pages, lead hand-off), connect the domain with the exact DNS records for the registrar, wait and verify, switch the main address, redirects from the old site, after-launch checks (404s, a real test lead, ads pointing at the new domain). Replaces the engine's go-live checklist. Use for "live gehen", "online gehen", "eigene Domain", "Domain verbinden", "DNS umstellen", "go.firma.de soll auf die Landingpage zeigen", "Website live schalten", "Checkliste vor dem Livegang", "go live", "connect my domain". |
| `landing-page` | Build a landing page that brings leads: one goal, one audience, a lead form (inline or as a modal) whose leads go to the right inbox or webhook, a tracked campaign link per channel, then measure it. Use for "Landingpage bauen", "Kampagnenseite", "Lead-Seite", "E-Book-Seite", "Webinar-Anmeldung", "Formular für Anfragen", "Kampagnenlink", "QR-Code-Link", "UTM-Link", "landing page", "lead form", "campaign link". |
| `landing-page-tests` | Run the challenger loop on a landing page: a hypothesis from data in one sentence, a variant with exactly that one change, the quality gate, the owner's yes, the test running automatically, a verdict only when the statistics allow it, the winner made live and the next challenger proposed. Use for "Schalte eine Alternativversion dazu", "teste eine zweite Version", "Bild oder Video oben?", "welche Version gewinnt?", "nächster Test", "Challenger", "testen, testen, testen", "run a page test", "which version won". |
| `launch-campaign` | From one sentence to running ads: clarify goal, offer, audience, budget and success measure, build the landing page, pass the quality gate, get the owner's thumbs up, prove tracking and the lead hand-off, set the campaign naming and UTM scheme, plan the creatives, build the ads paused in the ads connector, preview, switch on only on a yes and schedule the first review; a visible checklist where every gate names its evidence. Use for "Ich will eine Landingpage und die bewerben", "neue Kampagne", "Anzeigen schalten", "wir wollen Werbung für … machen", "Landingpage für unser Angebot und Facebook-Anzeigen", "launch a campaign", "advertise this offer". |
| `lead-handoff` | Get every lead into the owner's CRM (HubSpot) and back the information which lead became a customer: connect HubSpot, map the form fields, send a test and walk the owner through the chain behind it (HubSpot workflow, Zapier, newsletter list) before ads go live; mail recipient or webhook as alternatives; then pull won and lost deals back so ads are judged by customers, not leads. Use for "Leads in HubSpot", "HubSpot verbinden", "CRM anbinden", "kommen die Leads im CRM an?", "Zapier testen", "welcher Lead wurde Kunde?", "Kunden zurückmelden", "Lead als gewonnen markieren", "connect HubSpot", "mark as won". |
| `leads` | Read and work the leads of an vocavo account: what came in, from which page, form, campaign and ad, set a status, mark won (with value) or lost, import outcomes, mark spam or not spam, export, change the recipient, set up and test the webhook to a CRM or newsletter tool with signature verification. Use for "Welcher Lead wurde Kunde?", "Lead gewonnen", "Leads pro Anzeige", "Welche Anfragen sind neu?", "neue Leads", "Leads anzeigen", "Lead als erledigt markieren", "Spam", "Leads exportieren", "Webhook einrichten", "Leads ans CRM schicken", "Empfänger ändern", "show my leads", "set up the webhook". |
| `migrate-website` | Move an existing website, landing page or sales funnel (WordPress, Elementor, OptimizePress, Wix, Webflow, a funnel builder, a static site) into an vocavo account without losing a lead, a link or a ranking: pick the account, inventory and measure the old pages, choose 1:1, keep the look or redesign, map every call to action and form (lead forms become lead_form blocks, payment and booking links stay), handle tracking through consent, compare old and new side by side at 390 and 1440 px, plan redirects, have it reviewed, pass the quality gate, hand over the preview link and offer an improved challenger next to a 1:1 page. Use for "Website umziehen", "Landingpage umziehen", "Funnel übernehmen", "Verkaufsseite übernehmen", "1:1 übernehmen", "Website migrieren", "von WordPress wechseln", "migrate my website", "move my landing page". |
| `migrate-website-agents` | How to run migrate-website with subagents: which phases run in parallel, which model does what, the plan file contract (account, mode, sections, calls to action, lead forms, tracking) and the approval rules. Detail guide of migrate-website. |
| `migrate-website-questions` | The predefined questions of a website or landing-page migration: format, rounds, when to ask which question and its options (mode, providers, forms and where their leads go, tracking, placeholders, host label), asked after the inventory and never what it already answered. Detail guide of migrate-website. |
| `migrate-website-review` | Rules and review checklist for a migrated or newly built website or landing page (side-by-side comparison with the old page at 390 and 1440 px, sections, calls to action, payment and booking links, lead forms and modals, tracking and consent, placeholders, header, hero, headings, contrast, buttons, images, testimonials, videos, legal pages, share images, fonts, facts and numbers). Builders apply it on the first pass, an independent reviewer walks it before the operator sees the site. |
| `onboard-account` | The setup of a new vocavo account: find or create the account, collect the business facts once, look at the accounts the funnel depends on (Stripe, Meta, Google, CRM) and collect what is needed, migrate every landing page and propose an improved challenger next to each 1:1 page, set where leads go, explain the trial. Use for "Richte mein Konto ein", "Ich bin neu hier", "Wie fange ich an?", "Einrichtung", "alle Landingpages umziehen", "Konto anlegen", "neues Konto für einen Kunden", "set up my account", "get started". A later session without a task starts with start-here. |
| `page-quality` | The quality gate before the owner sees a page and before any traffic goes to it: run the automatic page check (load speed, image and video weight on a phone, overlapping or cut-off elements on mobile, links, forms), fix what is wrong yourself, check again, then show screenshots and the remaining notes in plain words. Use for "Ist die Seite gut?", "Qualitätscheck", "Seite prüfen", "lädt die Seite schnell?", "sieht das auf dem Handy gut aus?", "ist alles bereit für Traffic?", "check the page", "quality check". |
| `performance-review` | Review how the ads and landing pages performed today, in the last hours or days: spend, clicks and leads per campaign and ad joined with vocavo's leads, page conversions, tests, purchases and won customers into cost per lead and cost per customer; judged with explicit patience rules; ends with a short list (pause, keep, more budget, next test), each with its reason and needing a yes. Use for "Wie liefen die Anzeigen heute?", "die letzten sechs Stunden", "wie lief die Woche?", "was soll ich pausieren?", "welche Anzeige ist die beste?", "lohnt sich die Kampagne?", "Kosten pro Lead", "Tagesbericht", "how did the ads do today", "daily review". |
| `playbook` | The account's own standing rules and its approval mode: remember a rule ("Überschriften grün statt rot"), show, change or forget rules, and decide what the assistant may do without asking ("mach alles, frag nicht" with a budget cap). Rules override every default. Use for "Merke dir …", "ab jetzt immer …", "nie wieder …", "was hast du dir gemerkt?", "vergiss die Regel", "mach alles, frag nicht", "frag mich vorher", "du darfst Anzeigen selbst pausieren", "remember that", "stop asking me". |
| `search-integrations` | Connect Google Search Console and Bing Webmaster Tools, verify the site, submit the sitemap, announce changed URLs through IndexNow and read search performance. Use for "Search Console einrichten", "Bing Webmaster", "IndexNow", "Sitemap einreichen", "Suchanfragen", "search performance". |
| `send-feedback` | When the owner wants something vocavo cannot do, hits an error or has an idea: say so plainly, suggest the nearest thing that works today, show the exact feedback text and send it to the vocavo team on a yes. Use for "Kannst du auch …?" when the answer is no, "das geht nicht", "Fehler melden", "Feedback", "Idee", "Wunsch", "warum geht das nicht", "Webinar", "Newsletter verschicken", "Dashboard", "Rechnungen", "send feedback", "feature request". |
| `seo-audit` | Check the SEO of the website and measure PageSpeed: page audit, one page, internal links, acknowledged findings, PageSpeed reports. Use for "SEO prüfen", "SEO-Audit", "PageSpeed messen", "warum rankt die Seite nicht", "Ladezeit", "seo audit". |
| `start-here` | The start of every vocavo session and the house rules all other skills follow: pick the account, read its playbook, show where the funnel stands in five lines (pages, tracking, ads connector, lead hand-off, tests) and route to the right skill. Use when a conversation starts without a clear task or the owner asks where things stand: "Hallo", "Wo stehen wir?", "Was kannst du?", "Was steht an?", "Was soll ich als Nächstes machen?", "Status", "hilf mir", "where are we", "what can you do". |
| `theme-authoring` | Build or change a website theme: Twig templates, blocks, design tokens, fonts and colours, with validate, preview and publish. Use for "Theme bauen", "Design anpassen", "Block anpassen", "Farben ändern", "Schrift ändern", "Vorlage bearbeiten", "theme authoring", "change the design". |
| `theme-authoring-blocks` | The blocks every theme renders, overrides of block schemas (optional fields only), schema versions, icons and theme-specific blocks with their fallback. Detail guide of theme-authoring. |
| `theme-authoring-site-parts` | Theme authoring details for navigation levels, contact and legal data, forms, social links, video and campaign layouts. Detail guide of theme-authoring. |
| `tracking-check` | Prove that tracking works end to end, from the ad click to the lead, the CRM, the Meta event and the Stripe purchase: read the funnel proof stage by stage, run a real test (test lead with a tagged campaign link, test server event, test purchase where possible), cross-check in the ads connector, give a verdict per stage in plain words and set up what is missing. Use for "Funktioniert unser Tracking?", "Haben wir sauberes Tracking?", "kommen die Leads an?", "sieht Meta die Conversions?", "ist Stripe angebunden?", "Pixel einbauen", "Conversion-Tracking", "is tracking working", "set up conversions". |

## Security

- The plugin holds no data and no token. After sign-in the server checks which accounts you may use.
- Every write is shown as a preview first and runs only after you confirm it.

## Layout

```
.claude-plugin/marketplace.json        Claude Code marketplace
.agents/plugins/marketplace.json       Codex/ChatGPT marketplace
plugins/vocavo/
  .claude-plugin/plugin.json           Claude plugin manifest
  .mcp.json                            MCP server for Claude (http, URL only, OAuth)
  plugin.json, mcp.json                portable agent-plugins package (OpenAI, streamable-http)
  .codex-plugin/plugin.json            Codex manifest
  skills/<slug>/SKILL.md               skills
  skills/<slug>/scripts/               helper scripts (Python 3, no dependencies)
```

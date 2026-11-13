---
name: tracking-check
description: 'Prove that tracking works end to end, from the ad click to the lead, the CRM, the Meta event and the Stripe purchase: read the funnel proof stage by stage, run a real test (test lead with a tagged campaign link, test server event, test purchase where possible), cross-check in the ads connector, give a verdict per stage in plain words and set up what is missing. Use for "Funktioniert unser Tracking?", "Haben wir sauberes Tracking?", "kommen die Leads an?", "sieht Meta die Conversions?", "ist Stripe angebunden?", "Pixel einbauen", "Conversion-Tracking", "is tracking working", "set up conversions".'
---

# Tracking check

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`.

**The standard: "Ein Pixel ist kein Tracking."** Tracking works when a test went through every stage and each stage shows its evidence. A stage without evidence is "nicht belegt", never "ok".

## 1. Read the proof

1. `manage-account` `get-playbook`.
2. `manage-conversions` `status` (`website_id`; default the primary website): eight stages with a verdict and their evidence: consent (banner approved for exactly the configured services), browser tags (Meta pixel, Google Ads labels per goal), server events (token stored, last delivery Meta accepted, skips without consent, a test code still stored), goals (last occurrence), attribution (leads with and without source), lead forms (last submission per form), purchases (pricing tables, Stripe signing secret, last purchase), lead sync (webhook or CRM, last delivery). Its `limits` list says what cannot be proven from here: use it in section 3.
3. Context: the page's latest quality report (`manage-quality` `get-report`; none or stale: `page-quality`), `manage-tracking` `list-tracking` (services, banner approved), `manage-tracking` `list-goals` (each lead form is `form:<form_key>`), `manage-lead-sync` `status`, `manage-conversions` `deliveries` (server events sent and Meta's answer), `manage-conversions` `purchases`.

## 2. Test for real

Say in one line what `status` already shows ("Laut System: Leads und HubSpot ok, Server-Events und Stripe nicht eingerichtet; ich prüfe das jetzt echt."). Then ask which stages the owner relies on (Meta ads → the pixel and server events count; do they sell through Stripe? should customers come back from the CRM?), so "durchgehend" means their funnel; a stage they do not use is "nicht genutzt". Then ask once for the yes to a test run, naming only what is set up ("Ich lege einen Test-Link an, du schickst darüber einen Test-Lead; er landet in HubSpot als Test. Okay?"). That yes covers the test link, the test lead and marking it lost afterwards; setting up something new (section 4) is a separate yes, and so is a further test lead later. A stage that is not set up is not tested: it is "nicht eingerichtet" and goes to section 4. Then:

1. **Tagged visit and test lead.** A campaign link for the test: `manage-campaign-links` `save-campaign-link` with the page the ads lead to (the one with the lead form; `manage-site` `list` resource `page`; ask when unsure) and `utm_source: "test"`, `utm_medium: "check"`, `utm_campaign: "trackingtest"`, `utm_content` = today's date as yymmdd. Fill the form on the live page through that link (your browser tool), or hand the owner the link and ask them to send it from their phone with an address like `vorname+test@their-domain`. Without a browser tool say that the owner has to do this step.
2. **Lead arrived with its source.** `manage-leads` `summary` with `hours` covering the time since the link was sent and `group_by: "utm_campaign"`: the test lead must appear under "trackingtest". In the group "(none)", the attribution is broken: check that the form sits on the page the link opens and that nothing redirects without the parameters, then test again; if it stays broken, `send-feedback` with the steps.
3. **Hand-off.** `manage-lead-sync` `deliveries`: delivered? (A webhook instead: `manage-leads` `test-webhook`; the mail: ask the recipient whether it arrived.) The rest of the chain behind the CRM is checked with the owner in `lead-handoff`.
4. **Server event** (only when configured). The owner opens Meta Events Manager → the pixel → Test events and copies the test code (it starts with TEST). `manage-conversions` `send-test-event` with `test_event_code` (and `event_name`, default Lead); within a minute the event shows under Test events: ask what they see. `manage-conversions` `deliveries` shows Meta's answer (events received). If a test code was stored with `configure-meta-server-events`, every server event goes to Test events only: remove it (`test_event_code: ""`) before ads run; `status` warns while it is stored.
5. **Purchase** (only when purchase tracking is configured). `manage-conversions` `purchases` (`days`) lists purchases Stripe confirmed by its signed webhook, with their attribution. One since the setup: belegt. None: a test purchase in Stripe test mode needs its own webhook endpoint and secret; otherwise a real low-price purchase the owner refunds, or waiting for the first real sale. Offer the options and do nothing without the owner choosing one. A purchase through a payment link outside the website is recorded but never attributed or sent to Meta: say so when the owner sells that way.
6. **Pixel and cross-check in the ads connector** (read only): does the ad account's dataset or pixel show the test lead's events (page view, lead) and from which source (browser, server)? Without a connector that shows events, the owner opens Events Manager → Test events and tells you. This check is required for the pixel row to be ok. Do the active and paused ads link to the right page, and do their URL parameters carry the UTM scheme (`launch-campaign`: `utm_campaign={{campaign.name}}`, `utm_content={{ad.name}}`)? An ad without them cannot be attributed.

## 3. Verdict table

One row per stage, in the owner's words, with the evidence:

| Stufe | Ergebnis | Beleg |
|---|---|---|
| Seite live und schnell | ok | Qualitätsbericht vom 13.11., pass |
| Cookie-Banner freigegeben | ok | freigegeben am 12.11. |
| Meta-Pixel im Browser | eingerichtet, nicht belegt | belegt erst, wenn der Events Manager den Test-Lead zeigt |
| Lead mit Quelle gespeichert | ok | Test-Lead 14:02 unter „trackingtest" |
| Lead in HubSpot | ok | Übergabe 14:02, Antwort 200 |
| Meta sieht den Lead (Server) | nicht belegt | Test-Event gesendet, Bestätigung im Events Manager fehlt |
| Stripe-Kauf erfasst | nicht eingerichtet | |
| Kunde zurückgemeldet | nicht eingerichtet | |

Then what cannot be proven from vocavo's side (the `limits` of `status`) and how the owner checks it: the browser pixel firing after consent (Events Manager → Test events, open the page on the phone, accept cookies); whether Meta matched and deduplicated browser and server events (Events Manager → Overview → the event → Event deduplication, Event Match Quality); visitors who decline consent are never reported to Meta, so Meta's numbers stay below ours (expected); Google Ads conversions come only from the browser tag (check in Google Ads → Goals).

Open the answer with the plain verdict ("Ja, durchgehend belegt." or "Noch nicht ganz: belegt bis HubSpot, danach nicht."), then the table. "Durchgehend belegt" only when every stage the owner relies on is ok.

## 4. Set up what is missing

Each with the owner's inputs and a yes (or the playbook's "tracking" scope):

- Consent banner and pixel: `consent-tracking` (`manage-tracking` `configure-tracking` with `meta-pixel` and the pixel id the owner gives; `manage-tracking` `approve-consent-banner` after they read it).
- Server events to Meta: the pixel must be configured first (`meta-pixel` above). `manage-conversions` `configure-meta-server-events` with `access_token`, which the owner creates in Events Manager → the pixel → Settings → Conversions API → Generate access token; options: `user_data` (hashed email, phone, name with consent, default on: Meta's matching depends on it), `client_data`, `phone_country_code` (49 for German numbers without prefix), `event_mapping`, `won_event` (the event for a customer won in the CRM). A token pasted in the chat stays in this conversation: say so, never repeat it, and tell the owner to create a new one in Events Manager if the conversation is ever shared.
- Purchases from Stripe (a page with a `stripe_pricing_table` block): `manage-conversions` `configure-purchase-tracking` (preview) returns the webhook URL, the return URL and the steps. The owner adds the webhook in Stripe (Developers → Webhooks, events for completed checkout sessions), reveals its signing secret, and sets the pricing table's confirmation to redirect to the return URL. Then the same action with `signing_secret` and `thank_you_page`. Test as in step 2.5.
- Failed deliveries: `manage-conversions` `retry` after the cause is fixed.
- Outcomes back from the CRM: `lead-handoff`.

Then test that stage again (a new test lead needs a new yes). A setup is done when its stage is ok, not when the call succeeded.

## Never

- Calling tracking "100 %" or "sauber" while a stage the owner relies on is not belegt.
- Inventing a pixel id, dataset id or token, or copying ids from an old site unconfirmed.
- Buying, refunding or charging anything yourself.
- Counting a test lead as a real one: after the check find it (`query-model` type `lead`, `utm_campaign` trackingtest) and set it to lost with the reason "Tracking-Test" (`manage-leads` `mark-lost`) and remind the owner to delete the test contact in their CRM and newsletter tool.

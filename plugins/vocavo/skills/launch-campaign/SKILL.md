---
name: launch-campaign
description: 'From one sentence to running ads: clarify goal, offer, audience, budget and success measure, build the landing page, pass the quality gate, get the owner''s thumbs up, prove tracking and the lead hand-off, set the campaign naming and UTM scheme, plan the creatives, build the ads paused in the ads connector, preview, switch on only on a yes and schedule the first review; a visible checklist where every gate names its evidence. Use for "Ich will eine Landingpage und die bewerben", "neue Kampagne", "Anzeigen schalten", "wir wollen Werbung für … machen", "Landingpage für unser Angebot und Facebook-Anzeigen", "launch a campaign", "advertise this offer".'
---

# Launch a campaign

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`.

The owner said the goal in one sentence. You lead through eleven gates. **No gate is skipped silently**: a gate the owner wants to skip is marked "übersprungen auf Wunsch" with the risk said once.

## The checklist

Show it at the start and after every gate, updated, with the evidence:

```
Kampagne „Entsperrung" – Stand
[x] 1 Ziel, Angebot, Budget        bestätigt
[x] 2 Landingpage gebaut           Entwurf /entsperrung
[ ] 3 Qualitätscheck               –
[ ] 4 Daumen hoch zur Seite        –
[ ] 5 Tracking belegt              –
[ ] 6 Lead-Übergabe belegt         –
[ ] 7 Namen und UTM-Schema         –
[ ] 8 Creatives freigegeben        –
[ ] 9 Anzeigen pausiert angelegt   –
[ ] 10 Freigabe und live           –
[ ] 11 Erster Review geplant       –
```

## Before gate 1

`manage-account` `get-playbook`; `manage-billing` `status` (a read-only account cannot build); `manage-site` `overview`; look through your tools for the ads connector. None: say so in two sentences (`start-here`) and go on; gates 1–8 work without it.

## Gate 1: the brief, one question at a time

Each question with a proposed answer from what you know (their site, the playbook, earlier campaigns). Skip what the owner already said.

1. **Goal:** which action counts? (a call request, an e-book download, a purchase through Stripe)
2. **Offer:** what exactly, at which price, what does the visitor get after the form?
3. **Audience:** who, what is their problem, in their words?
4. **Success measure:** what may a lead cost, what a customer? A target in the playbook: confirm it. None: ask how many leads out of ten usually buy, derive it with the owner from price and that closing rate, and they confirm the number. Without it, every later verdict is a guess.
5. **Budget:** one daily figure for the whole campaign (Meta spreads it over the ad sets) and how long the first test runs (at least 7 days). Propose one number with its basis: enough for about one to two leads a day at the target (target 25 € → 40 € a day), and what the week costs ("280 € für die erste Woche"). A "ja" to that figure is the budget; never take a figure from an example in this skill.
6. **Ad account:** which one (from the connector, read only), and the Facebook page and Instagram account to run as.

Evidence: the brief in six lines, confirmed by the owner. Offer to `remember` lasting answers in the playbook (target cost per lead, budget cap).

## Gate 2: the page

`landing-page`, template `campaign`, one goal, a `lead_form` (or a `stripe_pricing_table` when the goal is a purchase). The headline repeats the promise the ads will make. Evidence: page id and preview link.

## Gate 3: quality

`page-quality` until the verdict is "pass" or "pass-with-notes" after the last change. Evidence: the report and its date.

## Gate 4: the owner's thumbs up

Screenshots from the quality report (phone first; as links when the client cannot show images), preview link, remaining notes. A "nein" goes back to gate 2. Ask both in one question: "Gefällt sie dir, und soll ich sie veröffentlichen?" A clear yes to both: `manage-site` `publish-page` (or the playbook's "pages" scope). Evidence: yes and publish time.

## Gate 5: tracking proven

`tracking-check` on this page. Required: the test lead stored with its source, the lead handed on, and the optimisation event the ads will use (usually Lead) seen by Meta, proven by the ads connector's dataset events or by the owner in Events Manager (the browser pixel at least; server events strongly recommended: when missing, offer to set them up now through `tracking-check`, the owner needs the dataset id and an access token); purchases from Stripe when the goal is a sale. Evidence: the verdict table, every required stage ok.

## Gate 6: lead hand-off proven

`lead-handoff`: the test lead arrived at the end of the owner's chain (for example CRM → Zapier → newsletter list), each step confirmed by the owner. Evidence: their ok per step.

## Gate 7: names and UTM scheme

Campaign and ad set names now (campaign `<offer>_<goal>_<yymm>`, ad set `<audience>_<placements>`); ad names `<hypothesis>_<format>_<version>` follow in gate 8 (`ad-creatives`). Every ad links to the page with these URL parameters, set in the ad's URL parameters field:

```
utm_source=facebook&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_term={{adset.name}}&utm_content={{ad.name}}
```

Meta fills the placeholders; `manage-leads` `summary` with `group_by` `utm_campaign`, `utm_term` or `utm_content` then attributes every lead to its campaign, ad set and ad. Links elsewhere (mail, posts, QR): `manage-campaign-links` `save-campaign-link` per channel. Meta fills the placeholders only when it serves the ad; a test by hand uses the same URL with literal values (`utm_campaign=entsperrung_leads_2611`, `utm_content=test`). Evidence: the scheme, and one test lead through that URL arriving with these values in `manage-leads` `summary` (the owner sends it when you have no browser).

## Gate 8: creatives

`ad-creatives`: hypothesis, test matrix, Meta's ad policies checked (Meta reviews offers around earnings or getting blocked accounts back strictly; wording as in `ad-creatives`), every ad previewed. Evidence: the owner's yes per ad.

## Gate 9: ads built paused

Ask first, naming the budget that will be stored: "Ich lege die Kampagne jetzt pausiert in eurem Werbekonto an, mit 40 € Tagesbudget; das kostet nichts, bis du sie einschaltest. Okay?" Then through the ads connector, after reading the account again (existing campaigns, the pixel or dataset, page and Instagram account; it may have changed since gate 1):

1. Campaign: objective leads (or sales for a purchase goal), conversion location website, the optimisation event from gate 5, a special ad category only when the offer needs one. Status **paused**.
2. Ad set: audience from the brief, placements, daily budget from gate 1. **Paused.**
3. Upload the approved images and videos of gate 8 (files the owner gave you, or public URLs the connector accepts; a creative without its file waits), create the creatives and ads with the page URL and the URL parameters of gate 7. **Paused.**

Read everything back and check: names, URL, parameters, budget, status paused. Evidence: the list of ids and statuses.

## Gate 10: preview and live

The page must be on the address the ads will use before they run: on the owner's own domain that is `go-live` (domain active, main address switched, the ads' URL with the gate 7 parameters on that domain). Ads that already run on the platform host get the new URL there too, each with a yes.

Show the owner each ad as it will appear (the connector's preview link if it has one, else image and texts), the daily budget and what it costs per week. Ask with the owner's budget: "Soll ich die Kampagne mit <Budget> € pro Tag einschalten?" Only a clear yes to that question (or the playbook's "ads-create" scope, which covers creating and switching on, within its budget cap) switches campaign, ad set and ads on; anything vaguer ("sieht gut aus") gets the question again. Read back that they are active. Evidence: yes and time.

## Gate 11: first review

Name the date of the first review (`performance-review` patience rules: usually after 2–3 days) and offer the daily morning report as a scheduled task in the owner's client where it has one, set up on their yes (see `performance-review`; vocavo itself does not schedule). Evidence: the date said.

Hand over: the checklist complete, the page URL, the campaign names, what is still open.

## Never

- Skipping a gate silently, or calling it passed without its evidence.
- Writing to the ad account without a yes, creating an ad that is not paused, switching ads on, or changing a budget without a yes or the playbook's approval mode.
- Ads to a page without a passed quality gate or without proven tracking, unless the owner decided it knowingly after hearing the risk.
- Inventing a target number, a result or a testimonial.

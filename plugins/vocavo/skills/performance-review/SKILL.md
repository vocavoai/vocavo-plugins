---
name: performance-review
description: 'Review how the ads and landing pages performed today, in the last hours or days: spend, clicks and leads per campaign and ad joined with vocavo''s leads, page conversions, tests, purchases and won customers into cost per lead and cost per customer; judged with explicit patience rules; ends with a short list (pause, keep, more budget, next test), each with its reason and needing a yes. Use for "Wie liefen die Anzeigen heute?", "die letzten sechs Stunden", "wie lief die Woche?", "was soll ich pausieren?", "welche Anzeige ist die beste?", "lohnt sich die Kampagne?", "Kosten pro Lead", "Tagesbericht", "how did the ads do today", "daily review".'
---

# Performance review

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`.

This skill reads and recommends. Every change it proposes (pause, budget, new test) is a separate step with the owner's yes, unless the playbook's approval mode covers that exact scope.

## 1. Period and sources

1. `manage-account` `get-playbook` (target cost per lead or customer, budget rules, approval mode).
2. Period from the owner's words: "heute" = today since midnight, "letzte sechs Stunden" = `hours: 6`, "gestern", "diese Woche" = `days: 7`. Say the period and the time zone in the first line; the ad account may use another time zone than vocavo, say so when the hours differ.
3. **Ads connector** (look through your tools; none → say so, give the vocavo half only, and name what is missing). Read only: per campaign and per ad for the period, spend, impressions, reach, frequency, link clicks, CTR, CPC, results (leads) as Meta counts them, delivery and learning status, and the date of the last significant edit. Prefer insights per ad and per day; hourly data only if the connector offers it. For the patience rules also read each ad's totals since its last significant edit and the last 7 days (frequency, CTR trend): the only exception to "one period". The ad account's time zone comes with the account details.
4. **vocavo**, for the same period:
   - `manage-leads` `summary` with `group_by: "utm_campaign"`, then `group_by: "utm_content"` (= the ad), and `hours` or `days`. Each row has leads, won, won value and the rate from lead to customer, for the leads created in the period. Spam is apart; test leads (campaign "trackingtest") do not count.
   - `manage-tracking` `analytics-report` (`days`; see `analytics-report`): visitors and conversions of the landing pages, sources. It counts whole days: for "heute" use `days: 1` and say so; for a few hours leave it out and say that visitors are only available per day.
   - `manage-experiments` `list-experiments`: running page tests (they change the page's conversion during the period).
   - `manage-conversions` `purchases` (Stripe). Won customers are in the `summary` rows above; they are only as current as the outcomes from the CRM (`lead-handoff`): say when they were last pulled.

## 2. Join

Per ad (match the ad name to `utm_content`, the campaign name to `utm_campaign`), as your working table; the owner gets the phone format below:

| Ad | Spend | Clicks | CTR | Leads (vocavo) | € per lead | Customers | € per customer |
|---|---|---|---|---|---|---|---|

Leads are vocavo's numbers (they are stored), Meta's result count is shown beside them only when they differ a lot. Leads without a campaign are shown apart and never divided into an ad's cost. A source that returned nothing is "keine Daten", never 0; never compute a figure from a missing number.

**Tracking gaps you notice, flag them:**

- Leads without campaign (the group "(none)" of `utm_campaign`) while ads run: an ad without URL parameters, or a link that loses them. Check the ads' URL parameters in the connector right away (read only) and offer `tracking-check`.
- Link clicks far above landing-page visitors (more than about 40 % lost): slow page, wrong URL, or visitors declining consent. → `page-quality`, `tracking-check`.
- Meta reports leads that vocavo does not have, or the other way round.

## 3. Judge with patience

No verdict on an ad before **all** of these, counted since its last significant edit:

- at least 48 hours of delivery;
- at least 1,000 impressions;
- spend of at least twice the target cost per lead (without a target: 30 €).

A verdict on cost per customer needs at least 3 won customers in the campaign, and the owner's typical time from lead to purchase must have passed.

An ad set still in Meta's learning phase (about 50 results in 7 days needed) is judged on its leads over 7 days, not by the day.

Too little data: say "noch nicht aussagekräftig" and name the date to look again ("schau am Montag, 16.11., wieder rein") from the numbers: when the ad will reach the thresholds at its current spend.

## 4. Recommend

At most five lines, each with the number behind it:

- **Pause**: spend at least three times the target cost per lead with no lead; or cost per lead more than twice the target after the thresholds; or frequency above 3 in 7 days with falling CTR (the creative is worn out).
- **Keep**: within target, or not yet judgeable.
- **More budget**: at least 5 leads, cost per lead at or below target for 3 days, not in learning. Raise by at most 20 % per step and at most every 3 days (bigger jumps restart Meta's learning).
- **Next test**: one new hypothesis for a creative (`ad-creatives`) or the page (`landing-page-tests`), from what the numbers show. A page test and big ad changes are not started on the same day without saying that both together blur the read.

Each recommendation needs a yes. Execute it through the ads connector (pause, change budget) only after that yes or within the playbook's "ads-pause" or "ads-budget-up-to" scope, and report what you did. Never raise a budget above the cap.

## 5. For the phone

Short lines, numbers first; per ad only spend, leads and € per lead (clicks or CTR only when they explain a verdict). Order: period, totals, tracking gaps, ads, what is unknown, proposal, what you changed.

```
Anzeigen heute, 13.11. 00:00–14:00 (Berlin)
42 € · 2 Leads aus Anzeigen · 21 € pro Lead (Ziel 25 €)
Lücke: 1 Lead ohne Kampagne – Link-Parameter prüfen?
h1schmerz_vid916_v1: 30 €, 2 Leads, 15 €/Lead
h2ergebnis_img45_v1: 12 €, 0 Leads – noch nicht aussagekräftig
Kunden: keine Daten (HubSpot zuletzt abgeglichen 12.11.)
Vorschlag: nichts ändern, Mo 16.11. wieder reinschauen
Geändert habe ich nichts.
```

## Every morning

vocavo does not schedule anything. Offer this once, when no morning report is set up yet. If the owner's client offers scheduled tasks (for example scheduled tasks in Claude Desktop or Claude Code, tasks in ChatGPT), offer one and, on their yes, help them create it in the client: every morning at 7:30, prompt "Wie liefen die Anzeigen gestern? Nutze performance-review und schlag vor, schalte nichts um." A scheduled run only reports; changes wait for the owner, except what the approval mode allows. If the client has no scheduler, say so.

## Never

- A verdict before the thresholds, or a number that no tool returned.
- Pausing, switching on or changing budgets without a yes or the matching scope.
- Mixing periods (ad spend of today with leads of the week).
- Blaming the ads for a tracking gap: name the gap first.

---
name: leads
description: 'Read and work the leads of an vocavo account: what came in, from which page, form, campaign and ad, set a status, mark won (with value) or lost, import outcomes, mark spam or not spam, export, change the recipient, set up and test the webhook to a CRM or newsletter tool with signature verification. Use for "Welcher Lead wurde Kunde?", "Lead gewonnen", "Leads pro Anzeige", "Welche Anfragen sind neu?", "neue Leads", "Leads anzeigen", "Lead als erledigt markieren", "Spam", "Leads exportieren", "Webhook einrichten", "Leads ans CRM schicken", "Empfänger ändern", "show my leads", "set up the webhook".'
---

# Leads

A lead is one submission of a `lead_form` block, or of the engine's contact form, on a website of the account. vocavo stores it in the account, mails it to the website's recipient and, if set, sends it to the website's webhook. Every call takes `account` (the slug; optional with one account) and, with several websites, `website_id`. Writes preview until the same call comes with `confirmed: true`.

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`.

**Core principle:** leads are personal data of real people. Show what the operator asks for, no more; never send a lead anywhere the operator did not set up; never change what a person submitted.

## What came in

1. `manage-leads` `summary` (`days`, default 30, or `hours` for today): total, spam held back, counts by status, by form (`form_key`) and by source. `group_by` splits it: `utm_campaign`, `utm_content` (the ad), `utm_term` (the ad set), `utm_source`, `utm_medium`, `form_key`, `landing_page`, `page_path` or `day`. Each row carries leads, won, lost, won value and the rate from lead to customer. The group "(none)" is leads without that value: with ads running, an attribution gap (`tracking-check`). Fewer than 10 leads: differences between rows are noise, say so.
2. The leads themselves: `query-model` with type `lead` (fields and filters: `get-schema` type `lead`). Filter by `status`, `form_key`, date or `utm_source`; newest first.
3. One lead: `get-model`: what the person sent (`name`, `email`, `phone`, `company`, `message`, the other answers in `fields`), consent text and time, where they came from (`page_path`, `landing_page`, `referrer`, `utm_source` and the other UTM values), `tags`, `status`, `notes`.

Answer in the operator's words: "3 neue Anfragen in den letzten 7 Tagen, 2 über das E-Book-Formular (Google Ads), 1 Kontakt." Name and contact of a person only when the operator asks for that lead.

## Work them

- **Status.** new → contacted → qualified → won or lost. `manage-model` on the lead with `status` and, if useful, `notes`. Preview, yes, `confirmed: true`.
- **Outcomes** (which lead became a customer, so ads are judged by customers): `manage-leads` `mark-won` (`lead_id`, `value`, `currency`), `manage-leads` `mark-lost` (`lead_id`), several at once from the owner's CRM export with `manage-leads` `import-outcomes` (`rows` of email, outcome, value, currency, date; matched by email, preview first); from HubSpot automatically: `lead-handoff`. Only what the owner or their CRM says, never a guess. Cost per customer per ad: `performance-review`.
- **Spam** is a flag, not a status: a lead keeps its status when it comes back. `manage-leads` `mark-spam` (`lead_id`) reports the sender for this website; with `block_sender: true` later leads of the same sender go straight to spam. A real lead in spam: `manage-leads` `mark-not-spam` (`lead_id`); its mail and webhook go out then if they never did. Spam held back by the guard across all forms: `manage-form-spam` `spam-report`.
- **Export.** `manage-leads` `export` (`days`, default 90; `status`, `form_key`, `include_spam`): CSV text, newest first, at most 5000 rows. Hand it over as a file; say that it holds personal data.
- **Delete.** `delete-model` only on the operator's explicit request for that lead (for example a data deletion request), never in bulk to tidy up.

## Recipient

Leads are mailed to the website's recipient; without one set, to the account owner. `manage-leads` `set-recipient` (`email`) changes it per website; an empty `email` goes back to the account owner. Spam is never mailed.

## Webhook to a CRM or newsletter tool

HubSpot has its own connection with outcomes back: `lead-handoff`. The webhook is for every other tool.

1. Ask for the receiving URL (HTTPS) from the tool: Zapier, Make, n8n, HubSpot, a newsletter tool, the operator's own endpoint.
2. `manage-leads` `set-webhook` (`url`). After `confirmed: true` the result holds `webhook_secret` (`whsec_…`): show it once and tell the operator to store it in the receiving tool, never in a chat or a document. Every `set-webhook` makes a new secret and the old one stops working; an empty `url` removes the webhook (leads are still stored and mailed).
3. `manage-leads` `test-webhook`: POSTs a sample lead (event `lead.test`) and returns `ok`, `status_code` and the start of the answer. A 2xx is fine; anything else: show the code and the answer.
4. Every new lead goes out as JSON by POST (event `lead.created`), retried when the receiver fails. Headers: `X-Vocavo-Event`, `X-Vocavo-Delivery` (an id, the same on a retry) and `X-Vocavo-Signature: sha256=<hex>`.

**Verify the signature** on the receiving side: the HMAC-SHA256 of the raw request body with the secret, hex, after `sha256=`. Compare in constant time and reject anything else; drop a repeated `X-Vocavo-Delivery`.

```php
// PHP receiver
$body = file_get_contents('php://input');
$expected = 'sha256='.hash_hmac('sha256', $body, getenv('VOCAVO_WEBHOOK_SECRET'));
if (! hash_equals($expected, $_SERVER['HTTP_X_VOCAVO_SIGNATURE'] ?? '')) {
    http_response_code(401);
    exit;
}
$lead = json_decode($body, true);
```

```js
// Node receiver: express.raw({ type: 'application/json' }) on this route, so the body stays raw
const crypto = require('crypto');
const expected = 'sha256=' + crypto.createHmac('sha256', process.env.VOCAVO_WEBHOOK_SECRET).update(req.body).digest('hex');
const given = String(req.get('X-Vocavo-Signature') || '');
const ok = given.length === expected.length && crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
if (!ok) return res.sendStatus(401);
```

Zapier and Make cannot check a signature by themselves; tell the operator that the secret webhook URL is then the only protection.

## Never

- Forwarding, mailing or exporting leads to anyone the operator did not name.
- Writing a lead by hand to make a form look used, or changing what a person submitted.
- Promising delivery: say what `test-webhook` and the delivery log show.

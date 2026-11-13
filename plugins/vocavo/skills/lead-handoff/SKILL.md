---
name: lead-handoff
description: 'Get every lead into the owner''s CRM (HubSpot) and back the information which lead became a customer: connect HubSpot, map the form fields, send a test and walk the owner through the chain behind it (HubSpot workflow, Zapier, newsletter list) before ads go live; mail recipient or webhook as alternatives; then pull won and lost deals back so ads are judged by customers, not leads. Use for "Leads in HubSpot", "HubSpot verbinden", "CRM anbinden", "kommen die Leads im CRM an?", "Zapier testen", "welcher Lead wurde Kunde?", "Kunden zurückmelden", "Lead als gewonnen markieren", "connect HubSpot", "mark as won".'
---

# Lead hand-off and outcomes

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`.

Sales stays in the owner's CRM; vocavo never becomes one. vocavo delivers each lead there and learns back which lead became a customer.

## 1. Choose the way

| The owner has | Way |
|---|---|
| HubSpot | `manage-lead-sync` (the HubSpot app "Website Leads" their portal connects to) |
| another CRM, Zapier, Make, n8n | `manage-leads` `set-webhook` (see `leads`) |
| nothing | the mail to `manage-leads` `set-recipient`; say that outcomes then come back only by hand |

## 2. Connect HubSpot

1. `manage-lead-sync` `status`.
2. Not connected: `manage-lead-sync` `connect-link` (account-wide; `website_id` only for one website's own portal) returns a signed link valid for 30 minutes. The owner opens it while logged into HubSpot with the right to install apps and approves the app. Say which properties the app creates (the result lists them). Wait for "fertig", then `status` again.
3. **Mapping.** Each lead is matched to a HubSpot contact by email, created or updated. Show the mapping from `status`: which lead value (email, name, phone, company, message, the form's other answers as `fields.<key>`, form, page, landing page, UTM values, consent) goes to which contact property. Existing contact data is only filled where empty, unless a property is listed in `overwrite`; the app's own website lead properties always carry the latest lead. Change it with `manage-lead-sync` `set-mapping` (`mapping` of lead value to the property's internal name, null drops one; `overwrite`) after the owner's yes. Properties that do not exist in HubSpot are named, never invented: the owner creates them or leaves them out.
4. **Workflow trigger.** The contact property `website_lead_submitted_at` ("Website lead: last submission") changes with every lead: it is the trigger for the owner's HubSpot workflows. A workflow that started on the old landing page's form submission must be switched to "Website lead: last submission is known" with re-enrollment on changes of that property, or the chain behind HubSpot stops; a Zap that watches HubSpot itself points at a list with the same criteria. Walk the owner through it in HubSpot before the test. Test contacts carry the form "test": a workflow that filters on a form (for example only "ebook") will not enroll them, so check the filter or test without it.
5. `manage-lead-sync` `test` (`email` of a test address of the owner, `vorname+test@` their domain) writes a test contact (form "test", tag "test") and returns what it wrote. Show it.

## 3. Walk the chain behind it, with the owner

vocavo sees only its own delivery. Everything after HubSpot the owner checks, step by step, while you wait. For PSA Marketing the chain is HubSpot workflow → Zapier → GetResponse list:

1. HubSpot → Contacts: is the test contact there with source, form and UTM values filled?
2. HubSpot → Automation → Workflows: was it enrolled in the workflow that hands on to Zapier?
3. Zapier → Zap history: did the Zap run, without error?
4. GetResponse → Contacts: is it on the right list? (The newsletter itself stays in GetResponse; vocavo does not send newsletters.)

Each step gets ok or not ok from the owner. A break: help them read the error; fix only what is in vocavo (mapping). Afterwards remind them to delete the test contact in HubSpot and GetResponse.

**Gate:** ads do not go live before this chain is ok, or the owner decided knowingly to go live without it.

## 4. Watch deliveries

`manage-lead-sync` `deliveries` (`failed_only`, `days`): each lead with status and HubSpot's answer; `status` shows the failures of 7 days. Failed ones after the cause is fixed: `manage-lead-sync` `retry` (`delivery_id`, or all failed of the last `days`). A token HubSpot revoked shows in `status`: a new `connect-link`. `manage-lead-sync` `disconnect` only on the owner's request.

## 5. Outcomes back

Ads are optimised for customers, not leads. Set up the return path once:

- **From HubSpot:** `manage-lead-sync` `pull-outcomes` (`days`, default 180) marks leads won whose contact reached the lifecycle stage customer (value = the contact's total revenue) and lost whose lead status is Unqualified. Preview first, then `confirmed: true`. Tell the owner this only works when sales keeps lifecycle stage and revenue up to date in HubSpot; run it before every `performance-review` that judges cost per customer.
- **From a list:** `manage-leads` `import-outcomes` with `rows` (up to 1000 of `{email, outcome, value, currency, date}`, outcome "won" or "lost") from the owner's CRM export. Each row is matched by email to the newest lead; the preview lists changes, unchanged, unmatched and invalid rows: show them before `confirmed: true`. Repeating an import changes nothing.
- **One lead:** `manage-leads` `mark-won` (`lead_id`, `value`, `currency`, `won_at`) or `manage-leads` `mark-lost` (`lead_id`, `reason`).
- A purchase through Stripe counts by itself (`manage-conversions` `purchases`).

When `manage-conversions` `status` shows that outcomes are sent on to Meta, say so; otherwise the outcomes still serve the review (`performance-review`: cost per customer per ad).

Ask the owner how long a lead usually takes to buy. That delay is why cost per customer lags behind cost per lead.

## Never

- Sending leads anywhere the owner did not set up, or putting lead data in feedback or chat beyond what they asked.
- Marking a lead won or lost by guess.
- Claiming the chain works past HubSpot without the owner's ok for each step.
- Building CRM features in vocavo (pipelines, dashboards, invoices): `send-feedback`.

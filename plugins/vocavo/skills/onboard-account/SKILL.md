---
name: onboard-account
description: 'The setup of a new vocavo account: find or create the account, collect the business facts once, look at the accounts the funnel depends on (Stripe, Meta, Google, CRM) and collect what is needed, migrate every landing page and propose an improved challenger next to each 1:1 page, set where leads go, explain the trial. Use for "Richte mein Konto ein", "Ich bin neu hier", "Wie fange ich an?", "Einrichtung", "alle Landingpages umziehen", "Konto anlegen", "neues Konto für einen Kunden", "set up my account", "get started". A later session without a task starts with start-here.'
---

# Onboard an account

The first conversation after a person registered and connected the plugin. Goal: at the end the account knows its business, has its first website in draft (or a migration under way), leads have a recipient, and the operator knows their trial and what happens next. Talk in the operator's language, du in German. Writes preview until the same call comes with `confirmed: true`.

**Core principle:** ask each fact once, store it where every website reads it, never invent one.

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`.

## 1. Which account

`list-accounts`.

- **One account:** use it; `account` may be left out on every call.
- **Several:** ask which one (the user may run accounts for clients); pass `account` on every call from then on.
- **None:** the person has not finished signing up on the web (the sign-up asks for their name and company after the e-mail and creates the account). Offer the link from the `list-accounts` message to finish it there, or create the account here as below.
- **A new one for a client (or none, if the user prefers):** confirm name and slug with the user, then `manage-account` `create-account` (`name`, `slug`; it needs no `account`). The trial starts with the account.

## 2. Billing state

`manage-billing` `status`: trial or subscription, days left, website limit, whether the account is read-only. Say it in one sentence ("Du testest vocavo noch 12 Tage."). vocavo has one plan, no tiers: never talk about plans to compare or upgrade. Only when the user asks or a limit is in the way: `manage-billing` `plans` (the price and website limit as the tool returns them), `manage-billing` `checkout-link` to subscribe, `manage-billing` `portal-link` to change payment details or cancel. Never state a price the tool did not return.

## 3. Business facts, once

Ask in one round (at most four questions, recommended first, skip what the user said):

1. What does the business offer, for whom, where (services, regions)?
2. Company name with legal form, address, phone, e-mail, the person responsible (for the Impressum).
3. Is there a website or landing page today? (URL)
4. What should a visitor do: call, request a quote, book a call, download something, buy?

Register number, VAT id and supervisory facts are asked only when needed for the Impressum, and never guessed: an unknown legal fact becomes a `clarifications` entry on the legal page.

## 4. The accounts the funnel depends on

Look at each with the owner (they log in and show or tell you; you never ask for passwords) and note what is there and what is needed. Calls to an external account happen only with their yes.

| Account | Look at | Collect |
|---|---|---|
| Stripe | payment links, pricing tables, products and prices the pages use | the links and pricing table ids as on the pages; purchase tracking later through `tracking-check` |
| Meta (Facebook, Instagram) | Business Manager, ad account, page, Instagram account, pixel or dataset, current and past campaigns | ad account and pixel id; whether an ads connector is connected in their Claude (`start-here`) |
| Google | Ads account and conversion ids, Analytics, Search Console | ids the owner confirms are theirs and still wanted (`consent-tracking`, `search-integrations`) |
| CRM and the tools behind it | HubSpot (or another), Zapier, the newsletter tool, what each automation does | the chain a lead takes today; `lead-handoff` connects it |

Then the owner's standing preferences and how much they want to be asked: `playbook` (`manage-account` `get-playbook`, `manage-account` `remember`, `manage-account` `set-approval-mode`).

## 5. The websites and landing pages

- **Old pages exist:** list every landing page and site with the owner, then `migrate-website` for each (it starts with the inventory and asks its own questions). For each page moved 1:1, show an improved challenger next to it: the inventory and `page-quality` name the one change most likely to help, `landing-page-tests` builds it as a draft variant, and the owner sees both side by side. The test starts only on their yes, once the 1:1 page is live.
- **No site:** `build-website`; a single page for a campaign: `landing-page`; a page plus ads: `launch-campaign`.

A new website starts with `manage-site` `create-website` (`name`, `default_locale`, `locales`), then `manage-site` `update-website` `settings` with the facts of step 3 (`brand`, `contact`, `legal`, `social`, `seo`). The new website gets its platform host `<label>.<site domain>` automatically (label = the website slug); `manage-account` `list-hosts` shows it, and `manage-account` `assign-host` (`website_id`, `label`) sets a label the user prefers. An own domain (`go.firma.de`, `firma.de`) is connected when the site is ready to go live: `go-live` (`manage-account` `add-custom-domain` returns the DNS records; vocavo checks them and issues the certificate itself).

## 6. Where leads go

1. Leads are mailed to the account owner unless the website has its own recipient. Ask who should get them; another address: `manage-leads` `set-recipient` (`email`) per website.
2. HubSpot: `lead-handoff` (connect, map, test the chain behind it, outcomes back). Another CRM, newsletter tool, Zapier, Make or n8n: `manage-leads` `set-webhook`, then `manage-leads` `test-webhook`. The signing secret is shown once; details in `leads`.
3. Before any ads: `tracking-check`.

## 7. Hand over

Summarise in a few lines: the account (slug), billing state, the pages with their preview links and hosts, the challengers proposed, the external accounts and what is still missing there, where leads go, the playbook, what is still open (clarifications, photos, texts). Name the next useful sentence ("Ich will eine Landingpage und die bewerben." / "Funktioniert unser Tracking?" / "Wie liefen die Anzeigen heute?").

## Never

- Creating an account or a website without the user's yes to its name.
- Entering legal facts you did not get from the user or their existing site.
- Starting a checkout or changing a plan without the user asking for it.

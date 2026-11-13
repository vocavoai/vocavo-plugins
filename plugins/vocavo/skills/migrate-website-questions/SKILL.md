---
name: migrate-website-questions
description: 'The predefined questions of a website or landing-page migration: format, rounds, when to ask which question and its options (mode, providers, forms and where their leads go, tracking, placeholders, host label), asked after the inventory and never what it already answered. Detail guide of migrate-website.'
---

# Migrating a website: the questions

Ask only these, after the inventory of `migrate-website`, never what the inventory or the operator already answered.

**Format.** The client's multiple-choice tool (else a numbered list), at most 4 questions per round, recommended option first, marked "(Empfohlen)" in German. In the operator's language, du in German; option descriptions name the finding behind them ("3 Stripe-Links, 1 HubSpot-Terminlink gefunden").

If the operator already said which mode they want ("1:1", "genau so wie jetzt"), that answers Q1: do not ask it again and skip what the mode skips.

## Round 1: setup

| # | Ask when | Question | Options (first = recommended) |
|---|---|---|---|
| Q0 | the user has several accounts and the inventory does not make the account obvious | In which account should the site live? | the accounts of `list-accounts`, the one matching the business first · a new account (`onboard-account`) |
| Q1 | always | How should the page move? | **1:1** for a page that sells or converts today: structure, look, texts and every call to action stay, only the technology, forms, tracking and legal texts change · **Keep the look**: colours, fonts, photos and voice stay (found tokens), layout and structure become new · **Redesign**: new structure, mobile first, one call to action per screen |
| Q2 | the provider inventory is not empty | These providers are linked: (list with where). We keep them as they are. Should one go? (multi-select) | **Keep all**: payment, booking and the rest stay linked as before · one option per provider |
| Q3 | always | Under which name should the site be reachable? | the brand or offer as label (`<label>.<site domain>`) · a second proposal · own wish |

Autonomous run (no questions allowed): mode 1:1 for a single sales page, else keep the look; keep all providers and languages; list every skipped question under open questions.

## Round 2: forms, leads and tracking

| # | Ask when | Question | Options |
|---|---|---|---|
| Q4 | the page has forms | These forms collect leads: (form, fields, where the old provider sent them). Who should get each new lead? | **Mail to (address) and the list in vocavo** · plus a webhook to the tool behind the old form (`leads`) · only the list |
| Q5 | a form delivered something automatically (e-book, webinar access, sequence) | After the form, (what happened before). How should it continue? | **Webhook to (old tool)**, which keeps sending it · a thank-you page with the download link the operator gives · a mail the operator sends by hand |
| Q6 | the inventory found tracking | The old page loads (list with ids). Which do you still need? (multi-select) | **Only cookie-free counting**, nothing else · per service the engine supports (Google Ads, Google Analytics, Meta pixel), with its id · services the engine does not support are listed, not offered |
| Q7 | the old page has placeholders, dead links or broken links | I found (list with where). What should they become? | per finding: the fix I propose · remove · the operator gives the text or target |

## Round 3: only for keep the look and redesign

| # | Question | Options |
|---|---|---|
| Q8 | Who should the page reach first? | The audiences found in the inventory, the largest first |
| Q9 | What should a visitor do first? | The first action the old page pushes (buy, book a call, download) · other actions found |
| Q10 | What sets you apart? | Up to three proof points from the brief, verbatim |
| Q11 | Mood (redesign only)? | Two or three directions derived from the brief |

Skipped for 1:1. Then offer two or three page structures, one recommended.

## Round 4: extras

| # | Question | Options |
|---|---|---|
| Q12 | Which additions? (multi-select) | Only what the operator can back up: a thank-you page, landing pages per service or region (`landing-page`), FAQ, an about page |
| Q13 | Languages? | The languages the old site has · plus further ones the audience needs |

Then get an explicit yes to the final page list, the call-to-action map, the forms with their recipients, the tracking table and the navigation.

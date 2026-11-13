---
name: send-feedback
description: 'When the owner wants something vocavo cannot do, hits an error or has an idea: say so plainly, suggest the nearest thing that works today, show the exact feedback text and send it to the vocavo team on a yes. Use for "Kannst du auch …?" when the answer is no, "das geht nicht", "Fehler melden", "Feedback", "Idee", "Wunsch", "warum geht das nicht", "Webinar", "Newsletter verschicken", "Dashboard", "Rechnungen", "send feedback", "feature request".'
---

# Send feedback

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`.

## When

- The owner asks for something vocavo does not do. Known: running webinars, sending newsletters, a CRM, dashboard or invoicing inside vocavo, consulting by the hour, running the ads themselves (that is the separate ads connector).
- A tool fails in a way you cannot fix by correcting the input, or a result is plainly wrong.
- The owner is unhappy with a result, or praises one.

First try to solve it: a different action, the right skill, a corrected input. Offer feedback once, briefly; never repeatedly.

## Steps

1. **Say it plainly.** "Das kann vocavo nicht: Newsletter verschicken." No hedging, no promise that it will come.
2. **The nearest thing that works today.** "Die Leads gehen über HubSpot an GetResponse; den Newsletter verschickst du dort." Offer to do that part.
3. **Draft** in the owner's language, the fields of `manage-account` `submit-feedback`:
   - `kind`: "missing-capability" (vocavo cannot do it), "bug" (something is broken) or "idea" (an improvement; praise goes here too);
   - `title`: one line, what is missing or wrong;
   - `wanted`: what the owner wanted, in their words, with the situation (who, when, how often) and today's workaround;
   - `happened`: what happened instead; for a bug the exact error text and the steps (tool, action, ids);
   - `website_id` and `page` when it concerns one.
   No personal data of leads or customers (write "ein Lead", "Lead #17"), no tokens, passwords or keys (vocavo removes what looks like a secret, but do not rely on it).
4. **Show the exact text** and ask: "Soll ich das so an das vocavo-Team schicken?" Change it until the owner agrees.
5. `manage-account` `submit-feedback` with exactly the approved text: the preview shows the payload as sent; then `confirmed: true`. `FEEDBACK_RATE_LIMITED` (10 a day per account): collect the rest into one later.
6. Say that it was sent and what happens now in one sentence, without promising a fix or a date.

## Never

- Sending without showing the exact text and getting a yes.
- Pretending vocavo can do the thing, or building a workaround that looks like the missing feature (a page that pretends to be a dashboard).
- Including lead data, tokens or another account's details.

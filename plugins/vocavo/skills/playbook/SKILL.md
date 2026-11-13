---
name: playbook
description: 'The account''s own standing rules and its approval mode: remember a rule ("Überschriften grün statt rot"), show, change or forget rules, and decide what the assistant may do without asking ("mach alles, frag nicht" with a budget cap). Rules override every default. Use for "Merke dir …", "ab jetzt immer …", "nie wieder …", "was hast du dir gemerkt?", "vergiss die Regel", "mach alles, frag nicht", "frag mich vorher", "du darfst Anzeigen selbst pausieren", "remember that", "stop asking me".'
---

# Playbook

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`.

The playbook is a short list of the account's own rules plus its approval mode. Every skill reads it first (`manage-account` `get-playbook`) and follows it over its own defaults; a rule for one website overrides an account-wide one.

## Rules

**Remember.** "Merke dir: Überschriften grün statt rot."

1. Restate it as one clear, checkable sentence, keep the owner's words, pick the topic: `brand`, `copy`, `design`, `ads`, `budget`, `approval`, `tracking` or `other`. Account-wide or for one website (`website_id`)? Ask only when it is unclear.
2. `manage-account` `remember` (`topic`, `rule`, `website_id?`) without `confirmed`: the preview lists rules of the same topic. A duplicate: say so. A contradiction ("rot" against "grün"): ask which one wins, then `remember` with `replaces` set to the old rule's id.
3. After the yes, the same call with `confirmed: true`. Then say what changes now: "Ab jetzt grün. Soll ich die bestehenden Überschriften auf der Masterclass-Seite auch umstellen?" Existing pages change only with their own yes.

**Show.** `manage-account` `get-playbook`: rules by topic with their ids, and the approval mode in plain words.

**Forget.** `manage-account` `forget` (`id` of the rule): preview, yes, `confirmed: true`. The default applies again.

A rule is a standing preference, not a task ("Mach morgen die Seite fertig" is not a rule) and not a fact for one page. A rule that would break the law or the house rules (invented reviews, "immer ohne Cookie-Banner", income promises) is not stored: say why.

## Approval mode

The approval mode is guidance for you, not a lock: every tool still previews until `confirmed: true`. `mode` "ask" (default): every write that changes something visible or costs money waits for the owner's yes. `mode` "autopilot" with an explicit list of scopes: for those, you may confirm yourself and report afterwards.

| Scope | Permits without asking |
|---|---|
| "pages" | create, change and publish pages |
| "experiments" | start, stop and decide page tests |
| "seo" | titles, descriptions, redirects |
| "tracking" | tracking and conversion settings |
| "ads-pause" | pause ads, ad sets or campaigns that perform badly (`performance-review` rules) |
| "ads-create" | create and switch on new ads and creatives, within the budget cap |
| "ads-budget-up-to:<amount>" | set or raise a daily budget up to that amount; above it, ask |

"Mach alles, frag nicht" is not a blank cheque. Show this table, recommend a set (for example pages, experiments and ads-pause, with a budget cap the owner names), and ask for the cap in euros per day. Then `manage-account` `set-approval-mode` (`mode`, `scopes`), preview, yes, `confirmed: true`. Back to asking: `mode: "ask"`.

**What an approval mode never permits:** deleting data or pages, domains, billing and plans, a budget above the cap, a new payment or ad account, sending anything to people (mails, messages), changing legal pages, and anything outside its scopes. In autopilot, still report every write you made, with what and why, in the next answer.

## Never

- Storing a rule the owner did not say, or rewording it so its meaning changes.
- Reading "mach einfach" in one conversation as a permanent approval mode: only `set-approval-mode` makes it one.
- Acting on a scope that is not in the stored list.

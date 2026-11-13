---
name: landing-page-tests
description: 'Run the challenger loop on a landing page: a hypothesis from data in one sentence, a variant with exactly that one change, the quality gate, the owner''s yes, the test running automatically, a verdict only when the statistics allow it, the winner made live and the next challenger proposed. Use for "Schalte eine Alternativversion dazu", "teste eine zweite Version", "Bild oder Video oben?", "welche Version gewinnt?", "nächster Test", "Challenger", "testen, testen, testen", "run a page test", "which version won".'
---

# Landing-page tests

House rules (`start-here`): playbook first and it wins; nothing live without a yes unless the approval mode covers it; show before asking; say what is unknown; never invent; what the system cannot do → `send-feedback`.

Builds on `ab-test` (the engine's mechanics). This skill adds the loop: one test per page at a time, always the next challenger.

## 1. Hypothesis from data

`manage-account` `get-playbook`, `manage-experiments` `list-experiments` (a page with an open test gets no second one), then the sources: the last `performance-review` (ads with clicks but no leads point at the page), `manage-quality` `get-report` of the page, `manage-tracking` `analytics-report` (form starts against leads), the questions leads ask.

One sentence: "Wenn oben ein Video statt eines Bildes steht, schicken mehr Besucher das Formular ab." Pick the goal from `manage-tracking` `list-goals` (the lead form is `form:<form_key>`; a sale through Stripe if `manage-conversions` `status` shows purchases). Propose it; the owner says yes or names their own.

Good first tests: the hero (promise, image against video), the form (fewer fields, popup against inline), proof near the button, the call to action text. Image against video is decided here and in the ads by data, not taste.

## 2. Build the challenger

1. Read the control: `manage-site` `get` (resource `page` with its blocks).
2. `manage-site` `create-page` for the variant (`noindex: true`, a slug like `<control>-b`), then `manage-site` `set-blocks` with the control's blocks and **exactly the one change**. Anything else that differs spoils the test.
3. `page-quality` on the variant. It must pass like any page.
4. Show control and variant side by side (`manage-quality` `compare` with `page_id` of the control and `other_page_id` of the variant: screenshots and metrics next to each other; preview links) and the hypothesis. Wait for the yes.

## 3. Start

1. `manage-site` `publish-page` for the variant (visitors reach it only through the test; a direct visit redirects to the control).
2. `manage-experiments` `create-page-experiment` (`page_id` of the control, `name`, `hypothesis`, `primary_goal`, `variants` with the variant's `page_id` and `label`), preview, `confirmed: true`.
3. `manage-experiments` `start-page-experiment`. Both steps need the owner's yes, or the playbook's "experiments" scope.
4. Say when the first look is due and why the decision may take longer (below).

**Ads and test on the same day:** a new ad round changes who comes to the page. Do not start a page test and an ad change on the same day without telling the owner that the read gets blurred; prefer to stagger them by a few days.

## 4. Verdict

`manage-experiments` `experiment-report`. The engine's `decision` decides: no winner before its minimum days and visits (the report's `rules`: currently 14 days and 200 visits per variant), a winner at a probability of being best of 95 %, an end after 56 days.

- **Day 7** (what the owner was told: "about a week"): give an interim read with the numbers, and say plainly "noch keine Entscheidung" while the engine has none. With little traffic, say how many days it will need at the current visits.
- Never stop early because one version looks better; never call a winner the engine did not.

## 5. Winner and next challenger

1. Decision reached: show the numbers and the recommendation. With a yes: `manage-experiments` `end-page-experiment` (`winner`, `promote: true`). That copies the winner into the control's draft; `page-quality` on it, then `manage-site` `publish-page` with a yes. The variant page gets a redirect to the control (`edit-website`), deleting it only with a yes.
2. No difference after the maximum: keep the control, say that this change does not matter, which is a result too.
3. **Propose the next challenger** right away, from what this test taught.

## Never

- Two tests on one page, or more than one change in a variant.
- Starting, ending or promoting without a yes or the "experiments" scope.
- Reporting a winner before the engine's decision, or numbers the report did not return.

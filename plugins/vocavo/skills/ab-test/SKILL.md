---
name: ab-test
description: 'Create, run and evaluate a page A/B test: variant pages, goal, start, report, winner. Use for "A/B-Test anlegen", "Variante testen", "welche Version ist besser", "Test auswerten", "Gewinner übernehmen", "ab test".'
---

# Page A/B test

Assignment is server-side and cookie-free. A variant is a normal page with its own preview. While a test runs, the control's URL serves a variant and a direct request of a variant's URL redirects to the control. `manage-tracking` `list-goals` lists the possible goals. Statistics must be on (`analytics.enabled`), else `ANALYTICS_OFF`.

## Create

1. **Hypothesis and one goal.** "If X changes, more visitors do Y." Ask the operator; pick the goal from `manage-tracking` `list-goals` (for instance `form:contact`).
2. **Variant page.** `manage-site` `create-page` for each variant, set `noindex: true`, fill it (`manage-site` `set-blocks`) with the one change; `manage-site` `preview-page` next to the control. 2 to 5 variants including the control.
3. **Publish** control and variants: `manage-site` `publish-page` with a yes. A test only starts on published pages (`PAGES_NOT_PUBLISHED`).
4. **Create.** `manage-experiments` `create-page-experiment`: `page_id` (control), `name`, `hypothesis`, `primary_goal`, `variants` `[{page_id, label, weight?, changes?}]`. Preview, yes, `confirmed: true`. It is a draft; visitors see nothing yet. One open test per page.
5. **Start.** `manage-experiments` `start-page-experiment` (`experiment_id`), with a yes. Pause: `manage-experiments` `pause-page-experiment`: everyone sees the control.

## Evaluate

`manage-experiments` `experiment-report` (`experiment_id`), overview with `manage-experiments` `list-experiments`. It returns visits, conversions, rate, P(best), expected loss, a z-test against the control and a `decision`.

- The Bayesian `decision` is what counts: nothing before 14 days and 200 visits per variant; a variant with P(best) at least 0.95 wins; after 56 days the test ends with the smallest expected loss.
- `significant` and the p-value are additional. Do not stop early because one looks good: repeated looks inflate it.
- Report the numbers as returned, with the days run. With little traffic say "no decision yet".

## End

`manage-experiments` `end-page-experiment` (`experiment_id`, `winner` = variant key, `promote: true`): with a yes. Promote copies the winner into the control page's **draft**; nothing is live until `manage-site` `publish-page`. Then retire the variant page: a redirect to the control, `manage-site` `delete-page` only with a yes.

## Consent banner test

`manage-experiments` `consent-banner-report` reads the banner test, which is off by default (`consent_banner_experiment.enabled`). Switching it on is the operator's decision and a host config change; never do it unasked.

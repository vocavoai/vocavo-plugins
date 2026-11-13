---
name: analytics-report
description: 'Evaluate the website statistics: visitors, page views, sources, devices, goals, conversions, comparison with the previous period. Use for "Website-Statistik", "wie viele Besucher", "Conversions", "woher kommen die Besucher", "Analytics auswerten", "analytics report".'
---

# Analytics report

`manage-tracking` `analytics-report` (`days` 1 to 366, default 28; `limit` per list up to 50; `goal`). Goals: `manage-tracking` `list-goals`.

| Field | Means |
|---|---|
| `totals`, `previous` | `visitor`, `page_view`, `conversion`, `form_start`: this period and the one before |
| `conversion_rate` | conversions per visitor |
| `daily` | per day |
| `pages`, `referrers`, `sources`, `devices`, `locales` | top lists by page view |
| `goals` | conversions per goal |
| `sessions` | pages per session, engaged seconds, bounce rate, entry and exit pages, channels: only for visitors who consented to `own-statistics`, else null |

**How to read it**

- Counts are cookie-free daily aggregates; visitors are per day and cannot be summed into unique people over a period.
- `sessions` covers only those who consented, so it is a sample, not the whole audience.
- Data needs the schedule `website-engine:analytics-aggregate` every 15 minutes. All zeros on a live site: first check the schedule and `analytics.enabled`, and say so instead of reporting "no visitors".
- A website in draft and previews do not count.

**Report:** the period, totals against the previous period, the top pages and sources, goals. Numbers as returned; a change is a hint, not a cause. Low numbers: say that they carry little.

**Next steps:** campaign links with `manage-campaign-links` `list-campaign-links`, search terms with `manage-integrations` `search-console-performance`, a running test with `manage-experiments` `experiment-report`. A page with visitors but no conversions may suit an `ab-test`.

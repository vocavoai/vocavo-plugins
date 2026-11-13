---
name: consent-tracking
description: 'Configure consent and tracking: which services load, the IDs, the banner approval, what the privacy policy must name. Use for "Cookie-Banner", "Consent einrichten", "Google Analytics einbauen", "Meta Pixel", "Google Ads Tag", "Tracking konfigurieren", "consent".'
---

# Consent and tracking

**Principle.** Nothing loads before the visitor consents, and nothing shows until the operator approved the banner for exactly this set of services. The approval records the operator's decision. It is no legal review, and the banner texts are working defaults that nobody reviewed. Say that every time.

The engine's cookie-free counting (daily aggregates, salted daily hash, no IP or user agent stored) runs without a banner unless the host switched `analytics.enabled` off. Whether that fits is the operator's decision before going live.

## Steps

1. **State.** `manage-tracking` `list-tracking`: `configurations`, `approved`, `banner_shown`, and `services_in_use` with name, operator, category and hosts. Embedded videos count as services by themselves.
2. **Decide with the operator:** only services with a purpose. Do not copy tags from an old site.
3. **Configure.** `manage-tracking` `configure-tracking` with `service` and `settings`:

   | `service` | `settings` |
   |---|---|
   | `google-ads` | `{conversion_id, labels?: {goal: label}, remarketing?, linker_domains?}` (remarketing is off by default) |
   | `google-analytics` | `{measurement_id}` |
   | `meta-pixel` | `{pixel_id}` |
   | `own-statistics` | `{}` (sessions, entry and exit pages, only with consent) |

   IDs come from the operator; never invent one. `enabled: false` keeps the IDs without loading. Remove with `manage-tracking` `remove-tracking`.
4. **Privacy policy.** `services_in_use` says what it must name. The engine neither writes nor reviews that text; the operator updates it through `edit-website`.
5. **Approve.** Show the operator the banner on `manage-site` `preview-page`. After they read the texts and updated the policy: `manage-tracking` `approve-consent-banner`, preview first, then `confirmed: true`. A changed set of services needs a new approval, and until then tracking stays off.
6. **Verify on the rendered page:** no third-party request before consent, both choices equal in size, "Cookie-Einstellungen" at the end of each page, consent can be withdrawn. Only a real page shows this.

## Goals

`manage-tracking` `list-goals` shows the conversion goals; a host adds its own through its registry. Google Ads labels attach per goal.

## Never

- Approving for the operator, or switching on the banner test (`ab-test`).
- Adding tracking scripts through a theme: they bypass consent, and themes do not allow it.
- Calling this GDPR-compliant. Say what it does, and that the decision and the review are theirs.

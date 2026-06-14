# Copy And Localization

KCLUB product-core supports `en`, `ru`, and `uk`. Admin-app is English-only unless product scope changes.

## Rules

- `en` is the default locale.
- Product behavior must not depend on locale.
- Status labels must map cleanly to system statuses from `SPEC.md`.
- Error messages should be clear and action-oriented.

## High-Sensitivity Copy Areas

- sign-up vs sign-in intent errors
- onboarding requirements
- VIP billing and cancel-at-period-end language
- business moderation states
- introduction availability and rate-limit messaging
- card verification wording

## Translation Process

- Define English source copy first.
- Translate `ru` and `uk` only after status and behavior text is stable.
- Keep message keys aligned across locales.
- Do not ship locale files with missing critical auth/billing keys.

## Launch Checks

- every auth state has copy in all supported locales
- onboarding and dashboard tabs are translated
- legal pages exist for supported public locales if they are localized
- admin-app stays English-only unless implementation explicitly adds localization

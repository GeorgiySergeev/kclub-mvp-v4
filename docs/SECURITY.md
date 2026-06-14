# Security And Privacy

This document captures the security baseline for KCLUB MVP v4.

## Identity Boundaries

- Member identities and staff identities are separate.
- One person may hold both identities, but never through a shared auth session.
- Member auth uses phone OTP.
- Staff auth uses phone OTP plus TOTP 2FA.

## Authorization Rules

- Product-core is the enforcement point for product and admin API permissions.
- Admin-app UI hiding is not a security boundary.
- SUPPORT is read-only.
- OWNER-only capabilities must be enforced server-side.

## Session Rules

- Staff sessions must use secure, httpOnly cookies.
- `sameSite=strict` is the default for admin session cookies unless a real cross-site requirement exists.
- Staff without verified TOTP must be blocked from protected routes.
- Blocked member accounts must not gain member API access.

## Data Protection

- Public card verification DTOs must be PII-safe.
- Public business DTOs must not leak admin-only or internal-note fields.
- Logs must not include OTPs, TOTP secrets, full tokens, Stripe secrets, or service-role keys.
- TOTP secrets must never be readable by the client after storage.

## Stripe And Cron

- Stripe webhook endpoint must verify signatures.
- Webhook processing must be idempotent.
- Cron routes must require a server-only secret.
- Checkout creation must not change billing or publication state before verified webhook processing.

## Secret Handling

- Secrets live only in local env files or platform secret stores.
- Never commit secrets to the repo.
- Rotate leaked secrets immediately and document the incident.

## Minimum Security Tests

- Unauthorized webhook request rejection.
- Unauthorized cron request rejection.
- Permission matrix tests for admin mutations.
- Public DTO privacy boundary tests.
- TOTP route gating tests.

## Launch Blockers

The following are launch blockers:

- staff can access dashboard without TOTP
- public DTO leaks private data
- admin mutations succeed without role checks
- unsigned Stripe webhook is accepted
- cron can be triggered without auth

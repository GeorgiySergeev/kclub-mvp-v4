# Release Checklist

Use this checklist before staging signoff and before production launch.

## Code And CI

- `bun install --frozen-lockfile` passes
- `bun run format` passes
- `bun run lint` passes
- `bun run typecheck` passes
- `bun run test` passes
- `bun run test:contracts` passes
- `bun run build` passes
- E2E critical path suite passes

## Product-Core

- public home works
- localized routes work
- sign-up and sign-in work
- onboarding works
- card verification is PII-safe
- business submission works

## Billing

- VIP checkout starts successfully
- placement checkout starts only for approved business
- Stripe webhook signature validation works
- duplicate event handling is safe

## Admin-App

- staff sign-in works
- TOTP gating works
- SUPPORT is read-only
- moderation routes work
- audit log works

## Platform

- all required env vars are configured
- database migrations applied
- seed/reference data present
- cron secret configured
- webhook endpoint configured in Stripe
- monitoring/logging available

## Documentation

- README is current
- `SPEC.md` and `BLUEPRINT.md` are current
- deploy, env, security, testing, and runbook docs are current

## Decision

- ready for staging
- ready for production
- blocked, with owners and reasons documented

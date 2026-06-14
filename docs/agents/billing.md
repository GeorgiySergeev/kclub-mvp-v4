# Billing Agent Guide

Use this guide for Stripe checkout, subscriptions, webhooks, business placement billing, cron, and billing UI states.

## Required Context

- `docs/SPEC.md` sections 8, 9, and 12
- `docs/SECURITY.md`
- `docs/RUNBOOKS.md`
- `docs/BLUEPRINT.md` sections 8 and 10
- root `AGENTS.md`

## Billing Source Of Truth

- Stripe is the source of truth for subscription lifecycle.
- Local subscription tables are caches and audit/compliance records.
- Checkout creation is not proof of payment.
- Publication and VIP state changes must follow verified webhook handling.

## Stripe Rules

- Verify webhook signatures.
- Store and check Stripe event ids for idempotency.
- Use checkout metadata for `type`, user id, and business id where applicable.
- Do not expose Stripe secrets to clients.
- Use Stripe Customer Portal for receipts and subscription self-service where possible.

## Business Placement Rules

- Business approval moves `UNDER_REVIEW -> APPROVED`.
- Business publication happens only after verified placement payment webhook.
- Publishing resets featured flags to false.
- Expired VIP capability hides published paid business placement through maintenance logic.

## Cron Rules

- Cron routes require a server-only secret.
- Daily maintenance must be idempotent.
- Cron can expire cards, expire subscriptions, hide businesses, reset featured flags, and clean old webhook events.

## Billing Test Rules

Required for billing changes:

- webhook signature rejection tests
- duplicate event tests
- status mapping tests
- checkout metadata tests
- invalid business placement tests
- cron authorization tests

## Billing Handoff

Include:

- Stripe events touched
- status transitions
- idempotency coverage
- tests run
- operational risks

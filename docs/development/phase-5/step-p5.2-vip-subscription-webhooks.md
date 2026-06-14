# Step P5.2 - VIP Subscription Webhooks

## Context To Read First

- `docs/SPEC.md` sections 8.3, 9, 12
- P5.1 handoff

## Goal

Implement idempotent Stripe webhook handling for VIP subscription lifecycle.

## Non-Goals

- Do not handle business placement publication in this step.
- Do not trust unsigned webhook payloads.

## Implementation Instructions

1. Implement `POST /api/stripe/webhook` signature verification.
2. Store and check `stripe_webhook_events` by Stripe event id before processing.
3. Handle VIP events:
   - `checkout.session.completed` with `metadata.type = vip`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Sync local `vip_subscriptions` fields:
   - Stripe customer id
   - Stripe subscription id
   - current period end
   - cancel at period end
   - local status
5. Preserve `CANCELED` access until `current_period_end`.
6. Write audit logs for subscription state changes.
7. Return safe success for duplicate events.

## Interfaces Or Contracts Touched

- Stripe webhook route.
- VIP subscription service.
- Subscription DTO/status behavior.

## Required Tests

- Signature verification tests with mocked payloads.
- Idempotency tests for duplicate event id.
- Status mapping tests for active, past due, canceled, expired.
- Audit log tests.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:contracts`
- `bun run build`

## Acceptance Criteria

- VIP subscription cache follows Stripe source of truth.
- Duplicate webhooks do not double-apply changes.
- VIP capability rules remain consistent with `@kclub/domain`.

## Regression Notes

Webhook idempotency is release-critical. Do not skip duplicate-event coverage.

## Handoff Summary Format

```markdown
## P5.2 Handoff
- Events handled:
- Status mapping:
- Idempotency tests:
- Risks:
```

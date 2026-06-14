# Step P5.5 - Billing Regression And Failure Modes

## Context To Read First

- All Phase 5 handoffs
- `docs/SPEC.md` sections 8, 9, 12

## Goal

Harden billing and webhook behavior by testing failure modes, retries, idempotency, and user-visible billing states.

## Non-Goals

- Do not add custom invoice UI.
- Do not change Stripe as source of truth.

## Implementation Instructions

1. Add or expand tests for:
   - duplicate webhook delivery
   - out-of-order subscription events
   - failed invoice
   - canceled at period end
   - deleted subscription
   - placement checkout completed for invalid business
   - webhook signature failure
2. Verify member dashboard subscription tab reflects local subscription cache accurately.
3. Verify business tab reflects `APPROVED`, `PUBLISHED`, and `HIDDEN` after payment/expiration.
4. Add operational notes for replaying webhook events through admin API if implemented.
5. Ensure all billing errors use shared error codes and safe messages.

## Interfaces Or Contracts Touched

- Billing tests.
- Subscription and business user-visible state behavior.
- Optional webhook replay documentation.

## Required Tests

- Full Phase 5 billing test suite.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:contracts`
- `bun run build`
- Targeted smoke test for member subscription/business tabs if UI exists.

## Acceptance Criteria

- Billing lifecycle handles normal and failure paths.
- User-visible states do not promise access after expiration.
- Duplicate and invalid webhooks are safe.

## Regression Notes

Billing bugs are high-impact. Prefer explicit tests over relying on manual Stripe dashboard checks.

## Handoff Summary Format

```markdown
## P5.5 Handoff
- Failure modes covered:
- Billing UI state:
- Tests:
- Remaining risks:
```

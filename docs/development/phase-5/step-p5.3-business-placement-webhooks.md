# Step P5.3 - Business Placement Webhooks

## Context To Read First

- `docs/SPEC.md` sections 8.4, 9, 12
- P5.1 and P5.2 handoffs

## Goal

Implement Stripe webhook handling for business placement checkout, publishing approved businesses only after verified payment.

## Non-Goals

- Do not publish businesses from admin approval alone.
- Do not set featured flags automatically on publication.

## Implementation Instructions

1. Extend `checkout.session.completed` handling for `metadata.type = business_placement`.
2. Validate metadata includes business id and user id.
3. Load business and verify:
   - owner matches metadata user id
   - status is `APPROVED`
   - owner still has VIP capability
4. Transition business `APPROVED -> PUBLISHED`.
5. Reset `featured_top` and `featured_recommended` to false on publication.
6. Store subscription/payment identifiers needed for future subscription sync.
7. Add audit log entry for publication.
8. Make handler idempotent for already-published business from the same event.

## Interfaces Or Contracts Touched

- Business placement webhook logic.
- Business status transition service.
- Audit log behavior.

## Required Tests

- Webhook tests for valid placement publication.
- Tests for wrong owner, missing metadata, non-approved status, and missing VIP.
- Duplicate event tests.
- Tests that featured flags are false after publication.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:contracts`
- `bun run build`

## Acceptance Criteria

- Business publication only happens through verified webhook.
- Invalid placement events do not publish.
- Audit trail records publication.

## Regression Notes

This step connects payments to directory visibility. Be strict with ownership and status checks.

## Handoff Summary Format

```markdown
## P5.3 Handoff

- Placement events:
- Publication rules:
- Tests:
- Risks:
```

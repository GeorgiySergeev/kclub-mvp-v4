# Step P5.4 - Daily Maintenance Cron

## Context To Read First

- `docs/SPEC.md` sections 8.2, 8.3, 8.4, 12
- `docs/BLUEPRINT.md` sections 10, 14
- P5.2 and P5.3 handoffs

## Goal

Implement daily maintenance cron for card expiration, subscription expiration, business hiding, featured flag reset, and webhook event cleanup.

## Non-Goals

- Do not run cron without authentication.
- Do not delete business or user records.

## Implementation Instructions

1. Add `POST /api/cron/daily-maintenance`.
2. Verify cron authorization with a server-only secret.
3. Expire active cards whose `expires_at` is in the past.
4. Expire VIP subscriptions past `current_period_end` where status is not already `EXPIRED`.
5. Hide published businesses owned by users who no longer have VIP capability.
6. Reset featured flags when hiding businesses.
7. Clean old webhook events according to retention policy.
8. Write audit logs for hidden businesses and significant maintenance actions.
9. Return structured job result counts.

## Interfaces Or Contracts Touched

- Cron route.
- Maintenance service.
- Audit log entries.

## Required Tests

- Authorization tests for cron route.
- Integration tests for expired cards.
- Integration tests for expired subscriptions and business hiding.
- Tests for featured flag reset.
- Tests for job result counts.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

## Acceptance Criteria

- Cron route is protected.
- Maintenance actions are idempotent.
- Business visibility follows VIP capability.

## Regression Notes

Maintenance jobs are destructive state transitions. Keep operations transactional and auditable.

## Handoff Summary Format

```markdown
## P5.4 Handoff

- Cron actions:
- Authorization:
- Tests:
- Risks:
```

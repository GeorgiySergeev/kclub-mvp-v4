# Step P6.4 - Business Moderation And Catalog

## Context To Read First

- `docs/SPEC.md` sections 5.2, 8.4, 10.2
- P3.5 and P5.3 handoffs

## Goal

Implement admin business moderation UI and catalog featured toggles.

## Non-Goals

- Do not publish businesses without payment webhook.
- Do not allow SUPPORT mutations.

## Implementation Instructions

1. Implement business review queue with filters by status.
2. Implement business detail page with submitted fields, owner summary, internal notes, and audit trail.
3. Implement approve/reject/hide actions using admin API.
4. Make approval transition business to `APPROVED`, not `PUBLISHED`.
5. Add placement/payment status indicators.
6. Implement catalog page for `featured_top` and `featured_recommended` toggles.
7. Enforce and display max 3 featured limits.
8. Reset or reflect reset featured flags when business is not `PUBLISHED`.

## Interfaces Or Contracts Touched

- Admin business DTOs.
- Business moderation actions.
- Featured toggle API consumption.

## Required Tests

- Component tests for status-specific actions.
- Tests that approve does not publish.
- Tests for featured limit error handling.
- Smoke tests for businesses and catalog routes.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

## Acceptance Criteria

- Moderators can approve/reject/hide according to permissions.
- Publication remains payment-webhook-driven.
- Featured toggles work only for published businesses and respect max 3.

## Regression Notes

This is the most likely place to accidentally skip billing lifecycle. Keep status labels precise.

## Handoff Summary Format

```markdown
## P6.4 Handoff

- Business moderation:
- Catalog toggles:
- Tests:
- Risks:
```

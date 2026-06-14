# Step P3.5 - Admin API Foundation And Audit

## Context To Read First

- `docs/SPEC.md` sections 5.2, 7.3, 10.2
- `docs/BLUEPRINT.md` sections 5.1, 7, 8, 14
- P3.1 through P3.4 handoffs

## Goal

Implement product-core admin API foundation, permission enforcement, admin DTOs, moderation endpoints, and audit logging behavior required by admin-app.

## Non-Goals

- Do not build admin-app UI.
- Do not implement staff TOTP UI.
- Do not implement Stripe webhooks yet.

## Implementation Instructions

1. Add admin API auth context extraction placeholder compatible with later staff sessions.
2. Implement permission middleware using `@kclub/domain` and `@kclub/contracts`.
3. Implement admin endpoints for:
   - users list/detail/block/unblock
   - cards list/revoke/re-issue
   - businesses list/detail/approve/reject/hide/featured
   - introductions list/detail/approve/reject/complete
   - categories/countries/cities CRUD
   - subscriptions read/admin cancel placeholder
   - stripe-prices config placeholder
   - staff list/manage placeholder if staff DB exists
   - audit list
4. Enforce SUPPORT read-only behavior.
5. Add audit log writes for state-changing admin actions.
6. Enforce featured max 3 with transaction/lock or service-level placeholder plus DB-backed test plan.

## Interfaces Or Contracts Touched

- Admin API routes.
- Admin DTOs.
- Permission enforcement.
- Audit log behavior.

## Required Tests

- Permission matrix API tests for OWNER, ADMIN, MODERATOR, SUPPORT.
- Admin moderation state transition tests.
- Featured max-count tests including race-condition strategy.
- Audit write tests for state-changing actions.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:contracts`
- `bun run build`

## Acceptance Criteria

- Admin APIs return contract DTOs and shared API envelope.
- SUPPORT cannot mutate.
- Admin moderation moves businesses through allowed states.
- Audit logs are created for state changes.

## Regression Notes

Admin-app must later consume these APIs rather than duplicating business logic or writing DB tables directly.

## Handoff Summary Format

```markdown
## P3.5 Handoff
- Admin APIs:
- Permissions:
- Audit behavior:
- Tests:
- Risks:
```

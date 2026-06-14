# Step P6.3 - Admin Dashboard Users Cards

## Context To Read First

- `docs/SPEC.md` sections 5.2, 7.3, 10.2
- P3.5, P6.1, and P6.2 handoffs

## Goal

Implement admin dashboard metrics, users list/detail, user block/unblock, cards list, card revoke, and card re-issue UI.

## Non-Goals

- Do not add moderator access to user/card operations.
- Do not bypass product-core admin APIs.

## Implementation Instructions

1. Implement dashboard metrics cards using admin API.
2. Implement users list with search/filter/pagination.
3. Implement user detail with profile, card, subscription, and audit sections.
4. Implement block/unblock actions with confirmation.
5. Implement cards list with filters.
6. Implement revoke and re-issue actions for ADMIN/OWNER only.
7. Add permission-aware UI states while relying on server denials as source of truth.
8. Add empty/error/loading states for every table.

## Interfaces Or Contracts Touched

- Admin user DTOs.
- Admin card DTOs.
- Admin mutation actions.

## Required Tests

- Component tests for permission-aware actions.
- Proxy/API mock tests for user/card operations.
- Smoke tests for users and cards routes.
- Tests that MODERATOR/SUPPORT cannot mutate.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

## Acceptance Criteria

- ADMIN/OWNER can manage users and cards.
- MODERATOR/SUPPORT cannot see or execute restricted actions.
- UI reflects API errors safely.

## Regression Notes

Permission hiding in UI is convenience only. Product-core admin API remains enforcement authority.

## Handoff Summary Format

```markdown
## P6.3 Handoff

- Dashboard/users/cards UI:
- Permission behavior:
- Tests:
- Risks:
```

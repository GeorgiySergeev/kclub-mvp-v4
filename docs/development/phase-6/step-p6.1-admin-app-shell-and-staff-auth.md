# Step P6.1 - Admin-App Shell And Staff Auth

## Context To Read First

- `docs/SPEC.md` sections 5.2, 6.3, 7.3
- `docs/BLUEPRINT.md` sections 5.2, 9.2, 14
- Phase 5 summary

## Goal

Build the admin-app shell, staff sign-in UI, admin route layout, and proxy boundary to product-core admin APIs.

## Non-Goals

- Do not implement TOTP verification UI yet.
- Do not write directly to product database from admin-app.
- Do not duplicate product-core business logic.

## Implementation Instructions

1. Implement admin-app layout and route groups for auth and dashboard.
2. Implement staff sign-in form for phone OTP start/verify.
3. Add admin-app BFF/proxy route to product-core admin API.
4. Add staff session placeholder compatible with later TOTP enforcement.
5. Add admin navigation skeleton matching `SPEC.md` admin routes.
6. Ensure admin pages are noindexed.
7. Add loading, empty, error, and unauthorized states.

## Interfaces Or Contracts Touched

- Admin-app route shell.
- Admin auth UI.
- Admin BFF/proxy contract.

## Required Tests

- Component tests for sign-in form states.
- Smoke test for admin sign-in route.
- Smoke test for protected dashboard redirect.
- Proxy tests with mocked product-core API.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

## Acceptance Criteria

- Admin-app boots separately from product-core.
- Admin-app uses proxy/API calls, not DB writes.
- Staff auth shell is ready for TOTP.

## Regression Notes

Admin-app is an operations UI, not a second backend. Keep business authority in product-core.

## Handoff Summary Format

```markdown
## P6.1 Handoff

- Admin shell:
- Auth shell:
- Proxy:
- Tests:
```

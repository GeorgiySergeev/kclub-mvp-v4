# Phase 6 Regression - Admin-App

## Goal

Verify admin-app is a secure operational dashboard consuming product-core admin APIs without direct DB writes.

## Required Checks

```bash
bun install --frozen-lockfile
bun run format
bun run lint
bun run typecheck
bun run test
bun run test:contracts
bun run build
```

Additional checks:

- Staff without TOTP cannot access dashboard.
- Admin pages are noindexed.
- Admin-app has no product database write client.
- Permission matrix is reflected in UI and enforced by API.
- SUPPORT is read-only.
- Business approval does not publish without payment.
- Featured max 3 errors are handled.

## Acceptance Criteria

- All admin MVP routes exist and have smoke coverage.
- Admin-app consumes shared contracts and product-core admin APIs.
- Phase 7 can focus on hardening, not missing MVP surfaces.

## End Of Phase

After completing this regression handoff, update `docs/development/phase-6/phase-summary.md` with the current admin status, risks carried forward, and readiness assessment for Phase 7. A phase is not complete until its `phase-summary.md` is populated.

## Handoff Summary Format

```markdown
## Phase 6 Regression Handoff

- Commands run:
- Admin smoke:
- Permission coverage:
- Security notes:
- Phase 7 blockers:
```

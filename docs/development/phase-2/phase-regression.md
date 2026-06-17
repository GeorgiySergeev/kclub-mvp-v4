# Phase 2 Regression - Shared Foundation

## Goal

Verify shared packages provide a stable contract, validation, domain, database, and testing foundation before app backend work starts.

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

- Search for duplicated error code or permission constants outside `packages/contracts`.
- Search shared packages for forbidden imports: DB clients, Stripe SDK, Supabase SDK, cookies, Next route handlers.
- Validate that public/admin DTO boundaries are tested.
- Validate migrations cover all status models.

## Acceptance Criteria

- Shared packages are importable by both apps.
- Domain policies are pure and tested.
- Database schema supports MVP flows.
- Contract tests prevent admin-app/product-core drift.

## End Of Phase

After completing this regression handoff, update `docs/development/phase-2/phase-summary.md` with the current shared-package state, risks carried forward, and readiness assessment for Phase 3. A phase is not complete until its `phase-summary.md` is populated.

## Handoff Summary Format

```markdown
## Phase 2 Regression Handoff

- Commands run:
- Package status:
- Contract coverage:
- Migration validation:
- Phase 3 blockers:
```

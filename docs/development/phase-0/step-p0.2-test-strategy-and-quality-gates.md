# Step P0.2 - Test Strategy And Quality Gates

## Context To Read First

- `docs/SPEC.md` sections 4, 13, 14
- `docs/BLUEPRINT.md` sections 3, 11, 13, 17
- `docs/development/README.md`
- P0.1 handoff

## Goal

Define the testing strategy before implementation begins. The output must make it impossible for later phases to treat tests as an afterthought.

## Non-Goals

- Do not implement test suites yet.
- Do not choose a non-Bun package manager unless Bun is proven blocked.

## Implementation Instructions

1. Inspect the current repo for any package manager files, CI config, test config, or formatting config.
2. Define the expected test commands for the future monorepo:
   - `bun run format`
   - `bun run lint`
   - `bun run typecheck`
   - `bun run test`
   - `bun run test:contracts`
   - `bun run build`
   - targeted smoke and E2E commands once apps exist.
3. Decide test ownership by package/app:
   - `packages/domain`: unit tests.
   - `packages/validation`: schema tests.
   - `packages/contracts`: contract shape and boundary tests.
   - `apps/product-core`: API/service integration and smoke tests.
   - `apps/admin-app`: UI/auth/proxy smoke tests.
4. Define when full phase regression is required.
5. Document temporary behavior for early phases where commands do not exist yet: the implementer must add the command or explain why it is deferred.

## Interfaces Or Contracts Touched

Documentation and future script names only.

## Required Tests

- Manual markdown link verification.
- Confirm that planned commands match `SPEC.md` and `BLUEPRINT.md`.

## Acceptance Criteria

- A test matrix exists for unit, contract, integration, smoke, E2E, build, lint, typecheck, and format.
- Every later phase can reference this strategy.
- Early-phase missing-command policy is explicit.

## Regression Notes

Phase regressions must become stricter over time. Never remove a gate just because it is inconvenient; fix the gate or document a real blocker.

## Handoff Summary Format

```markdown
## P0.2 Handoff

- Test matrix:
- Required commands:
- Missing commands to create:
- Phase regression policy:
- Risks:
```

# Step P2.5 - Test Utils And Fixtures

## Context To Read First

- `docs/BLUEPRINT.md` sections 4.7, 13
- P2.1 through P2.4 handoffs

## Goal

Create `packages/test-utils` with shared factories, fixtures, and contract assertions for later phases.

## Non-Goals

- Do not create product flows.
- Do not add brittle snapshot-only tests.

## Implementation Instructions

1. Create package `@kclub/test-utils`.
2. Add factories for:
   - member users
   - staff users
   - cards
   - VIP subscriptions
   - business profiles in each status
   - introductions
   - Stripe webhook event payloads
3. Add contract assertion helpers for:
   - API envelope shape
   - public DTO excludes admin fields
   - admin DTO includes moderation fields
   - error code membership
4. Add permission matrix fixtures.
5. Keep fixtures deterministic and easy to override.
6. Reuse contracts and domain packages instead of redefining values.

## Interfaces Or Contracts Touched

- Shared test helper APIs.

## Required Tests

- Unit tests for factories and assertions.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test --filter @kclub/test-utils`
- `bun run test:contracts`
- `bun run build`

## Acceptance Criteria

- Later phases can create realistic test data without copy/paste.
- Fixtures import from contracts/domain where relevant.
- No production runtime code imports test-utils.

## Regression Notes

Test utilities are shared infrastructure. Keep them stable and avoid test-only assumptions leaking into app code.

## Handoff Summary Format

```markdown
## P2.5 Handoff
- Factories:
- Assertions:
- Tests:
- Follow-ups:
```

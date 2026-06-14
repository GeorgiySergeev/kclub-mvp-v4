# Step P3.1 - Product-Core Server Foundation

## Context To Read First

- `docs/SPEC.md` sections 2, 10, 13
- `docs/BLUEPRINT.md` sections 5.1, 7, 8
- Phase 2 summary

## Goal

Build the server foundation for `apps/product-core`: API envelope helpers, request context, server-only dependency boundaries, error mapping, service structure, and audit logging primitives.

## Non-Goals

- Do not implement full auth flows.
- Do not implement Stripe webhooks yet.
- Do not implement admin UI.

## Implementation Instructions

1. Create product-core server folders for `api`, `auth`, `db`, `services`, `audit`, and `errors`.
2. Implement API response helpers using `@kclub/contracts`.
3. Implement typed error classes or error mapping that converts domain/service failures into contract error codes.
4. Add request context shape with actor, locale, request id, IP/user-agent where available.
5. Add server-only DB client wrapper using env schema validation, without committing secrets.
6. Add audit service interface and a minimal implementation ready for DB-backed logging.
7. Add health route or server smoke route.
8. Ensure shared packages do not import product-core server modules.

## Interfaces Or Contracts Touched

- Product-core API response behavior.
- Server service conventions.
- Audit log shape usage.

## Required Tests

- Unit tests for API envelope helpers.
- Unit tests for error-to-response mapping.
- Smoke test for health route if route exists.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test --filter @kclub/product-core`
- `bun run test:contracts`
- `bun run build`

## Acceptance Criteria

- Product-core has a consistent server foundation.
- Route handlers can share error and response handling.
- No secrets are committed.
- Build and tests pass.

## Regression Notes

All later API routes must use the shared response/error helpers instead of hand-rolled JSON shapes.

## Handoff Summary Format

```markdown
## P3.1 Handoff
- Server foundation:
- Response/error helpers:
- Tests:
- Risks:
```

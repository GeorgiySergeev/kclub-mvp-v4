# Step P2.1 - Contracts Package

## Context To Read First

- `docs/SPEC.md` sections 5, 7, 8, 10
- `docs/BLUEPRINT.md` sections 4.1, 7
- Phase 1 summary

## Goal

Create `packages/contracts` as the single source of truth for DTOs, API response envelopes, error codes, permissions, route contract helpers, and public/admin data boundaries.

## Non-Goals

- Do not create DB clients.
- Do not add app route handlers.
- Do not add React components.

## Implementation Instructions

1. Create package `@kclub/contracts`.
2. Define the shared API response envelope used by product-core and admin-app.
3. Define error codes for auth, permission, validation, resource, business, VIP, card, introduction, featured, rate limit, and server errors.
4. Define role and permission constants for `OWNER`, `ADMIN`, `MODERATOR`, `SUPPORT`, member capabilities, and dashboard tab visibility.
5. Define DTOs for:
   - current member profile
   - public card verification
   - member card
   - public business list/detail
   - admin business detail
   - subscription
   - introduction
   - audit log
6. Keep public DTOs PII-safe and separate from admin DTOs.
7. Export all public contract symbols from a stable `src/index.ts`.

## Interfaces Or Contracts Touched

This step creates the shared contract surface that later phases must import instead of duplicating.

## Required Tests

- Unit/contract tests for exported constants and DTO boundary helpers.
- Tests proving public DTO types do not include admin-only fields.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test --filter @kclub/contracts` or equivalent
- `bun run test:contracts`
- `bun run build`

## Acceptance Criteria

- Contracts package builds and typechecks.
- Error code and permission exports are centralized.
- Product-core and admin-app can import from `@kclub/contracts`.
- No server-only dependency is imported.

## Regression Notes

Any later DTO or permission change must update this package and contract tests first.

## Handoff Summary Format

```markdown
## P2.1 Handoff
- Contracts created:
- DTO boundaries:
- Tests:
- Risks:
```

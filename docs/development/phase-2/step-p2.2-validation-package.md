# Step P2.2 - Validation Package

## Context To Read First

- `docs/SPEC.md` sections 6, 11
- `docs/BLUEPRINT.md` sections 4.2, 7
- P2.1 handoff

## Goal

Create `packages/validation` with shared Zod schemas and validation helpers for inputs used by product-core and admin-app.

## Non-Goals

- Do not perform database existence checks in schemas.
- Do not duplicate error code strings outside `@kclub/contracts`.

## Implementation Instructions

1. Create package `@kclub/validation`.
2. Add schemas for:
   - phone OTP send and verify
   - member onboarding
   - member profile update
   - business profile submit
   - business profile editable fields
   - introduction submit/cancel
   - staff TOTP verify/setup
   - pagination/filter inputs
3. Import error codes from `@kclub/contracts` where validation maps to structured errors.
4. Add reusable helpers for phone, URL, locale, UUID/CUID, and safe text.
5. Keep schemas deterministic and side-effect free.
6. Document which checks remain service-level: VIP status, city belongs to country, category high-risk, uniqueness, ownership.

## Interfaces Or Contracts Touched

- Shared request validation schemas.
- Validation error shape conventions.

## Required Tests

- Unit tests for valid and invalid inputs for every schema.
- Tests for single clear error per invalid field where possible.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test --filter @kclub/validation`
- `bun run test:contracts`
- `bun run build`

## Acceptance Criteria

- All MVP request payloads have shared schemas.
- Service-only validation responsibilities are documented.
- No DB, Stripe, Supabase, or React imports exist.

## Regression Notes

When API payloads change, update validation and contracts in the same PR.

## Handoff Summary Format

```markdown
## P2.2 Handoff
- Schemas added:
- Service-level checks deferred:
- Tests:
- Follow-ups:
```

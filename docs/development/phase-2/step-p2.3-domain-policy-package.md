# Step P2.3 - Domain Policy Package

## Context To Read First

- `docs/SPEC.md` sections 5, 8, 9, 12
- `docs/BLUEPRINT.md` sections 4.3, 8
- P2.1 and P2.2 handoffs

## Goal

Create `packages/domain` for pure business policies and state machines that can be tested without DB, HTTP, Stripe, Supabase, or React.

## Non-Goals

- Do not create services that write to the database.
- Do not create API handlers.
- Do not call external SDKs.

## Implementation Instructions

1. Create package `@kclub/domain`.
2. Add role and permission decision helpers using `@kclub/contracts`.
3. Add member capability helpers:
   - member dashboard tab visibility
   - VIP active-through-canceled-period behavior
   - VIP + published business requirement for introductions
4. Add business status transition policy:
   - `UNDER_REVIEW -> APPROVED/REJECTED`
   - `APPROVED -> PUBLISHED/REJECTED`
   - `PUBLISHED -> HIDDEN`
   - future `DRAFT` excluded from MVP runtime unless explicitly enabled
5. Add card lifecycle policy:
   - active/revoked/expired
   - one active card invariant described for DB enforcement
   - MEMBER to VIP keeps existing card by default
6. Add introduction rate/cooldown policy constants.
7. Add featured business policy constants and helper results.

## Interfaces Or Contracts Touched

- Pure domain policy APIs used by product-core services and admin-app UI gating.

## Required Tests

- Exhaustive permission matrix tests.
- State transition tests for allowed and denied transitions.
- VIP capability tests for `ACTIVE`, `CANCELED`, `EXPIRED`, and `PAST_DUE`.
- Featured max-count policy tests.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test --filter @kclub/domain`
- `bun run test:contracts`
- `bun run build`

## Acceptance Criteria

- Domain package has no side-effectful imports.
- Policies match `SPEC.md`.
- Later app code can use policies instead of duplicating rules.

## Regression Notes

If a later implementation bypasses these policies, add tests or refactor so the policy remains the source of truth.

## Handoff Summary Format

```markdown
## P2.3 Handoff
- Policies added:
- Exhaustive tests:
- Spec assumptions used:
- Risks:
```

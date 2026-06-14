# ADR 0003: Shared Package Boundaries

## Status

Accepted

## Context

Shared code is necessary, but mixing server-only behavior into shared packages would leak secrets, couple apps too tightly, and make tests harder.

## Decision

Use separate shared packages:

- `packages/contracts`
- `packages/validation`
- `packages/domain`
- `packages/database`
- `packages/ui`
- `packages/config`
- `packages/test-utils`

Keep side-effectful services inside app server modules.

## Consequences

- Shared packages stay testable and import-safe.
- Product-core owns runtime integrations.
- Agents must check boundaries before adding imports.

## Alternatives Considered

- One large `packages/shared`.
- Shared `packages/services` containing DB and Stripe logic.

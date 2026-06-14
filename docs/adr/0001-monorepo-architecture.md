# ADR 0001: Monorepo Architecture

## Status

Accepted

## Context

KCLUB MVP v4 has two deployable apps, product-core and admin-app, but they share contracts, status models, validation, permissions, database schema, and operational workflows. Separate repositories would create contract drift and coordinated deployment risk.

## Decision

Use one monorepo with:

- `apps/product-core`
- `apps/admin-app`
- `packages/*`

Product-core and admin-app may deploy independently, but their shared contracts and implementation boundaries are versioned together.

## Consequences

- API and DTO changes can be reviewed atomically.
- CI can catch cross-app breakage before merge.
- Shared code must be kept clean and app-agnostic.
- The repo needs explicit package boundary rules.

## Alternatives Considered

- Separate repositories for product-core and admin-app.
- Separate repositories plus a published shared package.

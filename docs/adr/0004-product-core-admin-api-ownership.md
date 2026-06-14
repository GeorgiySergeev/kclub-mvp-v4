# ADR 0004: Product-Core Owns Admin APIs

## Status

Accepted

## Context

Admin-app operates on the same users, cards, subscriptions, businesses, introductions, and audit records as product-core. Allowing admin-app to write directly to the database would duplicate business logic and increase permission risk.

## Decision

Product-core owns `/api/admin/v1/*`, admin DTOs, admin permission enforcement, audit writes, and product state changes. Admin-app consumes these APIs through its proxy/BFF layer.

## Consequences

- Product-core is the authority for admin mutations.
- Admin-app can focus on staff UX.
- Permission tests live around product-core admin APIs.
- Admin-app must not add direct product database write clients.

## Alternatives Considered

- Admin-app writes directly to the database.
- Separate admin backend service for MVP.

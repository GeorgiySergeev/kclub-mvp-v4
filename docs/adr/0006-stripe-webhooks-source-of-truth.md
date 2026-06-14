# ADR 0006: Stripe Webhooks Drive Billing State

## Status

Accepted

## Context

Checkout creation does not prove payment. Stripe is the source of truth for subscription lifecycle and payment completion.

## Decision

Use verified Stripe webhooks to update VIP subscription status and business placement publication. Store processed Stripe event ids for idempotency.

## Consequences

- Checkout creation returns a URL but does not activate VIP or publish businesses.
- VIP state changes follow webhook events.
- Business placement publication follows verified checkout completion.
- Duplicate webhook events must be safe.

## Alternatives Considered

- Trust checkout success redirect.
- Let admin approval publish businesses without placement payment.

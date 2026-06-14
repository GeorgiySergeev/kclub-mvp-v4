# Step P5.1 - Stripe Price Config And Checkout

## Context To Read First

- `docs/SPEC.md` sections 9, 10.2
- `docs/BLUEPRINT.md` sections 5.1, 8, 10
- Phase 4 summary

## Goal

Implement Stripe configuration and checkout session creation for VIP subscriptions and business placement subscriptions.

## Non-Goals

- Do not process webhooks in this step.
- Do not mark businesses published from checkout creation.
- Do not create custom invoice UI.

## Implementation Instructions

1. Add Stripe server client wrapper in product-core server code.
2. Add env schema entries for Stripe secret key, publishable key, webhook secret placeholder, and app URLs.
3. Implement admin-managed price config storage/API for OWNER:
   - VIP monthly Price ID
   - business placement monthly Price ID
4. Implement member VIP checkout start action/API.
5. Implement `POST /api/v1/businesses/{id}/checkout-placement` for approved business profiles only.
6. Add checkout metadata:
   - `type: vip` or `business_placement`
   - user id
   - business id when relevant
7. Configure success and cancel URLs to the localized member checkout routes.
8. Return checkout URL through the shared API envelope.

## Interfaces Or Contracts Touched

- Stripe price config admin API.
- VIP checkout API.
- Business placement checkout API.
- Env schema.

## Required Tests

- Unit tests for checkout metadata builders.
- Integration tests with mocked Stripe client.
- Permission tests for OWNER-only price config.
- Tests that only `APPROVED` business can start placement checkout.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:contracts`
- `bun run build`

## Acceptance Criteria

- Checkout creation is implemented without changing subscription/business status prematurely.
- Stripe metadata is sufficient for webhook handlers.
- Price IDs are configurable by OWNER only.

## Regression Notes

Checkout creation is not proof of payment. State changes must occur through verified webhooks.

## Handoff Summary Format

```markdown
## P5.1 Handoff

- Stripe config:
- Checkout APIs:
- Tests:
- Risks:
```

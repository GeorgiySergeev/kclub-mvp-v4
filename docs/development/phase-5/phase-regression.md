# Phase 5 Regression - Billing And Async Operations

## Goal

Verify Stripe checkout, webhooks, subscription cache, business placement publication, and maintenance cron are production-safe.

## Required Checks

```bash
bun install --frozen-lockfile
bun run format
bun run lint
bun run typecheck
bun run test
bun run test:contracts
bun run build
```

Additional checks:

- Stripe webhooks reject unsigned payloads.
- Duplicate event ids are ignored safely.
- VIP status maps correctly from Stripe lifecycle.
- Business placement publishes only valid approved businesses.
- Cron is authenticated and idempotent.
- Featured flags reset when business leaves published visibility.

## Acceptance Criteria

- Billing state changes are webhook-driven and auditable.
- Subscription expiration hides paid business placement.
- Phase 6 can build admin UI against billing/admin APIs.

## Handoff Summary Format

```markdown
## Phase 5 Regression Handoff

- Commands run:
- Webhook coverage:
- Cron coverage:
- Billing risks:
- Phase 6 blockers:
```

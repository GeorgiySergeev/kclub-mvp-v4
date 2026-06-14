# Step P7.3 - Observability And Operational Runbooks

## Context To Read First

- `docs/SPEC.md` sections 12, 13
- `docs/BLUEPRINT.md` sections 10, 11, 14
- P7.1 and P7.2 handoffs

## Goal

Add practical observability and operational runbooks for production MVP support.

## Non-Goals

- Do not build a full internal ops platform.
- Do not add noisy logging of secrets or PII.

## Implementation Instructions

1. Add structured logging for:
   - API errors
   - auth failures
   - webhook processing
   - cron maintenance
   - admin state-changing actions
2. Add request ids/correlation ids where possible.
3. Add safe error redaction for logs.
4. Add health/readiness endpoints or documented checks.
5. Document runbooks for:
   - failed Stripe webhook
   - duplicate webhook event
   - stuck approved business
   - expired VIP still seeing access
   - staff lost 2FA
   - featured business limit confusion
6. Add monitoring/alert placeholders for production deployment.

## Interfaces Or Contracts Touched

- Logging utilities.
- Health checks.
- Operational documentation.

## Required Tests

- Unit tests for log redaction helpers.
- Smoke test for health/readiness endpoint.
- Webhook error logging test if feasible.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

## Acceptance Criteria

- Operators have runbooks for the highest-risk MVP failures.
- Logs are useful without exposing secrets or PII.
- Health checks are documented and testable.

## Regression Notes

Observability must help production support without weakening privacy.

## Handoff Summary Format

```markdown
## P7.3 Handoff

- Logging added:
- Runbooks:
- Health checks:
- Tests:
```

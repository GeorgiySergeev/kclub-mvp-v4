# Step P7.4 - Staging Deployment And Release Gates

## Context To Read First

- `docs/BLUEPRINT.md` sections 10, 11, 17
- P7.1 through P7.3 handoffs

## Goal

Prepare staging deployment configuration and define production release gates for product-core, admin-app, database migrations, Stripe, and environment variables.

## Non-Goals

- Do not deploy production without explicit approval.
- Do not commit real secrets.

## Implementation Instructions

1. Add or validate Vercel configuration for both apps.
2. Document required env vars for:
   - product-core
   - admin-app
   - Supabase
   - Stripe
   - cron
   - admin session/TOTP
   - email provider if used
3. Add staging deployment checklist.
4. Add migration application checklist.
5. Add Stripe dashboard setup checklist:
   - products
   - prices
   - webhook endpoint
   - webhook signing secret
6. Add release gate checklist:
   - full CI pass
   - E2E pass
   - migration validated
   - webhook tested
   - rollback plan
7. Document how to verify both deployed apps.

## Interfaces Or Contracts Touched

- Deployment config.
- Environment documentation.
- Release checklist.

## Required Tests

- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:contracts`
- `bun run build`
- E2E against local or staging preview when available.
- Verify deployment config syntax if tooling exists.

## Acceptance Criteria

- Staging deploy can be performed from documented steps.
- Required env vars are complete and secret-safe.
- Production release gates are explicit.

## Regression Notes

Deployment docs are part of the product. Keep them synchronized with actual app/package names.

## Handoff Summary Format

```markdown
## P7.4 Handoff
- Deployment config:
- Env docs:
- Release gates:
- Tests:
- Production blockers:
```

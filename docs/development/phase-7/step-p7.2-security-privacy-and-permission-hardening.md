# Step P7.2 - Security Privacy And Permission Hardening

## Context To Read First

- `docs/SPEC.md` sections 5, 6, 8, 13
- `docs/BLUEPRINT.md` section 14
- P7.1 handoff

## Goal

Run a focused security and privacy hardening pass across public, member, admin, webhook, and cron surfaces.

## Non-Goals

- Do not introduce broad architecture rewrites.
- Do not add new product features.

## Implementation Instructions

1. Audit public DTOs for PII leakage.
2. Audit admin permission enforcement at API level.
3. Audit admin-app for direct DB write clients and remove if found.
4. Verify admin pages are noindexed.
5. Verify staff routes require TOTP and valid session.
6. Verify member routes enforce onboarding and blocked-user behavior.
7. Verify Stripe webhook signature enforcement.
8. Verify cron route authorization.
9. Add missing tests for any discovered gap.
10. Document residual risks and mitigation owners.

## Interfaces Or Contracts Touched

- Security tests.
- Permission and privacy boundaries.
- Possible fixes to API guards.

## Required Tests

- Permission matrix tests.
- Public DTO boundary tests.
- Webhook unsigned payload tests.
- Cron unauthorized tests.
- Route guard smoke tests.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:contracts`
- `bun run build`
- Targeted E2E auth/permission tests.

## Acceptance Criteria

- No known public PII leak remains.
- Admin mutations are server-permission-enforced.
- Webhooks and cron reject unauthorized calls.
- Security risks are documented with owner/status.

## Regression Notes

Security fixes should be narrow and tested. Avoid polishing UI during this step unless needed to remove a security ambiguity.

## Handoff Summary Format

```markdown
## P7.2 Handoff
- Audited surfaces:
- Issues fixed:
- Tests:
- Residual risks:
```

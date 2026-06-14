# Phase 3 Regression - Product-Core Backend

## Goal

Verify product-core backend is stable before building member/public UI and Stripe billing.

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

- API responses use the shared envelope.
- Public DTOs are PII-safe.
- Member auth and onboarding do not run implicit side effects outside explicit completion.
- Card issuance maintains one active card per user.
- Business and introduction services enforce capability requirements.
- Admin APIs enforce role permissions and SUPPORT read-only rules.
- Audit logs exist for state-changing admin actions.

## Acceptance Criteria

- Product-core backend MVP APIs are implemented or explicitly stubbed with tracked follow-ups.
- Contract tests pass.
- Phase 4 can build UI against stable APIs.

## Handoff Summary Format

```markdown
## Phase 3 Regression Handoff

- Commands run:
- API coverage:
- Contract status:
- Known backend gaps:
- Phase 4 blockers:
```

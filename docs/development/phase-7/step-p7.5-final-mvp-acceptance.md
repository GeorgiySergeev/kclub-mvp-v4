# Step P7.5 - Final MVP Acceptance

## Context To Read First

- `docs/SPEC.md`
- `docs/BLUEPRINT.md`
- All phase summaries
- P7.1 through P7.4 handoffs

## Goal

Perform final MVP acceptance against the specification, blueprint, test strategy, security expectations, and release checklist.

## Non-Goals

- Do not add new features during acceptance.
- Do not hide known failures; document and classify them.

## Implementation Instructions

1. Build an acceptance matrix covering:
   - public website
   - member auth
   - onboarding
   - card issuance and verification
   - VIP billing
   - business submission/moderation/placement/publication
   - Business Introductions
   - admin staff auth/TOTP
   - admin operations surfaces
   - Stripe webhooks
   - cron maintenance
   - audit logs
   - permissions
   - privacy boundaries
2. Run the full validation suite.
3. Run final E2E suite.
4. Verify docs are current:
   - README
   - SPEC
   - BLUEPRINT
   - deployment/runbooks
5. Classify any failures:
   - launch blocker
   - launch risk accepted by owner
   - post-MVP follow-up
6. Produce final release recommendation.

## Interfaces Or Contracts Touched

- Acceptance documentation.
- Possible narrow fixes for launch blockers only.

## Required Tests

```bash
bun install --frozen-lockfile
bun run format
bun run lint
bun run typecheck
bun run test
bun run test:contracts
bun run build
bun run e2e
```

If a command differs, document the exact replacement and why.

## Acceptance Criteria

- Every MVP journey is either passing or explicitly classified.
- No unclassified security/privacy/billing failure remains.
- Release recommendation is clear: ready, ready with accepted risks, or not ready.

## Regression Notes

Final acceptance is not a refactor phase. Fix only launch blockers; defer polish and non-critical improvements.

## Handoff Summary Format

```markdown
## P7.5 Final Acceptance Handoff
- Full commands run:
- MVP journey matrix:
- Launch blockers:
- Accepted risks:
- Post-MVP follow-ups:
- Release recommendation:
```

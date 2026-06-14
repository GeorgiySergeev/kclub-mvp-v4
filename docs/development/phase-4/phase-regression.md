# Phase 4 Regression - Product-Core Public And Member UX

## Goal

Verify product-core public and member UX works against backend APIs and respects security/capability boundaries.

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

- Smoke public home, directory, business detail, and card verification.
- Smoke sign-up, sign-in, onboarding, and dashboard.
- Verify dashboard tabs for MEMBER, VIP, and VIP + published business.
- Verify unpublished businesses do not appear publicly.
- Verify no public card verification PII leakage.
- Check mobile and desktop layouts for overlap.

## Acceptance Criteria

- Public/member UX is usable without admin-app.
- Capability-gated tabs are hidden and server-enforced.
- Phase 5 can add billing without redesigning dashboard architecture.

## Handoff Summary Format

```markdown
## Phase 4 Regression Handoff

- Commands run:
- Public smoke:
- Member smoke:
- UI/accessibility notes:
- Phase 5 blockers:
```

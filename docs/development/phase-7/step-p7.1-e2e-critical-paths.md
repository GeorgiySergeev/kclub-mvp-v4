# Step P7.1 - E2E Critical Paths

## Context To Read First

- `docs/SPEC.md` full document
- `docs/BLUEPRINT.md` sections 11, 13, 17
- Phase 6 summary

## Goal

Implement end-to-end coverage for all MVP release-critical journeys across product-core and admin-app.

## Non-Goals

- Do not use E2E tests as a replacement for missing unit or contract tests.
- Do not rely on live Stripe/SMS providers in CI.

## Implementation Instructions

1. Add E2E test setup using deterministic test data and provider mocks.
2. Cover public visitor paths:
   - home
   - directory
   - business detail
   - card verification
3. Cover member path:
   - sign-up with mocked OTP
   - onboarding
   - card display
   - dashboard tabs
4. Cover billing path:
   - VIP checkout start
   - mocked webhook confirms subscription
   - subscription tab updates
5. Cover business path:
   - VIP submits business
   - staff approves
   - business placement checkout starts
   - mocked webhook publishes
   - public directory shows business
6. Cover introduction path:
   - VIP business member submits introduction
   - staff reviews it
7. Cover staff auth path:
   - phone OTP
   - TOTP
   - route gating

## Interfaces Or Contracts Touched

- E2E harness.
- Test data setup/teardown.
- Provider mocks.

## Required Tests

- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:contracts`
- `bun run build`
- `bun run e2e` or documented equivalent

## Acceptance Criteria

- E2E suite covers release-critical MVP journeys.
- CI can run E2E without live SMS or live Stripe.
- Failures produce actionable logs/screenshots/traces if tooling supports them.

## Regression Notes

Keep E2E tests high-signal. Do not duplicate every field-level unit test at browser level.

## Handoff Summary Format

```markdown
## P7.1 Handoff

- E2E scenarios:
- Provider mocks:
- Commands:
- Flaky risks:
```

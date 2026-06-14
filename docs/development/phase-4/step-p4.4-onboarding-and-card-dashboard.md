# Step P4.4 - Onboarding And Card Dashboard

## Context To Read First

- `docs/SPEC.md` sections 6.2, 7.2, 8.2
- P3.2, P3.3, and P4.1 handoffs

## Goal

Implement member onboarding and dashboard tabs for card, catalog, subscription, and profile basics.

## Non-Goals

- Do not implement Stripe checkout yet.
- Do not implement business/introductions tabs beyond placeholders if their APIs are not ready.

## Implementation Instructions

1. Implement `/{locale}/m/onboarding` with required fields:
   - display name
   - locale preference
   - terms acceptance
2. Submit onboarding through the API and redirect to dashboard.
3. Implement member layout gate for incomplete onboarding.
4. Implement dashboard tabs:
   - card
   - catalog
   - subscription
   - profile
5. Render digital card from the card API.
6. Add alias redirects:
   - `/m/card`
   - `/m/profile`
   - `/m/subscription`
7. Add responsive tab navigation with hidden unauthorized tabs.

## Interfaces Or Contracts Touched

- Onboarding API.
- Card API.
- Dashboard tab capability rules.

## Required Tests

- Onboarding form validation tests.
- Route guard tests for incomplete members.
- Smoke tests for dashboard tabs and aliases.
- Public card link test from dashboard card.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

## Acceptance Criteria

- Incomplete members cannot access dashboard content.
- Completing onboarding issues/displays a card.
- Dashboard tab visibility follows capability rules.

## Regression Notes

The dashboard is the canonical member area. Alias routes must redirect into dashboard tabs.

## Handoff Summary Format

```markdown
## P4.4 Handoff

- Onboarding:
- Dashboard tabs:
- Guards:
- Tests:
```

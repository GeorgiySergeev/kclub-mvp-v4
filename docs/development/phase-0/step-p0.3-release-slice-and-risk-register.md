# Step P0.3 - Release Slice And Risk Register

## Context To Read First

- `docs/SPEC.md`
- `docs/BLUEPRINT.md`
- P0.1 and P0.2 handoffs

## Goal

Define the MVP release slice and risk register so implementation stays focused on production-ready MVP instead of drifting into future product ideas.

## Non-Goals

- Do not implement features.
- Do not expand MVP scope beyond the spec.

## Implementation Instructions

1. Convert the MVP into release-critical user journeys:
   - Public visitor views home, directory, business detail, and card verification.
   - Member signs up, completes onboarding, receives card, and opens dashboard.
   - Member upgrades to VIP through Stripe.
   - VIP submits business profile.
   - Staff approves business.
   - User pays business placement.
   - Business appears in directory and optional featured blocks.
   - VIP business member submits Business Introduction.
   - Staff reviews introduction.
2. Mark future scope explicitly: draft business profiles, custom invoice UI, public arbitrary card lookup form, guest partner cabinet, MLM mechanics.
3. Create a risk register with owner phase:
   - Bun tooling compatibility.
   - Stripe webhook idempotency.
   - Contract drift between apps.
   - Staff auth and TOTP security.
   - Public DTO PII leakage.
   - Featured business race conditions.
   - README/docs drift.
4. Assign each risk to a phase and testing layer.

## Interfaces Or Contracts Touched

Planning docs only.

## Required Tests

- Manual consistency check against `SPEC.md` status models, route map, and API surface.

## Acceptance Criteria

- MVP release journeys are listed.
- Future scope is clearly excluded.
- Each high-risk area has a phase owner and validation method.

## Regression Notes

Later phases must update the risk register when they close or discover risks.

## Handoff Summary Format

```markdown
## P0.3 Handoff
- MVP journeys:
- Future scope:
- Risks by phase:
- Tests/checks:
- Open questions:
```

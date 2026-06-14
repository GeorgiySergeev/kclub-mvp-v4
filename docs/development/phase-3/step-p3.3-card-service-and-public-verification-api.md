# Step P3.3 - Card Service And Public Verification API

## Context To Read First

- `docs/SPEC.md` sections 7.1, 8.2, 10.1
- P3.1 and P3.2 handoffs

## Goal

Implement card service behavior and public PII-safe card verification APIs.

## Non-Goals

- Do not build the public card verification page yet.
- Do not implement admin card operations yet.

## Implementation Instructions

1. Implement card service methods for:
   - get current member active card
   - issue onboarding card
   - revoke card
   - re-issue card for admin use later
   - verify public card by card number
2. Enforce one active card per user at service and DB constraint level.
3. Use shared card lifecycle policy from `@kclub/domain`.
4. Implement:
   - `GET /api/v1/cards`
   - `GET /api/v1/cards/verify/{cardNumber}`
5. Public verification response must exclude private member fields and expose only safe status/display information.
6. Add card number format handling for `MEM-000001` and future `VIP-000002`.

## Interfaces Or Contracts Touched

- Card DTOs.
- Public card verification DTO.
- Card service methods used by onboarding and later admin APIs.

## Required Tests

- Unit tests for card number validation/format behavior.
- Integration tests for one-active-card enforcement.
- Public DTO PII boundary tests.
- API tests for active, revoked, expired, and missing card.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:contracts`
- `bun run build`

## Acceptance Criteria

- Public card verification is PII-safe.
- Card lifecycle matches `SPEC.md`.
- Onboarding card behavior from P3.2 still passes.

## Regression Notes

Card APIs are public-facing security-sensitive surfaces. Keep DTOs minimal and covered by contract tests.

## Handoff Summary Format

```markdown
## P3.3 Handoff

- Card service:
- Public verification:
- Tests:
- Risks:
```

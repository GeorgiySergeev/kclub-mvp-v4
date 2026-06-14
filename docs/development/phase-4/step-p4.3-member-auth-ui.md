# Step P4.3 - Member Auth UI

## Context To Read First

- `docs/SPEC.md` sections 6.1, 7.1
- P3.2 and P4.1 handoffs

## Goal

Implement localized member sign-up, sign-in, and sign-out UI using the product-core auth APIs while preserving distinct sign-up/sign-in semantics.

## Non-Goals

- Do not implement staff auth.
- Do not silently create accounts from sign-in.
- Do not run onboarding side effects in auth UI.

## Implementation Instructions

1. Implement `/{locale}/sign-up` for new member registration.
2. Implement `/{locale}/sign-in` for existing members.
3. Use the same phone OTP transport but distinct intent.
4. Show clear errors:
   - existing phone on sign-up points to sign-in
   - unknown phone on sign-in points to sign-up
   - invalid or expired OTP
   - blocked account
5. Implement sign-out route/action.
6. Add accessible forms with inline errors and loading states.
7. Redirect authenticated incomplete members to onboarding.

## Interfaces Or Contracts Touched

- Member auth API consumption.
- Auth form validation and localized messages.
- Session redirect behavior.

## Required Tests

- Component tests for sign-up/sign-in intent states.
- Smoke tests for auth routes.
- Tests for redirect after successful auth.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

## Acceptance Criteria

- Sign-up and sign-in are semantically distinct.
- Inline errors are clear and localized.
- Auth UI does not duplicate server validation logic.

## Regression Notes

Do not collapse sign-up and sign-in into ambiguous OTP login behavior. Product semantics matter.

## Handoff Summary Format

```markdown
## P4.3 Handoff
- Auth routes:
- Intent behavior:
- Tests:
- Risks:
```

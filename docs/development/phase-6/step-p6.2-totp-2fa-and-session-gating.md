# Step P6.2 - TOTP 2FA And Session Gating

## Context To Read First

- `docs/SPEC.md` section 6.3
- P6.1 handoff

## Goal

Implement staff TOTP enrollment, verification, backup-code behavior if scoped, and strict session gating for admin routes.

## Non-Goals

- Do not allow staff dashboard access without verified TOTP.
- Do not store TOTP secrets in client-readable state.

## Implementation Instructions

1. Implement TOTP status check.
2. Implement TOTP setup flow:
   - create secret server-side
   - show QR/manual key once
   - verify first code
   - mark staff 2FA verified
3. Implement sign-in TOTP verification after phone OTP.
4. Implement admin session issue/refresh/clear behavior with secure httpOnly cookie.
5. Implement `/2fa-required` route.
6. Add route guards so unverified staff can access only sign-in and 2FA routes.
7. Add OWNER reset pathway placeholder if required by API.

## Interfaces Or Contracts Touched

- Staff auth API/proxy calls.
- Admin session behavior.
- Admin route guards.

## Required Tests

- Unit tests for TOTP verification wrapper with deterministic secret.
- Route guard tests for unverified staff.
- Session cookie tests where possible.
- Smoke tests for sign-in -> 2FA-required -> dashboard.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

## Acceptance Criteria

- Staff cannot enter dashboard without verified TOTP.
- TOTP secrets are server-only.
- Session cookies are secure and httpOnly in production mode.

## Regression Notes

Staff auth is security-critical. UI hiding is not enough; server route guards must enforce access.

## Handoff Summary Format

```markdown
## P6.2 Handoff
- TOTP flow:
- Session gating:
- Tests:
- Risks:
```

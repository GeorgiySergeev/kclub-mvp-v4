# ADR 0005: Staff Auth Requires TOTP

## Status

Accepted

## Context

Staff users can access operational and sensitive member, billing, business, and audit data. Phone OTP alone is not enough for staff operations.

## Decision

Staff authentication requires phone OTP plus TOTP 2FA. Staff without verified TOTP can access only sign-in and 2FA setup/required flows.

## Consequences

- Staff auth differs from member auth.
- Staff identities remain separate from member identities.
- TOTP secrets must remain server-only.
- Route guards and API permission checks must both enforce staff access.

## Alternatives Considered

- Phone OTP only for staff.
- Shared member/staff account sessions.

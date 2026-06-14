# API Agent Guide

Use this guide for product-core APIs, admin APIs, contracts, DTOs, validation, and API tests.

## Required Context

- `docs/SPEC.md` section 10
- `docs/API-REFERENCE.md`
- `docs/BLUEPRINT.md` sections 4 and 7
- root `AGENTS.md`

## API Ownership

- Product-core owns `/api/v1/*`.
- Product-core owns `/api/admin/v1/*`.
- Admin-app consumes admin APIs through its proxy/BFF layer.
- Admin-app must not write directly to product database tables.

## Contract Rules

- Use the shared response envelope from `packages/contracts`.
- Add or update DTOs in `packages/contracts` before using them in apps.
- Validate request payloads with `packages/validation`.
- Use `packages/domain` policies for state transitions and permission decisions.
- Keep public DTOs PII-safe.
- Keep admin DTOs separate from public DTOs.

## Error Rules

- Use shared error codes.
- Return safe user-facing messages.
- Do not leak internal stack traces, secrets, tokens, or provider payloads.

## API Test Rules

Required for API changes:

- validation tests
- contract tests
- permission tests where applicable
- integration tests for state changes
- build and typecheck

## API Handoff

Include:

- endpoints changed
- contracts changed
- validation changed
- permission checks
- tests run
- backward compatibility notes

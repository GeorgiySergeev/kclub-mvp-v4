# RBAC Agent Guide

Use this guide for role definitions, permission checks, capability enforcement, and role-based UI logic.

## Required Context

- `docs/SPEC.md` sections 5 and 6
- `packages/contracts` (permission constants)
- `packages/domain` (pure RBAC policies)
- `docs/agents/auth.md`
- root `AGENTS.md`

## Member Tiers

| Capability                  |    MEMBER    |  VIP   | VIP + published business |
| --------------------------- | :----------: | :----: | :----------------------: |
| Digital club card           |     Yes      |  Yes   |           Yes            |
| Public partner directory    |     Yes      |  Yes   |           Yes            |
| VIP subscription management | Upgrade only | Manage |          Manage          |
| Submit business profile     |      No      |  Yes   |           Yes            |
| Manage own business profile |      No      |  Yes   |           Yes            |
| Business Introductions      |      No      |   No   |           Yes            |

## Staff Roles

Operational hierarchy: `OWNER >= ADMIN >= MODERATOR`. `SUPPORT` is a parallel read-only role.

| Action                                    | OWNER | ADMIN | MODERATOR | SUPPORT |
| ----------------------------------------- | :---: | :---: | :-------: | :-----: |
| Dashboard metrics                         |  Yes  |  Yes  |    Yes    |   Yes   |
| Search users                              |  Yes  |  Yes  |    No     |   No    |
| Block / unblock users                     |  Yes  |  Yes  |    No     |   No    |
| Revoke or re-issue cards                  |  Yes  |  Yes  |    No     |   No    |
| View subscriptions                        |  Yes  |  Yes  |    Yes    |   Yes   |
| Cancel subscription (admin override)      |  Yes  |  Yes  |    No     |   No    |
| Review, approve, publish, hide businesses |  Yes  |  Yes  |    Yes    |   No    |
| Manage Business Introductions             |  Yes  |  Yes  |    Yes    |   No    |
| CRUD categories, countries, cities        |  Yes  |  Yes  |    Yes    |   No    |
| Toggle homepage featured flags            |  Yes  |  Yes  |    Yes    |   No    |
| Manage Stripe Price IDs                   |  Yes  |  No   |    No     |   No    |
| Manage staff roles                        |  Yes  |  No   |    No     |   No    |
| View audit log                            |  Yes  |  Yes  |    No     |   Yes   |
| Add internal notes                        |  Yes  |  Yes  |    Yes    |   Yes   |

## Enforcement Rules

- Permission constants live in `packages/contracts`.
- Pure policy checks live in `packages/domain`. They must be side-effect free.
- Every admin API endpoint in `product-core` enforces staff role server-side.
- UI visibility controls (hiding buttons, greying menu items) are UX only — not security.
- SUPPORT role must be blocked at the API level from all write operations.
- Staff and member contexts are separate: a person may hold both, but they authenticate through different flows.

## RBAC Change Rules

- Always update `packages/contracts` permission constants first.
- Update domain policy in `packages/domain` next.
- Update API enforcement in `product-core` admin routes.
- Update contract tests in `packages/test-utils`.
- Update this file and `docs/SPEC.md` if the role matrix changes.
- Never rely on frontend role checks as a security gate.

## RBAC Test Requirements

- Permission matrix coverage: each role/action combination in the matrix above.
- Negative tests: SUPPORT cannot write, MODERATOR cannot manage users.
- Member tier tests: MEMBER cannot submit business, VIP without published business cannot submit introduction.
- Contract tests: fail if permission constants drift between packages.

## RBAC Handoff

Include:

- roles or permissions changed
- constants updated in `packages/contracts`
- domain policies updated in `packages/domain`
- API enforcement updated
- contract tests updated
- matrix in this file and `docs/SPEC.md` updated

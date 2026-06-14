# Testing Strategy

This is the test reference for KCLUB MVP v4. The implementation plan in `docs/development/` defines when tests are added; this document defines what the finished system must support.

## Baseline Commands

These are the future root gates for the Bun/Turbo monorepo. Phase 1 must create
the scripts and make early no-op behavior explicit where a package or app does
not exist yet.

```bash
bun install --frozen-lockfile
bun run format
bun run lint
bun run typecheck
bun run test
bun run test:contracts
bun run build
```

Recommended additional commands once implemented:

```bash
bun run test:unit
bun run test:integration
bun run test:smoke
bun run e2e
```

## Quality Gate Matrix

| Gate                 | Future root command                                            | Primary owner                                              | Required before                                                   |
| -------------------- | -------------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------------------------- |
| Install and lockfile | `bun install --frozen-lockfile`                                | root workspace                                             | dependency, lockfile, CI, or scaffold handoff                     |
| Format               | `bun run format`                                               | root config and all workspaces                             | every phase regression once configured                            |
| Lint                 | `bun run lint`                                                 | root config, apps, packages                                | every implementation handoff after Phase 1                        |
| Typecheck            | `bun run typecheck`                                            | apps and packages                                          | every implementation handoff after Phase 1                        |
| Unit tests           | `bun run test` or targeted package test                        | `packages/domain`, `packages/validation`, pure helpers     | policy, validation, DTO mapper, or helper changes                 |
| Contract tests       | `bun run test:contracts`                                       | `packages/contracts`, `packages/test-utils`, app consumers | DTO, envelope, permission, route contract, or error-code changes  |
| Integration tests    | targeted product-core integration command, then `bun run test` | `apps/product-core`                                        | API, service, DB transaction, webhook, cron, or billing changes   |
| Smoke tests          | future `bun run test:smoke` or app-scoped smoke command        | `apps/product-core`, `apps/admin-app`                      | route, auth, shell, proxy, deploy config, or health-check changes |
| E2E tests            | future `bun run e2e`                                           | cross-app release flows                                    | phase regression once apps exist and before release               |
| Build                | `bun run build`                                                | apps and buildable packages                                | every implementation handoff after Phase 1                        |

## Test Layers

### Unit Tests

Target ownership:

- `packages/domain`
- `packages/validation`
- DTO mappers
- small pure helpers

Required examples:

- business status transitions
- member capability logic
- card lifecycle rules
- input schema validation

### Contract Tests

Target ownership:

- API envelope
- error codes
- permission constants
- public/admin DTO boundaries
- admin-app assumptions against product-core admin APIs

### Integration Tests

Target ownership:

- product-core service and API flows
- DB transactions
- webhook handlers with mocked Stripe events
- cron maintenance

### Smoke Tests

Target ownership:

- app boot
- localized routing
- auth redirects
- health/readiness routes
- core public and admin screens

### E2E Tests

Target release-critical journeys:

- member sign-up and onboarding
- digital card display
- VIP checkout start and confirmed state
- business submission and moderation
- business placement publication
- Business Introduction flow
- staff auth with TOTP

## Package And App Ownership

| Workspace             | Test responsibility                                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `packages/domain`     | Unit tests for state machines, RBAC, membership capability, card lifecycle, business transitions, introduction rate/cooldown logic, and featured-count policies.   |
| `packages/validation` | Schema tests for accepted and rejected onboarding, business, introduction, phone, URL, locale, pagination, and staff-auth payloads.                                |
| `packages/contracts`  | Contract tests for DTO shapes, enum values, error codes, permission constants, route contract types, public/admin boundary separation, and API envelope stability. |
| `packages/test-utils` | Fixture and assertion tests that prove shared factories match contract/domain expectations.                                                                        |
| `packages/database`   | Migration, seed, generated type, relationship, and invariant validation once database tooling exists.                                                              |
| `packages/ui`         | Accessibility, rendering, and responsive primitive tests once shared primitives exist.                                                                             |
| `apps/product-core`   | API/service integration, member auth/onboarding smoke, public directory/card verification smoke, Stripe webhook tests, cron tests, and product E2E participation.  |
| `apps/admin-app`      | Staff auth/TOTP smoke, route guard checks, admin proxy/BFF tests, permission-aware UI smoke, and admin E2E participation.                                          |

## Early-Phase Missing Command Policy

Before Phase 1 creates the root workspace, validation commands may be missing.
When a required command does not exist yet, the implementer must:

1. State that the command is unavailable because the workspace or script is not scaffolded yet.
2. Run the closest useful check, such as markdown link inspection for docs-only work.
3. Record the missing command in the handoff as a Phase 1 script or scaffold item.

After Phase 1 creates a root `package.json`, missing baseline scripts are defects
unless the active step explicitly documents a temporary no-op. Do not remove,
skip, or weaken a gate because it is inconvenient; fix the gate or document a
real blocker.

## Phase Regression Policy

- End every phase with a regression pass.
- Use the strongest available command set.
- Document any missing or deferred command explicitly.
- Never remove a test gate because it is inconvenient.
- Phase regressions must get stricter over time as packages, apps, and scripts
  appear.
- A phase regression must include every baseline command that exists at that
  point, plus targeted smoke or E2E checks for implemented user journeys.
- If a later prompt conflicts with this strategy, pause and reconcile the docs
  before reducing coverage.

## Launch Requirement

Before production release:

- baseline commands must pass
- E2E critical path suite must pass
- no unclassified billing/security failures may remain
- contract tests must catch incompatible product-core/admin-app API drift
- smoke coverage must include member sign-up, onboarding, VIP checkout return,
  business submission, admin moderation, and public directory visibility

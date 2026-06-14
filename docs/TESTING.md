# Testing Strategy

This is the test reference for KCLUB MVP v4. The implementation plan in `docs/development/` defines when tests are added; this document defines what the finished system must support.

## Baseline Commands

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

## Test Layers

### Unit Tests

Target:

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

Target:

- API envelope
- error codes
- permission constants
- public/admin DTO boundaries
- admin-app assumptions against product-core admin APIs

### Integration Tests

Target:

- product-core service and API flows
- DB transactions
- webhook handlers with mocked Stripe events
- cron maintenance

### Smoke Tests

Target:

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

## Phase Regression Policy

- End every phase with a regression pass.
- Use the strongest available command set.
- Document any missing or deferred command explicitly.
- Never remove a test gate because it is inconvenient.

## Launch Requirement

Before production release:

- baseline commands must pass
- E2E critical path suite must pass
- no unclassified billing/security failures may remain

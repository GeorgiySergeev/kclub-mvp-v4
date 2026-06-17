# KCLUB MVP v4 Development Plan

This folder contains the implementation prompts for a production-ready KCLUB MVP v4. Each `step-pX.Y-*.md` file is intended to be handed to a fresh LLM implementation session.

## How To Use This Plan

Work in phase order. Do not skip a phase regression file. A step is complete only when code, docs, tests, and handoff notes are finished. A phase is complete only when its `phase-summary.md` has been updated with current state, risks, and readiness assessment for the next phase.

Before starting any step, the implementer must read:

- `docs/SPEC.md`
- `docs/BLUEPRINT.md`
- The current phase README/previous phase summaries, if present
- The target step prompt

Every step must:

1. Inspect the live repository before editing.
2. Preserve existing user changes.
3. Keep scope limited to the step.
4. Add or update tests with the implementation.
5. Run the required validation commands.
6. End with a concise handoff summary including changed files, tests run, failures, and follow-up risks.

## Global Quality Gates

Use Bun as package manager and Turborepo as task runner unless a documented blocker requires switching the monorepo to pnpm.

Baseline commands:

```bash
bun install --frozen-lockfile
bun run format
bun run lint
bun run typecheck
bun run test
bun run test:contracts
bun run build
```

Run a narrower command first when a full gate is not yet available, but every phase regression must run the strongest available gate.

## Test Layers

- Unit tests: pure domain policies, validators, DTO mappers, service helpers.
- Contract tests: DTOs, API envelope, error codes, permission constants, public/admin DTO boundaries.
- Integration tests: product-core API/service flows, database transactions, webhook handlers with mocked events.
- Smoke tests: route rendering, health endpoints, app boot, critical redirects.
- E2E tests: member signup, onboarding, card issuance, VIP checkout return, business moderation, directory publication, staff 2FA.
- Regression tests: end-of-phase suites that combine affected unit, contract, integration, smoke, and build checks.

## Prompt Conventions

Each step prompt is written in English and includes:

- Context to read first
- Goal
- Non-goals
- Implementation instructions
- Interfaces/contracts touched
- Required tests
- Acceptance criteria
- Regression notes
- Handoff summary format

If a step discovers a product ambiguity, use the defaults in `docs/SPEC.md` unless implementation would create irreversible data or security risk. Record the ambiguity in the handoff.

## Phase Index

- `phase-0`: Planning, repo readiness, testing strategy, CI policy.
- `phase-1`: Monorepo scaffold, Bun/Turbo, shared config, quality gates.
- `phase-2`: Shared packages: contracts, validation, domain policies, database schema.
- `phase-3`: Product-core backend foundation.
- `phase-4`: Member/public product-core UX.
- `phase-5`: Stripe, subscriptions, webhooks, cron.
- `phase-6`: Admin-app.
- `phase-7`: Production hardening and release readiness.

# Testing Agent Guide

Use this guide when adding features, changing contracts, modifying flows, or fixing bugs.

## Required Context

- `docs/TESTING.md`
- `docs/development/README.md`
- root `AGENTS.md`
- relevant step prompt under `docs/development/`

## Test Selection

Use the smallest useful test first, then run broader gates before handoff.

| Change Type | Required Tests |
| --- | --- |
| pure domain policy | unit tests for allowed and denied cases |
| validation schema | valid/invalid input tests |
| contract or DTO | contract tests and typecheck |
| API route | integration/API tests, contract tests, typecheck |
| auth/session | route guard tests, permission tests, smoke |
| billing/webhook | idempotency, signature, failure-mode tests |
| UI route | component/smoke tests, build |
| migration | migration validation, integration tests, typecheck |

## Baseline Commands

```bash
bun run format
bun run lint
bun run typecheck
bun run test
bun run test:contracts
bun run build
```

Use `bun install --frozen-lockfile` after dependency or lockfile changes.

## Regression Rules

- Run phase regression after each phase.
- Do not delete or weaken tests to make a build pass.
- If a test is flaky, isolate it and document the cause.
- If a command does not exist yet, document that and run the closest available check.

## Test Handoff

Include:

- commands run
- passing result
- failures and why
- tests intentionally not run
- residual risk

# Step P1.4 - CI And Local Dev Scripts

## Context To Read First

- `docs/BLUEPRINT.md` sections 10, 11, 12, 17
- P1.1 through P1.3 handoffs

## Goal

Add CI and local development scripts that enforce the monorepo quality gates and support both app deployables.

## Non-Goals

- Do not configure production secrets.
- Do not deploy to Vercel yet.

## Implementation Instructions

1. Add CI workflow files for install, format, lint, typecheck, tests, contract tests, and build.
2. Ensure CI uses Bun with frozen lockfile.
3. Add local scripts or docs for running:
   - all apps
   - product-core only
   - admin-app only
   - affected checks through Turbo
4. Add README updates to remove split-repo assumptions and point to `docs/SPEC.md`, `docs/BLUEPRINT.md`, and `docs/development/`.
5. Add placeholders for required env files without real secrets.
6. Document preview/deployment expectations without requiring deployment in this step.

## Interfaces Or Contracts Touched

- CI workflow contract.
- Root README architecture statement.
- Local developer command map.

## Required Tests

- `bun install --frozen-lockfile`
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:contracts`
- `bun run build`
- CI workflow lint/parse if a local action linter exists.

## Acceptance Criteria

- CI validates the same commands developers run locally.
- README no longer describes split repositories.
- Local dev instructions mention both app ports.

## Regression Notes

CI is the guardrail for contract drift. Do not defer contract tests without a written blocker.

## Handoff Summary Format

```markdown
## P1.4 Handoff

- CI files:
- README updates:
- Commands run:
- Remaining CI gaps:
```

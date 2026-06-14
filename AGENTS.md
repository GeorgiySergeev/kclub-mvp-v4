# KCLUB MVP v4 Agent Instructions

This file is the entry point for LLM agents working in this repository.

## First Reading Order

Before making changes, read the relevant files in this order:

1. `docs/SPEC.md` for product behavior, routes, statuses, permissions, and MVP scope.
2. `docs/BLUEPRINT.md` for monorepo architecture, package boundaries, and deploy model.
3. The active step prompt in `docs/development/phase-*/step-*.md`, if the work is phase-driven.
4. The matching specialized agent guide in `docs/agents/`.
5. Live repository files related to the change.

Do not implement from prompt memory alone. Inspect the current files first.

## Source Of Truth Priority

When documents disagree:

1. Live code wins for current implementation reality.
2. `docs/SPEC.md` wins for intended product behavior.
3. `docs/BLUEPRINT.md` wins for intended technical boundaries.
4. ADRs in `docs/adr/` explain accepted architectural decisions.
5. Development step prompts define execution order, not permanent product truth.

If a conflict affects security, data integrity, billing, or irreversible migration behavior, stop and document the conflict before implementing.

## Repository Boundaries

- `apps/product-core` owns public/member UX, product APIs, admin APIs, Stripe webhooks, cron, and business logic.
- `apps/admin-app` owns staff UX and admin proxy/session shell. It must not write directly to product database tables.
- `packages/contracts` owns DTOs, API envelope, error codes, route contracts, and permission constants.
- `packages/validation` owns request schemas and pure validation helpers.
- `packages/domain` owns pure policies and state machines. It must not import DB, Stripe, Supabase, cookies, or Next route handlers.
- `packages/database` owns migrations, seeds, generated DB types, and schema docs.
- `packages/ui` owns shared primitives and tokens, not product workflows.

## Standard Workflow

For every implementation task:

1. Inspect repo state with `git status --short`.
2. Read the target files before editing.
3. Keep scope limited to the task.
4. Preserve user changes you did not make.
5. Update docs when behavior, env, API, security, deployment, or tests change.
6. Add tests proportional to risk.
7. Run the strongest available validation commands.
8. End with a handoff summary.

## Required Validation

Use the strongest available subset of:

```bash
bun install --frozen-lockfile
bun run format
bun run lint
bun run typecheck
bun run test
bun run test:contracts
bun run build
bun run e2e
```

If a command does not exist yet, say so and run the nearest useful check.

## Handoff Format

Every substantial task should end with:

```markdown
## Handoff
- Goal:
- Files changed:
- Behavior changed:
- Tests run:
- Tests not run:
- Risks or follow-ups:
```

## Context Discipline

- Prefer repo-native docs and live files over assumptions.
- Do not invent new architecture outside `SPEC`, `BLUEPRINT`, or ADRs.
- Do not add new dependencies without checking existing tooling and documenting why.
- Do not weaken security or tests to make a step pass.
- Do not use Bun as production runtime unless the relevant ADR/docs explicitly approve it.

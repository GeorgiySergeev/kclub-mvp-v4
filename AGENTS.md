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

<!-- gitnexus:start -->

# GitNexus — Code Intelligence

This project is indexed by GitNexus as **kclub-v4** (941 symbols, 979 relationships, 0 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "main"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource                                  | Use for                                  |
| ----------------------------------------- | ---------------------------------------- |
| `gitnexus://repo/kclub-v4/context`        | Codebase overview, check index freshness |
| `gitnexus://repo/kclub-v4/clusters`       | All functional areas                     |
| `gitnexus://repo/kclub-v4/processes`      | All execution flows                      |
| `gitnexus://repo/kclub-v4/process/{name}` | Step-by-step execution trace             |

## CLI

| Task                                         | Read this skill file                                        |
| -------------------------------------------- | ----------------------------------------------------------- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md`       |
| Blast radius / "What breaks if I change X?"  | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?"             | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md`       |
| Rename / extract / split / refactor          | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md`     |
| Tools, resources, schema reference           | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md`           |
| Index, status, clean, wiki CLI commands      | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md`             |

<!-- gitnexus:end -->

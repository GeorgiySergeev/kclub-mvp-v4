# KCLUB MVP v4 Agent Instructions

This file is the entry point for LLM agents working in this repository.

## First Reading Order

Before writing ANY code, read the relevant files in this exact order:

1. `docs/SPEC.md` — product behavior, routes, statuses, permissions, and MVP scope.
2. `docs/BLUEPRINT.md` — monorepo architecture, package boundaries, and deploy model.
3. **`docs/CODESTYLE.md` — mandatory code style, naming conventions, and structural patterns. Do not write a single line of code before reading this.**
4. The active step prompt in `docs/development/phase-*/step-*.md`, if the work is phase-driven.
5. The matching specialized agent guide in `docs/agents/`.
6. Live repository files related to the change.

Do not implement from prompt memory alone. Inspect the current files first.

## Code Style Enforcement

`docs/CODESTYLE.md` is a hard requirement, not a suggestion. It defines:

- Naming conventions for variables, functions, files, services, hooks, components, and schemas.
- TypeScript rules: no `any`, explicit return types, `as const` enums, import order.
- React/Next.js patterns: Server Components by default, component file structure, named exports.
- API route handler pattern: the canonical 5-step sequence.
- Service layer pattern: the canonical 7-step flow.
- Domain and validation package constraints.
- Database access rules.
- Error handling via `@kclub/contracts/errors` only.
- Testing conventions.
- 9 things AI agents must never do.

If your output violates any rule in `docs/CODESTYLE.md`, treat it as a bug and fix it before finishing the task.

## Source Of Truth Priority

When documents disagree:

1. Live code wins for current implementation reality.
2. `docs/SPEC.md` wins for intended product behavior.
3. `docs/BLUEPRINT.md` wins for intended technical boundaries.
4. `docs/CODESTYLE.md` wins for all code style and structural decisions.
5. ADRs in `docs/adr/` explain accepted architectural decisions.
6. Development step prompts define execution order, not permanent product truth.

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

1. Read `docs/CODESTYLE.md` if not already read in this session.
2. Inspect repo state with `git status --short`.
3. Read the target files before editing.
4. Keep scope limited to the task.
5. Preserve user changes you did not make.
6. Update docs when behavior, env, API, security, deployment, or tests change.
7. Add tests proportional to risk.
8. Run the strongest available validation commands.
9. End with a handoff summary.

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
- Do not write code in a style that contradicts `docs/CODESTYLE.md`.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **kclub-v4** (2626 symbols, 5565 relationships, 200 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

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

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/kclub-v4/context` | Codebase overview, check index freshness |
| `gitnexus://repo/kclub-v4/clusters` | All functional areas |
| `gitnexus://repo/kclub-v4/processes` | All execution flows |
| `gitnexus://repo/kclub-v4/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->

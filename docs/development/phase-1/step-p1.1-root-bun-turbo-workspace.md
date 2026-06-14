# Step P1.1 - Root Bun Turbo Workspace

## Context To Read First

- `docs/SPEC.md` section 4
- `docs/BLUEPRINT.md` sections 2, 3, 16, 17
- Phase 0 summary

## Goal

Create the root monorepo workspace with Bun and Turborepo. Establish the single lockfile, workspace globs, root scripts, and baseline repository files.

## Non-Goals

- Do not implement app routes.
- Do not create database schema yet.
- Do not introduce npm, pnpm, or yarn lockfiles.

## Implementation Instructions

1. Inspect the repo for existing package manager files and config.
2. Create root `package.json` with:
   - `private: true`
   - pinned `packageManager` using the installed/current Bun version
   - workspaces `apps/*` and `packages/*`
   - scripts for `dev`, `build`, `typecheck`, `lint`, `test`, `test:contracts`, `format`
3. Add `turbo.json` with build, typecheck, lint, test, and dev tasks.
4. Add root `.gitignore` for `.next`, `node_modules`, coverage, env files, Turbo cache, and logs.
5. Generate `bun.lock` with Bun.
6. Do not create app code beyond empty workspace placeholders unless needed for Bun workspace validity.

## Interfaces Or Contracts Touched

- Root workspace scripts.
- Package manager lockfile.
- Turbo task names used by all later phases.

## Required Tests

- `bun install --frozen-lockfile`
- `bun run format` if available
- `bun run lint` if available
- `bun run typecheck` if available
- `bun run test` if available
- `bun run build` if available

For commands not yet meaningful, make them exist as no-op or config-level checks and document the temporary behavior.

## Acceptance Criteria

- The repo has one Bun workspace and one `bun.lock`.
- `turbo.json` exists and uses stable task names.
- No split-repo package manager files are introduced.
- Later phases can add apps and packages without changing root architecture.

## Regression Notes

Root task names are public workflow contracts. Changing them later requires updating all development prompts and CI.

## Handoff Summary Format

```markdown
## P1.1 Handoff
- Files created/changed:
- Bun version pinned:
- Commands run:
- Temporary no-op commands:
- Follow-ups:
```

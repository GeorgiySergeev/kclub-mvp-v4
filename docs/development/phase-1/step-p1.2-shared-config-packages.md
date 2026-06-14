# Step P1.2 - Shared Config Packages

## Context To Read First

- `docs/BLUEPRINT.md` sections 3, 4.6
- P1.1 handoff

## Goal

Create shared configuration foundations for TypeScript, ESLint, Prettier, Tailwind, and environment schema helpers.

## Non-Goals

- Do not build UI components yet.
- Do not add app-specific feature code.

## Implementation Instructions

1. Create `packages/config` as `@kclub/config`.
2. Add shared TypeScript base config and package-specific extension pattern.
3. Add shared ESLint config suitable for TypeScript and Next.js apps.
4. Add Prettier config at the root and make `bun run format` check formatting.
5. Add Tailwind preset placeholder if Tailwind is selected by the app scaffold.
6. Add env schema helper structure without real secrets.
7. Update root scripts so lint/typecheck/format can run against the current workspace.

## Interfaces Or Contracts Touched

- Shared config package exports.
- Root lint/typecheck/format behavior.

## Required Tests

- `bun install --frozen-lockfile`
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test` if available

## Acceptance Criteria

- Shared config is consumed or ready to be consumed by apps/packages.
- Formatting and linting commands exist.
- No environment secret values are committed.

## Regression Notes

Config must support both shared packages and Next.js apps. Avoid app-specific assumptions in shared config.

## Handoff Summary Format

```markdown
## P1.2 Handoff
- Config package exports:
- Root scripts updated:
- Commands run:
- Known limitations:
```

# Phase 1 Regression - Monorepo Scaffold

## Goal

Verify the repo is a functional Bun/Turbo monorepo with two Next.js app scaffolds, shared config, CI gates, and updated README.

## Required Checks

```bash
bun install --frozen-lockfile
bun run format
bun run lint
bun run typecheck
bun run test
bun run test:contracts
bun run build
```

Also verify:

- Only `bun.lock` is present.
- `apps/product-core` and `apps/admin-app` exist.
- `packages/config` exists and is usable.
- README points to the monorepo architecture.
- No production secrets are committed.

## Acceptance Criteria

- Root gates pass or documented early scaffold no-ops exist.
- Both apps are discoverable by Turbo.
- Phase 2 can add shared packages without changing root setup.

## Handoff Summary Format

```markdown
## Phase 1 Regression Handoff
- Commands run:
- Passing gates:
- Temporary no-op gates:
- Files changed:
- Phase 2 blockers:
```

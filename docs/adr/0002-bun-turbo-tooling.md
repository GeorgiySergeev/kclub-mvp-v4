# ADR 0002: Bun And Turborepo Tooling

## Status

Accepted

## Context

The monorepo needs fast installs, workspace support, a single lockfile, and task orchestration across apps and packages.

## Decision

Use Bun as package manager and local script runner. Use Turborepo for task orchestration and caching.

Production Next.js runtime remains the standard supported Vercel/Next.js runtime unless a separate decision approves Bun runtime for a specific target.

## Consequences

- The repo commits one `bun.lock`.
- Root scripts call Turbo tasks.
- If Bun package-manager compatibility becomes a blocker, the fallback is pnpm inside the monorepo, not split repositories.

## Alternatives Considered

- pnpm workspaces.
- npm workspaces.
- Bun as production runtime by default.

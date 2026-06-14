# Step P1.3 - Next App Scaffolds

## Context To Read First

- `docs/SPEC.md` sections 2, 7
- `docs/BLUEPRINT.md` sections 2, 5, 10, 12
- P1.1 and P1.2 handoffs

## Goal

Create minimal Next.js app scaffolds for `apps/product-core` and `apps/admin-app` inside the Bun/Turbo monorepo.

## Non-Goals

- Do not implement business flows.
- Do not add Stripe, Supabase, or database logic.
- Do not design final UI beyond minimal app boot pages.

## Implementation Instructions

1. Create `apps/product-core` and `apps/admin-app` workspace packages.
2. Configure each app as a Next.js TypeScript app using the shared config package where practical.
3. Product-core must include locale-ready route structure with `en`, `ru`, and `uk` support placeholders.
4. Admin-app must be unlocalized and prepared for staff-only routes.
5. Add minimal home/health pages or route handlers so smoke tests can verify app boot.
6. Add per-app package scripts for `dev`, `build`, `typecheck`, `lint`, and `test`.
7. Keep production runtime on standard Next.js/Vercel assumptions. Do not switch to Bun runtime.

## Interfaces Or Contracts Touched

- App package names.
- App script contracts.
- Initial route structure.

## Required Tests

- `bun install --frozen-lockfile`
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`
- Start each app locally if feasible and verify minimal route/health response.

## Acceptance Criteria

- Both apps build or reach the strongest scaffold-level build possible.
- Product-core and admin-app are separate deployables inside one repo.
- Root Turbo commands detect both apps.

## Regression Notes

If scaffold tooling creates lockfiles other than `bun.lock`, remove them and document the cleanup.

## Handoff Summary Format

```markdown
## P1.3 Handoff

- Apps created:
- Routes available:
- Commands run:
- Build/smoke result:
- Follow-ups:
```

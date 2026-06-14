# Step P0.1 - Docs And Scope Audit

## Context To Read First

- `docs/SPEC.md`
- `docs/BLUEPRINT.md`
- `docs/review.md`
- `README.md`

## Goal

Audit the documentation set and produce a repository-local implementation scope snapshot for MVP v4. Confirm that the current source of truth is monorepo-based and that no implementation work starts from stale split-repo assumptions.

## Non-Goals

- Do not scaffold apps.
- Do not install dependencies.
- Do not edit product requirements unless you find a contradiction that blocks implementation.

## Implementation Instructions

1. Inspect all documentation under `docs/` and the root README.
2. Identify any references to split repositories, old doc paths, old version labels, or missing source-of-truth links.
3. Confirm the intended architecture: `apps/product-core`, `apps/admin-app`, and shared `packages/*`.
4. Create or update a scope audit document if the repo has a planning location for it; otherwise add a concise section to the phase handoff summary.
5. Record open product defaults from `SPEC.md` and explicitly state that implementation should use those defaults unless Product changes them.
6. Flag README drift as an implementation item for Phase 1 after scaffold decisions are materialized.

## Interfaces Or Contracts Touched

Documentation only. No runtime interfaces should change in this step.

## Required Tests

- Run a markdown/link inspection if a markdown checker exists.
- If no checker exists, manually verify relative links in touched docs.
- Run `git status --short` and ensure only documentation planning files changed.

## Acceptance Criteria

- The handoff states which docs are authoritative.
- Split-repo references are identified for later cleanup.
- Open product decisions and defaults are listed.
- No application code is changed.

## Regression Notes

This step defines the baseline for later phases. Any later prompt that conflicts with this audit must pause and reconcile docs before implementation.

## Handoff Summary Format

```markdown
## P0.1 Handoff

- Docs inspected:
- Source of truth:
- Drift found:
- Open decisions/defaults:
- Tests/checks:
- Follow-ups:
```

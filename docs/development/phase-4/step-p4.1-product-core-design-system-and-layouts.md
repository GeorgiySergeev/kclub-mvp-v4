# Step P4.1 - Product-Core Design System And Layouts

## Context To Read First

- `docs/SPEC.md` sections 1, 7
- `docs/BLUEPRINT.md` sections 4.5, 5.1
- Phase 3 summary

## Goal

Build the product-core UI foundation: shared UI consumption, localized layouts, responsive shells, navigation, and base page states.

## Non-Goals

- Do not implement final business forms yet.
- Do not implement admin-app UI.
- Do not add decorative landing pages instead of usable product screens.

## Implementation Instructions

1. Wire product-core to `@kclub/ui` primitives and shared design tokens.
2. Implement localized root layout for `en`, `ru`, and `uk`.
3. Add marketing/public layout, auth layout, and member layout.
4. Add loading, empty, error, and not-found states.
5. Add accessible navigation with locale switching.
6. Add responsive constraints so mobile and desktop layouts do not overlap.
7. Keep UI domain-appropriate: polished, direct, membership/product focused.

## Interfaces Or Contracts Touched

- Product-core layout structure.
- Shared UI package usage.
- Locale route conventions.

## Required Tests

- Component/unit tests for layout helpers if present.
- Smoke tests for localized root routes.
- Accessibility checks if tooling exists.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

## Acceptance Criteria

- Product-core has stable localized layout shells.
- Routes render without layout overlap at mobile and desktop sizes.
- Shared UI primitives are used instead of ad hoc duplicates.

## Regression Notes

Design system changes affect later screens. Keep components generic and avoid product-flow logic in `@kclub/ui`.

## Handoff Summary Format

```markdown
## P4.1 Handoff

- Layouts:
- Shared UI usage:
- Smoke checks:
- Risks:
```

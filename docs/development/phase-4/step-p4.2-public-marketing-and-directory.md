# Step P4.2 - Public Marketing And Directory

## Context To Read First

- `docs/SPEC.md` sections 1, 7.1, 8.4
- P4.1 handoff

## Goal

Implement public product-core pages for home, directory, business detail, and public card verification.

## Non-Goals

- Do not add public arbitrary card lookup form.
- Do not expose unpublished businesses.
- Do not expose private card/member data.

## Implementation Instructions

1. Implement localized home page with MVP messaging and clear member/VIP/partner pathways.
2. Implement `/directory` listing published businesses only.
3. Implement `/directory/{slug}` for published business details.
4. Implement `/verify-card/{cardNumber}` using the public verification API.
5. Add featured top and recommended blocks that only show published businesses and respect API state.
6. Add empty states for no partners and invalid cards.
7. Ensure SEO metadata is localized and public pages are indexable.

## Interfaces Or Contracts Touched

- Public business DTO consumption.
- Public card verification DTO consumption.
- Public route metadata.

## Required Tests

- Route smoke tests for home, directory, business detail, and card verification.
- Tests that unpublished businesses are not rendered.
- Tests that card verification does not expose PII.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

## Acceptance Criteria

- Public pages render from API/data layer.
- Public directory only shows `PUBLISHED` businesses.
- Card verification is PII-safe.

## Regression Notes

Do not add the removed verify-card lookup form. QR/direct URL verification only.

## Handoff Summary Format

```markdown
## P4.2 Handoff
- Public routes:
- Visibility rules:
- Tests:
- Risks:
```

# Step P3.4 - Business And Introduction Services

## Context To Read First

- `docs/SPEC.md` sections 5.1, 8.4, 8.5, 10.1, 11
- `docs/BLUEPRINT.md` section 8
- P3.1 through P3.3 handoffs

## Goal

Implement product-core member-side services and APIs for business profiles and Business Introductions.

## Non-Goals

- Do not implement admin moderation endpoints yet.
- Do not implement Stripe placement checkout yet.
- Do not build UI.

## Implementation Instructions

1. Implement business service methods:
   - submit business for review
   - list own businesses
   - get business detail with visibility rules
   - edit allowed fields while reviewable
2. Enforce VIP capability for business submission.
3. Enforce high-risk category denial, ownership, uniqueness, and editable-field locks.
4. Implement introduction service methods:
   - submit introduction
   - list own introductions
   - cancel own introduction
5. Enforce VIP + published business requirement for introductions.
6. Enforce daily and target cooldown/rate limits.
7. Implement member API routes from `SPEC.md`.
8. Write audit logs for meaningful state-changing actions where specified.

## Interfaces Or Contracts Touched

- Business DTOs.
- Introduction DTOs.
- Member business/introduction API routes.
- Validation schemas and domain policy usage.

## Required Tests

- Unit tests for service-level authorization decisions.
- Integration tests for business submit/edit/list/detail.
- Integration tests for introduction submit/cancel/rate limits.
- Contract tests for public/member DTO boundaries.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:contracts`
- `bun run build`

## Acceptance Criteria

- Member-side business and introduction APIs behave according to `SPEC.md`.
- Non-VIP and non-owner cases are denied.
- Locked fields cannot be edited after submission.

## Regression Notes

Do not publish businesses in this step. Publication happens through admin approval plus Stripe placement flow in later phases.

## Handoff Summary Format

```markdown
## P3.4 Handoff
- Business APIs:
- Introduction APIs:
- Tests:
- Risks:
```

# Step P6.5 - Introductions Taxonomy Subscriptions Audit

## Context To Read First

- `docs/SPEC.md` sections 5.2, 7.3, 8.3, 8.5, 10.2
- P3.5 and Phase 5 handoffs

## Goal

Complete remaining admin MVP surfaces: Business Introductions, taxonomy/reference data, subscriptions, Stripe prices, staff roles, settings, and audit log.

## Non-Goals

- Do not add non-MVP CRM features.
- Do not expose OWNER-only settings to lower roles.

## Implementation Instructions

1. Implement introductions list/detail and approve/reject/complete actions.
2. Implement categories, countries, and cities CRUD with high-risk category flag support.
3. Implement subscriptions read-only list/detail and ADMIN/OWNER cancel override where API supports it.
4. Implement OWNER-only Stripe Price IDs configuration UI.
5. Implement OWNER-only staff management UI.
6. Implement audit log list with filters and read-only detail.
7. Implement settings page for OWNER platform settings.
8. Ensure SUPPORT can view audit/investigation-safe surfaces but cannot mutate.

## Interfaces Or Contracts Touched

- Admin introduction DTOs.
- Taxonomy/reference data APIs.
- Subscription admin DTOs.
- Staff/settings/audit APIs.

## Required Tests

- Permission tests for OWNER-only surfaces.
- Component tests for introduction actions.
- Smoke tests for each admin route.
- Tests that SUPPORT remains read-only.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

## Acceptance Criteria

- All admin MVP routes from `SPEC.md` exist.
- Role restrictions match permission matrix.
- Audit log is accessible to ADMIN and SUPPORT as specified.

## Regression Notes

Admin breadth should not become scope creep. Keep screens operational and clear, not over-designed.

## Handoff Summary Format

```markdown
## P6.5 Handoff
- Admin surfaces:
- Permissions:
- Tests:
- Remaining gaps:
```

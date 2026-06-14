# Step P4.5 - Business And Introduction Member UI

## Context To Read First

- `docs/SPEC.md` sections 5.1, 7.2, 8.4, 8.5, 11
- P3.4 and P4.4 handoffs

## Goal

Implement member UI for business submission/management and Business Introduction submission/listing.

## Non-Goals

- Do not publish businesses directly.
- Do not bypass admin moderation.
- Do not implement Stripe placement checkout in this step.

## Implementation Instructions

1. Add dashboard `business` tab for VIP members.
2. Implement business submission form with inline validation and clear moderation status.
3. Allow editing only the fields permitted by `SPEC.md` while status is reviewable.
4. Show `UNDER_REVIEW`, `APPROVED`, `PUBLISHED`, `REJECTED`, and `HIDDEN` states.
5. Add dashboard `introductions` tab only for VIP members with a published business.
6. Implement introduction submit form and list.
7. Add cancel action where allowed.
8. Add helpful empty and denied states without exposing unavailable tabs to unauthorized members.

## Interfaces Or Contracts Touched

- Member business APIs.
- Introduction APIs.
- Capability-gated dashboard tabs.

## Required Tests

- Form validation tests.
- Visibility tests for MEMBER, VIP, and VIP + published business.
- Smoke tests for business submit and introduction submit paths.
- Tests that unauthorized tabs are hidden and server-denied.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run build`

## Acceptance Criteria

- VIP can submit a business for review.
- Published-business VIP can submit introductions.
- UI mirrors server status model and does not imply instant publication.

## Regression Notes

Business publication requires admin moderation and Stripe placement. Keep that lifecycle explicit in UI copy.

## Handoff Summary Format

```markdown
## P4.5 Handoff
- Business UI:
- Introduction UI:
- Capability gating:
- Tests:
```

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

## Handoff

### P4.5 Handoff

- **Business UI**: Added `BusinessPanel` server component (taxonomy options loaded server-side from DB) and `BusinessForm` client component. Shows own businesses with status badges (`UNDER_REVIEW`, `APPROVED`, `PUBLISHED`, `REJECTED`, `HIDDEN`). Submit form for new businesses, edit form for `UNDER_REVIEW`/`REJECTED` statuses. Rejection reason displayed inline for rejected businesses.
- **Introduction UI**: Added `IntroductionsPanel` client component. Submit form with requester business (own published), target business (all published except own), and optional message. Lists own introductions with status badges, timestamps, and cancel action for `SUBMITTED`/`IN_REVIEW`.
- **Capability gating**: `getImplementedDashboardTabs` now accepts `hasPublishedBusiness` flag. MEMBER sees 4 tabs, VIP sees 5 (adds `business`), VIP with published business sees 6 (adds `introductions`). Unauthorized tabs normalize to first visible tab.
- **Alias pages**: `/m/my-business` redirects to `dashboard?tab=business`, `/m/introduce` redirects to `dashboard?tab=introductions`.
- **DTO**: Added `MemberIntroductionDto` extending `IntroductionDto` with `requesterBusinessName`, `requesterBusinessSlug`, `targetBusinessName`, `targetBusinessSlug`.
- **Service**: Updated `introduction-service.ts` functions (submit, getOwn, cancel) to return `MemberIntroductionDto` with joined business names.
- **Tests**: 7 dashboard tab tests (MEMBER, VIP, VIP+published, tab normalization, unauthorized tab, alias hrefs) + 2 introduction service DTO tests. 115 total pass in product-core.
- **Validation gates passed**: `format` (--write applied), `typecheck` (11/11 success), `test` (115/115 pass across 18 files), `test:contracts` (17/17 pass), packages `build` (4/4 full turbo).
- **Known blocked gate**: `build` fails on `apps/product-core` and `apps/admin-app` due to pre-existing Windows Next.js webpack EPERM (`scandir 'C:\Users\Admin\Application Data'`). Not introduced by this change.
- **Risks or follow-ups**: Stripe placement checkout not wired (per spec). City filtering by country in BusinessForm could be enhanced with cascade loading. Public businesses endpoint `/api/v1/businesses` serves `MemberBusinessProfileDto` for auth'd users and `PublicBusinessListItemDto` for anonymous; IntroductionsPanel consumes the auth'd shape.

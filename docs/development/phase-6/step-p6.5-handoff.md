# P6.5 Handoff — Admin MVP Surfaces

## Goal

Complete remaining admin MVP surfaces: Introductions, taxonomy/reference data, subscriptions, Stripe prices, staff roles, audit log, settings, and memberships.

## Admin Surfaces

| Surface | Status | Pages | Features |
|---------|--------|-------|----------|
| Introductions | Operational | `/dashboard/introductions` | List with status badges, approve/reject/complete dialogs, requester/target business summaries, role-gated actions |
| Categories | Operational | `/dashboard/categories` | CRUD table, create/edit dialog with high-risk flag, delete confirm, active/inactive toggle |
| Countries | Operational | `/dashboard/countries` | CRUD table, create/edit dialog with ISO codes, delete confirm |
| Cities | Operational | `/dashboard/cities` | CRUD table, create/edit dialog with country dropdown, delete confirm |
| Subscriptions | Operational | `/dashboard/subscriptions` | List by kind (VIP/Business), user summary, period dates, cancel-at-period-end, cancel dialog (OWNER/ADMIN only) |
| Memberships | Operational | `/dashboard/memberships` | Read-only plan metadata from admin_config |
| Stripe Prices | Operational | `/dashboard/stripe-prices` | OWNER-only editable Price ID config values |
| Staff | Operational | `/dashboard/staff` | OWNER-only list, role update dialog via `staff/[id]/role` PUT |
| Audit | Operational | `/dashboard/audit` | Filterable (action/role/entity/date range), paginated read-only table |
| Settings | Operational | `/dashboard/settings` | OWNER-only platform settings (shares StripePricesForm) |

## Permissions

- **OWNER**: All surfaces including staff, stripe-prices, settings (matches STAFF_MANAGE, STRIPE_PRICES_MANAGE)
- **ADMIN**: All except staff, stripe-prices, settings (no STAFF_MANAGE, STRIPE_PRICES_MANAGE)
- **MODERATOR**: Introductions, categories, countries, cities, catalog, businesses (INTRODUCTIONS_MODERATE, TAXONOMY_MANAGE)
- **SUPPORT**: Audit only (AUDIT_READ); read-only enforced by adminGuard at API level
- Subscription pages: OWNER/ADMIN only (route-permissions); SUBSCRIPTIONS_READ also granted to MODERATOR/SUPPORT at API level for dashboard metrics

## Files Changed

### `packages/contracts/src/dto.ts`
- Added `SUBSCRIPTION_KINDS` const + `SubscriptionKind` type
- Added DTOs: `AdminIntroductionListItemDto`, `CategoryDto`, `CountryDto`, `CityDto`, `AdminSubscriptionListItemDto`, `AdminStaffListItemDto`, `AdminConfigEntryDto`, `MembershipPlanDto`

### `packages/validation/src/admin.ts`
- Added `auditLogListSchema` with action/role/entity/date/page/limit filters
- Added `staffDeactivateSchema` with optional reason
- Exported `AuditLogListInput` and `StaffDeactivateInput` types

### `apps/product-core/src/server/services/admin-service.ts`
- Taxonomy functions (list/get/create/update) now return typed `CategoryDto[]`, `CountryDto[]`, `CityDto[]`
- `listIntroductions`/`getIntroductionDetail` return `AdminIntroductionListItemDto[]` with requester user/business and target business summaries
- Added `listAdminSubscriptions`/`getAdminSubscriptionDetail` querying `Subscription` model (both kinds)
- `adminCancelSubscription` now operates on `Subscription` model, returns `AdminSubscriptionListItemDto`
- `listAuditLogs` now accepts `Partial<AuditLogListInput>` with pagination and filtering
- `getStripePrices`/`getAdminConfig`/`updateAdminConfig` return `AdminConfigEntryDto`
- `listStaff`/`updateStaffRole` return `AdminStaffListItemDto[]`
- Added `getStaffDetail`, `deactivateStaff`, `getMembershipPlans` functions
- Added helper mappers: `toAdminIntroductionListItem`, `toAdminSubscriptionListItem`, `toCategoryDto`, `toCountryDto`, `toCityDto`, `toAdminStaffListItem`, `toAdminConfigEntry`

### `apps/product-core/src/app/api/admin/v1/` (new routes)
- `staff/[id]/route.ts` — GET staff detail
- `staff/[id]/role/route.ts` — PUT update role
- `staff/[id]/deactivate/route.ts` — POST deactivate
- `memberships/route.ts` — GET membership plans

### `apps/product-core/src/app/api/admin/v1/` (updated routes)
- `subscriptions/route.ts` — now calls `listAdminSubscriptions()` (both kinds)
- `audit/route.ts` — now parses query params, passes filters to `listAuditLogs(filters)`, returns paginated response

### `apps/admin-app/src/features/` (new)
- `introductions/api.ts` + `components/introductions-table.tsx`
- `categories/api.ts` + `components/categories-table.tsx`
- `countries/api.ts` + `components/countries-table.tsx`
- `cities/api.ts` + `components/cities-table.tsx`
- `subscriptions/api.ts` + `components/subscriptions-table.tsx`
- `staff/api.ts` + `components/staff-table.tsx`
- `audit/api.ts` + `components/audit-table.tsx`
- `stripe-prices/api.ts` + `components/stripe-prices-form.tsx`
- `memberships/api.ts` + `components/memberships-view.tsx`

### `apps/admin-app/src/app/dashboard/` (updated)
- All 10 placeholder pages replaced with real server components:
  `introductions`, `categories`, `countries`, `cities`, `subscriptions`, `memberships`, `stripe-prices`, `staff`, `audit`, `settings`

### `apps/admin-app/tests/server/route-permissions.test.ts`
- Added test block for all P6.5 route permissions
- Added authorized/unauthorized tests for new surfaces

## Tests Run

| Command | Result |
|---------|--------|
| `packages/contracts: test` | 10 pass, 0 fail |
| `packages/validation: test` | 24 pass, 0 fail |
| `packages/contracts: typecheck` | Pass |
| `packages/validation: typecheck` | Pass |
| `apps/admin-app: test` | 26 pass, 1 skip, 0 fail |
| `apps/admin-app: typecheck` | 1 pre-existing error in `session.test.ts` (unrelated) |
| `apps/product-core: typecheck` | Pass |
| `apps/admin-app: build` | Compiled successfully, 23 pages |
| `packages/contracts: lint` | Pass |
| `packages/validation: lint` | Pass |

## Remaining Gaps

1. **Staff creation**: `staff/route.ts` POST still returns 501 NOT_IMPLEMENTED. Staff must be provisioned via seed or direct DB.
2. **Business placement cancel**: `adminCancelSubscription` operates on `Subscription` model. If Stripe doesn't support cancel for business placement subscriptions, the endpoint will fail gracefully at the Stripe layer.
3. **Memberships page**: Shows config-stored Price IDs only. Full Stripe-synced plan metadata requires Stripe plan retrieval.
4. **Settings page**: Minimal — only Stripe Price ID config. No CRM, bulk import/export, or analytics.
5. **Audit detail modal**: Current implementation shows flat table rows. A future enhancement could add an expandable detail panel with before/after JSON comparison.
6. **Session test type error**: Pre-existing TS error in `apps/admin-app/tests/server/session.test.ts:35` — not caused by this PR.

## Risks or Follow-Ups

- GitNexus detect_changes: HIGH risk due to 51 changed symbols across 25 files — all within planned P6.5 scope
- Taxonomy functions now return typed DTOs (was `any`) — existing consumers may need type adjustments
- Subscription route now returns both kinds — any consumer relying on `listSubscriptions` return shape unchanged (old function preserved)
- Audit route now returns `{ data, meta }` paginated envelope — was flat array
- Database schema unchanged — no migrations needed

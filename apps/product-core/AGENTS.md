# product-core Agent Guide

This app owns public/member UX, product APIs, admin APIs, Stripe webhooks, cron jobs, and all product business logic.

## Required Context

- `docs/SPEC.md` sections 3, 5, 6, 7, 8, 9, 10, 11, 12, 13
- `docs/BLUEPRINT.md`
- `docs/agents/auth.md`
- `docs/agents/billing.md`
- `docs/agents/api.md`
- `docs/agents/rbac.md`
- root `AGENTS.md`

## Scope

- Public multilingual routes: `/{locale}/...`
- Member auth and cabinet routes: `/{locale}/m/...`
- Product API: `/api/v1/*`
- Admin API surface called by admin-app
- Stripe webhooks and cron handlers
- Public card verification and public business directory

## Boundary Rules

- This app is the only source of product business logic.
- Admin-app must never write directly to product tables — only call product-core admin APIs.
- Supabase service-role access, Stripe SDK, email delivery, admin JWT signing, and cron handlers stay inside this app's server modules.
- Do not expose sensitive member or staff fields in public-facing DTOs.
- All role and permission checks must be enforced server-side in route handlers and API endpoints.

## Route Rules

- All public and member routes use `/{locale}` prefix where locale is `en`, `ru`, or `uk`.
- Authenticated members with incomplete onboarding are redirected to `/{locale}/m/onboarding`.
- Public pages must be SEO-friendly: correct metadata, no noindex.
- Stripe return routes (`/m/checkout/success`, `/m/checkout/cancel`) are auth-gated.

## Critical Areas

- **Auth**: phone OTP sign-up vs sign-in intent separation; onboarding gate; member session.
- **Onboarding**: completion requires `display_name`, `locale_preference`, `terms_accepted_at`; auto-issues club card on complete.
- **Card lifecycle**: issue on onboarding, QR links to public verify view, status transitions in `packages/domain`.
- **Stripe webhooks**: must be idempotent; use event ID deduplication; state transitions flow through domain policies.
- **Admin API**: separate surface from public/member API; all staff permission checks enforced here.
- **Cron jobs**: must be idempotent; log outcomes; fail safely.

## product-core Handoff

Include:

- routes or API endpoints changed
- auth or permission surfaces touched
- Stripe or webhook behavior changed
- domain policies or state transitions affected
- migrations included
- tests run
- public SEO impact

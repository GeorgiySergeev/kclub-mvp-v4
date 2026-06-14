# Deployment Runbook

This runbook describes how to deploy KCLUB MVP v4 to staging and production.

## Deploy Targets

| App | Platform | Domain |
| --- | --- | --- |
| `apps/product-core` | Vercel | `www.kylyvnyk.club` |
| `apps/admin-app` | Vercel | `admin.kylyvnyk.club` |
| Database | Supabase Cloud | managed |
| Billing | Stripe | managed |

## Preconditions

- CI is green.
- Release checklist is complete.
- Required env vars are configured.
- Database migrations are reviewed.
- Stripe products, prices, and webhook endpoint are prepared.

## Staging Deployment

1. Merge the target branch into the staging branch or create a staging preview deploy.
2. Apply pending database migrations to staging.
3. Verify `product-core` preview URL and `admin-app` preview URL.
4. Run smoke checks:
   - public home
   - member sign-up/sign-in
   - onboarding
   - admin sign-in
   - Stripe checkout start
   - webhook endpoint reachable
5. Record staging validation result in the release notes or handoff.

## Production Deployment

1. Freeze non-essential merges.
2. Confirm current rollback point.
3. Apply database migrations first if backward compatible.
4. Deploy `apps/product-core`.
5. Deploy `apps/admin-app`.
6. Verify domains and TLS.
7. Re-run production smoke checks:
   - home and directory
   - card verification
   - member auth
   - admin auth
   - Stripe checkout start
   - webhook signature verification path
   - cron route auth

## Post-Deploy Checks

- Public site loads and localized routes work.
- Admin site is noindexed and login-protected.
- Stripe webhook delivery succeeds.
- No launch-blocking errors appear in logs/monitoring.
- Dashboard metrics and audit log are reachable.

## Rollback

Use rollback if:

- auth is broken for members or staff
- Stripe webhook processing is failing in production
- migrations caused incompatible runtime failures
- public pages leak PII or admin access is exposed

Rollback steps:

1. Disable new release traffic if supported by platform.
2. Roll back Vercel deploys to last known good release.
3. If migration is backward-compatible, keep it and restore app code first.
4. If migration is not backward-compatible, follow the DB rollback plan in `DB-OPERATIONS.md`.
5. Re-run smoke checks after rollback.

## Ownership

- Engineering lead owns deploy decision.
- Platform owner owns secret correctness and domain config.
- Product owner signs off on accepted launch risks.

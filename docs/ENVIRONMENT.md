# Environment Variables

This document defines the environment contract for KCLUB MVP v4. Never commit real secrets. Each app uses its own `.env.local` in development and platform-managed secrets in staging/production.

## Rules

- Validate env at startup.
- Fail fast for missing required secrets.
- Keep server-only secrets out of public bundles.
- Prefix client-exposed variables with `NEXT_PUBLIC_` only when they are safe.

## Product-Core

| Variable                             | Required            | Environment | Purpose                                            |
| --------------------------------------| ---------------------| -------------| ----------------------------------------------------|
| `NEXT_PUBLIC_APP_URL`                | Yes                 | all         | Public product-core base URL                       |
| `NEXT_PUBLIC_SUPABASE_URL`           | Yes                 | all         | Supabase project URL                               |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`      | Yes                 | all         | Public Supabase client key                         |
| `SUPABASE_SERVICE_ROLE_KEY`          | Yes                 | server only | Service-role access for product-core server logic  |
| `SUPABASE_JWT_SECRET`                | Optional            | server only | Needed only if server verifies tokens directly     |
| `STRIPE_SECRET_KEY`                  | Yes                 | server only | Stripe server SDK                                  |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes                 | all         | Stripe client usage if checkout helpers require it |
| `STRIPE_WEBHOOK_SECRET`              | Yes                 | server only | Stripe webhook signature verification              |
| `CRON_SECRET`                        | Yes                 | server only | Protects cron route                                |
| `ADMIN_APP_URL`                      | Yes                 | all         | Admin app base URL for links and redirects         |
| `EMAIL_PROVIDER_API_KEY`             | Optional/likely yes | server only | Transactional email provider key                   |
| `EMAIL_FROM_ADDRESS`                 | Optional/likely yes | server only | Sender for product emails                          |
| `LOG_LEVEL`                          | Optional            | all         | Logging verbosity                                  |

## Admin-App

| Variable                        | Required | Environment | Purpose                                                |
| ---------------------------------| ----------| -------------| --------------------------------------------------------|
| `NEXT_PUBLIC_ADMIN_APP_URL`     | Yes      | all         | Admin app base URL                                     |
| `PRODUCT_CORE_API_BASE_URL`     | Yes      | server only | Admin proxy target                                     |
| `ADMIN_JWT_SECRET`              | Yes      | server only | Staff session signing secret if app issues its own JWT |
| `TOTP_ENCRYPTION_KEY`           | Yes      | server only | Protects stored TOTP secrets or encrypted material     |
| `NEXT_PUBLIC_SUPABASE_URL`      | Optional | all         | Needed only if admin-app uses Supabase client directly |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | all         | Same note as above                                     |
| `LOG_LEVEL`                     | Optional | all         | Logging verbosity                                      |

## Shared Operational Variables

| Variable               | Required                 | Environment | Purpose                                 |
| ---------------------- | ------------------------ | ----------- | --------------------------------------- |
| `NODE_ENV`             | Yes                      | all         | Runtime mode                            |
| `APP_ENV`              | Yes                      | all         | `development`, `staging`, `production`  |
| `SENTRY_DSN`           | Optional but recommended | all         | Error reporting                         |
| `SENTRY_AUTH_TOKEN`    | Optional                 | CI/deploy   | Source map upload or release automation |
| `RATE_LIMIT_REDIS_URL` | Optional but recommended | server only | Abuse/rate-limit backend if used        |

## Ownership

- Product engineering owns env schema.
- DevOps/platform owner owns staging and production secret provisioning.
- No feature is considered launch-ready until required env is documented here and used in code.

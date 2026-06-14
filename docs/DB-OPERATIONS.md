# Database Operations

This document covers migrations, seeding, reset, and backup/restore concerns for KCLUB MVP v4.

## Principles

- Product-core is the primary consumer of runtime database writes.
- Admin-app must not bypass product-core admin APIs for business state changes.
- Migrations must be versioned in `packages/database`.

## Migration Workflow

1. Create migration in `packages/database/migrations`.
2. Review schema change against `SPEC.md` and `BLUEPRINT.md`.
3. Regenerate DB types if generation is part of the workflow.
4. Run migration locally.
5. Run relevant tests and `bun run build`.
6. Apply to staging before production.

## Seed Workflow

Seed data is required for:

- countries
- cities
- categories
- high-risk category flags
- initial OWNER staff account bootstrap
- optional demo/test data in non-production environments

Use `docs/SEED-DATA.md` as the source of truth for required reference data.

## Local Reset

Document or implement a safe local-only reset command. The reset flow should:

1. drop or clean local data
2. re-apply migrations
3. re-run required seeds
4. regenerate database types if needed

Never use production credentials for local reset workflows.

## Backup And Restore

- Supabase-managed backups should be enabled for staging/production.
- Before risky production migrations, verify the backup window and restore path.
- Production restore must be treated as an incident and coordinated with platform owner.

## Dangerous Operations

Treat these as high risk:

- destructive migration rollback
- manual edits to subscription or webhook tables
- deleting staff auth records
- bulk updating business statuses

When one of these is required, create an explicit operator note in the incident or release handoff.

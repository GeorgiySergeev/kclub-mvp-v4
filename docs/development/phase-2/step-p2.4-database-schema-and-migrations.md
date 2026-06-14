# Step P2.4 - Database Schema And Migrations

## Context To Read First

- `docs/SPEC.md` sections 6, 8, 9, 12
- `docs/BLUEPRINT.md` sections 4.4, 6
- P2.1 through P2.3 handoffs

## Goal

Create `packages/database` with the MVP schema, migrations, generated types path, seed plan, and integrity constraints.

## Non-Goals

- Do not connect production database credentials.
- Do not implement app services yet.
- Do not store secrets.

## Implementation Instructions

1. Create package `@kclub/database`.
2. Add migrations for core tables:
   - users
   - member_cards
   - vip_subscriptions
   - subscriptions
   - business_profiles
   - business_introductions
   - categories
   - countries
   - cities
   - admin_users
   - admin_2fa
   - admin_sessions
   - audit_logs
   - admin_config
   - stripe_webhook_events
3. Add constraints:
   - one active card per user
   - unique card number
   - business slug uniqueness
   - one active non-rejected business per user
   - webhook event id idempotency
4. Add indexes for common admin lists, public directory, webhooks, and audit queries.
5. Add reset behavior for featured flags when business leaves `PUBLISHED`, either as trigger or explicitly documented service transaction.
6. Add seed data plan for countries, cities, categories, and high-risk category flags.
7. Add generated DB types placeholder and command.

## Interfaces Or Contracts Touched

- Database schema and migration contract.
- Generated DB type contract consumed by app server code.

## Required Tests

- Migration validation command if available.
- Schema tests for constraints if local DB tooling exists.
- Unit tests for generated type exports if applicable.
- `bun run format`
- `bun run lint`
- `bun run typecheck`
- `bun run test`
- `bun run test:contracts`
- `bun run build`

## Acceptance Criteria

- MVP tables and constraints are represented in migrations.
- App server code can later import generated types.
- Schema supports all status models from `SPEC.md`.
- No direct admin-app DB write path is introduced.

## Regression Notes

Migration changes must be included with affected contracts and service tests. Never rely only on UI behavior for data integrity.

## Handoff Summary Format

```markdown
## P2.4 Handoff
- Tables/migrations:
- Constraints/indexes:
- Seed plan:
- Validation:
- Risks:
```

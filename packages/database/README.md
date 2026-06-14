# @kclub/database

Shared PostgreSQL schema, migrations, seed planning, and generated type entrypoints for KCLUB MVP v4.

## Scope

- Prisma schema for the MVP data model
- SQL migration history in `prisma/migrations`
- Generated Prisma client output path in `src/generated/client`
- Placeholder generated-type export contract in `src/generated/types.ts`
- Seed planning data for countries, cities, categories, high-risk flags, and admin bootstrap

## Commands

- `bun --filter @kclub/database db:format`
- `bun --filter @kclub/database db:validate`
- `bun --filter @kclub/database db:generate`
- `bun --filter @kclub/database db:migrate:dev`
- `bun --filter @kclub/database db:migrate:deploy`
- `bun --filter @kclub/database db:seed:plan`

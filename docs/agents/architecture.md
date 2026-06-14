# Architecture Agent Guide

Use this guide for monorepo structure, package boundaries, architecture docs, and ADR work.

## Required Context

- `docs/SPEC.md`
- `docs/BLUEPRINT.md`
- `docs/adr/README.md`
- root `AGENTS.md`

## Core Decisions

- KCLUB MVP v4 is a monorepo.
- Product-core owns business logic, product APIs, admin APIs, Stripe webhooks, cron, and DB writes.
- Admin-app owns staff UX and proxy/session shell, not product business rules.
- Shared packages hold stable contracts and pure reusable logic.

## Boundary Rules

- Put DTOs, API envelope, error codes, and permission constants in `packages/contracts`.
- Put schemas in `packages/validation`.
- Put pure state machines and policy checks in `packages/domain`.
- Keep server-only service code inside app server modules.
- Keep migrations and generated DB types in `packages/database`.
- Keep product workflows out of `packages/ui`.

## ADR Rules

Create or update an ADR when a decision:

- changes package boundaries
- changes auth/session model
- changes billing source of truth
- changes package manager/runtime assumptions
- changes deployment platform or database strategy
- introduces a new cross-cutting dependency

ADRs are append-only decision records. Do not rewrite history unless correcting factual errors; supersede with a new ADR when a decision changes.

## Architecture Handoff

Include:

- decision made
- files affected
- ADR created or updated
- boundary checks performed
- risks and follow-ups

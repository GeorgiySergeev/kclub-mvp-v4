# Documentation Index

This folder contains the launch documentation for KCLUB MVP v4.

## Product And Architecture

| Document                       | Purpose                                                   |
| ------------------------------ | --------------------------------------------------------- |
| [`SPEC.md`](SPEC.md)           | Product scope, flows, routes, statuses, permissions, APIs |
| [`BLUEPRINT.md`](BLUEPRINT.md) | Monorepo architecture, package boundaries, deploy model   |

## Delivery And Implementation

| Document                                         | Purpose                                                                                 |
| ------------------------------------------------ | --------------------------------------------------------------------------------------- |
| [`CODESTYLE.md`](CODESTYLE.md)                   | **Mandatory pre-coding read.** Naming conventions, patterns, TypeScript and React rules |
| [`development/README.md`](development/README.md) | Phase-by-phase implementation plan                                                      |
| [`agents/README.md`](agents/README.md)           | LLM agent rules and specialized task guides                                             |
| [`tasks/README.md`](tasks/README.md)             | Task handoff format for multi-session work                                              |
| [`TESTING.md`](TESTING.md)                       | Test strategy, commands, and gate policy                                                |
| [`API-REFERENCE.md`](API-REFERENCE.md)           | Compact API surface reference                                                           |
| [`DB-OPERATIONS.md`](DB-OPERATIONS.md)           | Migrations, seeds, reset, and backup/restore operations                                 |
| [`SEED-DATA.md`](SEED-DATA.md)                   | Required seed/reference data for local, staging, and production                         |

## Operations And Launch

| Document                                       | Purpose                                                |
| ---------------------------------------------- | ------------------------------------------------------ |
| [`ENVIRONMENT.md`](ENVIRONMENT.md)             | Environment variables and ownership                    |
| [`DEPLOYMENT.md`](DEPLOYMENT.md)               | Staging/production deployment procedure                |
| [`OBSERVABILITY.md`](OBSERVABILITY.md)         | Logging, health checks, monitoring, alert expectations |
| [`RUNBOOKS.md`](RUNBOOKS.md)                   | Failure and incident response procedures               |
| [`RELEASE-CHECKLIST.md`](RELEASE-CHECKLIST.md) | Final release gate checklist                           |

## Security, Support, And Content

| Document                                     | Purpose                                    |
| -------------------------------------------- | ------------------------------------------ |
| [`SECURITY.md`](SECURITY.md)                 | Security and privacy controls              |
| [`SUPPORT-PLAYBOOK.md`](SUPPORT-PLAYBOOK.md) | Day-to-day support and escalation guidance |
| [`COPY-I18N.md`](COPY-I18N.md)               | UI copy and localization rules             |
| [`LEGAL-CONTENT.md`](LEGAL-CONTENT.md)       | Legal page inventory and ownership         |

## Source Of Truth Rules

- `SPEC.md` wins on product behavior.
- `BLUEPRINT.md` wins on technical boundaries and repository shape.
- `CODESTYLE.md` wins on all code style, naming, and structural pattern decisions.
- `adr/` records accepted architecture decisions and supersedes older architecture discussion.
- Root `../AGENTS.md` defines the required operating rules for LLM agents.
- Operational docs must align with both and be updated when implementation changes.
- If docs disagree, resolve the conflict before launch.

# Agent Guides

These guides give LLM agents scoped rules for common work areas. Start with root `AGENTS.md`, then read the guide that matches the task.

| Guide | Use For |
| --- | --- |
| [`architecture.md`](architecture.md) | package boundaries, monorepo structure, ADR decisions |
| [`testing.md`](testing.md) | test selection, regression gates, failure reporting |
| [`api.md`](api.md) | API contracts, DTOs, validation, response envelope |
| [`auth.md`](auth.md) | member auth, staff auth, TOTP, route/session gating |
| [`billing.md`](billing.md) | Stripe checkout, webhooks, subscription state, cron |
| [`context.md`](context.md) | context gathering, handoff, doc priority, task summaries |

## Common Rule

Never begin from the task prompt alone. Read the source-of-truth docs, inspect live files, then implement.

# Agent Guides

These guides give LLM agents scoped rules for common work areas.

## Mandatory Pre-Coding Checklist

Before writing any code, an agent MUST have read:

1. Root `AGENTS.md` — entry point, workflow, and source-of-truth priority.
2. **`docs/CODESTYLE.md` — naming conventions, TypeScript rules, React/Next.js patterns, service layer, API handler pattern, error handling, and 9 hard prohibitions for AI agents. This is not optional.**
3. **`docs/DESIGN-SYSTEM.md` — color palette, typography, spacing, component library reference, dark mode rules, icon library, layout patterns, and 11 hard prohibitions for UI code. Required for any task that touches components, pages, or styles.**
4. The guide below that matches the current task.

Do not skip steps 2 or 3. If either document was not read in the current session, read it before producing any code output.

## Specialized Task Guides

| Guide                                | Use For                                                  |
| ------------------------------------ | -------------------------------------------------------- |
| [`architecture.md`](architecture.md) | Package boundaries, monorepo structure, ADR decisions    |
| [`testing.md`](testing.md)           | Test selection, regression gates, failure reporting      |
| [`api.md`](api.md)                   | API contracts, DTOs, validation, response envelope       |
| [`auth.md`](auth.md)                 | Member auth, staff auth, TOTP, route/session gating      |
| [`billing.md`](billing.md)           | Stripe checkout, webhooks, subscription state, cron      |
| [`context.md`](context.md)           | Context gathering, handoff, doc priority, task summaries |

## Common Rule

Never begin from the task prompt alone. Read the source-of-truth docs, inspect live files, then implement.

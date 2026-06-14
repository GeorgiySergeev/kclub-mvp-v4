# Task Handoffs

Use this folder for task-specific notes that need to survive between LLM sessions.

## When To Create A Task File

Create `docs/tasks/<task>.md` when:

- work spans more than one session
- a phase step discovers a blocker
- an implementation decision needs short-lived tracking
- QA or release follow-up needs an owner

Do not use task files as permanent architecture docs. Convert permanent decisions into ADRs.

## Naming

Use lowercase kebab-case:

```text
docs/tasks/p3-member-auth-onboarding.md
docs/tasks/stripe-webhook-replay-risk.md
```

## Template

Use [`TEMPLATE.md`](TEMPLATE.md).

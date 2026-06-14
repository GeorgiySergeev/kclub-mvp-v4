# Agent Context Rules

Use this guide whenever a task spans multiple files, phases, or prior decisions.

## Context Pass

Start by collecting only the context needed for the task:

1. Read root `AGENTS.md`.
2. Read `docs/SPEC.md` and `docs/BLUEPRINT.md` sections relevant to the task.
3. Read any matching ADR in `docs/adr/`.
4. Read the active `docs/development/phase-*/step-*.md` prompt if applicable.
5. Inspect live files under the affected app/package.

Use `rg` or `rg --files` for searches.

## Avoid Context Drift

- Do not rely on stale summaries when live files are available.
- Do not assume Phase prompts are already implemented.
- Do not treat docs as implementation proof. Verify code.
- Do not rewrite unrelated docs while fixing one area.

## Conflict Handling

If docs disagree:

- Product behavior conflict: prefer `SPEC.md`.
- Architecture boundary conflict: prefer `BLUEPRINT.md` and ADRs.
- Operational command conflict: prefer the implemented scripts in `package.json`, then update docs if stale.
- Security or billing conflict: pause and document the issue before making a risky change.

## Handoff Requirements

At the end of a task, include:

- what was changed
- what was verified
- what was not verified
- assumptions used
- follow-up risks

If the task is phase-driven, update or create the phase summary requested by the step prompt.

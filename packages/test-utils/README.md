# @kclub/test-utils

Shared factories, fixtures, and contract assertions for tests across KCLUB MVP v4.

## Included helpers

- Deterministic factories for member and staff users, cards, subscriptions, businesses, introductions, and Stripe webhook payloads.
- Contract assertions for API envelopes, DTO boundary checks, and error-code membership.
- Permission matrix fixtures derived from shared contract and domain packages.

## Scripts

```bash
bun --filter @kclub/test-utils test
bun --filter @kclub/test-utils lint
bun --filter @kclub/test-utils typecheck
bun --filter @kclub/test-utils build
```

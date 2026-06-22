# Plan: P7.3 — Observability and Operational Runbooks

## Context

The MVP needs production-grade observability before launch. Most of the foundation already exists (Pino structured logger, request IDs, log redaction, AppError, admin guard logging, health route on product-core, all 6 runbooks). This step fills the remaining gaps: two silent error paths in high-risk routes, a stub health route in admin-app, and a monitoring configuration reference section in OBSERVABILITY.md.

## What Already Exists (do not re-implement)

- Pino logger with domain methods (`log.webhook()`, `log.cron()`, `log.auth()`, `log.admin()`) — `apps/product-core/src/server/logger/`
- `safeErrorForLog()` and `redactSensitiveFields()` exported from `@/server/logger`
- Request ID middleware — `apps/product-core/src/middleware.ts`
- All 6 runbooks — `docs/runbooks/`
- `docs/OBSERVABILITY.md` with logging/correlation/health guidance
- Unit tests for redact helpers — `apps/product-core/tests/server/logger/redact.test.ts`
- Health route smoke test — `apps/product-core/tests/server/health-route.test.ts`

## Changes Required

### 1. Webhook route — add structured logging

**File:** `apps/product-core/src/app/api/stripe/webhook/route.ts`

Add `import { createLogger, safeErrorForLog } from '@/server/logger';` and a module-level `const log = createLogger();`.

- After successful `processStripeEvent`: `log.webhook('Stripe event processed', { eventId: event.id, eventType: event.type })`
- Replace bare `catch {}` with `catch (error)` and before the 500 return: `log.error('Stripe event processing failed', { domain: 'webhook', eventId: event.id, eventType: event.type, error })`
  - Use `log.error()` (not `log.webhook()`) so the `error` key is processed by `logError()` which calls `safeErrorForLog` automatically
- On signature validation failure (second `catch {}`): `log.webhook('Stripe signature validation failed', { signatureTruncated: signature?.slice(0, 16) ?? null })`

### 2. Cron route — add structured logging

**File:** `apps/product-core/src/app/api/cron/daily-maintenance/route.ts`

Add `import { createLogger, safeErrorForLog } from '@/server/logger';` and `const log = createLogger();`.

- Before `runDailyMaintenance()` call: `log.cron('Daily maintenance started')`
- After success: `log.cron('Daily maintenance completed', { expiredCards: result.expiredCards, expiredSubscriptions: result.expiredSubscriptions, hiddenBusinesses: result.hiddenBusinesses, cleanedEvents: result.cleanedEvents })`
- Replace bare `catch {}` with `catch (error)` and before the error return: `log.error('Daily maintenance failed', { domain: 'cron', error })`

### 3. Admin-app health route — real backend check

**File:** `apps/admin-app/src/app/api/health/route.ts`

Replace stub with a function that fetches `${PRODUCT_CORE_API_BASE_URL}/api/health` with a 3-second timeout, parses `body.data.status`, and returns `backend: 'ok' | 'degraded' | 'unreachable'`.

```typescript
import { NextResponse } from 'next/server';

async function checkBackend(): Promise<'ok' | 'degraded' | 'unreachable'> {
  const baseUrl =
    process.env.PRODUCT_CORE_API_BASE_URL ??
    process.env.PRODUCT_CORE_ADMIN_API_URL ??
    'http://localhost:3000';
  try {
    const res = await fetch(`${baseUrl}/api/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return 'degraded';
    const body = await res.json();
    return body?.data?.status === 'ok' ? 'ok' : 'degraded';
  } catch {
    return 'unreachable';
  }
}

export async function GET() {
  const backend = await checkBackend();
  return NextResponse.json({
    status: backend === 'ok' ? 'ok' : 'degraded',
    app: 'admin-app',
    dependencies: { backend },
  });
}
```

The env var fallback chain `PRODUCT_CORE_API_BASE_URL ?? PRODUCT_CORE_ADMIN_API_URL ?? 'http://localhost:3000'` matches the pattern used by `admin-client.ts`, `profile.ts`, and `actions.ts`.

### 4. OBSERVABILITY.md — monitoring/alert placeholder section

**File:** `docs/OBSERVABILITY.md`

Append a new `## Production Monitoring Configuration (Placeholders)` section covering:

- Environment variables table (`LOG_LEVEL`, `CRON_SECRET`, `STRIPE_WEBHOOK_SECRET`)
- Vercel log drain filter fields (`domain`, `level`, `data.eventId`, `data.requestId`)
- Alert threshold stubs (high/medium/low priority, not yet active)
- Health check URL table for both apps

### 5. Webhook route test — error logging coverage

**File:** `apps/product-core/tests/server/webhook-route.test.ts`

The existing test only covers 400 paths (missing/invalid signature). Add a new `describe` block that:

- Mocks `@/server/logger` to capture `mockLogError` and `mockLogWebhook` spies
- Mocks `@/server/services/webhook-service` with a `mockProcessStripeEvent` that can be toggled to throw
- Tests: when `processStripeEvent` throws → `response.status === 500` and `mockLogError` was called with `{ eventId, eventType, domain: 'webhook' }`
- Tests: when `processStripeEvent` succeeds → `response.status === 200` and `mockLogWebhook` was called with `{ eventId, eventType }`

All `mock.module()` calls must be placed at file scope before the route `await import(...)`, matching the existing pattern in the file.

## Reusable Functions to Reference

- `createLogger()` — `apps/product-core/src/server/logger/logger.ts:80`
- `safeErrorForLog()` — `apps/product-core/src/server/logger/redact.ts` (exported via `@/server/logger`)
- `logError` (internal) — processes `data.error` key via `safeErrorForLog` automatically when using `log.error()`
- `log.webhook()` / `log.cron()` — `logWithDomain` at `'info'` level, adds `domain` field to structured log

## Verification

```
bun run format
bun run lint
bun run typecheck
bun run test
bun run build
```

Manual checks:

- `GET /api/health` on product-core returns `{ data: { status, app: 'product-core', dependencies: { database } } }`
- `GET /api/health` on admin-app returns `{ status, app: 'admin-app', dependencies: { backend } }` where `backend` is `'ok'` when product-core is up

## Handoff Summary (to fill after implementation)

```markdown
## P7.3 Handoff

- Logging added: webhook route (success + error), cron route (start + success + error)
- Runbooks: all 6 pre-existing, unchanged
- Health checks: product-core (DB), admin-app (backend reachability)
- Tests: webhook-route.test.ts extended with error logging coverage
```

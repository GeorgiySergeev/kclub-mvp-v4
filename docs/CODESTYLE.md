# KCLUB MVP v4 — Code Style Guide

| Field            | Value      |
| ---------------- | ---------- |
| Document version | `1.0.0`    |
| Status           | Active     |
| Last updated     | 2026-06-19 |

## Purpose

This document defines mandatory code style, naming conventions, and structural patterns for the KCLUB MVP v4 codebase. All contributors — human and AI agents — must follow these rules without exception. Consistency prevents divergence when multiple agents work on the same project across sessions.

When in doubt: **follow this document first**, then `BLUEPRINT.md`, then `SPEC.md`.

---

## 1. Naming Conventions

### 1.1 General Rules

| Entity                          | Style                          | Example                                    |
| ------------------------------- | ------------------------------ | ------------------------------------------ |
| Variables                       | `camelCase`                    | `userId`, `cardStatus`, `isActive`         |
| Function parameters             | `camelCase`                    | `memberId`, `rawPayload`                   |
| Functions and methods           | `camelCase`                    | `getCardStatus()`, `issueCard()`           |
| React components                | `PascalCase`                   | `MemberCard`, `BusinessForm`               |
| TypeScript types and interfaces | `PascalCase`                   | `MemberDto`, `ApiResponse<T>`              |
| Zod schemas                     | `PascalCase` + `Schema` suffix | `SubmitBusinessSchema`, `OnboardingSchema` |
| Enum-like `as const` objects    | `SCREAMING_SNAKE_CASE` values  | `UNDER_REVIEW`, `PAST_DUE`                 |
| Module-level constants          | `SCREAMING_SNAKE_CASE`         | `MAX_FEATURED_COUNT`, `SESSION_TTL_HOURS`  |
| CSS/Tailwind class variables    | `camelCase`                    | `buttonVariants`                           |

### 1.2 File Naming

| File type             | Convention                        | Example                                      |
| --------------------- | --------------------------------- | -------------------------------------------- |
| React component file  | `kebab-case.tsx`                  | `member-card.tsx`, `business-form.tsx`       |
| Utility / helper file | `kebab-case.ts`                   | `format-date.ts`, `build-slug.ts`            |
| Service file          | `kebab-case-service.ts`           | `card-service.ts`, `business-service.ts`     |
| Hook file             | `use-kebab-case.ts`               | `use-card-status.ts`, `use-business-form.ts` |
| Test file             | `*.test.ts` or `*.spec.ts`        | `card-service.test.ts`                       |
| Route handler         | `route.ts` (Next.js convention)   | `app/api/v1/cards/route.ts`                  |
| Page component        | `page.tsx` (Next.js convention)   | `app/[locale]/(member)/dashboard/page.tsx`   |
| Layout component      | `layout.tsx` (Next.js convention) | `app/[locale]/layout.tsx`                    |

### 1.3 Service Method Naming

Service methods must follow the **verb + noun** pattern. Use the specific verbs below:

| Operation           | Verb                 | Example                                                                                                |
| ------------------- | -------------------- | ------------------------------------------------------------------------------------------------------ |
| Create a new entity | `create`             | `createUser()`, `createCard()`                                                                         |
| Retrieve one entity | `get`                | `getUser()`, `getCard()`                                                                               |
| Retrieve a list     | `list`               | `listBusinesses()`, `listCards()`                                                                      |
| Update fields       | `update`             | `updateProfile()`, `updateBusiness()`                                                                  |
| Delete permanently  | `delete`             | `deleteCategory()`                                                                                     |
| State transition    | domain verb          | `issueCard()`, `approveBusinessProfile()`, `cancelSubscription()`, `publishBusiness()`, `revokeCard()` |
| Check a condition   | `is` / `can` / `has` | `isOnboardingComplete()`, `canSubmitBusiness()`                                                        |

Never name service methods `handle`, `process`, `do`, `execute`, or similar vague verbs.

### 1.4 Variable Naming

- Boolean variables must start with `is`, `has`, `can`, or `should`: `isBlocked`, `hasVip`, `canIntroduce`.
- ID variables: always suffix with `Id`: `userId`, `cardId`, `businessId`.
- Avoid single-letter variables except in very short array callbacks: `users.map(u => u.id)` is acceptable, but not in function bodies.
- Avoid abbreviations unless they are industry-standard (`dto`, `id`, `url`, `otp`, `ttl`, `rbac`).

---

## 2. TypeScript Rules

### 2.1 Type Safety

- **No `any`**. Use `unknown` with a type guard if the type is genuinely unknown.
- **No type assertions (`as SomeType`)** unless you have verified the shape and added a comment explaining why.
- **Always declare return types** for exported functions and all service methods.
- **Use `satisfies`** instead of `as` when checking object literals match a type.

```ts
// ✅ Good
export async function getCard(cardId: string): Promise<CardDto> { ... }

// ❌ Bad — missing return type
export async function getCard(cardId: string) { ... }

// ✅ Good
const config = { maxFeatured: 3 } satisfies AdminConfig

// ❌ Bad — assertion hides type errors
const config = { maxFeatured: 3 } as AdminConfig
```

### 2.2 Interfaces vs Types

- Use `type` for DTOs, API shapes, and union types.
- Use `interface` for objects that may be extended (e.g., service contracts, repository interfaces).
- Do not mix them arbitrarily — pick one and be consistent within a file.

### 2.3 Enums

Do **not** use TypeScript `enum`. Use `as const` objects instead:

```ts
// ✅ Good — in @kclub/contracts or @kclub/domain
export const BusinessStatus = {
  UNDER_REVIEW: 'UNDER_REVIEW',
  APPROVED: 'APPROVED',
  PUBLISHED: 'PUBLISHED',
  REJECTED: 'REJECTED',
  HIDDEN: 'HIDDEN',
} as const

export type BusinessStatus = (typeof BusinessStatus)[keyof typeof BusinessStatus]

// ❌ Bad
enum BusinessStatus { UNDER_REVIEW, APPROVED, ... }
```

### 2.4 Imports

- Import order: external packages → internal packages (`@kclub/*`) → app-local imports.
- Use absolute imports via TypeScript path aliases, not `../../../` relative chains.
- Never import from `@kclub/database` in shared domain or validation packages.
- Never import from `@kclub/ui` in server-only files.

```ts
// ✅ Correct import order
import { z } from 'zod';
import type { BusinessDto } from '@kclub/contracts';
import { BusinessStatus } from '@kclub/domain';
import { businessService } from '@/server/services/business-service';
```

---

## 3. React and Next.js Patterns

### 3.1 Server vs Client Components

- **Server Component by default**. Add `'use client'` only when the component needs browser APIs, React state, or event handlers.
- Never fetch data inside a Client Component. Data fetching belongs in Server Components, server actions, or route handlers.
- Pass data down via props from Server to Client, not the other way around.

### 3.2 Component Structure

Every component file follows this order:

1. `'use client'` directive (if needed)
2. Imports
3. Props type definition
4. Component function
5. Helper sub-components (if small and only used here)

```tsx
// ✅ Correct structure
'use client';

import { useState } from 'react';
import type { BusinessDto } from '@kclub/contracts';

type BusinessCardProps = {
  business: BusinessDto;
  onApprove: (id: string) => void;
};

export function BusinessCard({ business, onApprove }: BusinessCardProps) {
  const [loading, setLoading] = useState(false);
  // ...
}
```

- Props type must be defined as `type ComponentNameProps = { ... }` directly above the component.
- Do not use `React.FC` or `React.FunctionComponent` — just declare the function directly.
- Export components as **named exports**, not default exports (except Next.js required `page.tsx`, `layout.tsx`, `route.ts`).

### 3.3 Hooks

- All custom hooks live in `features/<feature>/hooks/` or `features/<feature>/use-<name>.ts`.
- Hook names must start with `use`: `useCardStatus`, `useBusinessForm`.
- Hooks must not contain business logic — they orchestrate state and call services/actions.

### 3.4 Features Directory

Each feature owns its own slice:

```
features/
  business/
    components/     ← UI pieces specific to this feature
    hooks/          ← custom hooks
    actions.ts      ← server actions
    types.ts        ← local feature-only types (not shared contracts)
```

Do not put cross-feature logic in a feature folder. Cross-feature logic belongs in shared packages or services.

---

## 4. API Route Handler Pattern

Every route handler must follow this exact sequence:

1. Parse and validate request body/params with a Zod schema from `@kclub/validation`.
2. Resolve and verify the session/actor.
3. Check permissions using `@kclub/domain`.
4. Call the app service.
5. Return the response using the shared `ApiResponse<T>` envelope from `@kclub/contracts`.

```ts
// ✅ Canonical route handler
import { SubmitBusinessSchema } from '@kclub/validation';
import { canSubmitBusiness } from '@kclub/domain';
import { businessService } from '@/server/services/business-service';
import { apiSuccess, apiError } from '@/server/api/response';
import { getSession } from '@/server/auth/session';

export async function POST(req: Request): Promise<Response> {
  const session = await getSession();
  if (!session) return apiError('UNAUTHORIZED', 'Not authenticated');

  const body = await req.json();
  const parsed = SubmitBusinessSchema.safeParse(body);
  if (!parsed.success) return apiError('VALIDATION_ERROR', parsed.error.flatten());

  if (!canSubmitBusiness(session.member)) {
    return apiError('FORBIDDEN', 'VIP subscription required');
  }

  const result = await businessService.submitBusiness(session.member.id, parsed.data);
  return apiSuccess(result);
}
```

- Never put business logic in route handlers — delegate entirely to services.
- Never catch and swallow errors silently. Always return a structured error response.
- Always type the return as `Promise<Response>`.

---

## 5. Service Layer Pattern

Service methods live in `apps/product-core/src/server/services/`. The canonical 7-step flow (from BLUEPRINT.md) is mandatory:

1. Load current actor/session.
2. Validate permissions with `@kclub/domain`.
3. Validate payload with `@kclub/validation`.
4. Run DB transaction if state changes.
5. Call Stripe/email only from app server code.
6. Write audit log for state-changing admin or billing actions.
7. Map DB rows to `@kclub/contracts` DTOs.

Additional rules:

- **Services never return raw DB rows** — always map to a DTO from `@kclub/contracts`.
- **Services never throw HTTP errors** — throw typed domain errors; let the route handler convert them.
- **Services are the only layer** that writes to the database. Route handlers and domain packages must not write directly.
- One service file per domain entity: `card-service.ts`, `business-service.ts`, `subscription-service.ts`.

---

## 6. Domain Package Pattern (`@kclub/domain`)

- **Pure TypeScript only** — no DB, no HTTP, no Stripe, no Supabase, no file system.
- Every policy function receives plain data objects, not DB models.
- Policy functions return `boolean` or a typed result object — they never throw.
- State transition functions must be tested with unit tests covering all legal and illegal transitions.

```ts
// ✅ Correct domain function
export function canTransitionBusiness(
  current: BusinessStatus,
  next: BusinessStatus,
  actor: StaffRole,
): boolean { ... }

// ❌ Wrong — has a side effect
export async function approveBusinessProfile(id: string) {
  await db.update(...) // NEVER in domain package
}
```

---

## 7. Validation Package Pattern (`@kclub/validation`)

- Use **Zod only** — no manual `if (typeof x === ...)` chains for input validation.
- Every schema file name matches the form/flow it validates: `business.ts`, `onboarding.ts`, `staff-auth.ts`.
- Schemas must be **app-agnostic** — no Next.js, no Supabase, no Stripe imports.
- Reusable validators (phone, URL, locale, pagination) live in a shared `common.ts` file.
- Schema names end in `Schema`: `SubmitBusinessSchema`, `OnboardingSchema`.

```ts
// ✅ Good
export const SubmitBusinessSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: PhoneSchema,
  categoryId: UuidSchema,
});

export type SubmitBusinessInput = z.infer<typeof SubmitBusinessSchema>;
```

---

## 8. Database Access Rules

- **Generated types** come from `@kclub/database` — never write manual DB type definitions.
- **DB client** lives only in app server code (`apps/product-core/src/server/db/`). Never in packages.
- Use **transactions** for any operation that writes to more than one table.
- Never read from the DB inside a domain package or validation package.
- Column names in queries use `snake_case` (Postgres convention). Map to `camelCase` in DTOs.

```ts
// ✅ Mapping DB row → DTO
function mapToCardDto(row: CardRow): CardDto {
  return {
    id: row.id,
    cardNumber: row.card_number,
    status: row.status as CardStatus,
    issuedAt: row.issued_at,
  };
}
```

---

## 9. Error Handling

- **All error codes** come from `@kclub/contracts/errors`. Never use inline string error codes.
- Services throw typed domain errors; route handlers catch them and convert to `ApiResponse`.
- Do not use `console.error` in production code paths — use the project logger.
- Never expose raw DB errors or stack traces in API responses.

```ts
// ✅ Good
throw new DomainError('CARD_NOT_FOUND', `Card ${cardId} does not exist`);

// ❌ Bad — inline string error code
throw new Error('card_not_found');
```

---

## 10. Testing Conventions

- Test **behaviour, not implementation**: `it('should deny card issue if user is blocked')`.
- Use **factories from `@kclub/test-utils`** — do not construct domain objects by hand in tests.
- Group tests with `describe` matching the module name or feature flow.
- Every new DTO field or error code must have a corresponding contract test.
- Unit tests for `@kclub/domain` must cover every legal state transition and every denial path.

```ts
// ✅ Good test description
describe('card-service', () => {
  it('should issue a card when onboarding is complete');
  it('should throw CARD_ALREADY_EXISTS if user has an active card');
  it('should deny issuance if user is blocked');
});

// ❌ Bad — tests implementation detail
describe('card-service', () => {
  it('should call db.insert once');
});
```

---

## 11. Comments and Documentation

- **Do not comment obvious code**. Comments explain _why_, not _what_.
- Public functions in shared packages (`@kclub/contracts`, `@kclub/domain`, `@kclub/validation`) must have a JSDoc comment.
- Complex business rules inline in code must reference the relevant section in `SPEC.md`.

```ts
// ✅ Good comment — explains business rule source
// SPEC.md §11: max 10 introductions per day per caller
if (todayCount >= MAX_DAILY_INTRODUCTIONS) {
  throw new DomainError('INTRODUCTION_DAILY_LIMIT_EXCEEDED')
}

// ❌ Bad — restates the code
// Check if count is greater than or equal to max
if (todayCount >= MAX_DAILY_INTRODUCTIONS) { ... }
```

---

## 12. What AI Agents Must Not Do

These rules specifically prevent common AI code generation mistakes:

- Do not create new DTO types inline in app code — use or extend types from `@kclub/contracts`.
- Do not add `eslint-disable` comments without a justification comment on the same line.
- Do not use `setTimeout` or arbitrary delays for async coordination — use proper async/await.
- Do not add `TODO` comments without a GitHub issue reference: `// TODO(#42): handle edge case`.
- Do not change the shared `ApiResponse<T>` envelope shape — it is a contract.
- Do not add new Stripe calls outside of `apps/product-core/src/server/stripe/`.
- Do not write directly to the DB from admin-app — all state mutations go through product-core admin API.
- Do not install packages without checking if a workspace package (`@kclub/*`) already provides the functionality.
- Do not rename existing exported symbols in shared packages without a migration plan and ADR.

---

## 13. Prettier and ESLint

Formatting and linting configs live in `packages/config/`. Do not override them per-file.

Required commands before any commit:

```bash
bun run lint       # ESLint via Turbo
bun run typecheck  # TypeScript via Turbo
```

Prettier runs automatically via pre-commit hook or CI. Do not manually reformat files selectively.

---

## Changelog

| Version | Date       | Summary                             |
| ------- | ---------- | ----------------------------------- |
| `1.0.0` | 2026-06-19 | Initial code style guide for MVP v4 |

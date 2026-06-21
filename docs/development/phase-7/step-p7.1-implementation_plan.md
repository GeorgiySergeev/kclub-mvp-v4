# P7.1 — E2E Critical Paths

Implement end-to-end test coverage for all MVP release-critical journeys across `product-core` and `admin-app` using Playwright, with mocked OTP, Stripe, and deterministic test data.

## User Review Required

> [!IMPORTANT]
> **New dependency**: This step adds `@playwright/test` as a dev dependency at the workspace root. No existing E2E framework is installed.

> [!IMPORTANT]
> **Provider mocking strategy**: All E2E tests will mock Supabase OTP and Stripe webhooks at the API route level (intercepting HTTP via Playwright `page.route()` and test API endpoints) — no live SMS or Stripe calls in CI. This means tests validate the full browser→server round-trip but bypass real external providers.

> [!WARNING]
> **Phase 6 summary is not populated** — phase-summary.md is still a template. The step assumes Phase 6 admin features (staff auth, TOTP, dashboard pages, business moderation, introductions, taxonomy) are implemented. If any Phase 6 features are incomplete, some E2E tests will fail or need to be `test.skip`'d until the feature is ready.

## Open Questions

> [!IMPORTANT]
> **1. Supabase Auth mocking approach**: The current `member-auth-service.ts` calls Supabase directly for OTP. For E2E, I plan to:
>
> - Create a `/api/v1/test/seed` API route (guarded by `E2E_TEST_SECRET` env var, disabled in production) that can create sessions and seed test users directly.
> - Alternatively, intercept Supabase OTP requests via Playwright's `page.route()`.
>
> **Recommendation**: Seed API route approach — it's more reliable and doesn't depend on Supabase API shape. Do you agree?

> [!IMPORTANT]
> **2. Playwright project scope**: Should E2E tests run against both `product-core` (:3000) and `admin-app` (:3001) as separate Playwright projects in a single config, or do you prefer separate E2E suites per app?
>
> **Recommendation**: Single `playwright.config.ts` at workspace root with two projects: `product-core` and `admin-app`. This keeps cross-app journeys (business submit → admin approve → public directory) testable end-to-end.

> [!IMPORTANT]
> **3. Test database strategy**: E2E tests need deterministic data. Options:
>
> - **(a)** Run against a local/test Supabase instance with seed data, reset between test suites.
> - **(b)** Run against mocked API responses (no real DB) — pure UI smoke tests.
>
> **Recommendation**: Option (a) with a test seed/teardown helper for full stack coverage. However if no local Supabase is configured, we fall back to (b) with API mocks.

---

## Proposed Changes

### Root — Playwright Setup

#### [NEW] [playwright.config.ts](file:///g:/KYLYVNYK%20CLUB/kclub-mvp-v4/playwright.config.ts)

Root-level Playwright configuration with:

- Two projects: `product-core` (port 3000) and `admin-app` (port 3001)
- `webServer` entries for both apps using `bun run dev` (reuse existing server outside CI)
- Reporter: HTML + list (CI-friendly)
- `testDir`: `e2e/`
- Traces, screenshots, videos on first retry for debugging
- `retries: 1` in CI for flake mitigation

#### [MODIFY] [package.json](file:///g:/KYLYVNYK%20CLUB/kclub-mvp-v4/package.json)

- Add `@playwright/test` to root `devDependencies`
- Add `"e2e"` and `"e2e:ui"` scripts:
  ```json
  "e2e": "playwright test",
  "e2e:ui": "playwright test --ui"
  ```

#### [MODIFY] [turbo.json](file:///g:/KYLYVNYK%20CLUB/kclub-mvp-v4/turbo.json)

- Add `"e2e"` task (not cached, depends on build):
  ```json
  "e2e": {
    "dependsOn": ["build"],
    "cache": false
  }
  ```

#### [MODIFY] [.gitignore](file:///g:/KYLYVNYK%20CLUB/kclub-mvp-v4/.gitignore)

- Add Playwright artifacts: `test-results/`, `playwright-report/`, `blob-report/`, `playwright/.cache/`

---

### E2E Infrastructure — `e2e/`

#### [NEW] `e2e/` directory structure

```
e2e/
  fixtures/
    base.ts              ← Extended test with custom fixtures (auth, locale, seed)
    auth.fixture.ts      ← Authenticated member session fixture
    admin-auth.fixture.ts ← Authenticated staff session fixture
  helpers/
    seed.ts              ← Test data seeding via API or DB
    mock-otp.ts          ← OTP interception helpers
    mock-stripe.ts       ← Stripe webhook simulation helpers
    selectors.ts         ← Shared selectors / test IDs
    wait-for.ts          ← Custom wait utilities
  page-objects/
    home.page.ts         ← Public home page POM
    directory.page.ts    ← Directory listing / detail POM
    card-verify.page.ts  ← Card verification POM
    sign-up.page.ts      ← Member sign-up POM
    sign-in.page.ts      ← Member sign-in POM
    onboarding.page.ts   ← Onboarding POM
    dashboard.page.ts    ← Member dashboard POM
    my-business.page.ts  ← Business submission POM
    introduce.page.ts    ← Business introduction POM
    admin-sign-in.page.ts ← Staff sign-in POM
    admin-dashboard.page.ts ← Admin dashboard POM
    admin-businesses.page.ts ← Admin business moderation POM
    admin-introductions.page.ts ← Admin introduction review POM
  specs/
    public-visitor.spec.ts  ← Test suite #2: Home, directory, business detail, card verification
    member-journey.spec.ts  ← Test suite #3: Sign-up (mocked OTP), onboarding, card display, dashboard tabs
    billing-flow.spec.ts    ← Test suite #4: VIP checkout start, mocked webhook, subscription tab
    business-lifecycle.spec.ts ← Test suite #5: Submit → approve → placement checkout → webhook → directory
    introduction-flow.spec.ts  ← Test suite #6: VIP business member submits intro, staff reviews
    staff-auth.spec.ts      ← Test suite #7: Phone OTP, TOTP, route gating
```

---

### E2E Spec Details

#### [NEW] `e2e/specs/public-visitor.spec.ts`

| Test case                                | Description                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------- |
| `home page renders`                      | Navigate to `/{locale}`, verify hero content, nav, footer               |
| `directory lists published businesses`   | Navigate to `/{locale}/directory`, verify business cards render         |
| `business detail page renders`           | Click a business card → verify detail page with name, category, contact |
| `card verification shows valid card`     | Navigate to `/{locale}/verify-card/{cardNumber}`, verify status shown   |
| `card verification handles invalid card` | Navigate with bad card number, verify appropriate error                 |

#### [NEW] `e2e/specs/member-journey.spec.ts`

| Test case                   | Description                                                                 |
| --------------------------- | --------------------------------------------------------------------------- |
| `sign-up with phone OTP`    | Fill phone, intercept OTP API, submit code, verify redirect to onboarding   |
| `onboarding flow`           | Fill display name, select locale, accept terms, submit → verify card issued |
| `card display on dashboard` | After onboarding, verify card tab shows card number and QR                  |
| `dashboard tabs render`     | Verify card/catalog/subscription/profile tabs present for MEMBER tier       |
| `hidden tabs for MEMBER`    | Verify business/introductions tabs NOT visible for MEMBER tier              |

#### [NEW] `e2e/specs/billing-flow.spec.ts`

| Test case                       | Description                                                                             |
| ------------------------------- | --------------------------------------------------------------------------------------- |
| `VIP checkout starts`           | On subscription tab, click upgrade → verify redirect to Stripe Checkout (mocked)        |
| `webhook confirms subscription` | POST mocked `checkout.session.completed` webhook → verify subscription tab shows ACTIVE |
| `subscription tab reflects VIP` | After webhook, member reloads → sees VIP tier, business tab appears                     |

#### [NEW] `e2e/specs/business-lifecycle.spec.ts`

| Test case                         | Description                                                                  |
| --------------------------------- | ---------------------------------------------------------------------------- |
| `VIP submits business profile`    | Fill business form, submit → verify UNDER_REVIEW status                      |
| `staff approves business`         | Admin navigates to businesses queue → approves → verify APPROVED             |
| `placement checkout starts`       | Owner starts placement checkout → verify redirect (mocked Stripe)            |
| `webhook publishes business`      | POST mocked `checkout.session.completed` → business transitions to PUBLISHED |
| `public directory shows business` | Navigate to public directory → verify newly published business visible       |

#### [NEW] `e2e/specs/introduction-flow.spec.ts`

| Test case                                  | Description                                                      |
| ------------------------------------------ | ---------------------------------------------------------------- |
| `VIP business member submits introduction` | Navigate to `/m/introduce`, fill form, submit → verify SUBMITTED |
| `staff reviews introduction`               | Admin reviews in introductions queue → approve or reject         |

#### [NEW] `e2e/specs/staff-auth.spec.ts`

| Test case                   | Description                                                           |
| --------------------------- | --------------------------------------------------------------------- |
| `staff sign-in with OTP`    | Fill phone, intercept OTP, submit → verify 2FA required screen        |
| `TOTP verification`         | Enter TOTP code (mocked) → verify dashboard access                    |
| `route gating without 2FA`  | Attempt dashboard access without TOTP → verify redirect to 2FA screen |
| `route gating without auth` | Attempt dashboard access unauthenticated → verify redirect to sign-in |

---

### Test API Routes (product-core)

#### [NEW] `apps/product-core/src/app/api/v1/test/seed/route.ts`

- Guarded by `process.env.E2E_TEST_SECRET` — returns 404 if not set
- `POST /api/v1/test/seed` — accepts a seed scenario descriptor, creates test users/businesses/cards in DB
- Used by E2E fixtures for deterministic data setup

#### [NEW] `apps/product-core/src/app/api/v1/test/teardown/route.ts`

- Guarded by `process.env.E2E_TEST_SECRET`
- `POST /api/v1/test/teardown` — cleans up test-created data
- Used in `afterAll` / `afterEach` hooks

---

### CI Integration

#### [MODIFY] [ci.yml](file:///g:/KYLYVNYK%20CLUB/kclub-mvp-v4/.github/workflows/ci.yml)

- Add E2E job after build:
  - Install Playwright browsers
  - Start product-core and admin-app via `bun run build && bun run start`
  - Run `bun run e2e`
  - Upload `playwright-report/` and `test-results/` as artifacts on failure

---

### Environment

#### [MODIFY] `apps/product-core/.env.example`

- Add `E2E_TEST_SECRET` placeholder
- Document that this env var enables test seed/teardown API routes

---

## Verification Plan

### Automated Tests

```bash
bun install
bun run format
bun run lint
bun run typecheck
bun run test
bun run test:contracts
bun run build
bun run e2e
```

### Manual Verification

- Run `bun run e2e:ui` to visually verify all 6 spec files pass
- Verify that Playwright HTML report is generated in `playwright-report/`
- Confirm that traces/screenshots are captured on failures
- Verify CI workflow updated and E2E job defined correctly
- Verify test API routes are NOT accessible without `E2E_TEST_SECRET`

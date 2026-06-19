import { test as base, expect } from './base';
import type { Page } from '@playwright/test';

import { DEV_OTP_CODE } from '../helpers/mock-otp';
import { waitForNavigation } from '../helpers/wait-for';
import type { SeedResult } from '../helpers/seed';

export type AuthFixtures = {
  /** Authenticated member page — signs in automatically */
  authenticatedPage: Page;
  /** Seed result for the authenticated member */
  memberData: SeedResult;
};

/**
 * Extended test with a pre-authenticated member session.
 * Uses the seed API to create a member, then signs in via the UI.
 */
export const test = base.extend<AuthFixtures>({
  memberData: async ({ seed }, use) => {
    const data = await seed('member-with-card');
    await use(data);
  },

  authenticatedPage: async ({ page, locale, memberData }, use) => {
    // Navigate to sign-in page
    await page.goto(`/${locale}/sign-in`);

    // Fill phone number from seeded data
    const phoneInput = page.locator('[data-testid="auth-phone-input"]');
    if (memberData.phone) {
      await phoneInput.fill(memberData.phone);
    }

    // Submit phone
    await page.locator('[data-testid="auth-submit-phone"]').click();

    // Fill dev OTP code
    await page.locator('[data-testid="auth-otp-input"]').fill(DEV_OTP_CODE);
    await page.locator('[data-testid="auth-submit-otp"]').click();

    // Wait for redirect to dashboard
    await waitForNavigation(page, new RegExp(`/${locale}/m/dashboard`));

    await use(page);
  },
});

export { expect };

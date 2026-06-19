import { test as base, expect } from './base';
import type { Page } from '@playwright/test';

import { DEV_OTP_CODE, DEV_TOTP_CODE } from '../helpers/mock-otp';
import { waitForNavigation } from '../helpers/wait-for';
import type { SeedResult } from '../helpers/seed';

export type AdminAuthFixtures = {
  /** Authenticated admin page — signs in as staff */
  adminPage: Page;
  /** Seed result for the staff user */
  staffData: SeedResult;
};

/**
 * Extended test with a pre-authenticated staff session.
 * Uses the seed API to ensure a staff user exists, then signs in via admin-app UI.
 */
export const test = base.extend<AdminAuthFixtures>({
  staffData: async ({ seed }, use) => {
    const data = await seed('staff-owner');
    await use(data);
  },

  adminPage: async ({ browser, staffData }, use) => {
    // Admin-app runs on port 3001
    const context = await browser.newContext({
      baseURL: 'http://localhost:3001',
    });
    const page = await context.newPage();

    // Navigate to admin sign-in
    await page.goto('/auth/sign-in');

    // Fill phone number
    if (staffData.staffPhone) {
      await page.locator('[data-testid="admin-phone-input"]').fill(staffData.staffPhone);
    }

    // Submit phone and enter OTP
    await page.locator('[data-testid="admin-submit-phone"]').click();
    await page.locator('[data-testid="admin-otp-input"]').fill(DEV_OTP_CODE);
    await page.locator('[data-testid="admin-submit-otp"]').click();

    // Handle TOTP verification
    await waitForNavigation(page, /\/auth\/(2fa-required|totp-setup)/);
    await page.locator('[data-testid="admin-totp-input"]').fill(DEV_TOTP_CODE);
    await page.locator('[data-testid="admin-submit-totp"]').click();

    // Wait for dashboard
    await waitForNavigation(page, /\/dashboard/);

    await use(page);

    // Cleanup
    await context.close();
  },
});

export { expect };

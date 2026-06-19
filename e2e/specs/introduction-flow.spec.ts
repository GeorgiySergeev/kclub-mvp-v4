import { test, expect } from '../fixtures/base';
import { IntroducePage } from '../page-objects/introduce.page';
import { AdminIntroductionsPage } from '../page-objects/admin-introductions.page';
import { DEV_OTP_CODE, DEV_TOTP_CODE, setupMemberAuthMocks } from '../helpers/mock-otp';

test.describe('Introduction flow', () => {
  test('VIP business member submits introduction', async ({ page, locale, seed }) => {
    const { phone } = await seed('vip-with-published-business');
    if (!phone) {
      test.skip();
      return;
    }

    await setupMemberAuthMocks(page);

    // Sign in as VIP with published business
    await page.goto(`/${locale}/sign-in`);
    await page.locator('[data-testid="auth-phone-input"]').fill(phone);
    await page.locator('[data-testid="auth-submit-phone"]').click();
    
    // Wait for state transition to OTP input
    await page.waitForSelector('[data-testid="auth-otp-input"]');

    await page.locator('[data-testid="auth-otp-input"]').fill(DEV_OTP_CODE);
    await page.locator('[data-testid="auth-submit-otp"]').click();
    await expect(page).toHaveURL(new RegExp(`.*/${locale}/m/dashboard.*`), { timeout: 30000 });

    // Navigate to introduce page
    const introducePage = new IntroducePage(page, locale);
    await introducePage.goto();

    // Fill introduction form
    await introducePage.fillMessage('E2E test introduction message');
    await introducePage.submit();

    // Should show submitted status
    await expect(page.locator('[data-testid="intro-status"]')).toContainText(/submitted/i);
  });

  test('staff reviews introduction in admin', async ({ browser, seed }) => {
    const { staffPhone } = await seed('staff-owner');
    if (!staffPhone) {
      test.skip();
      return;
    }

    const context = await browser.newContext({ baseURL: 'http://localhost:3001' });
    const adminPage = await context.newPage();

    // Sign in as staff
    await adminPage.goto('/auth/sign-in');
    await adminPage.locator('[data-testid="admin-phone-input"]').fill(staffPhone);
    await adminPage.locator('[data-testid="admin-submit-phone"]').click();
    await adminPage.locator('[data-testid="admin-otp-input"]').fill(DEV_OTP_CODE);
    await adminPage.locator('[data-testid="admin-submit-otp"]').click();

    await expect(adminPage).toHaveURL(/.*\/auth\/(2fa-required|totp-setup).*/, { timeout: 30000 });
    await adminPage.locator('[data-testid="admin-totp-input"]').fill(DEV_TOTP_CODE);
    await adminPage.locator('[data-testid="admin-submit-totp"]').click();
    await expect(adminPage).toHaveURL(/.*\/dashboard.*/, { timeout: 30000 });

    // Navigate to introductions
    const adminIntros = new AdminIntroductionsPage(adminPage);
    await adminIntros.goto();

    // Verify introductions table is visible
    await expect(adminPage.locator('[data-testid="admin-introductions-table"]')).toBeVisible();

    await context.close();
  });
});

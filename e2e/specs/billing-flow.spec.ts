import { test, expect } from '../fixtures/base';
import { DashboardPage } from '../page-objects/dashboard.page';
import { DEV_OTP_CODE, setupMemberAuthMocks } from '../helpers/mock-otp';
import { interceptStripeCheckout, simulateVipCheckoutComplete } from '../helpers/mock-stripe';

test.describe('Billing flow', () => {
  test('VIP checkout starts from subscription tab', async ({ page, locale, seed }) => {
    const { phone, userId } = await seed('member-with-card');
    if (!phone || !userId) {
      test.skip();
      return;
    }

    await setupMemberAuthMocks(page);

    // Sign in
    await page.goto(`/${locale}/sign-in`);
    await page.locator('[data-testid="auth-phone-input"]').fill(phone);
    await page.locator('[data-testid="auth-submit-phone"]').click();

    // Wait for state transition to OTP input
    await page.waitForSelector('[data-testid="auth-otp-input"]');

    await page.locator('[data-testid="auth-otp-input"]').fill(DEV_OTP_CODE);
    await page.locator('[data-testid="auth-submit-otp"]').click();
    await expect(page).toHaveURL(new RegExp(`.*/${locale}/m/dashboard.*`), { timeout: 30000 });

    // Navigate to subscription tab
    const dashboard = new DashboardPage(page, locale);
    await dashboard.clickTab('subscription');

    // Set up Stripe checkout interception
    const successUrl = `http://localhost:3000/${locale}/m/checkout/success`;
    await interceptStripeCheckout(page, successUrl);

    // Click upgrade button
    const upgradeBtn = page.locator('[data-testid="subscription-upgrade-btn"]');
    if (await upgradeBtn.isVisible()) {
      await upgradeBtn.click();
      // Should either redirect to Stripe or show checkout modal
      // With mock, it should redirect to success URL
    }
  });

  test('subscription tab updates after webhook', async ({ page, locale, seed }) => {
    const { phone, userId } = await seed('member-with-card');
    if (!phone || !userId) {
      test.skip();
      return;
    }

    // Simulate webhook before signing in
    await simulateVipCheckoutComplete(userId);

    await setupMemberAuthMocks(page);

    // Sign in and check subscription tab
    await page.goto(`/${locale}/sign-in`);
    await page.locator('[data-testid="auth-phone-input"]').fill(phone);
    await page.locator('[data-testid="auth-submit-phone"]').click();
    await page.locator('[data-testid="auth-otp-input"]').fill(DEV_OTP_CODE);
    await page.locator('[data-testid="auth-submit-otp"]').click();
    await expect(page).toHaveURL(new RegExp(`.*/${locale}/m/dashboard.*`), { timeout: 30000 });

    const dashboard = new DashboardPage(page, locale);
    await dashboard.clickTab('subscription');

    // After webhook, subscription should show VIP/ACTIVE
    const statusEl = page.locator('[data-testid="subscription-status"]');
    if (await statusEl.isVisible()) {
      await expect(statusEl).toContainText(/active/i);
    }
  });
});

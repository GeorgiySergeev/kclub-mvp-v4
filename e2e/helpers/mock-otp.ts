import type { Page } from '@playwright/test';

/** Dev OTP code accepted by both Supabase mock and staff auth */
export const DEV_OTP_CODE = '000000';

/** Dev TOTP code accepted by staff auth in development mode */
export const DEV_TOTP_CODE = '123456';

/**
 * Intercepts Supabase OTP send requests to prevent real SMS delivery.
 * The app's dev mode already accepts '000000' as a valid OTP code,
 * so we only need to mock the send endpoint to avoid real SMS.
 */
export async function mockOtpSend(page: Page): Promise<void> {
  await page.route('**/auth/v1/otp', (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message_id: 'e2e-mock-message-id',
      }),
    });
  });
}

/**
 * Intercepts Supabase OTP verify requests and returns a mock session.
 * This bypasses real Supabase verification for E2E tests.
 */
export async function mockOtpVerify(page: Page, userId?: string): Promise<void> {
  const mockUserId = userId ?? 'e2e-mock-user-id';

  await page.route('**/auth/v1/verify', (route) => {
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'e2e-mock-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'e2e-mock-refresh-token',
        user: {
          id: mockUserId,
          phone: '+10000000001',
          role: 'authenticated',
          aud: 'authenticated',
        },
      }),
    });
  });
}

/**
 * Sets up all OTP mocks for member auth flows.
 */
export async function setupMemberAuthMocks(page: Page, userId?: string): Promise<void> {
  await mockOtpSend(page);
  await mockOtpVerify(page, userId);
}

import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class AdminSignInPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto('/auth/sign-in');
  }

  async fillPhone(phone: string): Promise<void> {
    await this.page.locator(SELECTORS.ADMIN_PHONE_INPUT).first().fill(phone);
  }

  async submitPhone(): Promise<void> {
    await this.page.locator(SELECTORS.ADMIN_SUBMIT_PHONE).first().click();
  }

  async fillOtp(code: string): Promise<void> {
    await this.page.locator(SELECTORS.ADMIN_OTP_INPUT).first().fill(code);
  }

  async submitOtp(): Promise<void> {
    await this.page.locator(SELECTORS.ADMIN_SUBMIT_OTP).first().click();
  }

  async fillTotp(code: string): Promise<void> {
    await this.page.locator(SELECTORS.ADMIN_TOTP_INPUT).first().fill(code);
  }

  async submitTotp(): Promise<void> {
    await this.page.locator(SELECTORS.ADMIN_SUBMIT_TOTP).first().click();
  }
}

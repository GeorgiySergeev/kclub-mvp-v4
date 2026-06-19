import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class AdminBusinessesPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto('/businesses');
  }

  get table(): Locator {
    return this.page.locator(SELECTORS.ADMIN_BUSINESSES_TABLE).first();
  }

  async approveFirst(): Promise<void> {
    await this.page.locator(SELECTORS.ADMIN_BUSINESS_APPROVE_BTN).first().click();
  }

  async rejectFirst(): Promise<void> {
    await this.page.locator(SELECTORS.ADMIN_BUSINESS_REJECT_BTN).first().click();
  }
}

import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class AdminDashboardPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  get sidebar(): Locator {
    return this.page.locator(SELECTORS.ADMIN_SIDEBAR).first();
  }
}

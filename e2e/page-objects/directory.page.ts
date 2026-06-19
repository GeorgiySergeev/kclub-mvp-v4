import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class DirectoryPage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(`/${this.locale}/directory`);
  }

  get businessCards(): Locator {
    return this.page.locator(SELECTORS.DIRECTORY_CARD);
  }

  get searchInput(): Locator {
    return this.page.locator(SELECTORS.DIRECTORY_SEARCH).first();
  }

  async clickFirstBusiness(): Promise<void> {
    await this.businessCards.first().click();
  }
}

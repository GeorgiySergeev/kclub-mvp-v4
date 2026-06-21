import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class HomePage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(`/${this.locale}`);
  }

  get hero(): Locator {
    return this.page.locator(SELECTORS.HOME_HERO).first();
  }

  get navigation(): Locator {
    return this.page.locator('nav').first();
  }

  get footer(): Locator {
    return this.page.locator('footer').first();
  }

  get featuredTop(): Locator {
    return this.page.locator(SELECTORS.HOME_FEATURED_TOP).first();
  }

  get featuredRecommended(): Locator {
    return this.page.locator(SELECTORS.HOME_FEATURED_RECOMMENDED).first();
  }

  get signInLink(): Locator {
    return this.page.locator(SELECTORS.NAV_SIGN_IN).first();
  }

  get signUpLink(): Locator {
    return this.page.locator(SELECTORS.NAV_SIGN_UP).first();
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }
}

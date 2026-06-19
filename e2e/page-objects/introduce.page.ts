import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class IntroducePage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(`/${this.locale}/m/introduce`);
  }

  async selectTargetBusiness(businessId?: string): Promise<void> {
    const select = this.page.locator(SELECTORS.INTRO_TARGET_BUSINESS).first();
    if (await select.isVisible()) {
      if (businessId) {
        await select.selectOption(businessId);
      } else {
        await select.selectOption({ index: 1 });
      }
    }
  }

  async fillMessage(msg: string): Promise<void> {
    await this.page.locator(SELECTORS.INTRO_MESSAGE).first().fill(msg);
  }

  async submit(): Promise<void> {
    await this.page.locator(SELECTORS.INTRO_SUBMIT).first().click();
  }

  get status(): Locator {
    return this.page.locator(SELECTORS.INTRO_STATUS).first();
  }
}

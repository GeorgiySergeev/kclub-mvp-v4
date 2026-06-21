import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class CardVerifyPage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(cardNumber: string): Promise<void> {
    await this.page.goto(`/${this.locale}/verify-card/${cardNumber}`);
  }

  get status(): Locator {
    return this.page.locator(SELECTORS.CARD_VERIFY_STATUS).first();
  }

  get name(): Locator {
    return this.page.locator(SELECTORS.CARD_VERIFY_NAME).first();
  }

  get errorMessage(): Locator {
    return this.page.locator(SELECTORS.CARD_VERIFY_ERROR).first();
  }
}

import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class MyBusinessPage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(`/${this.locale}/m/my-business`);
  }

  async fillBusinessName(name: string): Promise<void> {
    await this.page.locator(SELECTORS.BUSINESS_FORM_NAME).first().fill(name);
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.locator(SELECTORS.BUSINESS_FORM_EMAIL).first().fill(email);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.page.locator(SELECTORS.BUSINESS_FORM_PHONE).first().fill(phone);
  }

  async selectCategory(categoryValue?: string): Promise<void> {
    const categorySelect = this.page.locator(SELECTORS.BUSINESS_FORM_CATEGORY).first();
    if (await categorySelect.isVisible()) {
      if (categoryValue) {
        await categorySelect.selectOption(categoryValue);
      } else {
        await categorySelect.selectOption({ index: 1 });
      }
    }
  }

  async fillWebsite(url: string): Promise<void> {
    await this.page.locator(SELECTORS.BUSINESS_FORM_WEBSITE).first().fill(url);
  }

  async submit(): Promise<void> {
    await this.page.locator(SELECTORS.BUSINESS_FORM_SUBMIT).first().click();
  }

  get status(): Locator {
    return this.page.locator(SELECTORS.BUSINESS_STATUS).first();
  }
}

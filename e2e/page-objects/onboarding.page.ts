import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class OnboardingPage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(`/${this.locale}/m/onboarding`);
  }

  async fillDisplayName(name: string): Promise<void> {
    await this.page.locator(SELECTORS.ONBOARDING_DISPLAY_NAME).first().fill(name);
  }

  async selectLocale(locale: string): Promise<void> {
    await this.page.locator(SELECTORS.ONBOARDING_LOCALE_SELECT).first().selectOption(locale);
  }

  async acceptTerms(): Promise<void> {
    await this.page.locator(SELECTORS.ONBOARDING_TERMS_CHECKBOX).first().check();
  }

  async submit(): Promise<void> {
    await this.page.locator(SELECTORS.ONBOARDING_SUBMIT).first().click();
  }
}

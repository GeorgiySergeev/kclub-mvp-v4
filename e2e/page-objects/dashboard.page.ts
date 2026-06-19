import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class DashboardPage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(`/${this.locale}/m/dashboard`);
  }

  getTab(tabName: string): Locator {
    switch (tabName) {
      case 'card': return this.page.locator(SELECTORS.DASHBOARD_TAB_CARD).first();
      case 'catalog': return this.page.locator(SELECTORS.DASHBOARD_TAB_CATALOG).first();
      case 'subscription': return this.page.locator(SELECTORS.DASHBOARD_TAB_SUBSCRIPTION).first();
      case 'profile': return this.page.locator(SELECTORS.DASHBOARD_TAB_PROFILE).first();
      case 'business': return this.page.locator(SELECTORS.DASHBOARD_TAB_BUSINESS).first();
      case 'introductions': return this.page.locator(SELECTORS.DASHBOARD_TAB_INTRODUCTIONS).first();
      default: return this.page.locator('body').first();
    }
  }

  async clickTab(tabName: string): Promise<void> {
    await this.getTab(tabName).click();
  }

  async getVisibleTabNames(): Promise<string[]> {
    const tabs = ['card', 'catalog', 'subscription', 'profile', 'business', 'introductions'];
    const visibleTabs: string[] = [];

    for (const tab of tabs) {
      if (await this.getTab(tab).isVisible()) {
        visibleTabs.push(tab);
      }
    }

    return visibleTabs;
  }

  get cardNumber(): Locator {
    return this.page.locator(SELECTORS.CARD_NUMBER).first();
  }

  get cardQr(): Locator {
    return this.page.locator(SELECTORS.CARD_QR_CODE).first();
  }

  get subscriptionStatus(): Locator {
    return this.page.locator(SELECTORS.SUBSCRIPTION_STATUS).first();
  }
}

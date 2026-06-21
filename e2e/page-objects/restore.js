const fs = require('fs');
const path = require('path');

const files = {
  'admin-businesses.page.ts': `import type { Page, Locator } from '@playwright/test';
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
`,
  'admin-dashboard.page.ts': `import type { Page, Locator } from '@playwright/test';
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
`,
  'admin-introductions.page.ts': `import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class AdminIntroductionsPage {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto('/introductions');
  }

  get table(): Locator {
    return this.page.locator(SELECTORS.ADMIN_INTRODUCTIONS_TABLE).first();
  }

  async approveFirst(): Promise<void> {
    await this.page.locator(SELECTORS.ADMIN_INTRO_APPROVE_BTN).first().click();
  }

  async rejectFirst(): Promise<void> {
    await this.page.locator(SELECTORS.ADMIN_INTRO_REJECT_BTN).first().click();
  }
}
`,
  'admin-sign-in.page.ts': `import type { Page, Locator } from '@playwright/test';
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
`,
  'card-verify.page.ts': `import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class CardVerifyPage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(cardNumber: string): Promise<void> {
    await this.page.goto(\`/\${this.locale}/verify-card/\${cardNumber}\`);
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
`,
  'dashboard.page.ts': `import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class DashboardPage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(\`/\${this.locale}/m/dashboard\`);
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
`,
  'directory.page.ts': `import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class DirectoryPage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(\`/\${this.locale}/directory\`);
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
`,
  'home.page.ts': `import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class HomePage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(\`/\${this.locale}\`);
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
`,
  'introduce.page.ts': `import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class IntroducePage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(\`/\${this.locale}/m/introduce\`);
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
`,
  'my-business.page.ts': `import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class MyBusinessPage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(\`/\${this.locale}/m/my-business\`);
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
`,
  'onboarding.page.ts': `import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class OnboardingPage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(\`/\${this.locale}/m/onboarding\`);
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
`,
  'sign-in.page.ts': `import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class SignInPage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(\`/\${this.locale}/sign-in\`);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.page.locator(SELECTORS.AUTH_PHONE_INPUT).first().fill(phone);
  }

  async submitPhone(): Promise<void> {
    await this.page.locator(SELECTORS.AUTH_SUBMIT_PHONE).first().click();
  }

  async fillOtp(code: string): Promise<void> {
    await this.page.locator(SELECTORS.AUTH_OTP_INPUT).first().fill(code);
  }

  async submitOtp(): Promise<void> {
    await this.page.locator(SELECTORS.AUTH_SUBMIT_OTP).first().click();
  }
}
`,
  'sign-up.page.ts': `import type { Page, Locator } from '@playwright/test';
import { SELECTORS } from '../helpers/selectors';

export class SignUpPage {
  private readonly page: Page;
  private readonly locale: string;

  constructor(page: Page, locale = 'en') {
    this.page = page;
    this.locale = locale;
  }

  async goto(): Promise<void> {
    await this.page.goto(\`/\${this.locale}/sign-up\`);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.page.locator(SELECTORS.AUTH_PHONE_INPUT).first().fill(phone);
  }

  async submitPhone(): Promise<void> {
    await this.page.locator(SELECTORS.AUTH_SUBMIT_PHONE).first().click();
  }

  async fillOtp(code: string): Promise<void> {
    await this.page.locator(SELECTORS.AUTH_OTP_INPUT).first().fill(code);
  }

  async submitOtp(): Promise<void> {
    await this.page.locator(SELECTORS.AUTH_SUBMIT_OTP).first().click();
  }
}
`,
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(__dirname, filename), content);
}
console.log('Done restoring!');

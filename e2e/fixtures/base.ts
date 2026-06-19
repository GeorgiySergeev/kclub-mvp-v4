import { test as base, expect } from '@playwright/test';

import {
  seedTestData,
  teardownTestData,
  type SeedScenario,
  type SeedResult,
} from '../helpers/seed';
import { setupMemberAuthMocks } from '../helpers/mock-otp';
import { interceptStripeCheckout } from '../helpers/mock-stripe';

/** Default locale used in E2E tests */
export const DEFAULT_LOCALE = 'en';

export type E2EFixtures = {
  /** Seeds test data for a specific scenario and returns the result */
  seed: (scenario: SeedScenario) => Promise<SeedResult>;
  /** Default locale used for navigation */
  locale: string;
};

/**
 * Extended Playwright test with KCLUB-specific fixtures.
 * Provides seed data helpers and locale configuration.
 */
export const test = base.extend<E2EFixtures>({
  locale: [DEFAULT_LOCALE, { option: true }],

  seed: async ({}, use) => {
    const seededScenarios: SeedScenario[] = [];

    const seedFn = async (scenario: SeedScenario): Promise<SeedResult> => {
      seededScenarios.push(scenario);
      return seedTestData(scenario);
    };

    await use(seedFn);

    // Teardown after test
    if (seededScenarios.length > 0) {
      await teardownTestData();
    }
  },
});

export { expect };

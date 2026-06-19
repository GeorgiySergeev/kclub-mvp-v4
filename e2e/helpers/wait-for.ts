import type { Page } from '@playwright/test';

/**
 * Waits for navigation to a URL matching the given pattern.
 */
export async function waitForNavigation(page: Page, urlPattern: string | RegExp): Promise<void> {
  await page.waitForURL(urlPattern, { timeout: 10_000 });
}

/**
 * Waits for the page to reach a network-idle state.
 */
export async function waitForPageReady(page: Page): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout: 15_000 });
}

/**
 * Waits for an API response matching the given URL pattern.
 * Returns the response JSON body.
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
): Promise<unknown> {
  const response = await page.waitForResponse(
    (resp) => {
      if (typeof urlPattern === 'string') {
        return resp.url().includes(urlPattern);
      }
      return urlPattern.test(resp.url());
    },
    { timeout: 10_000 },
  );

  return response.json();
}

/**
 * Waits for an element to be visible and stable (no animations).
 */
export async function waitForElementStable(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible', timeout: 10_000 });
}

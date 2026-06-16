import { describe, expect, test } from 'bun:test';

import {
  getDashboardAliasHref,
  getImplementedDashboardTabs,
  normalizeDashboardTab,
} from '@/features/member/dashboard-tabs';
import type { CurrentMemberProfileDto } from '@kclub/contracts';

const memberProfile: CurrentMemberProfileDto = {
  id: 'member-1',
  phone: '+15551234567',
  displayName: 'Member One',
  localePreference: 'en',
  membershipTier: 'MEMBER',
  status: 'ACTIVE',
  onboardingComplete: true,
  termsAcceptedAt: '2026-06-16T00:00:00.000Z',
  createdAt: '2026-06-16T00:00:00.000Z',
  updatedAt: '2026-06-16T00:00:00.000Z',
};

describe('member dashboard tabs', () => {
  test('returns implemented P4.4 tabs only', () => {
    const tabs = getImplementedDashboardTabs(memberProfile);

    expect(tabs).toEqual(['card', 'catalog', 'subscription', 'profile']);
    expect(tabs).not.toContain('business');
    expect(tabs).not.toContain('introductions');
  });

  test('normalizes invalid tab to card', () => {
    const tabs = getImplementedDashboardTabs(memberProfile);

    expect(normalizeDashboardTab('introductions', tabs)).toBe('card');
    expect(normalizeDashboardTab(undefined, tabs)).toBe('card');
  });

  test('keeps visible tab selection', () => {
    const tabs = getImplementedDashboardTabs(memberProfile);

    expect(normalizeDashboardTab('profile', tabs)).toBe('profile');
  });

  test('builds alias redirect hrefs', () => {
    expect(getDashboardAliasHref('en', 'card')).toBe('/en/m/dashboard?tab=card');
    expect(getDashboardAliasHref('uk', 'subscription')).toBe('/uk/m/dashboard?tab=subscription');
  });
});

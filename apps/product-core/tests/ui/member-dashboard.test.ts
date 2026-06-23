import { describe, expect, test } from 'bun:test';

import {
  getDashboardAliasHref,
  getImplementedDashboardTabs,
  isDashboardTabLocked,
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
  country: null,
  city: null,
  about: null,
  avatarUrl: null,
};

const vipProfile: CurrentMemberProfileDto = {
  ...memberProfile,
  id: 'vip-1',
  membershipTier: 'VIP',
};

const vipWithPublishedProfile: CurrentMemberProfileDto = {
  ...vipProfile,
  id: 'vip-published-1',
};

describe('member dashboard tabs', () => {
  test('MEMBER sees account, subscription, introductions, business, settings', () => {
    const tabs = getImplementedDashboardTabs(memberProfile);

    expect(tabs).toEqual(['account', 'subscription', 'introductions', 'business', 'settings']);
    expect(isDashboardTabLocked(memberProfile, 'introductions')).toBe(true);
    expect(isDashboardTabLocked(memberProfile, 'business')).toBe(true);
  });

  test('VIP unlocks business and introductions tabs', () => {
    const tabs = getImplementedDashboardTabs(vipProfile);

    expect(tabs).toContain('business');
    expect(tabs).toContain('introductions');
    expect(isDashboardTabLocked(vipProfile, 'business')).toBe(false);
    expect(isDashboardTabLocked(vipProfile, 'introductions')).toBe(false);
  });

  test('VIP with published business keeps full tab set', () => {
    const tabs = getImplementedDashboardTabs({
      ...vipWithPublishedProfile,
      hasPublishedBusiness: true,
    });

    expect(tabs).toHaveLength(5);
  });

  test('normalizes invalid tab to first visible tab', () => {
    const tabs = getImplementedDashboardTabs(memberProfile);

    expect(normalizeDashboardTab('catalog', tabs)).toBe('account');
    expect(normalizeDashboardTab(undefined, tabs)).toBe('account');
  });

  test('maps legacy card and profile tabs to account', () => {
    const tabs = getImplementedDashboardTabs(memberProfile);

    expect(normalizeDashboardTab('card', tabs)).toBe('account');
    expect(normalizeDashboardTab('profile', tabs)).toBe('account');
  });

  test('keeps visible tab selection', () => {
    const tabs = getImplementedDashboardTabs(memberProfile);

    expect(normalizeDashboardTab('settings', tabs)).toBe('settings');
  });

  test('builds alias redirect hrefs', () => {
    expect(getDashboardAliasHref('en', 'account')).toBe('/en/m/dashboard?tab=account');
    expect(getDashboardAliasHref('uk', 'subscription')).toBe('/uk/m/dashboard?tab=subscription');
  });
});

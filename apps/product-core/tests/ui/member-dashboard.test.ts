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
  test('MEMBER sees card, subscription, profile', () => {
    const tabs = getImplementedDashboardTabs(memberProfile);

    expect(tabs).toEqual(['card', 'subscription', 'profile']);
    expect(tabs).not.toContain('catalog');
    expect(tabs).not.toContain('business');
    expect(tabs).not.toContain('introductions');
  });

  test('VIP sees business tab but not introductions', () => {
    const tabs = getImplementedDashboardTabs(vipProfile);

    expect(tabs).toContain('business');
    expect(tabs).not.toContain('introductions');
    expect(tabs).toContain('card');
    expect(tabs).not.toContain('catalog');
    expect(tabs).toContain('subscription');
    expect(tabs).toContain('profile');
  });

  test('VIP with published business sees both business and introductions', () => {
    const tabs = getImplementedDashboardTabs({
      ...vipWithPublishedProfile,
      hasPublishedBusiness: true,
    });

    expect(tabs).toContain('business');
    expect(tabs).toContain('introductions');
    expect(tabs).toHaveLength(5);
  });

  test('normalizes invalid tab to first visible tab', () => {
    const tabs = getImplementedDashboardTabs(memberProfile);

    expect(normalizeDashboardTab('introductions', tabs)).toBe('card');
    expect(normalizeDashboardTab(undefined, tabs)).toBe('card');
  });

  test('normalizes unauthorized business tab to card for MEMBER', () => {
    const tabs = getImplementedDashboardTabs(memberProfile);

    expect(normalizeDashboardTab('business', tabs)).toBe('card');
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

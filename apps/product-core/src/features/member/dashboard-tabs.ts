import {
  MEMBER_DASHBOARD_TAB_VISIBILITY,
  type CurrentMemberProfileDto,
  type MemberCapabilityGroup,
  type MemberDashboardTab,
} from '@kclub/contracts';

export const IMPLEMENTED_MEMBER_DASHBOARD_TABS = [
  'card',
  'subscription',
  'profile',
  'business',
  'introductions',
] as const satisfies readonly MemberDashboardTab[];

export type ImplementedMemberDashboardTab = (typeof IMPLEMENTED_MEMBER_DASHBOARD_TABS)[number];

const DEFAULT_TAB: ImplementedMemberDashboardTab = 'card';

function getMemberCapabilityGroupForDashboard(
  profile: Pick<CurrentMemberProfileDto, 'membershipTier'> & { hasPublishedBusiness?: boolean },
): MemberCapabilityGroup {
  if (profile.membershipTier === 'VIP' && profile.hasPublishedBusiness) {
    return 'VIP_WITH_PUBLISHED_BUSINESS';
  }
  if (profile.membershipTier === 'VIP') {
    return 'VIP';
  }
  return 'MEMBER';
}

export function getImplementedDashboardTabs(
  profile: Pick<CurrentMemberProfileDto, 'membershipTier'> & { hasPublishedBusiness?: boolean },
): readonly ImplementedMemberDashboardTab[] {
  const group = getMemberCapabilityGroupForDashboard(profile);
  return MEMBER_DASHBOARD_TAB_VISIBILITY[group].filter((tab) =>
    IMPLEMENTED_MEMBER_DASHBOARD_TABS.includes(tab as ImplementedMemberDashboardTab),
  ) as readonly ImplementedMemberDashboardTab[];
}

export function normalizeDashboardTab(
  tab: string | string[] | undefined,
  visibleTabs: readonly ImplementedMemberDashboardTab[],
): ImplementedMemberDashboardTab {
  const value = Array.isArray(tab) ? tab[0] : tab;
  if (value && visibleTabs.includes(value as ImplementedMemberDashboardTab)) {
    return value as ImplementedMemberDashboardTab;
  }

  return visibleTabs[0] ?? DEFAULT_TAB;
}

export function getDashboardAliasHref(locale: string, tab: ImplementedMemberDashboardTab): string {
  return `/${locale}/m/dashboard?tab=${tab}`;
}

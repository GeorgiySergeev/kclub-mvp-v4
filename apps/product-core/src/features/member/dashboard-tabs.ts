import {
  MEMBER_DASHBOARD_TAB_VISIBILITY,
  type CurrentMemberProfileDto,
  type MemberCapabilityGroup,
  type MemberDashboardTab,
} from '@kclub/contracts';

export const IMPLEMENTED_MEMBER_DASHBOARD_TABS = [
  'account',
  'subscription',
  'introductions',
  'business',
  'settings',
] as const satisfies readonly MemberDashboardTab[];

export type ImplementedMemberDashboardTab = (typeof IMPLEMENTED_MEMBER_DASHBOARD_TABS)[number];

const DEFAULT_TAB: ImplementedMemberDashboardTab = 'account';

const LEGACY_TAB_ALIASES: Record<string, ImplementedMemberDashboardTab> = {
  card: 'account',
  profile: 'account',
};

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
  return IMPLEMENTED_MEMBER_DASHBOARD_TABS.filter((tab) => {
    if (tab === 'introductions' || tab === 'business') {
      return true;
    }

    const group = getMemberCapabilityGroupForDashboard(profile);
    return MEMBER_DASHBOARD_TAB_VISIBILITY[group].includes(tab);
  });
}

export function isDashboardTabLocked(
  profile: Pick<CurrentMemberProfileDto, 'membershipTier'>,
  tab: ImplementedMemberDashboardTab,
): boolean {
  if (tab === 'introductions') {
    return profile.membershipTier !== 'VIP';
  }

  if (tab === 'business') {
    return profile.membershipTier !== 'VIP';
  }

  return false;
}

export function getDashboardTabLockLabel(
  tab: ImplementedMemberDashboardTab,
): 'VIP' | 'BIZ' | null {
  if (tab === 'introductions') {
    return 'VIP';
  }

  if (tab === 'business') {
    return 'BIZ';
  }

  return null;
}

export function normalizeDashboardTab(
  tab: string | string[] | undefined,
  visibleTabs: readonly ImplementedMemberDashboardTab[],
): ImplementedMemberDashboardTab {
  const raw = Array.isArray(tab) ? tab[0] : tab;
  const value = raw ? (LEGACY_TAB_ALIASES[raw] ?? raw) : undefined;

  if (value && visibleTabs.includes(value as ImplementedMemberDashboardTab)) {
    return value as ImplementedMemberDashboardTab;
  }

  return visibleTabs[0] ?? DEFAULT_TAB;
}

export function getDashboardAliasHref(locale: string, tab: ImplementedMemberDashboardTab): string {
  return `/${locale}/m/dashboard?tab=${tab}`;
}

import {
  MEMBER_DASHBOARD_TAB_VISIBILITY,
  type CurrentMemberProfileDto,
  type MemberDashboardTab,
} from '@kclub/contracts';

export const IMPLEMENTED_MEMBER_DASHBOARD_TABS = [
  'card',
  'catalog',
  'subscription',
  'profile',
] as const satisfies readonly MemberDashboardTab[];

export type ImplementedMemberDashboardTab = (typeof IMPLEMENTED_MEMBER_DASHBOARD_TABS)[number];

const DEFAULT_TAB: ImplementedMemberDashboardTab = 'card';

export function getImplementedDashboardTabs(
  _profile: Pick<CurrentMemberProfileDto, 'membershipTier'>,
): readonly ImplementedMemberDashboardTab[] {
  return MEMBER_DASHBOARD_TAB_VISIBILITY.MEMBER.filter((tab) =>
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

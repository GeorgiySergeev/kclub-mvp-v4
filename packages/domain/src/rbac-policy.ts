import {
  MEMBER_CAPABILITY_GROUPS,
  MEMBER_DASHBOARD_TAB_VISIBILITY,
  STAFF_ROLE_PERMISSIONS,
  STAFF_ROLE_RANK,
  type MemberCapability,
  type MemberCapabilityGroup,
  type MemberDashboardTab,
  type StaffPermission,
  type StaffRole,
  type SubscriptionStatus,
  type BusinessStatus,
} from '@kclub/contracts';

export type MemberCapabilityContext = {
  subscriptionStatus: SubscriptionStatus;
  businessStatus?: BusinessStatus | null;
};

export function hasStaffPermission(role: StaffRole, permission: StaffPermission): boolean {
  return (STAFF_ROLE_PERMISSIONS[role] as readonly StaffPermission[]).includes(permission);
}

export function isStaffRoleAtLeast(
  role: StaffRole,
  minimumRole: Exclude<StaffRole, 'SUPPORT'>,
): boolean {
  return STAFF_ROLE_RANK[role] >= STAFF_ROLE_RANK[minimumRole];
}

export function getMemberCapabilityGroup(context: MemberCapabilityContext): MemberCapabilityGroup {
  if (hasActiveVipAccess(context.subscriptionStatus) && context.businessStatus === 'PUBLISHED') {
    return 'VIP_WITH_PUBLISHED_BUSINESS';
  }

  if (hasActiveVipAccess(context.subscriptionStatus)) {
    return 'VIP';
  }

  return 'MEMBER';
}

export function getMemberCapabilities(
  context: MemberCapabilityContext,
): readonly MemberCapability[] {
  return MEMBER_CAPABILITY_GROUPS[getMemberCapabilityGroup(context)];
}

export function hasMemberCapability(
  context: MemberCapabilityContext,
  capability: MemberCapability,
): boolean {
  return getMemberCapabilities(context).includes(capability);
}

export function getVisibleDashboardTabs(
  context: MemberCapabilityContext,
): readonly MemberDashboardTab[] {
  return MEMBER_DASHBOARD_TAB_VISIBILITY[getMemberCapabilityGroup(context)];
}

export function canAccessDashboardTab(
  context: MemberCapabilityContext,
  tab: MemberDashboardTab,
): boolean {
  return getVisibleDashboardTabs(context).includes(tab);
}

export function hasActiveVipAccess(status: SubscriptionStatus): boolean {
  return status === 'ACTIVE' || status === 'CANCELED' || status === 'PAST_DUE';
}

export function canSubmitIntroduction(context: MemberCapabilityContext): boolean {
  return getMemberCapabilityGroup(context) === 'VIP_WITH_PUBLISHED_BUSINESS';
}

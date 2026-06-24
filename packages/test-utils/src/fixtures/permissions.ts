import {
  MEMBER_DASHBOARD_TAB_VISIBILITY,
  MEMBER_DASHBOARD_TABS,
  STAFF_PERMISSIONS,
  STAFF_ROLES,
  type MemberDashboardTab,
  type StaffPermission,
  type StaffRole,
} from '@kclub/contracts';
import { getMemberCapabilities, hasStaffPermission } from '@kclub/domain';

export const STAFF_PERMISSION_MATRIX_FIXTURE = Object.fromEntries(
  STAFF_ROLES.map((role) => [
    role,
    Object.fromEntries(
      Object.values(STAFF_PERMISSIONS).map((permission) => [
        permission,
        hasStaffPermission(role, permission),
      ]),
    ) as Record<StaffPermission, boolean>,
  ]),
) as Record<StaffRole, Record<StaffPermission, boolean>>;

export const MEMBER_PERMISSION_FIXTURES = {
  MEMBER: {
    capabilities: getMemberCapabilities({ subscriptionStatus: 'NONE' }),
    visibleTabs: MEMBER_DASHBOARD_TAB_VISIBILITY.MEMBER,
  },
  VIP: {
    capabilities: getMemberCapabilities({ subscriptionStatus: 'ACTIVE' }),
    visibleTabs: MEMBER_DASHBOARD_TAB_VISIBILITY.VIP,
  },
  HAS_BUSINESS: {
    capabilities: getMemberCapabilities({
      subscriptionStatus: 'ACTIVE',
      businessStatus: 'UNDER_REVIEW',
    }),
    visibleTabs: MEMBER_DASHBOARD_TAB_VISIBILITY.HAS_BUSINESS,
  },
} as const satisfies Record<
  'MEMBER' | 'VIP' | 'HAS_BUSINESS',
  {
    capabilities: readonly string[];
    visibleTabs: readonly MemberDashboardTab[];
  }
>;

export const ALL_MEMBER_DASHBOARD_TABS_FIXTURE = [...MEMBER_DASHBOARD_TABS];

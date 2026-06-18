import type { StaffRole } from '@kclub/contracts';

const DASHBOARD_ROUTE_ROLES: Record<string, StaffRole[]> = {
  '/dashboard': ['OWNER', 'ADMIN', 'MODERATOR', 'SUPPORT'],
  '/dashboard/users': ['OWNER', 'ADMIN'],
  '/dashboard/cards': ['OWNER', 'ADMIN'],
  '/dashboard/businesses': ['OWNER', 'ADMIN', 'MODERATOR'],
  '/dashboard/introductions': ['OWNER', 'ADMIN', 'MODERATOR'],
  '/dashboard/catalog': ['OWNER', 'ADMIN', 'MODERATOR'],
  '/dashboard/categories': ['OWNER', 'ADMIN', 'MODERATOR'],
  '/dashboard/countries': ['OWNER', 'ADMIN', 'MODERATOR'],
  '/dashboard/cities': ['OWNER', 'ADMIN', 'MODERATOR'],
  '/dashboard/subscriptions': ['OWNER', 'ADMIN'],
  '/dashboard/memberships': ['OWNER', 'ADMIN'],
  '/dashboard/stripe-prices': ['OWNER'],
  '/dashboard/staff': ['OWNER'],
  '/dashboard/audit': ['OWNER', 'ADMIN', 'SUPPORT'],
  '/dashboard/settings': ['OWNER'],
};

export function getRequiredRoles(pathname: string): StaffRole[] | null {
  if (pathname === '/dashboard') {
    return DASHBOARD_ROUTE_ROLES['/dashboard'];
  }

  for (const [route, roles] of Object.entries(DASHBOARD_ROUTE_ROLES)) {
    if (route !== '/dashboard' && (pathname === route || pathname.startsWith(`${route}/`))) {
      return roles;
    }
  }

  return null;
}

export function hasRouteAccess(role: StaffRole, pathname: string): boolean {
  const requiredRoles = getRequiredRoles(pathname);
  if (!requiredRoles) return true;
  return requiredRoles.includes(role);
}

export function getRequiredRoleLabel(pathname: string): string {
  const roles = getRequiredRoles(pathname);
  if (!roles) return '';
  return roles.join(', ');
}

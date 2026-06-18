import { describe, expect, test } from 'bun:test';

import { hasRouteAccess, getRequiredRoles } from '../../src/server/auth/route-permissions';

describe('route-permissions', () => {
  test('getRequiredRoles returns correct roles for dashboard routes', () => {
    expect(getRequiredRoles('/dashboard')).toEqual(['OWNER', 'ADMIN', 'MODERATOR', 'SUPPORT']);
    expect(getRequiredRoles('/dashboard/users')).toEqual(['OWNER', 'ADMIN']);
    expect(getRequiredRoles('/dashboard/businesses')).toEqual(['OWNER', 'ADMIN', 'MODERATOR']);
    expect(getRequiredRoles('/dashboard/staff')).toEqual(['OWNER']);
  });

  test('hasRouteAccess returns true for authorized roles', () => {
    expect(hasRouteAccess('OWNER', '/dashboard')).toBe(true);
    expect(hasRouteAccess('ADMIN', '/dashboard/users')).toBe(true);
    expect(hasRouteAccess('MODERATOR', '/dashboard/businesses')).toBe(true);
  });

  test('hasRouteAccess returns false for unauthorized roles', () => {
    expect(hasRouteAccess('MODERATOR', '/dashboard/users')).toBe(false);
    expect(hasRouteAccess('SUPPORT', '/dashboard/staff')).toBe(false);
    expect(hasRouteAccess('MODERATOR', '/dashboard/staff')).toBe(false);
  });

  test('hasRouteAccess handles nested routes', () => {
    expect(hasRouteAccess('ADMIN', '/dashboard/users/123')).toBe(true);
    expect(hasRouteAccess('MODERATOR', '/dashboard/users/123')).toBe(false);
  });
});

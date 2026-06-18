import { describe, expect, test } from 'bun:test';

import {
  hasRouteAccess,
  getRequiredRoles,
  getRequiredRoleLabel,
} from '../../src/server/auth/route-permissions';

describe('route-permissions', () => {
  describe('getRequiredRoles', () => {
    test('returns roles for exact dashboard root', () => {
      const roles = getRequiredRoles('/dashboard');
      expect(roles).toEqual(['OWNER', 'ADMIN', 'MODERATOR', 'SUPPORT']);
    });

    test('returns roles for users route', () => {
      const roles = getRequiredRoles('/dashboard/users');
      expect(roles).toEqual(['OWNER', 'ADMIN']);
    });

    test('returns roles for nested user detail route', () => {
      const roles = getRequiredRoles('/dashboard/users/abc-123');
      expect(roles).toEqual(['OWNER', 'ADMIN']);
    });

    test('returns roles for cards route', () => {
      const roles = getRequiredRoles('/dashboard/cards');
      expect(roles).toEqual(['OWNER', 'ADMIN']);
    });

    test('returns roles for businesses route', () => {
      const roles = getRequiredRoles('/dashboard/businesses');
      expect(roles).toEqual(['OWNER', 'ADMIN', 'MODERATOR']);
    });

    test('returns roles for nested business detail route', () => {
      const roles = getRequiredRoles('/dashboard/businesses/biz-456');
      expect(roles).toEqual(['OWNER', 'ADMIN', 'MODERATOR']);
    });

    test('returns roles for stripe-prices (OWNER only)', () => {
      const roles = getRequiredRoles('/dashboard/stripe-prices');
      expect(roles).toEqual(['OWNER']);
    });

    test('returns roles for staff (OWNER only)', () => {
      const roles = getRequiredRoles('/dashboard/staff');
      expect(roles).toEqual(['OWNER']);
    });

    test('returns roles for settings (OWNER only)', () => {
      const roles = getRequiredRoles('/dashboard/settings');
      expect(roles).toEqual(['OWNER']);
    });

    test('returns roles for audit (ADMIN, OWNER, SUPPORT)', () => {
      const roles = getRequiredRoles('/dashboard/audit');
      expect(roles).toEqual(['OWNER', 'ADMIN', 'SUPPORT']);
    });

    test('returns null for unknown dashboard route', () => {
      const roles = getRequiredRoles('/dashboard/unknown-page');
      expect(roles).toBeNull();
    });

    test('returns null for non-dashboard route', () => {
      const roles = getRequiredRoles('/auth/sign-in');
      expect(roles).toBeNull();
    });
  });

  describe('hasRouteAccess', () => {
    test('OWNER can access all routes', () => {
      expect(hasRouteAccess('OWNER', '/dashboard')).toBe(true);
      expect(hasRouteAccess('OWNER', '/dashboard/users')).toBe(true);
      expect(hasRouteAccess('OWNER', '/dashboard/stripe-prices')).toBe(true);
      expect(hasRouteAccess('OWNER', '/dashboard/staff')).toBe(true);
      expect(hasRouteAccess('OWNER', '/dashboard/settings')).toBe(true);
    });

    test('ADMIN can access most routes except OWNER-only', () => {
      expect(hasRouteAccess('ADMIN', '/dashboard')).toBe(true);
      expect(hasRouteAccess('ADMIN', '/dashboard/users')).toBe(true);
      expect(hasRouteAccess('ADMIN', '/dashboard/cards')).toBe(true);
      expect(hasRouteAccess('ADMIN', '/dashboard/businesses')).toBe(true);
      expect(hasRouteAccess('ADMIN', '/dashboard/audit')).toBe(true);
      expect(hasRouteAccess('ADMIN', '/dashboard/stripe-prices')).toBe(false);
      expect(hasRouteAccess('ADMIN', '/dashboard/staff')).toBe(false);
      expect(hasRouteAccess('ADMIN', '/dashboard/settings')).toBe(false);
    });

    test('MODERATOR can access moderation routes only', () => {
      expect(hasRouteAccess('MODERATOR', '/dashboard')).toBe(true);
      expect(hasRouteAccess('MODERATOR', '/dashboard/businesses')).toBe(true);
      expect(hasRouteAccess('MODERATOR', '/dashboard/introductions')).toBe(true);
      expect(hasRouteAccess('MODERATOR', '/dashboard/catalog')).toBe(true);
      expect(hasRouteAccess('MODERATOR', '/dashboard/categories')).toBe(true);
      expect(hasRouteAccess('MODERATOR', '/dashboard/users')).toBe(false);
      expect(hasRouteAccess('MODERATOR', '/dashboard/cards')).toBe(false);
      expect(hasRouteAccess('MODERATOR', '/dashboard/audit')).toBe(false);
      expect(hasRouteAccess('MODERATOR', '/dashboard/stripe-prices')).toBe(false);
    });

    test('SUPPORT can access read-only routes', () => {
      expect(hasRouteAccess('SUPPORT', '/dashboard')).toBe(true);
      expect(hasRouteAccess('SUPPORT', '/dashboard/audit')).toBe(true);
      expect(hasRouteAccess('SUPPORT', '/dashboard/users')).toBe(false);
      expect(hasRouteAccess('SUPPORT', '/dashboard/businesses')).toBe(false);
      expect(hasRouteAccess('SUPPORT', '/dashboard/cards')).toBe(false);
    });

    test('unknown routes are allowed (returns true)', () => {
      expect(hasRouteAccess('OWNER', '/dashboard/unknown')).toBe(true);
      expect(hasRouteAccess('MODERATOR', '/auth/sign-in')).toBe(true);
    });
  });

  describe('getRequiredRoleLabel', () => {
    test('returns comma-separated role list', () => {
      expect(getRequiredRoleLabel('/dashboard/users')).toBe('OWNER, ADMIN');
    });

    test('returns empty string for unknown routes', () => {
      expect(getRequiredRoleLabel('/dashboard/unknown')).toBe('');
    });

    test('returns single role for OWNER-only routes', () => {
      expect(getRequiredRoleLabel('/dashboard/stripe-prices')).toBe('OWNER');
    });
  });
});

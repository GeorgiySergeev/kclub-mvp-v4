import { describe, expect, test } from 'bun:test';

import {
  ADMIN_API_BASE_PATH,
  ADMIN_BUSINESS_ONLY_KEYS,
  ADMIN_API_ROUTES,
  ERROR_CODES,
  MEMBER_CAPABILITIES,
  MEMBER_CAPABILITY_GROUPS,
  MEMBER_DASHBOARD_TAB_VISIBILITY,
  MEMBER_API_ROUTES,
  PUBLIC_BUSINESS_DTO_KEYS,
  STAFF_PERMISSIONS,
  STAFF_AUTH_STATES,
  STAFF_ROLE_PERMISSIONS,
  STAFF_ROLES,
  buildApiRoute,
  createApiError,
  createApiSuccess,
  isPublicBusinessDtoKey,
} from '../src';

describe('api envelope', () => {
  test('creates stable success and error envelopes', () => {
    expect(createApiSuccess({ ok: true })).toEqual({
      data: { ok: true },
      error: null,
    });

    expect(
      createApiError({
        code: ERROR_CODES.VALIDATION_INVALID_INPUT,
        message: 'Invalid input',
      }),
    ).toEqual({
      data: null,
      error: {
        code: ERROR_CODES.VALIDATION_INVALID_INPUT,
        message: 'Invalid input',
      },
    });
  });
});

describe('centralized constants', () => {
  test('exports expected error-code groups', () => {
    expect(ERROR_CODES.AUTH_SESSION_REQUIRED).toBe('AUTH_SESSION_REQUIRED');
    expect(ERROR_CODES.AUTH_SESSION_INVALID).toBe('AUTH_SESSION_INVALID');
    expect(ERROR_CODES.AUTH_SESSION_REVOKED).toBe('AUTH_SESSION_REVOKED');
    expect(ERROR_CODES.AUTH_STAFF_NOT_ALLOWED).toBe('AUTH_STAFF_NOT_ALLOWED');
    expect(ERROR_CODES.PERMISSION_DENIED).toBe('PERMISSION_DENIED');
    expect(ERROR_CODES.BUSINESS_INVALID_STATUS_TRANSITION).toBe(
      'BUSINESS_INVALID_STATUS_TRANSITION',
    );
    expect(ERROR_CODES.VIP_REQUIRED).toBe('VIP_REQUIRED');
    expect(ERROR_CODES.CARD_ALREADY_ACTIVE).toBe('CARD_ALREADY_ACTIVE');
    expect(ERROR_CODES.INTRODUCTION_PENDING_EXISTS).toBe('INTRODUCTION_PENDING_EXISTS');
    expect(ERROR_CODES.FEATURED_LIMIT_REACHED).toBe('FEATURED_LIMIT_REACHED');
    expect(ERROR_CODES.RATE_LIMITED).toBe('RATE_LIMITED');
    expect(ERROR_CODES.SERVER_ERROR).toBe('SERVER_ERROR');
  });

  test('matches the staff permission matrix from the spec', () => {
    expect(STAFF_ROLES).toEqual(['OWNER', 'ADMIN', 'MODERATOR', 'SUPPORT']);
    expect(STAFF_ROLE_PERMISSIONS.OWNER).toContain(STAFF_PERMISSIONS.STRIPE_PRICES_MANAGE);
    expect(STAFF_ROLE_PERMISSIONS.ADMIN).not.toContain(STAFF_PERMISSIONS.STAFF_MANAGE);
    expect(STAFF_ROLE_PERMISSIONS.MODERATOR).toContain(STAFF_PERMISSIONS.BUSINESSES_MODERATE);
    expect(STAFF_ROLE_PERMISSIONS.MODERATOR).not.toContain(STAFF_PERMISSIONS.USERS_BLOCK);
    expect(STAFF_ROLE_PERMISSIONS.SUPPORT).toContain(STAFF_PERMISSIONS.AUDIT_READ);
    expect(STAFF_ROLE_PERMISSIONS.SUPPORT).not.toContain(STAFF_PERMISSIONS.BUSINESSES_MODERATE);
    expect(STAFF_ROLE_PERMISSIONS.SUPPORT).not.toContain(STAFF_PERMISSIONS.INTERNAL_NOTES_CREATE);
    expect(STAFF_ROLE_PERMISSIONS.SUPPORT).not.toContain(STAFF_PERMISSIONS.USERS_BLOCK);
    expect(STAFF_ROLE_PERMISSIONS.SUPPORT).not.toContain(STAFF_PERMISSIONS.CARDS_REVOKE);
    expect(STAFF_ROLE_PERMISSIONS.SUPPORT).not.toContain(STAFF_PERMISSIONS.BUSINESSES_MODERATE);
    expect(STAFF_ROLE_PERMISSIONS.SUPPORT).not.toContain(STAFF_PERMISSIONS.STRIPE_PRICES_MANAGE);
    expect(STAFF_ROLE_PERMISSIONS.SUPPORT).not.toContain(STAFF_PERMISSIONS.STAFF_MANAGE);
    expect(STAFF_ROLE_PERMISSIONS.SUPPORT).not.toContain(
      STAFF_PERMISSIONS.FEATURED_BUSINESSES_MANAGE,
    );
    expect(STAFF_ROLE_PERMISSIONS.SUPPORT).not.toContain(STAFF_PERMISSIONS.TAXONOMY_MANAGE);
  });

  test('matches member capability and dashboard tab visibility rules', () => {
    expect(MEMBER_CAPABILITY_GROUPS.MEMBER).toContain(MEMBER_CAPABILITIES.VIP_UPGRADE);
    expect(MEMBER_CAPABILITY_GROUPS.MEMBER).not.toContain(MEMBER_CAPABILITIES.BUSINESS_SUBMIT);
    expect(MEMBER_CAPABILITY_GROUPS.VIP).toContain(MEMBER_CAPABILITIES.BUSINESS_SUBMIT);
    expect(MEMBER_CAPABILITY_GROUPS.VIP).not.toContain(MEMBER_CAPABILITIES.INTRODUCTIONS_SUBMIT);
    expect(MEMBER_CAPABILITY_GROUPS.VIP_WITH_PUBLISHED_BUSINESS).toContain(
      MEMBER_CAPABILITIES.INTRODUCTIONS_SUBMIT,
    );

    expect(MEMBER_DASHBOARD_TAB_VISIBILITY.MEMBER).toEqual([
      'card',
      'catalog',
      'subscription',
      'profile',
    ]);
    expect(MEMBER_DASHBOARD_TAB_VISIBILITY.VIP).not.toContain('introductions');
    expect(MEMBER_DASHBOARD_TAB_VISIBILITY.VIP_WITH_PUBLISHED_BUSINESS).toContain('introductions');
  });
});

describe('route contracts', () => {
  test('keeps member and admin route bases stable', () => {
    expect(MEMBER_API_ROUTES.ME).toBe('/api/v1/me');
    expect(ADMIN_API_BASE_PATH).toBe('/api/admin/v1');
    expect(ADMIN_API_ROUTES.STAFF_AUTH_SESSION).toBe('/api/admin/v1/staff-auth/session');
    expect(ADMIN_API_ROUTES.STAFF_AUTH_TOTP_SETUP).toBe('/api/admin/v1/staff-auth/totp/setup');
    expect(ADMIN_API_ROUTES.STAFF_AUTH_LOGOUT).toBe('/api/admin/v1/staff-auth/logout');
    expect(ADMIN_API_ROUTES.BUSINESS_APPROVE).toBe('/api/admin/v1/businesses/:id/approve');
  });

  test('defines staff auth states for the admin-app handshake', () => {
    expect(STAFF_AUTH_STATES).toEqual([
      'OTP_REQUIRED',
      'TOTP_REQUIRED',
      'TOTP_SETUP_REQUIRED',
      'AUTHENTICATED',
    ]);
  });

  test('builds parameterized route patterns', () => {
    expect(buildApiRoute(MEMBER_API_ROUTES.CARD_VERIFY, { cardNumber: 'VIP-000001' })).toBe(
      '/api/v1/cards/verify/VIP-000001',
    );
    expect(buildApiRoute(ADMIN_API_ROUTES.WEBHOOK_REPLAY, { eventId: 'evt 1' })).toBe(
      '/api/admin/v1/webhooks/evt%201/replay',
    );
  });
});

describe('public/admin DTO boundaries', () => {
  test('does not expose admin-only business fields as public DTO keys', () => {
    for (const key of ADMIN_BUSINESS_ONLY_KEYS) {
      expect(PUBLIC_BUSINESS_DTO_KEYS).not.toContain(key);
      expect(isPublicBusinessDtoKey(key)).toBe(false);
    }
  });

  test('keeps public business keys intentionally allow-listed', () => {
    expect(isPublicBusinessDtoKey('name')).toBe(true);
    expect(isPublicBusinessDtoKey('representativeEmail')).toBe(false);
    expect(isPublicBusinessDtoKey('internalNotes')).toBe(false);
  });
});

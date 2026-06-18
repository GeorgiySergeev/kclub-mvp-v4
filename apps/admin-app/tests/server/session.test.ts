import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

const mockGetCookie = mock();
const mockSetCookie = mock();

mock.module('next/headers', () => ({
  cookies: async () => ({
    get: mockGetCookie,
    set: mockSetCookie,
  }),
}));

import {
  readStaffSession,
  setStaffSession,
  clearStaffSession,
  STAFF_SESSION_COOKIE,
  STAFF_SESSION_TTL_SECONDS,
} from '../../src/server/auth/session';

describe('staff session', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    mockGetCookie.mockReset();
    mockSetCookie.mockReset();
  });

  afterEach(() => {
    (process.env as Record<string, string | undefined>).NODE_ENV = originalNodeEnv;
  });

  describe('readStaffSession', () => {
    test('returns null when no cookie exists', async () => {
      mockGetCookie.mockReturnValue(undefined);

      const session = await readStaffSession();
      expect(session).toBeNull();
    });

    test('returns token and expiry when cookie exists', async () => {
      const token = 'valid-staff-token';
      mockGetCookie.mockImplementation((name: string) =>
        name === STAFF_SESSION_COOKIE ? { value: token } : undefined,
      );

      const session = await readStaffSession();
      expect(session).not.toBeNull();
      expect(session?.token).toBe(token);
      expect(session?.expiresAtIso).toBeDefined();
    });

    test('expiry is approximately 8 hours from now', async () => {
      mockGetCookie.mockImplementation((name: string) =>
        name === STAFF_SESSION_COOKIE ? { value: 'token' } : undefined,
      );

      const before = Date.now();
      const session = await readStaffSession();
      const after = Date.now();

      const expiresAt = new Date(session!.expiresAtIso).getTime();
      const minExpected = before + STAFF_SESSION_TTL_SECONDS * 1000;
      const maxExpected = after + STAFF_SESSION_TTL_SECONDS * 1000;

      expect(expiresAt).toBeGreaterThanOrEqual(minExpected);
      expect(expiresAt).toBeLessThanOrEqual(maxExpected);
    });
  });

  describe('setStaffSession', () => {
    test('sets httpOnly secure sameSite=strict cookie in production', async () => {
      (process.env as Record<string, string>).NODE_ENV = 'production';

      await setStaffSession('test-token');

      expect(mockSetCookie).toHaveBeenCalledWith(STAFF_SESSION_COOKIE, 'test-token', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: STAFF_SESSION_TTL_SECONDS,
      });
    });

    test('sets httpOnly non-secure cookie in development', async () => {
      (process.env as Record<string, string>).NODE_ENV = 'development';

      await setStaffSession('test-token');

      expect(mockSetCookie).toHaveBeenCalledWith(STAFF_SESSION_COOKIE, 'test-token', {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        path: '/',
        maxAge: STAFF_SESSION_TTL_SECONDS,
      });
    });

    test('uses explicit expiry when provided', async () => {
      (process.env as Record<string, string>).NODE_ENV = 'development';

      const expiresAtIso = '2026-12-31T23:59:59.000Z';
      await setStaffSession('test-token', expiresAtIso);

      const call = mockSetCookie.mock.calls[0];
      expect(call[2].expires).toEqual(new Date(expiresAtIso));
    });

    test('TTL is 8 hours', () => {
      expect(STAFF_SESSION_TTL_SECONDS).toBe(60 * 60 * 8);
    });
  });

  describe('clearStaffSession', () => {
    test('clears cookie by setting maxAge to 0', async () => {
      await clearStaffSession();

      expect(mockSetCookie).toHaveBeenCalledWith(STAFF_SESSION_COOKIE, '', {
        httpOnly: true,
        secure: expect.any(Boolean),
        sameSite: 'strict',
        path: '/',
        maxAge: 0,
      });
    });
  });
});

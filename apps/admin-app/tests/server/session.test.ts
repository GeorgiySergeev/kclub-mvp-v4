import { beforeEach, afterEach, describe, expect, mock, test } from 'bun:test';

const mockCookieStore = {
  get: mock(),
  set: mock(),
};

mock.module('next/headers', () => ({
  cookies: () => Promise.resolve(mockCookieStore),
}));

describe('session', () => {
  beforeEach(() => {
    mockCookieStore.get.mockClear();
    mockCookieStore.set.mockClear();
    mockCookieStore.get.mockReturnValue(undefined);
  });

  afterEach(() => {
    mockCookieStore.get.mockClear();
    mockCookieStore.set.mockClear();
  });

  test.skip('readStaffSession returns null when no cookie exists', async () => {
    mockCookieStore.get.mockReturnValue(undefined);
    const { readStaffSession } = await import('../../src/server/auth/session');
    const session = await readStaffSession();
    expect(session).toBeNull();
  });

  test('readStaffSession returns session when cookie exists', async () => {
    mockCookieStore.get.mockImplementation((name: string) =>
      name === 'kclub_staff_session' ? { value: 'test-token' } : undefined,
    );
    const { readStaffSession } = await import('../../src/server/auth/session');
    const session = await readStaffSession();
    expect(session?.token).toBe('test-token');
    expect(session?.expiresAtIso).toBeDefined();
  });

  test('setStaffSession sets cookie with correct attributes', async () => {
    const { setStaffSession } = await import('../../src/server/auth/session');
    await setStaffSession('test-token');
    expect(mockCookieStore.set).toHaveBeenCalledWith('kclub_staff_session', 'test-token', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 60 * 60 * 8,
      path: '/',
    });
  });

  test('clearStaffSession clears the cookie', async () => {
    const { clearStaffSession } = await import('../../src/server/auth/session');
    await clearStaffSession();
    expect(mockCookieStore.set).toHaveBeenCalledWith('kclub_staff_session', '', {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 0,
      path: '/',
    });
  });
});

import { beforeEach, describe, expect, mock, test } from 'bun:test';

const mockGetCookie = mock();

mock.module('next/headers', () => ({
  cookies: async () => ({
    get: mockGetCookie,
    set: mock(),
  }),
}));

const mockRedirect = mock(() => {
  throw new Error('REDIRECT');
});

mock.module('next/navigation', () => ({
  redirect: mockRedirect,
}));

import { requireStaffSession } from '../../src/server/auth/guards';

describe('requireStaffSession', () => {
  beforeEach(() => {
    mockRedirect.mockClear();
    mockGetCookie.mockReset();
  });

  test('redirects to sign-in when no session cookie exists', async () => {
    mockGetCookie.mockReturnValue(undefined);

    try {
      await requireStaffSession();
    } catch {
      // redirect throws
    }

    expect(mockRedirect).toHaveBeenCalledWith('/auth/sign-in');
  });

  test('returns session when valid cookie exists', async () => {
    mockGetCookie.mockImplementation((name: string) =>
      name === 'kclub_staff_session' ? { value: 'valid-token' } : undefined,
    );

    const session = await requireStaffSession();

    expect(session).not.toBeNull();
    expect(session?.token).toBe('valid-token');
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});

import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';

const mockGetCookie = mock();

mock.module('next/headers', () => ({
  cookies: async () => ({
    get: mockGetCookie,
    set: mock(),
  }),
}));

import { adminApiFetch } from '../../src/server/proxy/admin-client';

describe('adminApiFetch', () => {
  const originalFetch = globalThis.fetch;
  let mockFetch: ReturnType<typeof mock>;

  beforeEach(() => {
    mockGetCookie.mockReset();
    mockFetch = mock();
    globalThis.fetch = mockFetch as unknown as typeof fetch;
    process.env.PRODUCT_CORE_API_BASE_URL = 'http://localhost:3000';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    delete process.env.PRODUCT_CORE_API_BASE_URL;
  });

  test('returns 401 when no staff session exists', async () => {
    mockGetCookie.mockReturnValue(undefined);

    const result = await adminApiFetch('/users');

    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
    expect(result.error).toBe('UNAUTHENTICATED_STAFF_SESSION');
    expect(result.data).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  test('makes GET request with auth header on success', async () => {
    mockGetCookie.mockImplementation((name: string) =>
      name === 'kclub_staff_session' ? { value: 'valid-token' } : undefined,
    );

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: { totalUsers: 42 }, error: null }),
    });

    const result = await adminApiFetch('/dashboard-metrics');

    expect(result.ok).toBe(true);
    expect(result.status).toBe(200);
    expect(result.data).toEqual({ data: { totalUsers: 42 }, error: null });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/admin/v1/dashboard-metrics',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          authorization: 'Bearer valid-token',
          'content-type': 'application/json',
        }),
      }),
    );
  });

  test('makes POST request with body', async () => {
    mockGetCookie.mockImplementation((name: string) =>
      name === 'kclub_staff_session' ? { value: 'valid-token' } : undefined,
    );

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: { id: 'user-1' }, error: null }),
    });

    const result = await adminApiFetch('/users/user-1/block', {
      method: 'POST',
      body: { reason: 'spam' },
    });

    expect(result.ok).toBe(true);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/admin/v1/users/user-1/block',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ reason: 'spam' }),
      }),
    );
  });

  test('returns error result when upstream returns non-ok', async () => {
    mockGetCookie.mockImplementation((name: string) =>
      name === 'kclub_staff_session' ? { value: 'valid-token' } : undefined,
    );

    mockFetch.mockResolvedValue({
      ok: false,
      status: 403,
    });

    const result = await adminApiFetch('/users');

    expect(result.ok).toBe(false);
    expect(result.status).toBe(403);
    expect(result.error).toBe('ADMIN_API_403');
    expect(result.data).toBeNull();
  });

  test('uses no-store cache by default', async () => {
    mockGetCookie.mockImplementation((name: string) =>
      name === 'kclub_staff_session' ? { value: 'valid-token' } : undefined,
    );

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: [], error: null }),
    });

    await adminApiFetch('/users');

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ cache: 'no-store' }),
    );
  });
});

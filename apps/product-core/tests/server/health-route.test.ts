import { describe, expect, test } from 'bun:test';

import { GET } from '../../src/app/api/health/route';

describe('health route', () => {
  test('returns the shared API envelope', async () => {
    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toEqual({ status: 'ok', app: 'product-core' });
    expect(body.error).toBeNull();
    expect(body.meta.timestamp).toBeString();
  });
});

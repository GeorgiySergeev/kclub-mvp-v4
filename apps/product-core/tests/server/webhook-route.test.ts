import { describe, expect, test, mock } from 'bun:test';

const mockConstructEvent = mock(() => ({}));

mock.module('@/server/stripe/client', () => ({
  getStripeClient: () => ({
    webhooks: {
      constructEvent: mockConstructEvent,
    },
  }),
}));

mock.module('@/server/stripe/env', () => ({
  readStripeEnv: () => ({ STRIPE_WEBHOOK_SECRET: 'whsec_test' }),
}));

const { POST } = await import('../../src/app/api/stripe/webhook/route');

function createRequest(body: string, signature: string | null): Request {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  if (signature !== null) {
    headers['stripe-signature'] = signature;
  }
  return new Request('http://localhost/api/stripe/webhook', {
    method: 'POST',
    headers,
    body,
  });
}

describe('POST /api/stripe/webhook', () => {
  test('missing stripe-signature header returns 400 with SERVER_STRIPE_WEBHOOK_INVALID', async () => {
    const request = createRequest('{}', null);
    const response = await POST(request as any);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('SERVER_STRIPE_WEBHOOK_INVALID');
    expect(body.error.message).toContain('Missing stripe-signature');
  });

  test('invalid signature returns 400 with SERVER_STRIPE_WEBHOOK_INVALID', async () => {
    mockConstructEvent.mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const request = createRequest('{}', 'bad_signature');
    const response = await POST(request as any);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('SERVER_STRIPE_WEBHOOK_INVALID');
  });
});

import { type NextRequest } from 'next/server';

import { ERROR_CODES } from '@kclub/contracts';

import { getStripeClient } from '@/server/stripe/client';
import { readStripeEnv } from '@/server/stripe/env';
import { jsonError, jsonErrorFromUnknown } from '@/server/api';

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return jsonError(
      { code: ERROR_CODES.SERVER_STRIPE_WEBHOOK_INVALID, message: 'Missing stripe-signature header' },
      undefined,
      { status: 400 },
    );
  }

  let event;
  try {
    const env = readStripeEnv();
    event = getStripeClient().webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return jsonError(
      { code: ERROR_CODES.SERVER_STRIPE_WEBHOOK_INVALID, message: 'Invalid stripe signature' },
      undefined,
      { status: 400 },
    );
  }

  try {
    const { processStripeEvent } = await import('@/server/services/webhook-service');
    await processStripeEvent(event);
    return new Response(null, { status: 200 });
  } catch {
    return new Response(null, { status: 500 });
  }
}

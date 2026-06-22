import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { ERROR_CODES } from '@kclub/contracts';

import { getPrismaClient } from '@/server/db';
import { jsonError } from '@/server/api';
import { createLogger } from '@/server/logger';

let stripeClient: Stripe | null = null;

function getWebhookSecret(): string | undefined {
  return process.env.STRIPE_WEBHOOK_SECRET;
}

function getStripeClient(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripeClient = new Stripe(secretKey, { apiVersion: '2025-04-10' as any });
  }
  return stripeClient;
}

async function getWebhookEvent(rawBody: string, signature: string): Promise<Stripe.Event> {
  const secret = getWebhookSecret();
  if (!secret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }
  return getStripeClient().webhooks.constructEvent(rawBody, signature, secret);
}

export async function POST(request: Request): Promise<Response> {
  const log = createLogger();

  if (!getWebhookSecret()) {
    log.error('Webhook not configured');
    return jsonError(
      { code: ERROR_CODES.SERVER_ERROR, message: 'Webhook is not configured' },
      undefined,
      { status: 500 },
    );
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    log.error('Webhook missing stripe-signature header');
    return jsonError(
      { code: ERROR_CODES.VALIDATION_INVALID_INPUT, message: 'Missing stripe-signature header' },
      undefined,
      { status: 400 },
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    log.error('Webhook failed to read request body');
    return jsonError(
      { code: ERROR_CODES.VALIDATION_INVALID_INPUT, message: 'Failed to read request body' },
      undefined,
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = await getWebhookEvent(rawBody, signature);
  } catch (err) {
    log.webhook('Webhook invalid signature', { error: err });
    return jsonError(
      { code: ERROR_CODES.VALIDATION_INVALID_INPUT, message: 'Invalid webhook signature' },
      undefined,
      { status: 400 },
    );
  }

  const prisma = getPrismaClient();

  const existing = await prisma.stripeWebhookEvent.findUnique({
    where: { event_id: event.id },
    select: { id: true, handler_status: true },
  });

  if (existing) {
    log.webhook('Webhook duplicate event received', {
      eventId: event.id,
      eventType: event.type,
      previousStatus: existing.handler_status,
    });
    return NextResponse.json({
      data: { received: true, duplicate: true, status: existing.handler_status },
      error: null,
    });
  }

  log.webhook('Webhook event received', {
    eventId: event.id,
    eventType: event.type,
    livemode: event.livemode,
  });

  const stripeEvent = await prisma.stripeWebhookEvent.create({
    data: {
      event_id: event.id,
      event_type: event.type,
      livemode: event.livemode,
      payload: JSON.parse(JSON.stringify(event.data.object)),
      handler_status: 'RECEIVED',
    },
  });

  try {
    await handleEvent(event);
    await prisma.stripeWebhookEvent.update({
      where: { id: stripeEvent.id },
      data: { handler_status: 'PROCESSED', processed_at: new Date() },
    });
    log.webhook('Webhook event processed successfully', {
      eventId: event.id,
      eventType: event.type,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    await prisma.stripeWebhookEvent.update({
      where: { id: stripeEvent.id },
      data: { handler_status: 'FAILED', error_message: message },
    });
    log.webhook('Webhook event processing failed', {
      eventId: event.id,
      eventType: event.type,
      error: { message },
    });
    return jsonError(
      { code: ERROR_CODES.SERVER_ERROR, message: 'Webhook processing failed' },
      undefined,
      { status: 500 },
    );
  }

  return NextResponse.json({ data: { received: true, duplicate: false }, error: null });
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutSessionCompleted(session);
      return;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
    case 'invoice.payment_failed': {
      return;
    }

    default: {
      return;
    }
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const metadata = session.metadata as Record<string, string> | null;

  if (!metadata?.type || !metadata?.userId) {
    return;
  }

  const prisma = getPrismaClient();
  const customerId = typeof session.customer === 'string' ? session.customer : null;
  const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null;
  const userId = metadata.userId;

  if (metadata.type === 'vip') {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { membership_tier: 'VIP' },
      });

      await tx.vipSubscription.upsert({
        where: { stripe_subscription_id: subscriptionId ?? '' },
        create: {
          user_id: userId,
          status: 'ACTIVE',
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
        update: {
          status: 'ACTIVE',
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });
    });
    return;
  }

  if (metadata.type === 'placement' && metadata.businessProfileId) {
    const businessProfileId = metadata.businessProfileId;
    await prisma.$transaction(async (tx) => {
      await tx.businessProfile.update({
        where: { id: businessProfileId },
        data: { status: 'PUBLISHED', published_at: new Date() },
      });

      await tx.subscription.upsert({
        where: { stripe_subscription_id: subscriptionId ?? '' },
        create: {
          user_id: userId,
          business_profile_id: businessProfileId,
          kind: 'BUSINESS_PLACEMENT',
          status: 'ACTIVE',
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          current_period_start: new Date(),
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
        update: {
          status: 'ACTIVE',
          current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });
    });
    return;
  }
}

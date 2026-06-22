import { makeEntityId, makeIsoDate, nextSequence, type FactoryOverrides, withOverrides } from './shared';

export const STRIPE_EVENT_TYPES = [
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_failed',
] as const;

export type StripeEventType = (typeof STRIPE_EVENT_TYPES)[number];

export type TestStripeWebhookEvent = {
  id: string;
  object: 'event';
  type: StripeEventType;
  api_version: string;
  created: number;
  data: {
    object: Record<string, unknown>;
  };
  livemode: boolean;
  pending_webhooks: number;
  request: {
    id: string | null;
    idempotency_key: string | null;
  };
};

function makeCheckoutSessionData(sequence: number): Record<string, unknown> {
  return {
    id: `cs_${sequence.toString().padStart(8, '0')}`,
    object: 'checkout.session',
    mode: 'subscription',
    customer: `cus_${sequence.toString().padStart(8, '0')}`,
    subscription: `sub_${sequence.toString().padStart(8, '0')}`,
    metadata: {
      type: 'vip',
      userId: makeEntityId('member', sequence),
    },
    client_reference_id: makeEntityId('member', sequence),
    currency: 'usd',
    amount_total: 2999,
    payment_status: 'paid',
    status: 'complete',
  };
}

function makePlacementCheckoutSessionData(sequence: number): Record<string, unknown> {
  return {
    id: `cs_${sequence.toString().padStart(8, '0')}`,
    object: 'checkout.session',
    mode: 'subscription',
    customer: `cus_${sequence.toString().padStart(8, '0')}`,
    subscription: `sub_${sequence.toString().padStart(8, '0')}`,
    metadata: {
      type: 'business_placement',
      userId: makeEntityId('member', sequence),
      businessId: makeEntityId('business', sequence),
    },
    client_reference_id: makeEntityId('member', sequence),
    currency: 'usd',
    amount_total: 999,
    payment_status: 'paid',
    status: 'complete',
  };
}

function makeSubscriptionData(sequence: number): Record<string, unknown> {
  const currentPeriodEnd = makeIsoDate(sequence, 30);
  return {
    id: `sub_${sequence.toString().padStart(8, '0')}`,
    object: 'subscription',
    customer: `cus_${sequence.toString().padStart(8, '0')}`,
    status: 'active',
    current_period_start: Math.floor(Date.now() / 1000) - 86400,
    current_period_end: Math.floor(Date.parse(currentPeriodEnd) / 1000),
    cancel_at_period_end: false,
    canceled_at: null,
    metadata: {
      type: 'vip',
      userId: makeEntityId('member', sequence),
    },
    items: {
      data: [
        {
          price: {
            id: `price_${sequence.toString().padStart(8, '0')}`,
            product: `prod_${sequence.toString().padStart(8, '0')}`,
            currency: 'usd',
            unit_amount: 2999,
            recurring: { interval: 'month' },
          },
        },
      ],
    },
  };
}

function makeInvoiceData(sequence: number): Record<string, unknown> {
  return {
    id: `in_${sequence.toString().padStart(8, '0')}`,
    object: 'invoice',
    subscription: `sub_${sequence.toString().padStart(8, '0')}`,
    customer: `cus_${sequence.toString().padStart(8, '0')}`,
    amount_due: 2999,
    amount_paid: 0,
    amount_remaining: 2999,
    status: 'open',
    paid: false,
    attempt_count: 1,
    next_payment_attempt: Math.floor(Date.now() / 1000) + 86400,
    metadata: {},
  };
}

export type CheckoutSessionType = 'vip' | 'business_placement';

export function createStripeWebhookEvent(
  overrides?: FactoryOverrides<TestStripeWebhookEvent> & { checkoutType?: CheckoutSessionType },
): TestStripeWebhookEvent {
  const sequence = nextSequence('stripe-event');
  const eventType: StripeEventType = overrides?.type ?? 'checkout.session.completed';
  const checkoutType: CheckoutSessionType = overrides?.checkoutType ?? 'vip';

  let dataObject: Record<string, unknown>;
  switch (eventType) {
    case 'checkout.session.completed':
      dataObject = checkoutType === 'business_placement'
        ? makePlacementCheckoutSessionData(sequence)
        : makeCheckoutSessionData(sequence);
      break;
    case 'invoice.payment_failed':
      dataObject = makeInvoiceData(sequence);
      break;
    default:
      dataObject = makeSubscriptionData(sequence);
  }

  const restOverrides: Record<string, unknown> = {};
  if (overrides) {
    for (const key of Object.keys(overrides)) {
      if (key !== 'checkoutType') {
        restOverrides[key] = overrides[key as keyof typeof overrides];
      }
    }
  }

  return withOverrides(
    {
      id: `evt_${sequence.toString().padStart(8, '0')}`,
      object: 'event',
      type: eventType,
      api_version: '2025-01-27.acacia',
      created: 1735689600 + sequence,
      data: { object: dataObject },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: null,
        idempotency_key: null,
      },
    },
    restOverrides as FactoryOverrides<TestStripeWebhookEvent>,
  );
}

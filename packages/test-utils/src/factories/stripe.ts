import { makeEntityId, nextSequence, type FactoryOverrides, withOverrides } from './shared';

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

export function createStripeWebhookEvent(
  overrides?: FactoryOverrides<TestStripeWebhookEvent>,
): TestStripeWebhookEvent {
  const sequence = nextSequence('stripe-event');
  const eventType: StripeEventType = overrides?.type ?? 'checkout.session.completed';

  return withOverrides(
    {
      id: `evt_${sequence.toString().padStart(8, '0')}`,
      object: 'event',
      type: eventType,
      api_version: '2025-01-27.acacia',
      created: 1735689600 + sequence,
      data: {
        object:
          eventType === 'checkout.session.completed'
            ? {
                id: `cs_${sequence.toString().padStart(8, '0')}`,
                object: 'checkout.session',
                customer: `cus_${sequence.toString().padStart(8, '0')}`,
                subscription: `sub_${sequence.toString().padStart(8, '0')}`,
                metadata: {
                  businessProfileId: makeEntityId('business', sequence),
                  userId: makeEntityId('member', sequence),
                },
              }
            : {
                id: `sub_${sequence.toString().padStart(8, '0')}`,
                object: 'subscription',
                customer: `cus_${sequence.toString().padStart(8, '0')}`,
                status: 'active',
              },
      },
      livemode: false,
      pending_webhooks: 1,
      request: {
        id: null,
        idempotency_key: null,
      },
    },
    overrides,
  );
}

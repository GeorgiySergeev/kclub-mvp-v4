import type { SubscriptionStatus } from '@kclub/contracts';

import {
  makeEntityId,
  makeIsoDate,
  nextSequence,
  type FactoryOverrides,
  withOverrides,
} from './shared';

export type TestVipSubscription = {
  id: string;
  userId: string;
  status: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
};

export function createVipSubscription(
  overrides?: FactoryOverrides<TestVipSubscription>,
): TestVipSubscription {
  const sequence = nextSequence('vip-subscription');
  const createdAt = makeIsoDate(sequence, 6);
  const currentPeriodEnd = makeIsoDate(sequence, 20);

  return withOverrides(
    {
      id: makeEntityId('vip-subscription', sequence),
      userId: makeEntityId('member', sequence),
      status: 'ACTIVE',
      stripeCustomerId: `cus_${sequence.toString().padStart(8, '0')}`,
      stripeSubscriptionId: `sub_${sequence.toString().padStart(8, '0')}`,
      stripePriceId: `price_${sequence.toString().padStart(8, '0')}`,
      currentPeriodStart: createdAt,
      currentPeriodEnd,
      cancelAtPeriodEnd: false,
      createdAt,
      updatedAt: createdAt,
    },
    overrides,
  );
}

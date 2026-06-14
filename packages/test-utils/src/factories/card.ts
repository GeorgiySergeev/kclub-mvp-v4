import type { ClubCardStatus, MemberCardDto, MemberTier } from '@kclub/contracts';

import {
  makeCardNumber,
  makeEntityId,
  makeIsoDate,
  nextSequence,
  type FactoryOverrides,
  withOverrides,
} from './shared';

export type TestMemberCard = MemberCardDto;

export function createCard(overrides?: FactoryOverrides<TestMemberCard>): TestMemberCard {
  const sequence = nextSequence('card');
  const membershipTier: MemberTier = overrides?.membershipTier ?? 'MEMBER';
  const issuedAt = makeIsoDate(sequence, 4);
  const status: ClubCardStatus = overrides?.status ?? 'ACTIVE';

  return withOverrides(
    {
      id: makeEntityId('card', sequence),
      userId: makeEntityId('member', sequence),
      cardNumber: makeCardNumber(membershipTier, sequence),
      status,
      membershipTier,
      qrPayloadUrl: `https://www.kylyvnyk.club/verify-card/${makeCardNumber(membershipTier, sequence)}`,
      issuedAt,
      expiresAt: status === 'EXPIRED' ? issuedAt : null,
    },
    overrides,
  );
}

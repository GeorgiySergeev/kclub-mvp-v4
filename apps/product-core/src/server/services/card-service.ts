import {
  ERROR_CODES,
  type ClubCardStatus,
  type MemberCardDto,
  type MemberTier,
  type PublicCardVerificationDto,
} from '@kclub/contracts';
import { canIssueNewActiveCard, canTransitionCardStatus } from '@kclub/domain';

import { AppError } from '@/server/errors';
import { getPrismaClient } from '@/server/db';
import { formatCardNumber, cardNumberToTierPrefix, parseCardNumber } from './card-helpers';

export type CardRecord = {
  id: string;
  user_id: string;
  card_number: string;
  membership_tier: string;
  status: string;
  qr_payload_url: string | null;
  issued_at: Date;
  expires_at: Date | null;
  revoked_at: Date | null;
  revoked_reason: string | null;
};

export type CardWithUserDisplayName = CardRecord & {
  user: { display_name: string | null };
};

export function toMemberCardDto(card: CardRecord): MemberCardDto {
  return {
    id: card.id,
    userId: card.user_id,
    cardNumber: card.card_number,
    status: card.status as ClubCardStatus,
    membershipTier: card.membership_tier as MemberTier,
    qrPayloadUrl: card.qr_payload_url ?? '',
    issuedAt: card.issued_at.toISOString(),
    expiresAt: card.expires_at?.toISOString() ?? null,
  };
}

export function toPublicCardVerificationDto(
  card: CardWithUserDisplayName,
): PublicCardVerificationDto {
  return {
    cardNumber: card.card_number,
    status: card.status as ClubCardStatus,
    membershipTier: card.membership_tier as MemberTier,
    displayName: card.user.display_name,
    issuedAt: card.issued_at.toISOString(),
    expiresAt: card.expires_at?.toISOString() ?? null,
  };
}

async function generateNextCardNumber(tierPrefix: 'VIP' | 'MEM' = 'MEM'): Promise<string> {
  const prisma = getPrismaClient();

  const lastCard = await prisma.memberCard.findFirst({
    orderBy: { card_number: 'desc' },
    select: { card_number: true },
  });

  let nextSeq = 1;
  if (lastCard) {
    try {
      const { sequence } = parseCardNumber(lastCard.card_number);
      nextSeq = sequence + 1;
    } catch {
      nextSeq = 1;
    }
  }

  return formatCardNumber(tierPrefix, nextSeq);
}

export async function getActiveCardForUser(userId: string): Promise<CardRecord | null> {
  const prisma = getPrismaClient();

  const card = await prisma.memberCard.findFirst({
    where: { user_id: userId, status: 'ACTIVE' },
    orderBy: { issued_at: 'desc' },
  });

  return card;
}

export async function issueCardForUser(
  userId: string,
  membershipTier: string,
): Promise<CardRecord> {
  const prisma = getPrismaClient();

  const activeCardCount = await prisma.memberCard.count({
    where: { user_id: userId, status: 'ACTIVE' },
  });

  if (!canIssueNewActiveCard(activeCardCount)) {
    throw new AppError({
      code: ERROR_CODES.CARD_ALREADY_ACTIVE,
      message: 'User already has an active card',
      status: 409,
    });
  }

  const tierPrefix = cardNumberToTierPrefix(membershipTier as 'MEMBER' | 'VIP');

  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const cardNumber = await generateNextCardNumber(tierPrefix);

      const card = await prisma.memberCard.create({
        data: {
          user_id: userId,
          card_number: cardNumber,
          membership_tier: membershipTier as MemberTier,
          qr_payload_url: `/verify-card/${cardNumber}`,
        },
      });

      return card;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        attempt++;
        if (attempt >= MAX_RETRIES) {
          throw new AppError({
            code: ERROR_CODES.SERVER_ERROR,
            message: 'Failed to generate a unique card number after multiple attempts.',
            status: 500,
          });
        }
        continue;
      }
      throw error;
    }
  }

  throw new Error('Unreachable code');
}

export async function issueCardForUserIfNoneActive(
  userId: string,
  membershipTier: string,
): Promise<CardRecord | null> {
  const activeCard = await getActiveCardForUser(userId);
  if (activeCard) return null;

  return issueCardForUser(userId, membershipTier);
}

export async function revokeCard(cardId: string, reason?: string): Promise<CardRecord> {
  const prisma = getPrismaClient();

  const card = await prisma.memberCard.findUnique({
    where: { id: cardId },
  });

  if (!card) {
    throw new AppError({
      code: ERROR_CODES.CARD_NOT_FOUND,
      message: 'Card not found',
      status: 404,
    });
  }

  if (!canTransitionCardStatus(card.status as ClubCardStatus, 'REVOKED')) {
    throw new AppError({
      code: ERROR_CODES.CARD_INVALID_STATUS_TRANSITION,
      message: `Cannot revoke a card with status ${card.status}`,
      status: 409,
    });
  }

  const updated = await prisma.memberCard.update({
    where: { id: cardId },
    data: {
      status: 'REVOKED',
      revoked_at: new Date(),
      revoked_reason: reason ?? null,
    },
  });

  return updated;
}

export async function reissueCard(
  userId: string,
  membershipTier: string,
  currentCardId: string,
  revokeReason?: string,
): Promise<CardRecord> {
  const prisma = getPrismaClient();

  const MAX_RETRIES = 3;
  let attempt = 0;

  while (attempt < MAX_RETRIES) {
    try {
      const [newCard] = await prisma.$transaction(async (tx) => {
        const card = await tx.memberCard.findUnique({
          where: { id: currentCardId },
        });

        if (!card) {
          throw new AppError({
            code: ERROR_CODES.CARD_NOT_FOUND,
            message: 'Card not found',
            status: 404,
          });
        }

        if (!canTransitionCardStatus(card.status as ClubCardStatus, 'REVOKED')) {
          throw new AppError({
            code: ERROR_CODES.CARD_INVALID_STATUS_TRANSITION,
            message: `Cannot reissue: current card status is ${card.status}`,
            status: 409,
          });
        }

        await tx.memberCard.update({
          where: { id: currentCardId },
          data: {
            status: 'REVOKED',
            revoked_at: new Date(),
            revoked_reason: revokeReason ?? null,
          },
        });

        const tierPrefix = cardNumberToTierPrefix(membershipTier as 'MEMBER' | 'VIP');
        const cardNumber = await generateNextCardNumber(tierPrefix);

        const newCardRecord = await tx.memberCard.create({
          data: {
            user_id: userId,
            card_number: cardNumber,
            membership_tier: membershipTier as MemberTier,
            qr_payload_url: `/verify-card/${cardNumber}`,
          },
        });

        return [newCardRecord];
      });

      return newCard;
    } catch (error: any) {
      if (error?.code === 'P2002') {
        attempt++;
        if (attempt >= MAX_RETRIES) {
          throw new AppError({
            code: ERROR_CODES.SERVER_ERROR,
            message: 'Failed to generate a unique card number after multiple attempts.',
            status: 500,
          });
        }
        continue;
      }
      throw error;
    }
  }

  throw new Error('Unreachable code');
}

export async function publicVerifyCard(cardNumber: string): Promise<PublicCardVerificationDto> {
  const prisma = getPrismaClient();

  const card = await prisma.memberCard.findUnique({
    where: { card_number: cardNumber },
    include: { user: { select: { display_name: true } } },
  });

  if (!card) {
    throw new AppError({
      code: ERROR_CODES.CARD_NOT_FOUND,
      message: 'Card not found',
      status: 404,
    });
  }

  return toPublicCardVerificationDto(card);
}

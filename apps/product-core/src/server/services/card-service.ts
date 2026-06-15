import { ERROR_CODES, type MemberCardDto, type ClubCardStatus, type MemberTier } from '@kclub/contracts';
import { canIssueNewActiveCard } from '@kclub/domain';

import { AppError } from '@/server/errors';
import { getPrismaClient } from '@/server/db';

export type CardRecord = {
  id: string;
  user_id: string;
  card_number: string;
  membership_tier: string;
  status: string;
  qr_payload_url: string | null;
  issued_at: Date;
  expires_at: Date | null;
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

async function generateNextCardNumber(): Promise<string> {
  const prisma = getPrismaClient();

  const lastCard = await prisma.memberCard.findFirst({
    where: { card_number: { startsWith: 'MEM-' } },
    orderBy: { card_number: 'desc' },
    select: { card_number: true },
  });

  let nextSeq = 1;
  if (lastCard) {
    const parts = lastCard.card_number.split('-');
    if (parts.length === 2) {
      nextSeq = parseInt(parts[1], 10) + 1;
    }
  }

  return `MEM-${String(nextSeq).padStart(6, '0')}`;
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

  const cardNumber = await generateNextCardNumber();

  const card = await prisma.memberCard.create({
    data: {
      user_id: userId,
      card_number: cardNumber,
      membership_tier: membershipTier as MemberTier,
      qr_payload_url: `/verify-card/${cardNumber}`,
    },
  });

  return card;
}

export async function issueCardForUserIfNoneActive(
  userId: string,
  membershipTier: string,
): Promise<CardRecord | null> {
  const prisma = getPrismaClient();

  const activeCardCount = await prisma.memberCard.count({
    where: { user_id: userId, status: 'ACTIVE' },
  });

  if (!canIssueNewActiveCard(activeCardCount)) {
    return null;
  }

  return issueCardForUser(userId, membershipTier);
}

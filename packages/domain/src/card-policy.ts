import type { ClubCardStatus, MemberTier } from '@kclub/contracts';

export const ACTIVE_CARD_MAX_PER_USER = 1;

const CARD_STATUS_TRANSITIONS: Record<ClubCardStatus, readonly ClubCardStatus[]> = {
  ACTIVE: ['REVOKED', 'EXPIRED'],
  REVOKED: [],
  EXPIRED: [],
};

export function canTransitionCardStatus(current: ClubCardStatus, next: ClubCardStatus): boolean {
  return CARD_STATUS_TRANSITIONS[current].includes(next);
}

export function shouldKeepExistingCardOnTierChange(
  previousTier: MemberTier,
  nextTier: MemberTier,
): boolean {
  return previousTier === 'MEMBER' && nextTier === 'VIP';
}

export function canIssueNewActiveCard(activeCardCount: number): boolean {
  return activeCardCount < ACTIVE_CARD_MAX_PER_USER;
}

export function getCardLifecycleState(status: ClubCardStatus): {
  isActive: boolean;
  isTerminal: boolean;
} {
  return {
    isActive: status === 'ACTIVE',
    isTerminal: status === 'REVOKED' || status === 'EXPIRED',
  };
}

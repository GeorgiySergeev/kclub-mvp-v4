import { describe, expect, test } from 'bun:test';

import type { PublicBusinessListItemDto, PublicCardVerificationDto } from '@kclub/contracts';

import {
  getFeaturedBusinessGroups,
  isPublicCardVerificationPiiSafe,
} from '../src/features/public/public-page-helpers';
import { PUBLIC_BUSINESS_VISIBILITY_FILTER } from '../src/server/services/business-service';

function createPublicBusiness(
  id: string,
  flags: Partial<Pick<PublicBusinessListItemDto, 'featuredTop' | 'featuredRecommended'>> = {},
): PublicBusinessListItemDto {
  return {
    id,
    slug: `partner-${id}`,
    name: `Partner ${id}`,
    categoryName: 'Hospitality',
    countryName: 'United States',
    cityName: 'New York',
    briefDescription: null,
    websiteUrl: null,
    socialUrl: null,
    featuredTop: flags.featuredTop ?? false,
    featuredRecommended: flags.featuredRecommended ?? false,
  };
}

describe('public business presentation helpers', () => {
  test('limits featured top and recommended blocks to published DTOs supplied by the public service', () => {
    const businesses = [
      createPublicBusiness('1', { featuredTop: true, featuredRecommended: true }),
      createPublicBusiness('2', { featuredTop: true }),
      createPublicBusiness('3', { featuredTop: true }),
      createPublicBusiness('4', { featuredTop: true }),
      createPublicBusiness('5', { featuredRecommended: true }),
      createPublicBusiness('6', { featuredRecommended: true }),
      createPublicBusiness('7', { featuredRecommended: true }),
      createPublicBusiness('8', { featuredRecommended: true }),
    ];

    const groups = getFeaturedBusinessGroups(businesses);

    expect(groups.top.map((business) => business.id)).toEqual(['1', '2', '3']);
    expect(groups.recommended.map((business) => business.id)).toEqual(['5', '6', '7']);
  });

  test('public business queries are pinned to published visibility', () => {
    expect(PUBLIC_BUSINESS_VISIBILITY_FILTER).toEqual({ status: 'PUBLISHED' });
  });
});

describe('public card verification presentation helpers', () => {
  test('accepts the public card DTO shape', () => {
    const card: PublicCardVerificationDto = {
      cardNumber: 'MEM-000001',
      status: 'ACTIVE',
      membershipTier: 'MEMBER',
      displayName: 'John',
      issuedAt: '2026-06-16T10:00:00.000Z',
      expiresAt: null,
    };

    expect(isPublicCardVerificationPiiSafe(card)).toBe(true);
  });

  test('rejects accidental private card or member fields', () => {
    const leakedCard = {
      cardNumber: 'MEM-000001',
      status: 'ACTIVE',
      membershipTier: 'MEMBER',
      displayName: 'John',
      issuedAt: '2026-06-16T10:00:00.000Z',
      expiresAt: null,
      userId: 'user-1',
      phone: '+15551234567',
    } as unknown as PublicCardVerificationDto;

    expect(isPublicCardVerificationPiiSafe(leakedCard)).toBe(false);
  });
});

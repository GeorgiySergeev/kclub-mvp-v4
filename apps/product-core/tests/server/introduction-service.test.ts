import { describe, expect, test } from 'bun:test';

import { toMemberIntroductionDto } from '../../src/server/services/introduction-service';

describe('toMemberIntroductionDto', () => {
  const baseIntro = {
    id: 'intro-1',
    requester_user_id: 'user-1',
    requester_business_id: 'bus-1',
    target_business_id: 'bus-2',
    status: 'SUBMITTED' as const,
    message: 'Hello',
    rejection_reason: null,
    created_at: new Date('2026-06-15T10:00:00.000Z'),
    updated_at: new Date('2026-06-15T10:00:00.000Z'),
    requester_business: { name: 'My Biz', slug: 'my-biz' },
    target_business: { name: 'Target Biz', slug: 'target-biz' },
  };

  test('maps to member introduction DTO correctly', () => {
    const dto = toMemberIntroductionDto(baseIntro);

    expect(dto).toEqual({
      id: 'intro-1',
      requesterUserId: 'user-1',
      requesterBusinessId: 'bus-1',
      targetBusinessId: 'bus-2',
      status: 'SUBMITTED',
      message: 'Hello',
      rejectionReason: null,
      createdAt: '2026-06-15T10:00:00.000Z',
      updatedAt: '2026-06-15T10:00:00.000Z',
      requesterBusinessName: 'My Biz',
      requesterBusinessSlug: 'my-biz',
      targetBusinessName: 'Target Biz',
      targetBusinessSlug: 'target-biz',
    });
  });

  test('maps rejection reason correctly', () => {
    const dto = toMemberIntroductionDto({
      ...baseIntro,
      status: 'REJECTED' as const,
      rejection_reason: 'Too busy',
    });

    expect(dto.status).toBe('REJECTED');
    expect(dto.rejectionReason).toBe('Too busy');
  });
});

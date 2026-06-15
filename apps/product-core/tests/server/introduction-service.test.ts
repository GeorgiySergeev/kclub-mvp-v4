import { describe, expect, test } from 'bun:test';

import { toIntroductionDto } from '../../src/server/services/introduction-service';

describe('toIntroductionDto', () => {
  const baseIntro = {
    id: 'intro-1',
    requester_user_id: 'user-1',
    requester_business_id: 'bus-1',
    target_business_id: 'bus-2',
    status: 'SUBMITTED',
    message: 'Hello',
    rejection_reason: null,
    created_at: new Date('2026-06-15T10:00:00.000Z'),
    updated_at: new Date('2026-06-15T10:00:00.000Z'),
  };

  test('maps to introduction DTO correctly', () => {
    const dto = toIntroductionDto(baseIntro);

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
    });
  });

  test('maps rejection reason correctly', () => {
    const dto = toIntroductionDto({
      ...baseIntro,
      status: 'REJECTED',
      rejection_reason: 'Too busy',
    });

    expect(dto.status).toBe('REJECTED');
    expect(dto.rejectionReason).toBe('Too busy');
  });
});

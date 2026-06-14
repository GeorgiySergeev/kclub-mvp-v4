import { ERROR_CODES } from '@kclub/contracts';
import { describe, expect, test } from 'bun:test';

import {
  businessListFilterSchema,
  businessProfileEditableFieldsSchema,
  businessProfileSubmitSchema,
  entityIdParamSchema,
  formatZodError,
  introductionCancelSchema,
  introductionListFilterSchema,
  introductionSubmitSchema,
  memberOnboardingSchema,
  memberProfileUpdateSchema,
  parseWithValidation,
  phoneOtpSendSchema,
  phoneOtpVerifySchema,
  staffTotpSetupSchema,
  staffTotpVerifySchema,
} from '../src';

const uuid = '11111111-1111-4111-8111-111111111111';
const secondUuid = '22222222-2222-4222-8222-222222222222';

function expectInvalidField(
  schema: { safeParse: (value: unknown) => { success: boolean; error?: unknown } },
  value: unknown,
  path: string,
) {
  const result = schema.safeParse(value);
  expect(result.success).toBe(false);
  if (!result.success) {
    const formatted = formatZodError(result.error as never);
    expect(formatted.issues.filter((issue) => issue.path === path)).toHaveLength(1);
  }
}

describe('auth schemas', () => {
  test('validates phone OTP send and verify payloads', () => {
    expect(
      phoneOtpSendSchema.parse({
        phone: '+15551234567',
        purpose: 'sign-up',
        locale: 'en',
      }),
    ).toEqual({
      phone: '+15551234567',
      purpose: 'sign-up',
      locale: 'en',
    });

    expect(
      phoneOtpVerifySchema.parse({
        phone: '+15551234567',
        code: '123456',
        purpose: 'sign-in',
      }),
    ).toEqual({
      phone: '+15551234567',
      code: '123456',
      purpose: 'sign-in',
    });
  });

  test('returns clear field errors for invalid OTP inputs', () => {
    expectInvalidField(phoneOtpSendSchema, { phone: '555', purpose: 'sign-up' }, 'phone');
    expectInvalidField(
      phoneOtpVerifySchema,
      { phone: '+15551234567', code: 'abc', purpose: 'sign-in' },
      'code',
    );
  });
});

describe('member schemas', () => {
  test('validates onboarding and profile updates', () => {
    expect(
      memberOnboardingSchema.parse({
        phone: '+15551234567',
        displayName: 'Member Name',
        localePreference: 'uk',
        termsAccepted: true,
      }),
    ).toEqual({
      phone: '+15551234567',
      displayName: 'Member Name',
      localePreference: 'uk',
      termsAccepted: true,
    });

    expect(memberProfileUpdateSchema.parse({ displayName: 'Updated Name' })).toEqual({
      displayName: 'Updated Name',
    });
  });

  test('rejects incomplete onboarding and empty profile updates', () => {
    expectInvalidField(
      memberOnboardingSchema,
      {
        phone: '+15551234567',
        displayName: 'A',
        localePreference: 'en',
        termsAccepted: true,
      },
      'displayName',
    );

    expect(memberProfileUpdateSchema.safeParse({}).success).toBe(false);
  });
});

describe('business schemas', () => {
  const validBusiness = {
    name: 'Kylyvnyk Partner',
    representativeName: 'Partner Owner',
    representativeEmail: 'owner@example.com',
    representativePhone: '+15551234567',
    countryId: uuid,
    cityId: secondUuid,
    categoryId: 'cabc123456789',
    websiteUrl: 'https://example.com',
    briefDescription: 'Private member service',
  };

  test('validates business submit, editable fields, and filters', () => {
    expect(businessProfileSubmitSchema.parse(validBusiness).name).toBe('Kylyvnyk Partner');
    expect(
      businessProfileEditableFieldsSchema.parse({
        representativeEmail: 'new@example.com',
        socialUrl: 'https://instagram.com/example',
      }),
    ).toEqual({
      representativeEmail: 'new@example.com',
      socialUrl: 'https://instagram.com/example',
    });
    expect(businessListFilterSchema.parse({ page: '2', limit: '50', status: 'PUBLISHED' })).toEqual(
      {
        page: 2,
        limit: 50,
        status: 'PUBLISHED',
      },
    );
  });

  test('rejects invalid business fields with one clear field error', () => {
    expectInvalidField(
      businessProfileSubmitSchema,
      { ...validBusiness, name: '<b>Bad</b>' },
      'name',
    );
    expectInvalidField(
      businessProfileSubmitSchema,
      { ...validBusiness, representativeEmail: 'not-email' },
      'representativeEmail',
    );
    expectInvalidField(
      businessProfileSubmitSchema,
      { ...validBusiness, websiteUrl: undefined, socialUrl: undefined },
      'websiteUrl',
    );
    expect(businessProfileEditableFieldsSchema.safeParse({}).success).toBe(false);
  });
});

describe('introduction schemas', () => {
  test('validates introduction submit, cancel, and filters', () => {
    expect(
      introductionSubmitSchema.parse({
        requesterBusinessId: uuid,
        targetBusinessId: secondUuid,
        message: 'Please introduce us.',
      }),
    ).toEqual({
      requesterBusinessId: uuid,
      targetBusinessId: secondUuid,
      message: 'Please introduce us.',
    });

    expect(introductionCancelSchema.parse({ id: uuid, reason: 'No longer needed' })).toEqual({
      id: uuid,
      reason: 'No longer needed',
    });
    expect(introductionListFilterSchema.parse({ status: 'SUBMITTED' })).toEqual({
      page: 1,
      limit: 20,
      status: 'SUBMITTED',
    });
  });

  test('rejects invalid introduction fields', () => {
    expectInvalidField(
      introductionSubmitSchema,
      {
        requesterBusinessId: 'bad',
        targetBusinessId: secondUuid,
      },
      'requesterBusinessId',
    );
    expectInvalidField(introductionCancelSchema, { id: uuid, reason: '<script />' }, 'reason');
  });
});

describe('staff auth schemas', () => {
  test('validates TOTP setup and verify payloads', () => {
    expect(
      staffTotpSetupSchema.parse({
        phone: '+15551234567',
        secret: 'JBSWY3DPEHPK3PXP',
        code: '123456',
      }),
    ).toEqual({
      phone: '+15551234567',
      secret: 'JBSWY3DPEHPK3PXP',
      code: '123456',
    });

    expect(staffTotpVerifySchema.parse({ phone: '+15551234567', code: '654321' })).toEqual({
      phone: '+15551234567',
      code: '654321',
    });
  });

  test('rejects invalid TOTP setup and verify fields', () => {
    expectInvalidField(
      staffTotpSetupSchema,
      { phone: '+15551234567', secret: 'not-valid-secret', code: '123456' },
      'secret',
    );
    expectInvalidField(staffTotpVerifySchema, { phone: '+15551234567', code: '12345a' }, 'code');
  });
});

describe('shared helpers', () => {
  test('validates id params and formats errors with contract codes', () => {
    expect(entityIdParamSchema.parse({ id: uuid })).toEqual({ id: uuid });

    const result = parseWithValidation(phoneOtpSendSchema, {
      phone: 'bad',
      purpose: 'sign-in',
      locale: 'de',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe(ERROR_CODES.VALIDATION_INVALID_INPUT);
      expect(result.error.issues).toEqual([
        expect.objectContaining({
          path: 'phone',
          code: ERROR_CODES.VALIDATION_INVALID_PHONE,
        }),
        expect.objectContaining({
          path: 'locale',
          code: ERROR_CODES.VALIDATION_INVALID_LOCALE,
        }),
      ]);
    }
  });
});

import { z } from 'zod';

import { localeSchema, otpCodeSchema, phoneSchema } from './shared';

export const phoneOtpPurposeSchema = z.enum(['sign-in', 'sign-up', 'staff-sign-in']);

export const phoneOtpSendSchema = z.object({
  phone: phoneSchema,
  purpose: phoneOtpPurposeSchema,
  locale: localeSchema.optional(),
});

export const phoneOtpVerifySchema = z.object({
  phone: phoneSchema,
  code: otpCodeSchema,
  purpose: phoneOtpPurposeSchema,
});

export type PhoneOtpSendInput = z.infer<typeof phoneOtpSendSchema>;
export type PhoneOtpVerifyInput = z.infer<typeof phoneOtpVerifySchema>;

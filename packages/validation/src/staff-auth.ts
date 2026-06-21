import { z } from 'zod';

import { otpCodeSchema, phoneSchema, totpCodeSchema } from './shared';

export const totpSecretSchema = z
  .string()
  .trim()
  .min(16)
  .max(128)
  .regex(/^[A-Z2-7=]+$/i, 'TOTP secret must be base32');

export const staffPhoneOtpSendSchema = z.object({
  phone: phoneSchema,
});

export const staffPhoneOtpVerifySchema = z.object({
  phone: phoneSchema,
  code: otpCodeSchema,
});

export const staffTotpCodeSchema = z.object({
  code: totpCodeSchema,
});

export const staffTotpSetupSchema = z.object({
  phone: phoneSchema,
  secret: totpSecretSchema,
  code: totpCodeSchema,
});

export const staffTotpVerifySchema = z.object({
  phone: phoneSchema,
  code: totpCodeSchema,
});

export type StaffPhoneOtpSendInput = z.infer<typeof staffPhoneOtpSendSchema>;
export type StaffPhoneOtpVerifyInput = z.infer<typeof staffPhoneOtpVerifySchema>;
export type StaffTotpCodeInput = z.infer<typeof staffTotpCodeSchema>;
export type StaffTotpSetupInput = z.infer<typeof staffTotpSetupSchema>;
export type StaffTotpVerifyInput = z.infer<typeof staffTotpVerifySchema>;

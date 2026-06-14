import { z } from 'zod';

import { phoneSchema, totpCodeSchema } from './shared';

export const totpSecretSchema = z
  .string()
  .trim()
  .min(16)
  .max(128)
  .regex(/^[A-Z2-7=]+$/i, 'TOTP secret must be base32');

export const staffTotpSetupSchema = z.object({
  phone: phoneSchema,
  secret: totpSecretSchema,
  code: totpCodeSchema,
});

export const staffTotpVerifySchema = z.object({
  phone: phoneSchema,
  code: totpCodeSchema,
});

export type StaffTotpSetupInput = z.infer<typeof staffTotpSetupSchema>;
export type StaffTotpVerifyInput = z.infer<typeof staffTotpVerifySchema>;

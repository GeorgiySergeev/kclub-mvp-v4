import { z } from 'zod';

import { localeSchema, phoneSchema, safeTextSchema } from './shared';

export const displayNameSchema = safeTextSchema.min(2).max(100);

export const memberOnboardingSchema = z.object({
  phone: phoneSchema,
  displayName: displayNameSchema,
  localePreference: localeSchema,
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'Terms must be accepted' }),
  }),
});

export const memberProfileUpdateSchema = z
  .object({
    displayName: displayNameSchema.optional(),
    localePreference: localeSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: 'At least one profile field is required',
  });

export type MemberOnboardingInput = z.infer<typeof memberOnboardingSchema>;
export type MemberProfileUpdateInput = z.infer<typeof memberProfileUpdateSchema>;

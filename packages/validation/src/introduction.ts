import { INTRODUCTION_STATUSES } from '@kclub/contracts';
import { z } from 'zod';

import { entityIdSchema, optionalSafeTextSchema, paginationSchema } from './shared';

export const introductionSubmitSchema = z.object({
  requesterBusinessId: entityIdSchema,
  targetBusinessId: entityIdSchema,
  message: optionalSafeTextSchema(500),
});

export const introductionCancelSchema = z.object({
  id: entityIdSchema,
  reason: optionalSafeTextSchema(300),
});

export const introductionListFilterSchema = paginationSchema.extend({
  status: z.enum(INTRODUCTION_STATUSES).optional(),
  businessId: entityIdSchema.optional(),
});

export type IntroductionSubmitInput = z.infer<typeof introductionSubmitSchema>;
export type IntroductionCancelInput = z.infer<typeof introductionCancelSchema>;
export type IntroductionListFilterInput = z.infer<typeof introductionListFilterSchema>;

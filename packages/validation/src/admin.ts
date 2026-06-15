import { z } from 'zod';

export const blockUserSchema = z.object({
  reason: z.string().min(1).max(500).optional(),
});

export const unblockUserSchema = z.object({
  reason: z.string().min(1).max(500).optional(),
});

export const revokeCardSchema = z.object({
  reason: z.string().min(1).max(500).optional(),
});

export const reissueCardSchema = z.object({
  reason: z.string().min(1).max(500).optional(),
});

export const businessApproveSchema = z.object({
  notes: z.string().max(2000).optional(),
});

export const businessRejectSchema = z.object({
  reason: z.string().min(1).max(500),
});

export const businessHideSchema = z.object({
  reason: z.string().min(1).max(500).optional(),
});

export const businessFeaturedSchema = z.object({
  featuredTop: z.boolean().optional(),
  featuredRecommended: z.boolean().optional(),
});

export const introductionApproveSchema = z.object({
  notes: z.string().max(2000).optional(),
});

export const introductionRejectSchema = z.object({
  reason: z.string().min(1).max(500),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120),
  isHighRisk: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
});

export const categoryUpdateSchema = categoryCreateSchema.partial();

export const countryCreateSchema = z.object({
  code2: z.string().length(2),
  code3: z.string().length(3).optional(),
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120),
  isActive: z.boolean().optional().default(true),
});

export const countryUpdateSchema = countryCreateSchema.partial();

export const cityCreateSchema = z.object({
  countryId: z.string().uuid(),
  name: z.string().min(1).max(120),
  slug: z.string().min(1).max(120),
  isActive: z.boolean().optional().default(true),
});

export const cityUpdateSchema = cityCreateSchema.partial();

export const adminConfigUpdateSchema = z.object({
  value: z.any(),
  description: z.string().max(500).optional(),
});

export const staffRoleUpdateSchema = z.object({
  role: z.enum(['OWNER', 'ADMIN', 'MODERATOR', 'SUPPORT']),
});

export type BlockUserInput = z.infer<typeof blockUserSchema>;
export type UnblockUserInput = z.infer<typeof unblockUserSchema>;
export type RevokeCardInput = z.infer<typeof revokeCardSchema>;
export type ReissueCardInput = z.infer<typeof reissueCardSchema>;
export type BusinessApproveInput = z.infer<typeof businessApproveSchema>;
export type BusinessRejectInput = z.infer<typeof businessRejectSchema>;
export type BusinessHideInput = z.infer<typeof businessHideSchema>;
export type BusinessFeaturedInput = z.infer<typeof businessFeaturedSchema>;
export type IntroductionApproveInput = z.infer<typeof introductionApproveSchema>;
export type IntroductionRejectInput = z.infer<typeof introductionRejectSchema>;
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
export type CountryCreateInput = z.infer<typeof countryCreateSchema>;
export type CountryUpdateInput = z.infer<typeof countryUpdateSchema>;
export type CityCreateInput = z.infer<typeof cityCreateSchema>;
export type CityUpdateInput = z.infer<typeof cityUpdateSchema>;
export type AdminConfigUpdateInput = z.infer<typeof adminConfigUpdateSchema>;
export type StaffRoleUpdateInput = z.infer<typeof staffRoleUpdateSchema>;

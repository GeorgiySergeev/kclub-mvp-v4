import {
  ERROR_CODES,
  type CurrentMemberProfileDto,
  type IsoDateTime,
  type Locale,
  type MemberTier,
  type UserStatus,
} from '@kclub/contracts';
import type { MemberOnboardingInput, MemberProfileUpdateInput } from '@kclub/validation';

import { AppError } from '@/server/errors';
import { getPrismaClient } from '@/server/db';

export type UserRecord = {
  id: string;
  phone: string;
  display_name: string | null;
  locale_preference: string | null;
  membership_tier: string;
  status: string;
  terms_accepted_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export function isOnboardingComplete(user: {
  display_name: string | null;
  locale_preference: string | null;
  terms_accepted_at: Date | null;
}): boolean {
  return !!(user.display_name && user.locale_preference && user.terms_accepted_at);
}

export function assertMemberOnboardingComplete(user: UserRecord): void {
  if (!isOnboardingComplete(user)) {
    throw new AppError({
      code: ERROR_CODES.PERMISSION_DENIED,
      message: 'Onboarding must be completed before this action',
      status: 403,
    });
  }
}

export function toCurrentMemberProfileDto(user: UserRecord): CurrentMemberProfileDto {
  return {
    id: user.id,
    phone: user.phone,
    displayName: user.display_name,
    localePreference: user.locale_preference as Locale | null,
    membershipTier: user.membership_tier as MemberTier,
    status: user.status as UserStatus,
    onboardingComplete: isOnboardingComplete(user),
    termsAcceptedAt: user.terms_accepted_at?.toISOString() ?? null,
    createdAt: user.created_at.toISOString(),
    updatedAt: user.updated_at.toISOString(),
  };
}

export async function getMemberBySupabaseUserId(supabaseUserId: string): Promise<UserRecord> {
  const prisma = getPrismaClient();

  const user = await prisma.user.findUnique({
    where: { supabase_auth_user_id: supabaseUserId },
  });

  if (!user) {
    throw new AppError({
      code: ERROR_CODES.AUTH_SESSION_REQUIRED,
      message: 'User session not found',
      status: 401,
    });
  }

  if (user.status === 'BLOCKED') {
    throw new AppError({
      code: ERROR_CODES.PERMISSION_DENIED,
      message: 'Account is blocked',
      status: 403,
    });
  }

  return user;
}

export async function updateMemberProfile(
  supabaseUserId: string,
  input: MemberProfileUpdateInput,
): Promise<UserRecord> {
  const prisma = getPrismaClient();

  const user = await getMemberBySupabaseUserId(supabaseUserId);

  const data: Record<string, string> = {};

  if (input.displayName !== undefined) data.display_name = input.displayName;
  if (input.localePreference !== undefined) data.locale_preference = input.localePreference;

  const updated = await prisma.user.update({
    where: { id: user.id },
    data,
  });

  return updated;
}

export async function completeMemberOnboarding(
  supabaseUserId: string,
  input: MemberOnboardingInput,
): Promise<UserRecord> {
  const prisma = getPrismaClient();

  const user = await getMemberBySupabaseUserId(supabaseUserId);

  if (user.phone !== input.phone) {
    throw new AppError({
      code: ERROR_CODES.VALIDATION_INVALID_INPUT,
      message: 'Phone does not match authenticated user',
      status: 400,
    });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      display_name: input.displayName,
      locale_preference: input.localePreference,
      terms_accepted_at: new Date(),
    },
  });

  return updated;
}

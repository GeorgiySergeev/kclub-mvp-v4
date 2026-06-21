import {
  ERROR_CODES,
  type StaffPermission,
  type StaffRole,
  type StaffProfileDto,
} from '@kclub/contracts';
import { hasStaffPermission } from '@kclub/domain';
import { AppError } from '@/server/errors';
import { createRequestContext, type RequestContext } from '@/server/context';
import { getBearerToken, getStaffSession } from '@/server/staff-auth';

export type AuthenticatedStaff = {
  profile: StaffProfileDto;
  token: string;
};

export async function authenticateStaff(request: Request): Promise<AuthenticatedStaff> {
  const token = getBearerToken(request);
  if (!token) {
    throw new AppError({
      code: ERROR_CODES.AUTH_SESSION_REQUIRED,
      message: 'Authorization bearer token is required',
      status: 401,
    });
  }

  const profile = await getStaffSession(token);
  if (!profile) {
    throw new AppError({
      code: ERROR_CODES.AUTH_SESSION_INVALID,
      message: 'Staff session is invalid or expired',
      status: 401,
    });
  }

  if (!profile.totpVerified) {
    throw new AppError({
      code: ERROR_CODES.AUTH_STAFF_2FA_REQUIRED,
      message: 'TOTP verification is required for admin access',
      status: 401,
    });
  }

  return { profile, token };
}

export function requireStaffPermission(
  profile: StaffProfileDto,
  permission: StaffPermission,
): void {
  if (!hasStaffPermission(profile.role as StaffRole, permission)) {
    throw new AppError({
      code: ERROR_CODES.PERMISSION_DENIED,
      message: `Staff role ${profile.role} does not have permission: ${permission}`,
      status: 403,
    });
  }
}

export function enrichStaffContext(profile: StaffProfileDto, request: Request): RequestContext {
  return createRequestContext({
    actor: {
      kind: 'staff',
      staffId: profile.id,
      role: profile.role as StaffRole,
    },
    headers: request.headers,
  });
}

export function enforceSupportReadOnly(profile: StaffProfileDto, method: string): void {
  if (profile.role === 'SUPPORT' && method !== 'GET' && method !== 'HEAD') {
    throw new AppError({
      code: ERROR_CODES.PERMISSION_DENIED,
      message: 'SUPPORT role is strictly read-only',
      status: 403,
    });
  }
}

export async function adminGuard(
  request: Request,
  permission: StaffPermission,
): Promise<{ profile: StaffProfileDto; context: RequestContext }> {
  const { profile } = await authenticateStaff(request);
  enforceSupportReadOnly(profile, request.method);
  requireStaffPermission(profile, permission);
  const context = enrichStaffContext(profile, request);
  return { profile, context };
}

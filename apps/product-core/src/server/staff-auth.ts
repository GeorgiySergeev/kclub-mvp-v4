import { createHmac, timingSafeEqual } from 'node:crypto';
import * as OTPAuth from 'otpauth';

import {
  ERROR_CODES,
  type ApiErrorResponse,
  type ApiResponse,
  type ApiSuccessResponse,
  type StaffAuthChallengeDto,
  type StaffAuthSessionDto,
  type StaffProfileDto,
  type StaffRole,
  type StaffTotpSetupDto,
} from '@kclub/contracts';
import { getPrismaClient } from '@/server/db';
import { encryptSecret, decryptSecret } from '@/server/totp-crypto';

const SESSION_TTL_SECONDS = 60 * 60 * 8;
const DEFAULT_DEV_OTP = '000000';
const DEFAULT_DEV_TOTP = '123456';

const totpSecretCache = new Map<string, string>();

type StaffRecord = {
  id: string;
  phone: string;
  displayName: string | null;
  role: StaffRole;
  isActive: boolean;
  totpConfigured: boolean;
};

type StaffSessionPayload = {
  sub: string;
  phone: string;
  name: string | null;
  role: StaffRole;
  totpVerified: boolean;
  exp: number;
};

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '').trim();
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_JWT_SECRET must be set to at least 32 characters for staff auth');
  }
  return secret;
}

function sign(input: string): string {
  return createHmac('sha256', getSessionSecret()).update(input).digest('base64url');
}

function createSessionToken(payload: StaffSessionPayload): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(payload));
  return `${header}.${body}.${sign(`${header}.${body}`)}`;
}

function readSessionToken(token: string): StaffSessionPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expected = sign(`${header}.${body}`);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as StaffSessionPayload;
    if (!payload.exp || payload.exp * 1000 <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function parseAllowlist(): StaffRecord[] {
  const ownerPhone = process.env.ADMIN_BOOTSTRAP_OWNER_PHONE;
  const bootstrapOwner = ownerPhone
    ? [
        {
          id: `bootstrap-owner-${normalizePhone(ownerPhone)}`,
          phone: normalizePhone(ownerPhone),
          displayName: 'Bootstrap Owner',
          role: 'OWNER' as StaffRole,
          isActive: true,
          totpConfigured: false,
        },
      ]
    : [];

  const json = process.env.ADMIN_STAFF_ALLOWLIST_JSON;
  if (!json) return bootstrapOwner;

  try {
    const rows = JSON.parse(json) as Array<Partial<StaffRecord>>;
    return [
      ...bootstrapOwner,
      ...rows
        .filter((row): row is Partial<StaffRecord> & { phone: string; role: StaffRole } =>
          Boolean(row.phone && row.role),
        )
        .map((row) => ({
          id: row.id ?? `env-staff-${normalizePhone(row.phone)}`,
          phone: normalizePhone(row.phone),
          displayName: row.displayName ?? null,
          role: row.role,
          isActive: row.isActive ?? true,
          totpConfigured: row.totpConfigured ?? false,
        })),
    ];
  } catch {
    return bootstrapOwner;
  }
}

function findStaffByPhone(phone: string): StaffRecord | null {
  const normalized = normalizePhone(phone);
  return parseAllowlist().find((staff) => staff.phone === normalized) ?? null;
}

function staffToProfile(staff: StaffRecord, totpVerified: boolean): StaffProfileDto {
  return {
    id: staff.id,
    phone: staff.phone,
    displayName: staff.displayName,
    role: staff.role,
    totpVerified,
  };
}

function success<T>(data: T): ApiSuccessResponse<T> {
  return { data, error: null };
}

function error(code: ApiErrorResponse['error']['code'], message: string, status = 400) {
  return Response.json({ data: null, error: { code, message } } satisfies ApiErrorResponse, {
    status,
  });
}

function isValidDevOtp(code: string): boolean {
  return code === (process.env.ADMIN_STAFF_DEV_OTP ?? DEFAULT_DEV_OTP);
}

function isValidDevTotp(code: string): boolean {
  return code === (process.env.ADMIN_STAFF_DEV_TOTP ?? DEFAULT_DEV_TOTP);
}

export function getBearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length);
}

export function getStaffSession(token: string): StaffProfileDto | null {
  const payload = readSessionToken(token);
  if (!payload) return null;

  const staff = findStaffByPhone(payload.phone);
  if (!staff?.isActive || staff.id !== payload.sub || staff.role !== payload.role) {
    return null;
  }

  return staffToProfile(staff, payload.totpVerified);
}

export async function handleStaffOtpSend(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as { phone?: string } | null;
  if (!body?.phone) {
    return error(ERROR_CODES.VALIDATION_INVALID_PHONE, 'Phone is required');
  }

  const staff = findStaffByPhone(body.phone);
  if (!staff) {
    return error(
      ERROR_CODES.AUTH_STAFF_NOT_ALLOWED,
      'This phone is not allowed for staff access',
      403,
    );
  }
  if (!staff.isActive) {
    return error(ERROR_CODES.AUTH_STAFF_INACTIVE, 'This staff account is inactive', 403);
  }

  return Response.json(
    success<StaffAuthChallengeDto>({ state: 'OTP_REQUIRED', phone: staff.phone }),
  );
}

export async function handleStaffOtpVerify(request: Request): Promise<Response> {
  const body = (await request.json().catch(() => null)) as { phone?: string; code?: string } | null;
  if (!body?.phone || !body.code) {
    return error(ERROR_CODES.VALIDATION_INVALID_INPUT, 'Phone and OTP code are required');
  }

  const staff = findStaffByPhone(body.phone);
  if (!staff) {
    return error(
      ERROR_CODES.AUTH_STAFF_NOT_ALLOWED,
      'This phone is not allowed for staff access',
      403,
    );
  }
  if (!staff.isActive) {
    return error(ERROR_CODES.AUTH_STAFF_INACTIVE, 'This staff account is inactive', 403);
  }
  if (!isValidDevOtp(body.code)) {
    return error(ERROR_CODES.AUTH_OTP_INVALID, 'Invalid staff OTP code', 401);
  }

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const token = createSessionToken({
    sub: staff.id,
    phone: staff.phone,
    name: staff.displayName,
    role: staff.role,
    totpVerified: false,
    exp: expiresAt,
  });

  return Response.json(
    success<StaffAuthSessionDto>({
      state: staff.totpConfigured ? 'TOTP_REQUIRED' : 'TOTP_SETUP_REQUIRED',
      profile: staffToProfile(staff, false),
      token,
      expiresAt: new Date(expiresAt * 1000).toISOString(),
    }),
  );
}

export async function handleStaffTotpVerify(request: Request): Promise<Response> {
  const token = getBearerToken(request);
  if (!token) {
    return error(ERROR_CODES.AUTH_SESSION_REQUIRED, 'Staff session is required', 401);
  }

  const payload = readSessionToken(token);
  if (!payload) {
    return error(ERROR_CODES.AUTH_SESSION_INVALID, 'Staff session is invalid or expired', 401);
  }

  const body = (await request.json().catch(() => null)) as { code?: string } | null;
  if (!body?.code) {
    return error(ERROR_CODES.VALIDATION_INVALID_INPUT, 'TOTP code is required');
  }

  const staff = findStaffByPhone(payload.phone);
  if (!staff?.isActive || staff.id !== payload.sub) {
    return error(
      ERROR_CODES.AUTH_STAFF_NOT_ALLOWED,
      'This phone is not allowed for staff access',
      403,
    );
  }

  let isValidCode = false;
  let secretFromDb: string | null = null;

  try {
    const prisma = getPrismaClient();
    const twoFactor = await prisma.admin2FA.findUnique({
      where: { admin_user_id: staff.id },
    });

    if (twoFactor?.secret_ciphertext) {
      secretFromDb = decryptSecret(twoFactor.secret_ciphertext);
      const totp = new OTPAuth.TOTP({
        issuer: 'KCLUB',
        label: staff.phone,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(secretFromDb),
      });
      isValidCode = totp.validate({ token: body.code, window: 1 }) !== null;

      if (isValidCode && !twoFactor.verified_at) {
        await prisma.$transaction([
          prisma.admin2FA.update({
            where: { id: twoFactor.id },
            data: { verified_at: new Date() },
          }),
          prisma.adminUser.update({
            where: { id: staff.id },
            data: { totp_verified_at: new Date() },
          }),
        ]);
      }
    }
  } catch {
    // DB unavailable, fall back to dev TOTP
  }

  if (!secretFromDb) {
    isValidCode = isValidDevTotp(body.code);
  }

  if (!isValidCode) {
    return error(ERROR_CODES.AUTH_STAFF_2FA_REQUIRED, 'Invalid authenticator code', 401);
  }

  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const verifiedToken = createSessionToken({
    sub: staff.id,
    phone: staff.phone,
    name: staff.displayName,
    role: staff.role,
    totpVerified: true,
    exp: expiresAt,
  });

  return Response.json(
    success<StaffAuthSessionDto>({
      state: 'AUTHENTICATED',
      profile: staffToProfile(staff, true),
      token: verifiedToken,
      expiresAt: new Date(expiresAt * 1000).toISOString(),
    }),
  );
}

export async function handleStaffTotpSetup(request: Request): Promise<Response> {
  const token = getBearerToken(request);
  if (!token) {
    return error(ERROR_CODES.AUTH_SESSION_REQUIRED, 'Staff session is required', 401);
  }

  const payload = readSessionToken(token);
  if (!payload) {
    return error(ERROR_CODES.AUTH_SESSION_INVALID, 'Staff session is invalid or expired', 401);
  }

  if (payload.totpVerified) {
    return error(
      ERROR_CODES.VALIDATION_INVALID_INPUT,
      'TOTP is already configured for this account',
      400,
    );
  }

  const staff = findStaffByPhone(payload.phone);
  if (!staff?.isActive || staff.id !== payload.sub) {
    return error(
      ERROR_CODES.AUTH_STAFF_NOT_ALLOWED,
      'This phone is not allowed for staff access',
      403,
    );
  }

  let secret: string;
  let provisioningUri: string;

  const cachedSecret = totpSecretCache.get(staff.id);

  try {
    const prisma = getPrismaClient();

    const existing = await prisma.admin2FA.findUnique({
      where: { admin_user_id: staff.id },
    });

    if (existing?.secret_ciphertext && !existing.verified_at) {
      secret = decryptSecret(existing.secret_ciphertext);
      totpSecretCache.set(staff.id, secret);
    } else if (existing?.verified_at) {
      return error(
        ERROR_CODES.VALIDATION_INVALID_INPUT,
        'TOTP is already verified for this account',
        400,
      );
    } else {
      const newSecret = new OTPAuth.Secret({ size: 20 });
      secret = newSecret.base32;
      const encrypted = encryptSecret(secret);

      await prisma.admin2FA.create({
        data: {
          admin_user_id: staff.id,
          secret_ciphertext: encrypted,
        },
      });
      totpSecretCache.set(staff.id, secret);
    }
  } catch {
    if (cachedSecret) {
      secret = cachedSecret;
    } else {
      const newSecret = new OTPAuth.Secret({ size: 20 });
      secret = newSecret.base32;
      totpSecretCache.set(staff.id, secret);
    }
  }

  const totp = new OTPAuth.TOTP({
    issuer: 'KCLUB',
    label: staff.phone,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
    secret: OTPAuth.Secret.fromBase32(secret),
  });

  provisioningUri = totp.toString();

  return Response.json(
    success<StaffTotpSetupDto>({
      provisioningUri,
      manualKey: secret,
    }),
  );
}

export function handleStaffSession(request: Request): Response {
  const token = getBearerToken(request);
  if (!token) {
    return error(ERROR_CODES.AUTH_SESSION_REQUIRED, 'Staff session is required', 401);
  }

  const profile = getStaffSession(token);
  if (!profile) {
    return error(ERROR_CODES.AUTH_SESSION_INVALID, 'Staff session is invalid or expired', 401);
  }

  return Response.json(
    success<ApiResponse<StaffProfileDto>['data']>({
      ...profile,
    }),
  );
}

import { beforeEach, describe, expect, test } from 'bun:test';

import {
  handleStaffOtpSend,
  handleStaffOtpVerify,
  handleStaffSession,
  handleStaffTotpVerify,
} from '../src/server/staff-auth';

const OWNER_PHONE = '+15551234567';

function jsonRequest(body: Record<string, string>, token?: string) {
  return new Request('http://localhost/api/admin/v1/staff-auth', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

describe('staff auth boundary', () => {
  beforeEach(() => {
    process.env.ADMIN_BOOTSTRAP_OWNER_PHONE = OWNER_PHONE;
    process.env.ADMIN_JWT_SECRET = 'staff-auth-test-secret-at-least-32-chars';
    process.env.ADMIN_STAFF_DEV_OTP = '000000';
    process.env.ADMIN_STAFF_DEV_TOTP = '123456';
    delete process.env.ADMIN_STAFF_ALLOWLIST_JSON;
  });

  test('rejects unknown staff phone before OTP', async () => {
    const response = await handleStaffOtpSend(jsonRequest({ phone: '+15550000000' }));
    const payload = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(403);
    expect(payload.error.code).toBe('AUTH_STAFF_NOT_ALLOWED');
  });

  test('allows bootstrap owner through OTP but keeps dashboard behind TOTP', async () => {
    const response = await handleStaffOtpVerify(
      jsonRequest({ phone: OWNER_PHONE, code: '000000' }),
    );
    const payload = await readJson<{
      data: { state: string; token: string; profile: { role: string; totpVerified: boolean } };
    }>(response);

    expect(response.status).toBe(200);
    expect(payload.data.state).toBe('TOTP_SETUP_REQUIRED');
    expect(payload.data.profile.role).toBe('OWNER');
    expect(payload.data.profile.totpVerified).toBe(false);

    const sessionResponse = handleStaffSession(
      new Request('http://localhost/api/admin/v1/staff-auth/session', {
        headers: { authorization: `Bearer ${payload.data.token}` },
      }),
    );
    const sessionPayload = await readJson<{ data: { totpVerified: boolean } }>(sessionResponse);
    expect(sessionPayload.data.totpVerified).toBe(false);
  });

  test('rejects forged staff session tokens', async () => {
    const forgedToken = [
      Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'),
      Buffer.from(
        JSON.stringify({
          sub: 'bootstrap-owner-+15551234567',
          phone: OWNER_PHONE,
          role: 'OWNER',
          totpVerified: true,
          exp: Math.floor(Date.now() / 1000) + 3600,
        }),
      ).toString('base64url'),
      'bad-signature',
    ].join('.');

    const response = handleStaffSession(
      new Request('http://localhost/api/admin/v1/staff-auth/session', {
        headers: { authorization: `Bearer ${forgedToken}` },
      }),
    );
    const payload = await readJson<{ error: { code: string } }>(response);

    expect(response.status).toBe(401);
    expect(payload.error.code).toBe('AUTH_SESSION_INVALID');
  });

  test('upgrades a valid staff session after TOTP verification', async () => {
    const otpResponse = await handleStaffOtpVerify(
      jsonRequest({ phone: OWNER_PHONE, code: '000000' }),
    );
    const otpPayload = await readJson<{ data: { token: string } }>(otpResponse);

    const totpResponse = await handleStaffTotpVerify(
      jsonRequest({ code: '123456' }, otpPayload.data.token),
    );
    const totpPayload = await readJson<{
      data: { state: string; token: string; profile: { totpVerified: boolean } };
    }>(totpResponse);

    expect(totpResponse.status).toBe(200);
    expect(totpPayload.data.state).toBe('AUTHENTICATED');
    expect(totpPayload.data.profile.totpVerified).toBe(true);

    const sessionResponse = handleStaffSession(
      new Request('http://localhost/api/admin/v1/staff-auth/session', {
        headers: { authorization: `Bearer ${totpPayload.data.token}` },
      }),
    );
    const sessionPayload = await readJson<{ data: { role: string; totpVerified: boolean } }>(
      sessionResponse,
    );

    expect(sessionPayload.data.role).toBe('OWNER');
    expect(sessionPayload.data.totpVerified).toBe(true);
  });
});

'use server';

import { redirect } from 'next/navigation';

import { clearStaffSession, readStaffSession, setStaffSession } from '@/server/auth/session';
import type {
  ApiResponse,
  StaffAuthChallengeDto,
  StaffAuthSessionDto,
  StaffTotpSetupDto,
} from '@kclub/contracts';

function getProductCoreBaseUrl() {
  return (
    process.env.PRODUCT_CORE_API_BASE_URL ??
    process.env.PRODUCT_CORE_ADMIN_API_URL ??
    'http://localhost:3000'
  );
}

function formValue(formData: FormData, key: string): string {
  return String(formData.get(key) ?? '').trim();
}

function redirectWithError(path: string, message: string): never {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

async function postProductCore<T>(path: string, body: Record<string, string>, token?: string) {
  const response = await fetch(`${getProductCoreBaseUrl()}${path}`, {
    method: 'POST',
    cache: 'no-store',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<T> | null;
  return { response, payload };
}

export async function sendStaffOtpAction(formData: FormData) {
  const phone = formValue(formData, 'phone');
  const { response, payload } = await postProductCore<StaffAuthChallengeDto>(
    '/api/admin/v1/staff-auth/phone-otp/send',
    { phone },
  );

  if (!response.ok || !payload?.data) {
    redirectWithError('/auth/sign-in', payload?.error?.message ?? 'Unable to send staff OTP');
  }

  redirect(`/auth/sign-in?sent=1&phone=${encodeURIComponent(payload.data.phone)}`);
}

export async function verifyStaffOtpAction(formData: FormData) {
  const phone = formValue(formData, 'phone');
  const code = formValue(formData, 'code');
  const { response, payload } = await postProductCore<StaffAuthSessionDto>(
    '/api/admin/v1/staff-auth/phone-otp/verify',
    { phone, code },
  );

  if (!response.ok || !payload?.data) {
    redirectWithError('/auth/sign-in', payload?.error?.message ?? 'Unable to verify staff OTP');
  }

  await setStaffSession(payload.data.token, payload.data.expiresAt);

  if (payload.data.state === 'AUTHENTICATED') {
    redirect('/dashboard');
  } else if (payload.data.state === 'TOTP_SETUP_REQUIRED') {
    redirect('/auth/totp-setup');
  } else {
    redirect('/auth/2fa-required');
  }
}

export async function verifyStaffTotpAction(formData: FormData) {
  const session = await readStaffSession();
  if (!session?.token) {
    redirect('/auth/sign-in');
  }

  const code = formValue(formData, 'code');
  const { response, payload } = await postProductCore<StaffAuthSessionDto>(
    '/api/admin/v1/staff-auth/totp/verify',
    { code },
    session.token,
  );

  if (!response.ok || !payload?.data) {
    redirectWithError(
      '/auth/2fa-required',
      payload?.error?.message ?? 'Unable to verify authenticator code',
    );
  }

  await setStaffSession(payload.data.token, payload.data.expiresAt);
  redirect('/dashboard');
}

export async function setupStaffTotpAction(): Promise<{
  provisioningUri: string;
  manualKey: string;
} | null> {
  const session = await readStaffSession();
  if (!session?.token) {
    redirect('/auth/sign-in');
  }

  const response = await fetch(`${getProductCoreBaseUrl()}/api/admin/v1/staff-auth/totp/setup`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      authorization: `Bearer ${session.token}`,
    },
  });

  const payload = (await response.json().catch(() => null)) as ApiResponse<StaffTotpSetupDto> | null;

  if (!response.ok || !payload?.data) {
    return null;
  }

  return {
    provisioningUri: payload.data.provisioningUri,
    manualKey: payload.data.manualKey,
  };
}

export async function logoutAction() {
  await clearStaffSession();
  redirect('/auth/sign-in');
}

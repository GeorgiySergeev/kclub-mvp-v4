const DEFAULT_DEV_OTP = '000000';

function isTruthyEnvFlag(value: string | undefined): boolean {
  const normalized = value?.trim().toLowerCase();
  return normalized === 'true' || normalized === '1';
}

function isTestRuntime(): boolean {
  return process.env.NODE_ENV === 'test' || process.env.BUN_ENV === 'test';
}

function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.APP_ENV === 'production';
}

export function getDevPhoneBypassOtp(): string {
  const configured = process.env.AUTH_DEV_PHONE_BYPASS_SECRET?.trim();
  if (configured && /^\d{4,8}$/.test(configured)) {
    return configured;
  }
  return DEFAULT_DEV_OTP;
}

export function isDevPhoneBypassEnabled(): boolean {
  if (isProductionRuntime()) {
    return false;
  }

  if (!isTruthyEnvFlag(process.env.AUTH_DEV_PHONE_BYPASS_ENABLED)) {
    return false;
  }

  if (isTestRuntime()) {
    return true;
  }

  const secret = process.env.AUTH_DEV_PHONE_BYPASS_SECRET?.trim();
  return Boolean(secret && secret.length >= 8);
}

export function isValidDevPhoneBypassOtp(code: string): boolean {
  return code.trim() === getDevPhoneBypassOtp();
}

export function toDevBypassEmail(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `phone-${digits}@dev.kclub.local`;
}

export function normalizePhoneForAuthLookup(phone: string): string {
  return phone.replace(/[\s\-()]/g, '');
}

export function phonesMatch(storedPhone: string | null | undefined, inputPhone: string): boolean {
  if (!storedPhone) {
    return false;
  }

  return storedPhone.replace(/\D/g, '') === inputPhone.replace(/\D/g, '');
}

export function getPhoneLookupCandidates(phone: string): string[] {
  const normalized = normalizePhoneForAuthLookup(phone);
  const digitsOnly = normalized.replace(/\D/g, '');

  return Array.from(
    new Set([normalized, `+${digitsOnly}`, digitsOnly].filter((value) => value.length > 0)),
  );
}

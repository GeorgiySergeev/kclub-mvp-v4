import type { AppError } from '@/server/errors';

export const REDACTED_FIELDS = new Set([
  'phone',
  'email',
  'ipAddress',
  'userAgent',
  'stripeCustomerId',
  'stripeSubscriptionId',
  'secret_ciphertext',
  'token',
  'authorization',
  'password',
  'code',
  'otp',
]);

export const REDACTED_STRING = '[REDACTED]';

type SafeRecord = Record<string, unknown>;

function redactValue(value: unknown, depth: number): unknown {
  if (depth > 10) return '[DEPTH_LIMITED]';

  if (value === null || value === undefined) return value;

  if (typeof value === 'string') {
    if (value.length > 2000)
      return value.substring(0, 200) + `...[truncated, ${value.length} chars]`;
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean') return value;

  if (Array.isArray(value)) {
    return value.map((item) => redactValue(item, depth + 1));
  }

  if (typeof value === 'object') {
    const record = value as SafeRecord;
    const result: SafeRecord = {};

    for (const [key, val] of Object.entries(record)) {
      if (REDACTED_FIELDS.has(key)) {
        result[key] = REDACTED_STRING;
      } else {
        result[key] = redactValue(val, depth + 1);
      }
    }

    return result;
  }

  return String(value);
}

export function redactSensitiveFields<T extends SafeRecord>(obj: T): SafeRecord {
  return redactValue(obj, 0) as SafeRecord;
}

export type SafeErrorPayload = {
  code: string;
  message: string;
  details?: SafeRecord;
};

export function safeErrorForLog(error: unknown): SafeErrorPayload | null {
  if (error === null || error === undefined) return null;

  const appError = error as AppError;

  if (appError?.code && appError?.message) {
    return {
      code: appError.code,
      message: appError.message,
      ...(appError.details
        ? { details: redactSensitiveFields(appError.details as SafeRecord) }
        : {}),
    };
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: String(error),
  };
}

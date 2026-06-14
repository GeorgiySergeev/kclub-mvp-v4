import { ERROR_CODES, type ErrorCode } from '@kclub/contracts';

const KNOWN_ERROR_CODES = new Set<string>(Object.values(ERROR_CODES));

export function isKnownErrorCode(value: string): value is ErrorCode {
  return KNOWN_ERROR_CODES.has(value);
}

export function assertKnownErrorCode(value: string): asserts value is ErrorCode {
  if (!isKnownErrorCode(value)) {
    throw new Error(`Unknown error code "${value}".`);
  }
}

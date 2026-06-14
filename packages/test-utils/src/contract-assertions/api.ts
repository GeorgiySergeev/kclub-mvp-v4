import type { ApiErrorResponse, ApiResponse, ApiSuccessResponse } from '@kclub/contracts';

export function assertApiEnvelopeShape<T>(
  response: ApiResponse<T>,
): asserts response is ApiResponse<T> {
  if (typeof response !== 'object' || response === null) {
    throw new Error('Expected API response to be a non-null object.');
  }

  if (!('data' in response) || !('error' in response)) {
    throw new Error('Expected API response to include data and error fields.');
  }

  if ('meta' in response && response.meta !== undefined && typeof response.meta !== 'object') {
    throw new Error('Expected API response meta to be an object when present.');
  }
}

export function assertApiSuccessEnvelope<T>(
  response: ApiResponse<T>,
): asserts response is ApiSuccessResponse<T> {
  assertApiEnvelopeShape(response);

  if (response.error !== null) {
    throw new Error('Expected API success response to have error: null.');
  }

  if (response.data === null) {
    throw new Error('Expected API success response data to be non-null.');
  }
}

export function assertApiErrorEnvelope(
  response: ApiResponse<unknown>,
): asserts response is ApiErrorResponse {
  assertApiEnvelopeShape(response);

  if (response.error === null) {
    throw new Error('Expected API error response to include an error payload.');
  }

  if (response.data !== null) {
    throw new Error('Expected API error response data to be null.');
  }
}

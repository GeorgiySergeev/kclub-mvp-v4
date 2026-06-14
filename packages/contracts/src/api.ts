export type ApiPaginationMeta = {
  page?: number;
  limit?: number;
  total?: number;
};

export type ApiMeta = ApiPaginationMeta & {
  timestamp?: string;
};

export type ApiError = {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
};

export type ApiResponse<T> = {
  data: T | null;
  meta?: ApiMeta;
  error: ApiError | null;
};

export type ApiSuccessResponse<T> = {
  data: T;
  meta?: ApiMeta;
  error: null;
};

export type ApiErrorResponse = {
  data: null;
  meta?: ApiMeta;
  error: ApiError;
};

export type ApiListResponse<T> = ApiResponse<T[]>;

import type { ErrorCode } from './errors';

export function createApiSuccess<T>(data: T, meta?: ApiMeta): ApiSuccessResponse<T> {
  return {
    data,
    ...(meta ? { meta } : {}),
    error: null,
  };
}

export function createApiError(error: ApiError, meta?: ApiMeta): ApiErrorResponse {
  return {
    data: null,
    ...(meta ? { meta } : {}),
    error,
  };
}

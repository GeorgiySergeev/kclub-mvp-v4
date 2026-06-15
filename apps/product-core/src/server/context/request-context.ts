import type { Locale } from '@kclub/contracts';

import type { RequestActor } from '@/server/auth';

export type RequestContextInput = {
  actor?: RequestActor;
  headers?: Headers;
  locale?: Locale;
  requestId?: string;
};

export type RequestContext = {
  actor: RequestActor;
  locale: Locale | null;
  requestId: string;
  ipAddress: string | null;
  userAgent: string | null;
};

export function createRequestContext(input: RequestContextInput = {}): RequestContext {
  const requestId =
    input.requestId ??
    input.headers?.get('x-request-id') ??
    input.headers?.get('x-vercel-id') ??
    crypto.randomUUID();

  return {
    actor: input.actor ?? null,
    locale: input.locale ?? null,
    requestId,
    ipAddress: readClientIp(input.headers),
    userAgent: input.headers?.get('user-agent') ?? null,
  };
}

function readClientIp(headers?: Headers): string | null {
  if (!headers) {
    return null;
  }

  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || null;
  }

  return headers.get('x-real-ip') ?? null;
}

import pino from 'pino';

import type { RequestActor } from '@/server/auth';
import type { RequestContext } from '@/server/context';

import { redactSensitiveFields, safeErrorForLog } from './redact';

const isProduction = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test' || process.env.BUN_ENV === 'test';

function createBaseLogger(): pino.Logger {
  if (isTest) {
    return pino({ enabled: false });
  }

  if (isProduction) {
    return pino({
      level: process.env.LOG_LEVEL || 'info',
      timestamp: pino.stdTimeFunctions.isoTime,
      formatters: {
        level(label) {
          return { level: label };
        },
      },
      serializers: {
        err: pino.stdSerializers.err,
      },
    });
  }

  return pino({
    level: process.env.LOG_LEVEL || 'debug',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  });
}

let baseLogger: pino.Logger | null = null;

function getBaseLogger(): pino.Logger {
  if (!baseLogger) {
    baseLogger = createBaseLogger();
  }
  return baseLogger;
}

function actorToLog(actor: RequestActor | null): Record<string, unknown> {
  if (!actor) return {};

  switch (actor.kind) {
    case 'staff':
      return { actorKind: 'staff', staffId: actor.staffId, role: actor.role };
    case 'member':
      return { actorKind: 'member', userId: actor.userId };
    case 'system':
      return { actorKind: 'system' };
    default:
      return { actorKind: 'unknown' };
  }
}

export type StructuredLogger = {
  info(msg: string, data?: Record<string, unknown>): void;
  warn(msg: string, data?: Record<string, unknown>): void;
  error(msg: string, data?: Record<string, unknown>): void;
  debug(msg: string, data?: Record<string, unknown>): void;

  auth(msg: string, data?: Record<string, unknown>): void;
  webhook(msg: string, data?: Record<string, unknown>): void;
  cron(msg: string, data?: Record<string, unknown>): void;
  admin(msg: string, data?: Record<string, unknown>): void;
};

export function createLogger(context?: RequestContext): StructuredLogger {
  const childBindings: Record<string, unknown> = {};

  if (context) {
    childBindings.requestId = context.requestId;
    childBindings.ipAddress = context.ipAddress;
    Object.assign(childBindings, actorToLog(context.actor));
  }

  const pinoLogger = childBindings.requestId
    ? getBaseLogger().child(childBindings)
    : getBaseLogger();

  function logWithRedact(
    level: 'info' | 'warn' | 'error' | 'debug',
    msg: string,
    data?: Record<string, unknown>,
  ): void {
    if (data && Object.keys(data).length > 0) {
      pinoLogger[level]({ data: redactSensitiveFields(data) }, msg);
    } else {
      pinoLogger[level](msg);
    }
  }

  function logWithDomain(
    domain: 'auth' | 'webhook' | 'cron' | 'admin',
    level: 'info' | 'warn' | 'error',
    msg: string,
    data?: Record<string, unknown>,
  ): void {
    const enriched = { ...data, domain };
    logWithRedact(level, msg, enriched);
  }

  function logError(msg: string, data?: Record<string, unknown>): void {
    if (data?.error) {
      const safe = safeErrorForLog(data.error);
      const rest = { ...data };
      delete rest.error;
      pinoLogger.error({ ...rest, error: safe }, msg);
    } else {
      logWithRedact('error', msg, data);
    }
  }

  return {
    info(msg, data) {
      logWithRedact('info', msg, data);
    },
    warn(msg, data) {
      logWithRedact('warn', msg, data);
    },
    error(msg, data) {
      logError(msg, data);
    },
    debug(msg, data) {
      logWithRedact('debug', msg, data);
    },

    auth(msg, data) {
      logWithDomain('auth', 'warn', msg, data);
    },
    webhook(msg, data) {
      logWithDomain('webhook', 'info', msg, data);
    },
    cron(msg, data) {
      logWithDomain('cron', 'info', msg, data);
    },
    admin(msg, data) {
      logWithDomain('admin', 'info', msg, data);
    },
  };
}

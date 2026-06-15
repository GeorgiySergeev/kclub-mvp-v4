import type { AuditAction, AuditLogDto, EntityId, StaffRole } from '@kclub/contracts';

import type { RequestContext } from '@/server/context';

export type AuditLogCommand = {
  action: AuditAction;
  entityType: string;
  entityId: EntityId;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
};

export type AuditLogRecord = {
  action: AuditAction;
  entityType: string;
  entityId: EntityId;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  actorStaffId: EntityId | null;
  actorRole: StaffRole | null;
  ipAddress: string | null;
  requestId: string;
  createdAt: string;
};

export type AuditSink = {
  write(record: AuditLogRecord): Promise<void>;
};

export type AuditService = {
  log(command: AuditLogCommand, context: RequestContext): Promise<AuditLogDto>;
};

export function createAuditService(sink?: AuditSink): AuditService {
  return {
    async log(command, context) {
      const record = createAuditRecord(command, context);
      await sink?.write(record);
      return toAuditLogDto(record);
    },
  };
}

function createAuditRecord(command: AuditLogCommand, context: RequestContext): AuditLogRecord {
  const staffActor = context.actor?.kind === 'staff' ? context.actor : null;

  return {
    ...command,
    before: command.before ?? null,
    after: command.after ?? null,
    actorStaffId: staffActor?.staffId ?? null,
    actorRole: staffActor?.role ?? null,
    ipAddress: context.ipAddress,
    requestId: context.requestId,
    createdAt: new Date().toISOString(),
  };
}

function toAuditLogDto(record: AuditLogRecord): AuditLogDto {
  return {
    id: record.requestId,
    actorStaffId: record.actorStaffId,
    actorRole: record.actorRole,
    action: record.action,
    entityType: record.entityType,
    entityId: record.entityId,
    before: record.before ?? null,
    after: record.after ?? null,
    ipAddress: record.ipAddress,
    createdAt: record.createdAt,
  };
}

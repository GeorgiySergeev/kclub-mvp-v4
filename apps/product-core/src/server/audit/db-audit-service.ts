import {
  type AuditAction,
  type AuditLogDto,
  type EntityId,
  type StaffRole,
} from '@kclub/contracts';

import { getPrismaClient } from '@/server/db';
import type { RequestContext } from '@/server/context';
import type { AuditLogCommand, AuditService } from './audit-service';

export function createDbAuditService(): AuditService {
  return {
    async log(command: AuditLogCommand, context: RequestContext): Promise<AuditLogDto> {
      const prisma = getPrismaClient();
      const staffActor = context.actor?.kind === 'staff' ? context.actor : null;

      const record = await prisma.auditLog.create({
        data: {
          actor_staff_id: staffActor?.staffId ?? null,
          actor_role: staffActor?.role ?? null,
          action: command.action,
          entity_type: command.entityType,
          entity_id: command.entityId,
          before_data: command.before as any,
          after_data: command.after as any,
          ip_address: context.ipAddress,
        },
      });

      return toAuditLogDto(record);
    },
  };
}

function toAuditLogDto(record: any): AuditLogDto {
  return {
    id: record.id,
    actorStaffId: record.actor_staff_id ?? null,
    actorRole: record.actor_role as StaffRole | null,
    action: record.action as AuditAction,
    entityType: record.entity_type,
    entityId: record.entity_id,
    before: record.before_data as Record<string, unknown> | null,
    after: record.after_data as Record<string, unknown> | null,
    ipAddress: record.ip_address ?? null,
    createdAt: record.created_at?.toISOString() ?? new Date().toISOString(),
  };
}

export type { AuditService, AuditLogCommand };

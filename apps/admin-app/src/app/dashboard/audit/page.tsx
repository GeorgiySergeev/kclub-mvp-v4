import { PageShell } from '@/components/page-shell';
import { requireStaffProfile } from '@/server/auth/profile';
import { fetchAuditLogs } from '@/features/audit/api';
import { AuditTable } from '@/features/audit/components/audit-table';

type AuditPageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    action?: string;
    actorRole?: string;
    entityType?: string;
    dateFrom?: string;
    dateTo?: string;
  }>;
};

export default async function AuditPage({ searchParams }: AuditPageProps) {
  await requireStaffProfile();
  const sp = await searchParams;
  const page = Number(sp.page) || 1;
  const limit = Math.min(Number(sp.limit) || 20, 100);
  const filters = {
    action: sp.action,
    actorRole: sp.actorRole,
    entityType: sp.entityType,
    dateFrom: sp.dateFrom,
    dateTo: sp.dateTo,
  };

  const result = await fetchAuditLogs({ ...filters, page, limit });

  return (
    <PageShell
      title="Audit"
      description="Read-only event and action log for compliance/support."
      roleScope="ADMIN | SUPPORT"
    >
      <AuditTable
        logs={result?.logs ?? []}
        total={result?.total ?? 0}
        page={result?.page ?? page}
        limit={result?.limit ?? limit}
        filters={filters}
      />
    </PageShell>
  );
}

import { PageShell } from '@/components/page-shell';

export default function AuditPage() {
  return (
    <PageShell
      title="Audit"
      description="Read-only event and action log for compliance/support."
      roleScope="ADMIN | SUPPORT"
    />
  );
}

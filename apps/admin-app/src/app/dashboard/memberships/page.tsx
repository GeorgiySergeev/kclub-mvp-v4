import { PageShell } from '@/components/page-shell';

export default function MembershipsPage() {
  return (
    <PageShell
      title="Memberships"
      description="Read-only plan metadata and internal mapping."
      roleScope="ADMIN"
    />
  );
}

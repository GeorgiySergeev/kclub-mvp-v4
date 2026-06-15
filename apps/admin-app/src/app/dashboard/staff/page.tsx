import { PageShell } from '@/components/page-shell';

export default function StaffPage() {
  return (
    <PageShell
      title="Staff"
      description="Owner-only management of staff accounts and role assignments."
      roleScope="OWNER"
    />
  );
}

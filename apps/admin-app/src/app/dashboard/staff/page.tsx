import { PageShell } from '@/components/page-shell';
import { requireStaffProfile } from '@/server/auth/profile';
import { fetchStaffList } from '@/features/staff/api';
import { StaffTable } from '@/features/staff/components/staff-table';

export default async function StaffPage() {
  await requireStaffProfile();
  const staff = await fetchStaffList();

  return (
    <PageShell
      title="Staff"
      description="Owner-only management of staff accounts and role assignments."
      roleScope="OWNER"
    >
      <StaffTable staff={staff ?? []} />
    </PageShell>
  );
}

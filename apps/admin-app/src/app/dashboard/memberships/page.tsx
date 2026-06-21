import { PageShell } from '@/components/page-shell';
import { requireStaffProfile } from '@/server/auth/profile';
import { fetchMembershipPlans } from '@/features/memberships/api';
import { MembershipsView } from '@/features/memberships/components/memberships-view';

export default async function MembershipsPage() {
  await requireStaffProfile();
  const plans = await fetchMembershipPlans();

  return (
    <PageShell
      title="Memberships"
      description="Read-only plan metadata and internal mapping."
      roleScope="ADMIN"
    >
      <MembershipsView plans={plans ?? []} />
    </PageShell>
  );
}

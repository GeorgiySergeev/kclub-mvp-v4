import { PageShell } from '@/components/page-shell';
import { requireStaffProfile } from '@/server/auth/profile';
import { fetchSubscriptions } from '@/features/subscriptions/api';
import { SubscriptionsTable } from '@/features/subscriptions/components/subscriptions-table';

export default async function SubscriptionsPage() {
  const profile = await requireStaffProfile();
  const subscriptions = await fetchSubscriptions();

  return (
    <PageShell
      title="Subscriptions"
      description="Stripe-synchronized subscription operations and review."
      roleScope="ADMIN"
    >
      <SubscriptionsTable subscriptions={subscriptions ?? []} staffRole={profile.role} />
    </PageShell>
  );
}

import { PageShell } from '@/components/page-shell';
import { requireStaffProfile } from '@/server/auth/profile';
import { fetchStripePrices } from '@/features/stripe-prices/api';
import { StripePricesForm } from '@/features/stripe-prices/components/stripe-prices-form';

export default async function SettingsPage() {
  await requireStaffProfile();
  const prices = await fetchStripePrices();

  return (
    <PageShell
      title="Settings"
      description="Owner-managed platform-level configuration."
      roleScope="OWNER"
    >
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-lg font-medium">Stripe Price IDs</h3>
          <StripePricesForm prices={prices ?? []} />
        </div>
      </div>
    </PageShell>
  );
}

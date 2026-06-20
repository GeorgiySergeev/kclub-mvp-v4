import { PageShell } from '@/components/page-shell';
import { requireStaffProfile } from '@/server/auth/profile';
import { fetchStripePrices } from '@/features/stripe-prices/api';
import { StripePricesForm } from '@/features/stripe-prices/components/stripe-prices-form';

export default async function StripePricesPage() {
  await requireStaffProfile();
  const prices = await fetchStripePrices();

  return (
    <PageShell
      title="Stripe Prices"
      description="Owner-only Price ID configuration and visibility."
      roleScope="OWNER"
    >
      <StripePricesForm prices={prices ?? []} />
    </PageShell>
  );
}

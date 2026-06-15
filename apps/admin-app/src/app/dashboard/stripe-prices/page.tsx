import { PageShell } from '@/components/page-shell';

export default function StripePricesPage() {
  return (
    <PageShell
      title="Stripe Prices"
      description="Owner-only Price ID configuration and visibility."
      roleScope="OWNER"
    />
  );
}

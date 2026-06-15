import { PageShell } from '@/components/page-shell';

export default function SubscriptionsPage() {
  return (
    <PageShell
      title="Subscriptions"
      description="Stripe-synchronized subscription operations and review."
      roleScope="ADMIN"
    />
  );
}

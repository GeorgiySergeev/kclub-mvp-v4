import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { PageShell } from '@/components/page-shell';
import {
  TotalUsersCard,
  VipSubscriptionsCard,
  BusinessesUnderReviewCard,
  IntroductionsUnderReviewCard,
} from '@/features/dashboard/components/metrics-cards';
import { fetchDashboardMetrics } from '@/features/dashboard/api';

function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-4">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3 h-8 w-16" />
    </div>
  );
}

async function TotalUsers() {
  const data = await fetchDashboardMetrics();
  if (!data) return <MetricCardSkeleton />;
  return <TotalUsersCard data={data} />;
}

async function VipSubscriptions() {
  const data = await fetchDashboardMetrics();
  if (!data) return <MetricCardSkeleton />;
  return <VipSubscriptionsCard data={data} />;
}

async function BusinessesReview() {
  const data = await fetchDashboardMetrics();
  if (!data) return <MetricCardSkeleton />;
  return <BusinessesUnderReviewCard count={data.businessesUnderReview} />;
}

async function IntroductionsReview() {
  const data = await fetchDashboardMetrics();
  if (!data) return <MetricCardSkeleton />;
  return (
    <IntroductionsUnderReviewCard
      submitted={data.introductionsSubmitted}
      inReview={data.introductionsInReview}
    />
  );
}

export default function DashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      description="Cross-role metrics and operational overview."
      roleScope="All staff roles"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Suspense fallback={<MetricCardSkeleton />}>
          <TotalUsers />
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <VipSubscriptions />
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <BusinessesReview />
        </Suspense>
        <Suspense fallback={<MetricCardSkeleton />}>
          <IntroductionsReview />
        </Suspense>
      </div>
    </PageShell>
  );
}

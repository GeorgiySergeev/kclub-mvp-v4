import { notFound } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { requireStaffProfile } from '@/server/auth/profile';
import { fetchBusinessDetail } from '@/features/businesses/api';
import { BusinessDetailClient } from '@/features/businesses/components/business-detail-client';

type BusinessDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BusinessDetailsPage({ params }: BusinessDetailsPageProps) {
  const { id } = await params;
  const profile = await requireStaffProfile();
  const business = await fetchBusinessDetail(id);

  if (!business) {
    notFound();
  }

  return (
    <PageShell
      title={business.name}
      description={`Business detail — ${business.status}, ${business.categoryName}`}
      roleScope="MODERATOR"
    >
      <BusinessDetailClient business={business} staffRole={profile.role} />
    </PageShell>
  );
}

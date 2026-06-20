import { PageShell } from '@/components/page-shell';
import { requireStaffProfile } from '@/server/auth/profile';
import { fetchCatalogBusinesses } from '@/features/catalog/api';
import { CatalogList } from '@/features/catalog/components/catalog-list';

export default async function CatalogPage() {
  const profile = await requireStaffProfile();
  const result = await fetchCatalogBusinesses();

  return (
    <PageShell
      title="Catalog"
      description="Featured homepage toggles and curation settings."
      roleScope="MODERATOR"
    >
      <CatalogList businesses={result?.businesses ?? []} staffRole={profile.role} />
    </PageShell>
  );
}

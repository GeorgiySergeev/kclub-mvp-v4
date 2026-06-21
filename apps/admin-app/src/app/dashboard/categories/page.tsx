import { PageShell } from '@/components/page-shell';
import { requireStaffProfile } from '@/server/auth/profile';
import { fetchCategories } from '@/features/categories/api';
import { CategoriesTable } from '@/features/categories/components/categories-table';

export default async function CategoriesPage() {
  await requireStaffProfile();
  const categories = await fetchCategories();

  return (
    <PageShell
      title="Categories"
      description="Taxonomy CRUD for platform catalog and moderation."
      roleScope="MODERATOR"
    >
      <CategoriesTable categories={categories ?? []} />
    </PageShell>
  );
}

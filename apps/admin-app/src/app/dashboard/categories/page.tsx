import { PageShell } from '@/components/page-shell';

export default function CategoriesPage() {
  return (
    <PageShell
      title="Categories"
      description="Taxonomy CRUD for platform catalog and moderation."
      roleScope="MODERATOR"
    />
  );
}

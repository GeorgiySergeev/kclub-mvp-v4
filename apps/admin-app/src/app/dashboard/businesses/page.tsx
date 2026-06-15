import { PageShell } from '@/components/page-shell';

export default function BusinessesPage() {
  return (
    <PageShell
      title="Businesses"
      description="Moderation queue for verification and publication."
      roleScope="MODERATOR"
    />
  );
}

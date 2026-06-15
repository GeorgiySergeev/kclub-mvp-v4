import { PageShell } from '@/components/page-shell';

export default function CardsPage() {
  return (
    <PageShell
      title="Cards"
      description="Issue controls, revoke actions, and re-issue workflow."
      roleScope="ADMIN"
    />
  );
}

import { PageShell } from '@/components/page-shell';

type UserDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = await params;
  return (
    <PageShell
      title={`User #${id}`}
      description="Profile, card status, subscriptions, and audit timeline."
      roleScope="ADMIN"
    />
  );
}

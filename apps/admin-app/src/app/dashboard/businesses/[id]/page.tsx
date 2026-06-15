import { PageShell } from '@/components/page-shell';

type BusinessDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function BusinessDetailsPage({ params }: BusinessDetailsPageProps) {
  const { id } = await params;
  return (
    <PageShell
      title={`Business #${id}`}
      description="Moderation details, internal notes, and workflow actions."
      roleScope="MODERATOR"
    />
  );
}

import { PageShell } from '@/components/page-shell';
import { requireStaffProfile } from '@/server/auth/profile';
import { fetchCountries } from '@/features/countries/api';
import { CountriesTable } from '@/features/countries/components/countries-table';

export default async function CountriesPage() {
  await requireStaffProfile();
  const countries = await fetchCountries();

  return (
    <PageShell
      title="Countries"
      description="Reference directory for country metadata."
      roleScope="MODERATOR"
    >
      <CountriesTable countries={countries ?? []} />
    </PageShell>
  );
}

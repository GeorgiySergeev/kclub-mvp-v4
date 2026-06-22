import { PageShell } from '@/components/page-shell';
import { requireStaffProfile } from '@/server/auth/profile';
import { fetchCities } from '@/features/cities/api';
import { fetchCountries } from '@/features/countries/api';
import { CitiesTable } from '@/features/cities/components/cities-table';

export default async function CitiesPage() {
  await requireStaffProfile();
  const [cities, countries] = await Promise.all([fetchCities(), fetchCountries()]);

  return (
    <PageShell
      title="Cities"
      description="Reference directory for city metadata."
      roleScope="MODERATOR"
    >
      <CitiesTable cities={cities ?? []} countries={countries ?? []} />
    </PageShell>
  );
}

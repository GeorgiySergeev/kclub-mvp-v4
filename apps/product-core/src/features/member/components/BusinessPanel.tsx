import { getTranslations } from 'next-intl/server';

import type { CurrentMemberProfileDto, MemberBusinessProfileDto } from '@kclub/contracts';
import { Badge, Surface } from '@kclub/ui';

import type { Locale } from '@/i18n/routing';
import { getOwnBusinesses } from '@/server/services/business-service';
import { getPrismaClient } from '@/server/db';
import { BusinessForm } from './BusinessForm';

export type TaxonomyOption = {
  id: string;
  name: string;
};

const STATUS_LABEL_KEYS: Record<string, string> = {
  UNDER_REVIEW: 'underReview',
  APPROVED: 'approved',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
  HIDDEN: 'hidden',
};

const STATUS_BADGE_VARIANTS: Record<string, 'default' | 'outline' | 'success'> = {
  UNDER_REVIEW: 'outline',
  APPROVED: 'success',
  PUBLISHED: 'success',
  REJECTED: 'default',
  HIDDEN: 'outline',
};

function getStatusBadgeVariant(status: string) {
  return STATUS_BADGE_VARIANTS[status] ?? 'outline';
}

export async function BusinessPanel({
  locale,
  profile,
}: {
  locale: Locale;
  profile: CurrentMemberProfileDto;
}) {
  const t = await getTranslations({ locale, namespace: 'member.dashboard.business' });
  const prisma = getPrismaClient();

  const [ownBusinesses, countries, categories] = await Promise.all([
    getOwnBusinesses(profile.id),
    prisma.country.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' },
    }),
    prisma.category.findMany({
      where: { is_active: true, is_high_risk: false },
      orderBy: { name: 'asc' },
    }),
  ]);

  const cities = await prisma.city.findMany({
    where: { is_active: true },
    orderBy: { name: 'asc' },
  });

  const countryOptions: TaxonomyOption[] = countries.map((c) => ({ id: c.id, name: c.name }));
  const cityOptions: TaxonomyOption[] = cities.map((c) => ({ id: c.id, name: c.name }));
  const categoryOptions: TaxonomyOption[] = categories.map((c) => ({ id: c.id, name: c.name }));

  const activeBusiness = ownBusinesses.find((b) => b.status !== 'REJECTED');
  const rejectedBusiness = ownBusinesses.find((b) => b.status === 'REJECTED');
  const canSubmit = !activeBusiness;
  const canEditBusiness =
    activeBusiness &&
    (activeBusiness.status === 'UNDER_REVIEW' || activeBusiness.status === 'REJECTED');
  const editBusiness = canEditBusiness ? activeBusiness : (rejectedBusiness ?? null);

  return (
    <Surface className="kclub-panel max-w-none space-y-6 rounded-none px-6 py-6 shadow-none ring-0">
      <h2 className="text-xl font-black uppercase tracking-[0.01em] text-zinc-950 dark:text-white">
        {t('title')}
      </h2>
      <p className="dark:text-white/66 text-sm leading-7 text-zinc-600">{t('description')}</p>

      {ownBusinesses.length > 0 && (
        <div className="space-y-4">
          {ownBusinesses.map((business) => (
            <BusinessStatusCard key={business.id} business={business} locale={locale} />
          ))}
        </div>
      )}

      {canSubmit && (
        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase tracking-[0.01em] text-zinc-950 dark:text-white">
            {t('submitTitle')}
          </h3>
          <BusinessForm
            locale={locale}
            business={null}
            countryOptions={countryOptions}
            cityOptions={cityOptions}
            categoryOptions={categoryOptions}
          />
        </div>
      )}

      {editBusiness && (
        <div className="space-y-4">
          <h3 className="text-lg font-black uppercase tracking-[0.01em] text-zinc-950 dark:text-white">
            {t('editTitle')}
          </h3>
          {editBusiness.status === 'REJECTED' && editBusiness.rejectionReason && (
            <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-200">
              <strong>{t('rejectionReasonLabel')}:</strong> {editBusiness.rejectionReason}
            </div>
          )}
          <BusinessForm
            locale={locale}
            business={editBusiness}
            countryOptions={countryOptions}
            cityOptions={cityOptions}
            categoryOptions={categoryOptions}
          />
        </div>
      )}

      {!canSubmit && !editBusiness && (
        <div className="kclub-panel-soft dark:text-white/62 p-4 text-sm text-zinc-600">
          {t('noEditAvailable')}
        </div>
      )}
    </Surface>
  );
}

async function BusinessStatusCard({
  business,
  locale,
}: {
  business: MemberBusinessProfileDto;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: 'member.dashboard.business' });

  return (
    <Surface className="kclub-panel-soft max-w-none space-y-3 rounded-none p-4 shadow-none ring-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-semibold uppercase tracking-[0.02em] text-zinc-950 dark:text-white">
            {business.name}
          </h4>
          <p className="dark:text-white/62 mt-1 text-sm text-zinc-600">
            {business.categoryName} &middot; {business.cityName}, {business.countryName}
          </p>
        </div>
        <Badge variant={getStatusBadgeVariant(business.status)}>
          {t(STATUS_LABEL_KEYS[business.status] ?? business.status)}
        </Badge>
      </div>
    </Surface>
  );
}

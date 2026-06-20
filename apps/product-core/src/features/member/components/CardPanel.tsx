'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import type { MemberCardDto } from '@kclub/contracts';
import { MEMBER_API_ROUTES } from '@kclub/contracts';
import { EmptyState, Skeleton, Surface, linkClasses } from '@kclub/ui';

import type { Locale } from '@/i18n/routing';
import { parseAuthResponse } from '@/features/auth/utils/api';

import { DigitalClubCard } from './DigitalClubCard';
import { DigitalClubCardSkeleton } from './DigitalClubCardSkeleton';

type CardPanelProps = {
  locale: Locale;
  memberName: string;
};

export function CardPanel({ locale, memberName }: CardPanelProps) {
  const t = useTranslations('member.dashboard.card');
  const [card, setCard] = useState<MemberCardDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCard() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(MEMBER_API_ROUTES.CARDS);
        const result = await parseAuthResponse<MemberCardDto | null>(response);

        if (!isMounted) return;

        if (!result.success) {
          setError(t('error'));
          return;
        }

        setCard(result.data ?? null);
      } catch {
        if (isMounted) setError(t('error'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadCard();

    return () => {
      isMounted = false;
    };
  }, [t]);

  if (isLoading) {
    return (
      <Surface className="kclub-panel max-w-none overflow-hidden rounded-none p-0 shadow-none ring-0">
        <div className="flex justify-center bg-zinc-950 px-6 py-10">
          <DigitalClubCardSkeleton />
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
        <div className="border-t border-zinc-200 px-6 py-4 dark:border-white/10">
          <Skeleton className="h-4 w-32" />
        </div>
      </Surface>
    );
  }

  if (error) {
    return <EmptyState title={t('errorTitle')} description={error} />;
  }

  if (!card) {
    return <EmptyState title={t('emptyTitle')} description={t('emptyDescription')} />;
  }

  const verifyHref = `/${locale}/verify-card/${encodeURIComponent(card.cardNumber)}`;
  const rows = [
    [t('cardNumber'), card.cardNumber],
    [t('tier'), card.membershipTier],
    [t('status'), card.status],
    [t('issuedAt'), new Date(card.issuedAt).toLocaleDateString(locale)],
    [
      t('expiresAt'),
      card.expiresAt ? new Date(card.expiresAt).toLocaleDateString(locale) : t('noExpiration'),
    ],
  ];

  return (
    <Surface className="kclub-panel max-w-none overflow-hidden rounded-none p-0 shadow-none ring-0">
      <div className="flex justify-center bg-zinc-950 px-6 py-10">
        <DigitalClubCard
          cardNumber={card.cardNumber}
          memberName={memberName}
          membershipTier={card.membershipTier}
          status={card.status}
          expiresAt={card.expiresAt}
          locale={locale}
          validThruLabel={t('validThru')}
          tierLabel={t('tier')}
        />
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="kclub-panel-soft p-4">
            <dt className="dark:text-white/48 text-xs uppercase tracking-[0.14em] text-zinc-500">
              {label}
            </dt>
            <dd className="mt-2 text-sm text-zinc-950 dark:text-white">{value}</dd>
          </div>
        ))}
      </div>

      <div className="border-t border-zinc-200 px-6 py-4 dark:border-white/10">
        <Link href={verifyHref} className={linkClasses}>
          {t('verifyLink')}
        </Link>
      </div>
    </Surface>
  );
}

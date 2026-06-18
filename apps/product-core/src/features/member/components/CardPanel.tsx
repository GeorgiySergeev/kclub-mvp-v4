'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import type { MemberCardDto } from '@kclub/contracts';
import { MEMBER_API_ROUTES } from '@kclub/contracts';
import { Badge } from '@kclub/ui';

import { ClubCardVisual } from '@/components/premium';
import type { Locale } from '@/i18n/routing';
import { parseAuthResponse } from '@/features/auth/utils/api';
import { MemberInfoTile, MemberPanel, MemberPanelHeader } from './cabinet/MemberPanel';
import { memberSecondaryButtonClasses } from './cabinet/styles';

export function CardPanel({ locale }: { locale: Locale }) {
  const t = useTranslations('member.dashboard.card');
  const tCommon = useTranslations('member.common');
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
      <MemberPanel>
        <p className="text-sm text-muted-foreground">{tCommon('loading')}</p>
      </MemberPanel>
    );
  }

  if (error) {
    return (
      <MemberPanel>
        <MemberPanelHeader title={t('errorTitle')} description={error} />
      </MemberPanel>
    );
  }

  if (!card) {
    return (
      <MemberPanel>
        <MemberPanelHeader title={t('emptyTitle')} description={t('emptyDescription')} />
      </MemberPanel>
    );
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
  ] as const;

  const isVip = card.membershipTier === 'VIP';

  return (
    <MemberPanel noPadding className="overflow-hidden">
      <div className="border-b border-border bg-kclub-navy-950 p-6 dark:border-kclub-navy-700 sm:p-8">
        <ClubCardVisual
          cardNumber={card.cardNumber}
          membershipTier={card.membershipTier}
          status={card.status}
          brandLabel={t('eyebrow')}
          tierLabel={card.membershipTier}
          statusLabel={card.status}
        />
        <div className="mt-4 flex justify-end">
          <Badge variant={isVip ? 'vip' : 'member'} className="text-[0.65rem] uppercase tracking-[0.1em]">
            {card.membershipTier}
          </Badge>
        </div>
      </div>

      <div className="grid gap-3 p-6 sm:grid-cols-2 sm:p-8">
        {rows.map(([label, value]) => (
          <MemberInfoTile key={label} label={label} value={value} />
        ))}
      </div>

      <div className="border-t border-border px-6 py-4 dark:border-kclub-navy-700 sm:px-8">
        <Link href={verifyHref} className={memberSecondaryButtonClasses}>
          {t('verifyLink')}
        </Link>
      </div>
    </MemberPanel>
  );
}

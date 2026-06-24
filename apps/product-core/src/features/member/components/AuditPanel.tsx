'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import type { AuditLogDto } from '@kclub/contracts';

import type { Locale } from '@/i18n/routing';
import { cabinetContentClasses } from '@/features/member/components/cabinet/styles';

type AuditPanelProps = {
  locale: Locale;
};

export function AuditPanel({ locale }: AuditPanelProps) {
  const t = useTranslations('member.dashboard.audit');
  const [entries, setEntries] = useState<AuditLogDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const res = await fetch('/api/v1/me/audit');
        if (!res.ok) throw new Error('fetch failed');
        const json = (await res.json()) as { data: AuditLogDto[] };
        if (isMounted) setEntries(json.data ?? []);
      } catch {
        if (isMounted) setError(t('error'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void load();
    return () => {
      isMounted = false;
    };
  }, [t]);

  const formatAction = (action: string) =>
    action
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className={cabinetContentClasses}>
      <p className="mb-6 text-sm text-muted-foreground">{t('description')}</p>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse border border-border bg-surface-muted" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t('empty')}</p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start justify-between gap-4 border border-border bg-surface-muted p-4"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">{formatAction(entry.action)}</p>
                {entry.after ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {Object.entries(entry.after)
                      .map(([k, v]) => `${k}: ${String(v)}`)
                      .join(' · ')}
                  </p>
                ) : null}
              </div>
              <time
                className="shrink-0 text-xs text-muted-foreground"
                dateTime={entry.createdAt}
              >
                {new Date(entry.createdAt).toLocaleDateString(locale, {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </time>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

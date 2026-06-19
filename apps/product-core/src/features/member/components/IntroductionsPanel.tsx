'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import {
  MEMBER_API_ROUTES,
  type CurrentMemberProfileDto,
  type MemberBusinessProfileDto,
  type MemberIntroductionDto,
  type PublicBusinessListItemDto,
} from '@kclub/contracts';
import { Badge, Surface } from '@kclub/ui';

import type { Locale } from '@/i18n/routing';
import { parseAuthResponse } from '@/features/auth/utils/api';

const STATUS_LABEL_KEYS: Record<string, string> = {
  SUBMITTED: 'statusSubmitted',
  IN_REVIEW: 'statusInReview',
  APPROVED: 'statusApproved',
  COMPLETED: 'statusCompleted',
  REJECTED: 'statusRejected',
  CANCELED: 'statusCanceled',
};

const STATUS_BADGE_VARIANTS: Record<string, 'default' | 'outline' | 'success'> = {
  SUBMITTED: 'outline',
  IN_REVIEW: 'outline',
  APPROVED: 'success',
  COMPLETED: 'success',
  REJECTED: 'default',
  CANCELED: 'outline',
};

const CANCELLABLE_STATUSES = new Set(['SUBMITTED', 'IN_REVIEW']);

function getStatusBadgeVariant(status: string) {
  return STATUS_BADGE_VARIANTS[status] ?? 'outline';
}

export function IntroductionsPanel({
  locale: _locale,
  profile: _profile,
  serverPublicBusinesses,
}: {
  locale: Locale;
  profile: CurrentMemberProfileDto;
  serverPublicBusinesses: PublicBusinessListItemDto[];
}) {
  const t = useTranslations('member.dashboard.introductions');
  const tCommon = useTranslations('member.common');

  const [ownBusinesses, setOwnBusinesses] = useState<MemberBusinessProfileDto[]>([]);
  const [introductions, setIntroductions] = useState<MemberIntroductionDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedRequesterBusinessId, setSelectedRequesterBusinessId] = useState('');
  const [selectedTargetBusinessId, setSelectedTargetBusinessId] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const labelClassName = 'block text-sm font-medium text-zinc-700 dark:text-white/72';
  const fieldClassName = 'kclub-field mt-1';
  const buttonClassName =
    'kclub-button-primary rounded-none border-0 px-5 py-3 text-xs tracking-[0.24em] disabled:cursor-not-allowed disabled:opacity-50';

  const publishedOwnBusinesses = ownBusinesses.filter((b) => b.status === 'PUBLISHED');
  const availableTargets = serverPublicBusinesses.filter(
    (pb) => !ownBusinesses.some((ob) => ob.id === pb.id),
  );

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      setError(null);

      try {
        const [introsRes, bizRes] = await Promise.all([
          fetch(MEMBER_API_ROUTES.INTRODUCTIONS),
          fetch(MEMBER_API_ROUTES.BUSINESSES),
        ]);

        const introsResult = await parseAuthResponse<MemberIntroductionDto[]>(introsRes);
        const bizResult = await parseAuthResponse<MemberBusinessProfileDto[]>(bizRes);

        if (!isMounted) return;

        if (!introsResult.success) {
          setError(tCommon('genericError'));
          return;
        }

        if (!bizResult.success) {
          setError(tCommon('genericError'));
          return;
        }

        setIntroductions(introsResult.data ?? []);
        const businesses = bizResult.data ?? [];
        setOwnBusinesses(businesses);

        if (businesses.filter((b) => b.status === 'PUBLISHED').length > 0) {
          const firstPublished = businesses.find((b) => b.status === 'PUBLISHED');
          if (firstPublished) setSelectedRequesterBusinessId(firstPublished.id);
        }
      } catch {
        if (isMounted) setError(tCommon('genericError'));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmitIntroduction(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch(MEMBER_API_ROUTES.INTRODUCTIONS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterBusinessId: selectedRequesterBusinessId,
          targetBusinessId: selectedTargetBusinessId,
          message: message || null,
        }),
      });

      const result = await parseAuthResponse<MemberIntroductionDto>(response);

      if (!result.success) {
        const msg = result.errorCode
          ? t(`errors.${result.errorCode}`, { defaultValue: tCommon('genericError') })
          : tCommon('genericError');
        setSubmitError(msg);
        return;
      }

      setSubmitSuccess(true);
      setMessage('');
      setSelectedTargetBusinessId('');

      const introsRes = await fetch(MEMBER_API_ROUTES.INTRODUCTIONS);
      const introsResult = await parseAuthResponse<MemberIntroductionDto[]>(introsRes);
      if (introsResult.success && introsResult.data) {
        setIntroductions(introsResult.data);
      }
    } catch {
      setSubmitError(tCommon('genericError'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCancel(introductionId: string) {
    try {
      const cancelUrl = MEMBER_API_ROUTES.INTRODUCTION_CANCEL.replace(':id', introductionId);
      const response = await fetch(cancelUrl, { method: 'POST' });
      const result = await parseAuthResponse<MemberIntroductionDto>(response);

      if (!result.success) {
        const msg = result.errorCode
          ? t(`errors.${result.errorCode}`, { defaultValue: tCommon('genericError') })
          : tCommon('genericError');
        setError(msg);
        return;
      }

      const introsRes = await fetch(MEMBER_API_ROUTES.INTRODUCTIONS);
      const introsResult = await parseAuthResponse<MemberIntroductionDto[]>(introsRes);
      if (introsResult.success && introsResult.data) {
        setIntroductions(introsResult.data);
      }
    } catch {
      setError(tCommon('genericError'));
    }
  }

  if (isLoading) {
    return (
      <Surface className="kclub-panel max-w-none rounded-none px-6 py-6 shadow-none ring-0">
        <p className="dark:text-white/66 text-sm text-zinc-600">{tCommon('loading')}</p>
      </Surface>
    );
  }

  if (publishedOwnBusinesses.length === 0) {
    return (
      <Surface className="kclub-panel max-w-none rounded-none px-6 py-6 shadow-none ring-0">
        <h2 className="text-xl font-black uppercase tracking-[0.01em] text-zinc-950 dark:text-white">
          {t('title')}
        </h2>
        <p className="dark:text-white/66 mt-2 text-sm leading-7 text-zinc-600">
          {t('noPublishedBusiness')}
        </p>
      </Surface>
    );
  }

  return (
    <Surface className="kclub-panel max-w-none space-y-6 rounded-none px-6 py-6 shadow-none ring-0">
      <h2 className="text-xl font-black uppercase tracking-[0.01em] text-zinc-950 dark:text-white">
        {t('title')}
      </h2>
      <p className="dark:text-white/66 text-sm leading-7 text-zinc-600">{t('description')}</p>

      {error && (
        <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-black uppercase tracking-[0.01em] text-zinc-950 dark:text-white">
          {t('submitTitle')}
        </h3>

        <form onSubmit={handleSubmitIntroduction} className="space-y-4">
          {submitError && (
            <div className="border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-200">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-200">
              {t('submitSuccess')}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClassName}>{t('requesterBusinessLabel')}</label>
              <select
                value={selectedRequesterBusinessId}
                onChange={(e) => setSelectedRequesterBusinessId(e.target.value)}
                required
                className={fieldClassName}
              >
                {publishedOwnBusinesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClassName}>{t('targetBusinessLabel')}</label>
              <select
                value={selectedTargetBusinessId}
                onChange={(e) => setSelectedTargetBusinessId(e.target.value)}
                required
                className={fieldClassName}
              >
                <option value="">{t('selectPlaceholder')}</option>
                {availableTargets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} - {b.countryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClassName}>{t('messageLabel')}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder={t('messagePlaceholder')}
              className={fieldClassName}
            />
          </div>

          <button type="submit" disabled={isSubmitting} className={buttonClassName}>
            {isSubmitting ? tCommon('saving') : t('submitCta')}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-black uppercase tracking-[0.01em] text-zinc-950 dark:text-white">
          {t('listTitle')}
        </h3>

        {introductions.length === 0 && (
          <p className="dark:text-white/62 text-sm text-zinc-600">{t('emptyList')}</p>
        )}

        <div className="space-y-3">
          {introductions.map((intro) => (
            <Surface
              key={intro.id}
              className="kclub-panel-soft max-w-none space-y-3 rounded-none p-4 shadow-none ring-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-zinc-950 dark:text-white">
                    <span className="font-medium">{intro.requesterBusinessName}</span>
                    {' -> '}
                    <span className="font-medium">{intro.targetBusinessName}</span>
                  </p>
                  {intro.message && (
                    <p className="dark:text-white/64 text-sm text-zinc-600">{intro.message}</p>
                  )}
                  {intro.rejectionReason && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {t('rejectionReasonLabel')}: {intro.rejectionReason}
                    </p>
                  )}
                  <p className="dark:text-white/42 text-xs text-zinc-500">
                    {new Date(intro.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={getStatusBadgeVariant(intro.status)}>
                    {t(STATUS_LABEL_KEYS[intro.status] ?? intro.status)}
                  </Badge>
                  {CANCELLABLE_STATUSES.has(intro.status) && (
                    <button
                      type="button"
                      onClick={() => handleCancel(intro.id)}
                      className="text-xs text-red-600 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      {t('cancelAction')}
                    </button>
                  )}
                </div>
              </div>
            </Surface>
          ))}
        </div>
      </div>
    </Surface>
  );
}

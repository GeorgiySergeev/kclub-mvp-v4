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
  profile,
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

      // Reload introductions
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

      // Reload
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
      <Surface className="max-w-none">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{tCommon('loading')}</p>
      </Surface>
    );
  }

  if (publishedOwnBusinesses.length === 0) {
    return (
      <Surface className="max-w-none">
        <h2 className="text-xl font-medium text-zinc-950 dark:text-zinc-50">{t('title')}</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{t('noPublishedBusiness')}</p>
      </Surface>
    );
  }

  return (
    <Surface className="max-w-none space-y-6">
      <h2 className="text-xl font-medium text-zinc-950 dark:text-zinc-50">{t('title')}</h2>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('description')}</p>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </div>
      )}

      {/* Submit form */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-zinc-950 dark:text-zinc-50">{t('submitTitle')}</h3>

        <form onSubmit={handleSubmitIntroduction} className="space-y-4">
          {submitError && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
              {submitError}
            </div>
          )}

          {submitSuccess && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-200">
              {t('submitSuccess')}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('requesterBusinessLabel')}
              </label>
              <select
                value={selectedRequesterBusinessId}
                onChange={(e) => setSelectedRequesterBusinessId(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
              >
                {publishedOwnBusinesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {t('targetBusinessLabel')}
              </label>
              <select
                value={selectedTargetBusinessId}
                onChange={(e) => setSelectedTargetBusinessId(e.target.value)}
                required
                className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
              >
                <option value="">{t('selectPlaceholder')}</option>
                {availableTargets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} &middot; {b.countryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {t('messageLabel')}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder={t('messagePlaceholder')}
              className="mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 focus:border-zinc-950 focus:outline-none focus:ring-1 focus:ring-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {isSubmitting ? tCommon('saving') : t('submitCta')}
          </button>
        </form>
      </div>

      {/* Introductions list */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-zinc-950 dark:text-zinc-50">{t('listTitle')}</h3>

        {introductions.length === 0 && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('emptyList')}</p>
        )}

        <div className="space-y-3">
          {introductions.map((intro) => (
            <Surface key={intro.id} className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-zinc-950 dark:text-zinc-50">
                    <span className="font-medium">{intro.requesterBusinessName}</span>
                    {' → '}
                    <span className="font-medium">{intro.targetBusinessName}</span>
                  </p>
                  {intro.message && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{intro.message}</p>
                  )}
                  {intro.rejectionReason && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {t('rejectionReasonLabel')}: {intro.rejectionReason}
                    </p>
                  )}
                  <p className="text-xs text-zinc-500 dark:text-zinc-500">
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

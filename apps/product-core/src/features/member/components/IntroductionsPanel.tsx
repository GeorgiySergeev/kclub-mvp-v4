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
import { Badge } from '@kclub/ui';

import type { Locale } from '@/i18n/routing';
import { parseAuthResponse } from '@/features/auth/utils/api';
import { MemberPanel, MemberPanelHeader } from './cabinet/MemberPanel';
import {
  memberActionButtonClasses,
  memberAlertErrorClasses,
  memberAlertSuccessClasses,
  memberFormInputClasses,
  memberFormLabelClasses,
  memberInfoTileClasses,
} from './cabinet/styles';

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
      <MemberPanel>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{tCommon('loading')}</p>
      </MemberPanel>
    );
  }

  if (publishedOwnBusinesses.length === 0) {
    return (
      <MemberPanel>
        <MemberPanelHeader title={t('title')} description={t('noPublishedBusiness')} />
      </MemberPanel>
    );
  }

  return (
    <MemberPanel>
      <MemberPanelHeader title={t('title')} description={t('description')} />

      {error && <div className={memberAlertErrorClasses}>{error}</div>}

      <div className="space-y-4 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h3 className="text-base font-medium text-zinc-950 dark:text-zinc-50">{t('submitTitle')}</h3>

        <form onSubmit={handleSubmitIntroduction} className="space-y-4">
          {submitError && <div className={memberAlertErrorClasses}>{submitError}</div>}

          {submitSuccess && <div className={memberAlertSuccessClasses}>{t('submitSuccess')}</div>}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={memberFormLabelClasses}>{t('requesterBusinessLabel')}</label>
              <select
                value={selectedRequesterBusinessId}
                onChange={(e) => setSelectedRequesterBusinessId(e.target.value)}
                required
                className={memberFormInputClasses}
              >
                {publishedOwnBusinesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={memberFormLabelClasses}>{t('targetBusinessLabel')}</label>
              <select
                value={selectedTargetBusinessId}
                onChange={(e) => setSelectedTargetBusinessId(e.target.value)}
                required
                className={memberFormInputClasses}
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
            <label className={memberFormLabelClasses}>{t('messageLabel')}</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder={t('messagePlaceholder')}
              className={memberFormInputClasses}
            />
          </div>

          <button type="submit" disabled={isSubmitting} className={memberActionButtonClasses}>
            {isSubmitting ? tCommon('saving') : t('submitCta')}
          </button>
        </form>
      </div>

      <div className="space-y-4 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <h3 className="text-base font-medium text-zinc-950 dark:text-zinc-50">{t('listTitle')}</h3>

        {introductions.length === 0 && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{t('emptyList')}</p>
        )}

        <div className="space-y-3">
          {introductions.map((intro) => (
            <div key={intro.id} className={memberInfoTileClasses}>
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
                  <p className="text-xs text-zinc-500">
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
            </div>
          ))}
        </div>
      </div>
    </MemberPanel>
  );
}

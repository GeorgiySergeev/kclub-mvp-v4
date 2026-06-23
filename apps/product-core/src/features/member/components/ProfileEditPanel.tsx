'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Camera, Pencil } from 'lucide-react';

import type { CurrentMemberProfileDto } from '@kclub/contracts';
import { MEMBER_API_ROUTES } from '@kclub/contracts';
import { Button, FieldError, Spinner } from '@kclub/ui';

import type { Locale } from '@/i18n/routing';
import { locales } from '@/i18n/routing';
import { parseAuthResponse } from '@/features/auth/utils/api';

import { CardPanel } from './CardPanel';

type Props = {
  locale: Locale;
  profile: CurrentMemberProfileDto;
};

function getInitials(name: string | null, phone: string): string {
  if (name) return name.charAt(0).toUpperCase();
  return phone.charAt(phone.length - 1);
}

export function ProfileEditPanel({ locale, profile }: Props) {
  const t = useTranslations('member.dashboard.profile');
  const tCommon = useTranslations('member.common');
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(profile.displayName ?? '');
  const [localePreference, setLocalePreference] = useState<Locale>(
    profile.localePreference ?? locale,
  );
  const [country, setCountry] = useState(profile.country ?? '');
  const [city, setCity] = useState(profile.city ?? '');
  const [about, setAbout] = useState(profile.about ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? '');

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const labelClass = 'block text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500 dark:text-white/48 mb-1.5';
  const fieldClass = 'kclub-field w-full';

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingAvatar(true);
    setAvatarError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/v1/me/avatar', { method: 'POST', body: formData });
      const result = await parseAuthResponse<CurrentMemberProfileDto>(res);

      if (!result.success || !result.data) {
        setAvatarError(t('avatarUploadError'));
        return;
      }

      setAvatarUrl(result.data.avatarUrl ?? '');
      router.refresh();
    } catch {
      setAvatarError(t('avatarUploadError'));
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const body: Record<string, string | null | undefined> = {
        displayName: displayName || undefined,
        localePreference,
        country: country || null,
        city: city || null,
        about: about || null,
      };

      const res = await fetch(MEMBER_API_ROUTES.ME, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await parseAuthResponse<CurrentMemberProfileDto>(res);

      if (!result.success) {
        setError(t('saveError'));
        return;
      }

      setSaveSuccess(true);
      setIsEditing(false);
      router.refresh();
    } catch {
      setError(t('saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDisplayName(profile.displayName ?? '');
    setLocalePreference(profile.localePreference ?? locale);
    setCountry(profile.country ?? '');
    setCity(profile.city ?? '');
    setAbout(profile.about ?? '');
    setError(null);
    setIsEditing(false);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr,400px]">
      {/* ── Left column: info + form ── */}
      <div className="space-y-6">
        {/* Avatar + name header */}
        <div className="flex items-center gap-5">
          {/* Avatar circle */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={handleAvatarClick}
              aria-label={t('avatar')}
              className="group relative h-20 w-20 overflow-hidden rounded-full bg-zinc-100 ring-2 ring-zinc-200 transition hover:ring-accent dark:bg-zinc-800 dark:ring-white/15"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName || profile.phone}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-xl font-black uppercase text-zinc-400 dark:text-white/40">
                  {getInitials(displayName || profile.displayName, profile.phone)}
                </span>
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                {isUploadingAvatar ? (
                  <Spinner size={18} className="text-white" />
                ) : (
                  <Camera size={18} className="text-white" />
                )}
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-xl font-black uppercase tracking-[0.01em] text-zinc-950 dark:text-white">
              {displayName || profile.displayName || profile.phone}
            </p>
            <p className="mt-0.5 font-mono text-xs text-zinc-500 dark:text-white/40">
              {profile.phone}
            </p>
            {(profile.city || profile.country) && !isEditing && (
              <p className="mt-1 text-xs text-zinc-500 dark:text-white/48">
                {[profile.city, profile.country].filter(Boolean).join(', ')}
              </p>
            )}
          </div>

          {!isEditing && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => { setSaveSuccess(false); setIsEditing(true); }}
              className="ml-auto shrink-0 gap-1.5 rounded-none text-xs uppercase tracking-[0.14em]"
            >
              <Pencil size={12} />
              {t('edit')}
            </Button>
          )}
        </div>

        {avatarError && (
          <p className="text-xs text-red-600 dark:text-red-400">{avatarError}</p>
        )}

        {/* View mode */}
        {!isEditing && (
          <dl className="grid gap-3 sm:grid-cols-2">
            {saveSuccess && (
              <div className="col-span-full text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {t('saveSuccess')}
              </div>
            )}
            {[
              [t('displayName'), profile.displayName ?? t('notSet')],
              [t('locale'), profile.localePreference ? tCommon(`locales.${profile.localePreference}`) : t('notSet')],
              [t('country'), profile.country ?? t('notSet')],
              [t('city'), profile.city ?? t('notSet')],
              [t('joined'), new Date(profile.createdAt).toLocaleDateString(locale)],
            ].map(([label, value]) => (
              <div key={label} className="kclub-panel-soft p-4">
                <dt className="text-xs uppercase tracking-[0.14em] text-zinc-500 dark:text-white/48">
                  {label}
                </dt>
                <dd className="mt-2 text-sm text-zinc-950 dark:text-white">{value}</dd>
              </div>
            ))}
            {profile.about && (
              <div className="kclub-panel-soft col-span-full p-4">
                <dt className="text-xs uppercase tracking-[0.14em] text-zinc-500 dark:text-white/48">
                  {t('about')}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-zinc-950 dark:text-white">
                  {profile.about}
                </dd>
              </div>
            )}
          </dl>
        )}

        {/* Edit mode */}
        {isEditing && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>{t('displayName')}</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={100}
                  disabled={isSaving}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t('locale')}</label>
                <select
                  value={localePreference}
                  onChange={(e) => setLocalePreference(e.target.value as Locale)}
                  disabled={isSaving}
                  className={fieldClass}
                >
                  {locales.map((l) => (
                    <option key={l} value={l}>
                      {tCommon(`locales.${l}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t('country')}</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  maxLength={100}
                  disabled={isSaving}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t('city')}</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  maxLength={100}
                  disabled={isSaving}
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>{t('about')}</label>
              <textarea
                rows={3}
                maxLength={500}
                placeholder={t('aboutPlaceholder')}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                disabled={isSaving}
                className={fieldClass}
              />
            </div>

            {error && <FieldError>{error}</FieldError>}

            <div className="flex items-center gap-3 pt-1">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2 rounded-none border-0 bg-zinc-950 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              >
                {isSaving && <Spinner size={13} />}
                {isSaving ? t('saving') : t('save')}
              </Button>
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
                className="text-xs uppercase tracking-[0.14em]"
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Right column: Club Card ── */}
      <div className="hidden lg:block">
        <CardPanel locale={locale} memberName={displayName || profile.displayName || profile.phone} />
      </div>
    </div>
  );
}

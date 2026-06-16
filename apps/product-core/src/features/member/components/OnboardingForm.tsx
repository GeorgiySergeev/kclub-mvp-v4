'use client';

import { useId, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import type { CurrentMemberProfileDto, Locale } from '@kclub/contracts';
import { Button, Field, FieldError, Input, Label } from '@kclub/ui';
import { MEMBER_API_ROUTES } from '@kclub/contracts';

import { parseAuthResponse } from '@/features/auth/utils/api';
import { locales } from '@/i18n/routing';

type OnboardingFormProps = {
  locale: Locale;
  profile: CurrentMemberProfileDto;
};

export function OnboardingForm({ locale, profile }: OnboardingFormProps) {
  const t = useTranslations('member.onboarding');
  const tCommon = useTranslations('member.common');
  const router = useRouter();
  const errorId = useId();

  const [displayName, setDisplayName] = useState(profile.displayName ?? '');
  const [localePreference, setLocalePreference] = useState<Locale>(
    profile.localePreference ?? locale,
  );
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(MEMBER_API_ROUTES.COMPLETE_ONBOARDING, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: profile.phone,
          displayName,
          localePreference,
          termsAccepted,
        }),
      });
      const result = await parseAuthResponse<CurrentMemberProfileDto>(response);

      if (!result.success) {
        const code = result.errorCode;
        if (code === 'VALIDATION_INVALID_PHONE') {
          setError(t('errors.phoneMismatch'));
        } else if (code === 'VALIDATION_INVALID_LOCALE') {
          setError(t('errors.invalidLocale'));
        } else if (code === 'AUTH_SESSION_REQUIRED') {
          setError(t('errors.session'));
        } else {
          setError(t('errors.invalidInput'));
        }
        return;
      }

      router.replace(`/${locale}/m/dashboard?tab=card`);
      router.refresh();
    } catch {
      setError(tCommon('genericError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <Field>
        <Label htmlFor="phone">{t('phoneLabel')}</Label>
        <Input id="phone" name="phone" type="tel" value={profile.phone} disabled readOnly />
      </Field>

      <Field>
        <Label htmlFor="displayName">{t('displayNameLabel')}</Label>
        <Input
          id="displayName"
          name="displayName"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={100}
          placeholder={t('displayNamePlaceholder')}
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          disabled={isLoading}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      </Field>

      <Field>
        <Label htmlFor="localePreference">{t('localeLabel')}</Label>
        <select
          id="localePreference"
          name="localePreference"
          value={localePreference}
          onChange={(event) => setLocalePreference(event.target.value as Locale)}
          disabled={isLoading}
          className="block w-full rounded-md border-0 px-3 py-2.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-700 dark:focus:ring-zinc-50 sm:text-sm sm:leading-6"
        >
          {locales.map((item) => (
            <option key={item} value={item}>
              {tCommon(`locales.${item}`)}
            </option>
          ))}
        </select>
      </Field>

      <label className="flex gap-3 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={termsAccepted}
          onChange={(event) => setTermsAccepted(event.target.checked)}
          disabled={isLoading}
          required
          className="mt-1 h-4 w-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-zinc-50"
        />
        <span>{t('termsLabel')}</span>
      </label>

      <FieldError id={errorId} role="alert">
        {error}
      </FieldError>

      <Button type="submit" fullWidth disabled={isLoading}>
        {isLoading ? tCommon('saving') : t('submit')}
      </Button>
    </form>
  );
}

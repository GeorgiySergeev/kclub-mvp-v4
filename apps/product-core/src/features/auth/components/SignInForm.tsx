'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button, Field, Input, Label, linkClasses, textMuted } from '@kclub/ui';
import { Locale } from '@/i18n/routing';
import { parseAuthResponse } from '../utils/api';

export function SignInForm({ locale }: { locale: Locale }) {
  const t = useTranslations('auth.signIn');
  const tCommon = useTranslations('auth.common');
  const router = useRouter();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/phone-otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, purpose: 'sign-in', locale }),
      });
      const parsed = await parseAuthResponse(res);

      if (!parsed.success) {
        const code = parsed.errorCode || 'generic';
        if (code === 'VALIDATION_INVALID_PHONE' || code === 'VALIDATION_INVALID_INPUT') {
          setError(tCommon('errors.invalidPhone'));
        } else if (code === 'AUTH_SIGN_IN_USE_SIGN_UP') {
          setError(tCommon('errors.useSignUp'));
        } else if (code === 'PERMISSION_DENIED') {
          setError(tCommon('errors.blocked'));
        } else {
          setError(tCommon('errors.generic'));
        }
        setIsLoading(false);
        return;
      }

      setStep('otp');
    } catch (err) {
      setError(tCommon('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/v1/auth/phone-otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp, purpose: 'sign-in' }),
      });
      const parsed = await parseAuthResponse(res);

      if (!parsed.success) {
        const code = parsed.errorCode || 'generic';
        if (code === 'AUTH_OTP_INVALID') {
          setError(tCommon('errors.invalidOtp'));
        } else if (code === 'PERMISSION_DENIED') {
          setError(tCommon('errors.blocked'));
        } else {
          setError(tCommon('errors.generic'));
        }
        setIsLoading(false);
        return;
      }

      if (parsed.data?.onboardingComplete) {
        router.replace(`/${locale}/m/dashboard`);
      } else {
        router.replace(`/${locale}/m/onboarding`);
      }
    } catch (err) {
      setError(tCommon('errors.generic'));
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[400px] overflow-hidden border border-black/5 bg-white/70 px-6 py-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/70 dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] sm:rounded-3xl sm:px-8 sm:py-12">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-zinc-300 via-zinc-600 to-zinc-300 opacity-75 dark:from-zinc-700 dark:via-zinc-300 dark:to-zinc-700" />

      <div className="mb-10 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-zinc-100 to-zinc-200 shadow-inner ring-1 ring-zinc-200 dark:from-zinc-800 dark:to-zinc-900 dark:ring-zinc-700">
          <svg
            className="h-6 w-6 text-zinc-700 dark:text-zinc-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-light tracking-tight text-zinc-900 dark:text-zinc-50">
          {t('title')}
        </h2>
        <p className={`mt-3 ${textMuted}`}>{t('description')}</p>
      </div>

      {step === 'phone' ? (
        <form className="space-y-6" onSubmit={handlePhoneSubmit}>
          <Field>
            <Label htmlFor="phone">{t('phoneLabel')}</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              aria-invalid={!!error ? 'true' : 'false'}
              aria-describedby={error ? 'phone-error' : undefined}
              placeholder={t('phonePlaceholder')}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
            />
          </Field>
          {error && (
            <p id="phone-error" role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? tCommon('loading') : t('submit')}
          </Button>
        </form>
      ) : (
        <form className="space-y-6" onSubmit={handleOtpSubmit}>
          <Field>
            <Label htmlFor="otp">{tCommon('otpLabel')}</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              aria-invalid={!!error ? 'true' : 'false'}
              aria-describedby={error ? 'otp-error' : undefined}
              placeholder={tCommon('otpPlaceholder')}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              disabled={isLoading}
            />
          </Field>
          {error && (
            <p id="otp-error" role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? tCommon('loading') : tCommon('submitOtp')}
          </Button>
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setError(null);
                setOtp('');
              }}
              className={linkClasses}
              disabled={isLoading}
            >
              {tCommon('backToPhone')}
            </button>
          </div>
        </form>
      )}

      {step === 'phone' && (
        <p className={`mt-6 text-center ${textMuted}`}>
          {t('switchPrompt')}{' '}
          <Link href={`/${locale}/sign-up`} className={linkClasses}>
            {t('switchAction')}
          </Link>
        </p>
      )}
    </div>
  );
}

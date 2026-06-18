'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { KeyRound, Smartphone } from 'lucide-react';

import { Button, Field, Input, Label, cn, linkClasses } from '@kclub/ui';
import { Locale } from '@/i18n/routing';
import { parseAuthResponse } from '../utils/api';

const authInputClasses =
  'h-10 rounded-xl border border-white/15 bg-[#161616] pl-10 pr-3 text-[15px] text-zinc-100 shadow-none ring-0 placeholder:text-zinc-500 focus:border-white/35 focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#161616] dark:text-zinc-100 dark:ring-0 dark:placeholder:text-zinc-500 dark:focus:ring-white/20';

const authButtonClasses =
  'h-9 rounded-lg border-white/90 bg-zinc-100 px-4 py-0 text-sm font-semibold text-black shadow-none hover:bg-white focus:ring-white focus:ring-offset-[#050505] disabled:opacity-60 dark:bg-zinc-100 dark:text-black dark:hover:bg-white dark:focus:ring-white dark:focus:ring-offset-[#050505]';

const subtleLinkClasses =
  'font-medium text-zinc-100 underline decoration-zinc-500 underline-offset-4 outline-none hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#050505]';

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
    <section className="w-full max-w-[480px] overflow-hidden border-x border-white/10 bg-[#070707]/95 shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
      <div className="border-b border-white/10 px-8 py-14 sm:px-10">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-[26px] font-black tracking-[-0.02em] text-white outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#050505]"
          aria-label="KCLUB home"
        >
          <span className="grid grid-cols-3 gap-1" aria-hidden="true">
            <span className="h-2 w-2 bg-white" />
            <span className="h-2 w-2 bg-white" />
            <span className="h-2 w-2 bg-white" />
            <span className="h-2 w-2 bg-white" />
            <span className="h-2 w-2" />
            <span className="h-2 w-2 bg-white" />
          </span>
          <span>KCLUB</span>
        </Link>
        <div className="mt-8">
          <h1 className="text-[26px] font-bold leading-tight text-white sm:text-[28px]">
            {t('title')}
          </h1>
          <p className="mt-3 text-[19px] leading-7 text-zinc-300">{t('description')}</p>
        </div>
      </div>

      <div className="border-b border-white/10 px-8 py-10 sm:px-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <p className="text-xs font-medium uppercase text-zinc-400">
            {tCommon('continueWithPhone')}
          </p>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {step === 'phone' ? (
          <form className="space-y-3" onSubmit={handlePhoneSubmit}>
            <Field className="space-y-0">
              <Label htmlFor="phone" className="sr-only">
                {t('phoneLabel')}
              </Label>
              <div className="relative">
                <Smartphone
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
                  strokeWidth={1.75}
                />
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
                  className={authInputClasses}
                />
              </div>
            </Field>
            {error && (
              <p id="phone-error" role="alert" className="text-sm text-red-300">
                {error}
              </p>
            )}
            <Button type="submit" fullWidth disabled={isLoading} className={authButtonClasses}>
              {isLoading ? tCommon('loading') : t('submit')}
            </Button>
          </form>
        ) : (
          <form className="space-y-3" onSubmit={handleOtpSubmit}>
            <Field className="space-y-0">
              <Label htmlFor="otp" className="sr-only">
                {tCommon('otpLabel')}
              </Label>
              <div className="relative">
                <KeyRound
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
                  strokeWidth={1.75}
                />
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
                  className={authInputClasses}
                />
              </div>
            </Field>
            {error && (
              <p id="otp-error" role="alert" className="text-sm text-red-300">
                {error}
              </p>
            )}
            <Button type="submit" fullWidth disabled={isLoading} className={authButtonClasses}>
              {isLoading ? tCommon('loading') : tCommon('submitOtp')}
            </Button>
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setError(null);
                  setOtp('');
                }}
                className={cn(linkClasses, 'text-zinc-300 hover:text-white')}
                disabled={isLoading}
              >
                {tCommon('backToPhone')}
              </button>
            </div>
          </form>
        )}

        {step === 'phone' && (
          <p className="mt-6 text-center text-sm text-zinc-400">
            {t('switchPrompt')}{' '}
            <Link href={`/${locale}/sign-up`} className={subtleLinkClasses}>
              {t('switchAction')}
            </Link>
          </p>
        )}
      </div>

      <p className="px-8 py-8 text-center text-base leading-6 text-zinc-300 sm:px-10">
        {tCommon('privacyNote')}
      </p>
    </section>
  );
}

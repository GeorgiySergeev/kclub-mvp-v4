'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@kclub/ui';
import { Locale } from '@/i18n/routing';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export function SignOutButton({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const router = useRouter();
  const tCommon = useTranslations('auth.common');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/auth/logout', { method: 'POST' });
      if (!res.ok) {
        setError(tCommon('errors.generic'));
        setIsLoading(false);
        return;
      }
      router.replace(`/${locale}/sign-in`);
      router.refresh();
    } catch (err) {
      console.error('Sign out failed', err);
      setError(tCommon('errors.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleSignOut} disabled={isLoading}>
        {isLoading ? tCommon('signingOut') : children}
      </Button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </>
  );
}

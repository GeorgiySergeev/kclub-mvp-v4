'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Locale } from '@/i18n/routing';

export function SignUpForm({ locale }: { locale: Locale }) {
  const t = useTranslations('auth.signUp');

  return (
    <div className="w-full max-w-md bg-white px-8 py-10 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:rounded-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-light tracking-tight text-zinc-900 dark:text-zinc-50">
          {t('title')}
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {t('description')}
        </p>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            {t('phoneLabel')}
          </label>
          <div className="mt-2">
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              placeholder={t('phonePlaceholder')}
              className="block w-full rounded-md border-0 py-2.5 px-3 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 dark:bg-zinc-900 dark:text-zinc-50 dark:ring-zinc-700 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-50 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-md border border-transparent bg-zinc-900 px-6 py-2.5 text-sm font-normal text-white shadow-sm transition hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950"
        >
          {t('submit')}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
        {t('switchPrompt')}{' '}
        <Link
          href={`/${locale}/sign-in`}
          className="font-medium text-zinc-900 hover:text-zinc-700 hover:underline dark:text-zinc-50 dark:hover:text-zinc-300"
        >
          {t('switchAction')}
        </Link>
      </p>
    </div>
  );
}

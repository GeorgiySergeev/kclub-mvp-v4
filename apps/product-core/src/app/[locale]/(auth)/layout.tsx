import { ReactNode } from 'react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Locale } from '@/i18n/routing';

export default async function AuthLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <div className="relative flex min-h-screen flex-col border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="dark:bg-[linear-gradient(to_right,rgba(250,250,250,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(250,250,250,0.04)_1px,transparent_1px] pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(24,24,27,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(24,24,27,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <header className="relative z-10 flex h-16 items-center justify-between px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="text-sm font-light uppercase tracking-widest text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white dark:text-zinc-50 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950"
        >
          {t('brand')}
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        {props.children}
      </main>
    </div>
  );
}

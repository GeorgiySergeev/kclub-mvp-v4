import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import '../globals.css';

import { ThemeProvider } from '@/features/marketing/components/ThemeProvider';
import { isLocale } from '@/i18n/routing';

export default async function LocaleLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  if (!isLocale(params.locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>{props.children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

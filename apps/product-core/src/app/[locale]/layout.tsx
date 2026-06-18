import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

import '../globals.css';

import { SkipLink } from '@kclub/ui';
import { ThemeProvider } from '@/features/marketing/components/ThemeProvider';
import { fontVariables } from '@/lib/fonts';
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
      <body
        className={`${fontVariables} min-h-screen bg-background font-sans text-foreground antialiased`}
        suppressHydrationWarning
      >
        <SkipLink />
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>{props.children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

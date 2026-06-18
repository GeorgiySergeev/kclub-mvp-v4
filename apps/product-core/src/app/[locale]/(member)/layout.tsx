import { ReactNode } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

import { Container } from '@kclub/ui';
import { Locale } from '@/i18n/routing';
import {
  getCurrentPagePathname,
  isOnboardingPath,
  requireCurrentMember,
} from '@/server/member-page';

export default async function MemberLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: 'home' });
  const pathname = await getCurrentPagePathname();
  const profile = await requireCurrentMember(locale);
  const onboardingRoute = isOnboardingPath(pathname);

  if (!profile.onboardingComplete && !onboardingRoute) {
    redirect(`/${locale}/m/onboarding`);
  }

  if (profile.onboardingComplete && onboardingRoute) {
    redirect(`/${locale}/m/dashboard?tab=card`);
  }

  return (
    <div className="flex min-h-screen flex-col bg-secondary/50 dark:bg-kclub-navy-950">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md dark:border-kclub-navy-700 dark:bg-kclub-navy-950/90">
        <Container className="flex h-14 items-center justify-between">
          <Link
            href={`/${locale}`}
            className="font-display text-sm font-medium uppercase tracking-[0.18em] text-foreground outline-none transition duration-200 hover:text-kclub-gold-600 focus:ring-2 focus:ring-kclub-gold-500 focus:ring-offset-2 focus:ring-offset-background dark:hover:text-kclub-gold-300"
          >
            {t('brand')}
          </Link>
        </Container>
      </header>

      <main id="content" className="flex-1">
        <Container className="py-8 sm:py-10">{props.children}</Container>
      </main>
    </div>
  );
}

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
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-900">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
        <Container className="flex h-12 items-center justify-between">
          <Link
            href={`/${locale}`}
            className="text-sm font-light uppercase tracking-widest text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white dark:text-zinc-50 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950"
          >
            {t('brand')}
          </Link>
        </Container>
      </header>

      <main id="content" className="flex-1">
        <Container className="py-8">{props.children}</Container>
      </main>
    </div>
  );
}

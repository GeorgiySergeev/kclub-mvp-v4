import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { TopBar } from '@/features/marketing/components/TopBar';
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
  const pathname = await getCurrentPagePathname();
  const profile = await requireCurrentMember(locale);
  const onboardingRoute = isOnboardingPath(pathname);

  if (!profile.onboardingComplete && !onboardingRoute) {
    redirect(`/${locale}/m/onboarding`);
  }

  if (profile.onboardingComplete && onboardingRoute) {
    redirect(`/${locale}/m/dashboard?tab=account`);
  }

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-[#09090b] dark:text-white">
      <div className="kclub-noise pointer-events-none fixed inset-0 opacity-30" />
      <TopBar locale={locale} isAuthenticated />

      <main id="content" className="relative z-10 flex-1 py-8 sm:py-10">
        <div className="kclub-shell">{props.children}</div>
      </main>
    </div>
  );
}

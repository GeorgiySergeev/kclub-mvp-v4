import { ReactNode } from 'react';

import { TopBar } from '@/features/marketing/components/TopBar';
import { Locale } from '@/i18n/routing';
import { getCurrentMemberProfileForPage } from '@/server/member-page';

export default async function AuthLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  const profile = await getCurrentMemberProfileForPage();

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-zinc-950 dark:bg-[#09090b] dark:text-white">
      <div className="kclub-noise pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,48,0.16),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(255,0,48,0.22),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_26%)]" />

      <TopBar locale={locale} isAuthenticated={profile !== null} />

      <main className="relative z-10 flex min-h-[calc(100vh-4.5rem)] items-center py-10 sm:py-14">
        <div className="kclub-shell w-full">{props.children}</div>
      </main>
    </div>
  );
}

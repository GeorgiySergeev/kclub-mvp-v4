import { ReactNode } from 'react';

import { Footer } from '@/features/marketing/components/Footer';
import { TopBar } from '@/features/marketing/components/TopBar';
import { Locale } from '@/i18n/routing';
import { getCurrentMemberProfileForPage } from '@/server/member-page';

export default async function MarketingLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;
  const profile = await getCurrentMemberProfileForPage();
  const isAuthenticated = profile !== null;

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-[#121212] dark:text-white">
      <TopBar locale={locale} isAuthenticated={isAuthenticated} />
      <main id="content">{props.children}</main>
      <Footer locale={locale} />
    </div>
  );
}

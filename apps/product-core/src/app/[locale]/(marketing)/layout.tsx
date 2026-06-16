import { ReactNode } from 'react';

import { Footer } from '@/features/marketing/components/Footer';
import { TopBar } from '@/features/marketing/components/TopBar';
import { Locale } from '@/i18n/routing';

export default async function MarketingLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await props.params;

  return (
    <>
      <TopBar locale={locale} />
      <main id="content">{props.children}</main>
      <Footer locale={locale} />
    </>
  );
}

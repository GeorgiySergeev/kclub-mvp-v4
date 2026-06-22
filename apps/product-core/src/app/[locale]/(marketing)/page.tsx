import { getTranslations } from 'next-intl/server';

import { AboutSection } from '@/features/marketing/components/AboutSection';
import { CtaSection } from '@/features/marketing/components/CtaSection';
import { FaqSection } from '@/features/marketing/components/FaqSection';
import { FeaturedBusinesses } from '@/features/marketing/components/FeaturedBusinesses';
import { FeaturesSection } from '@/features/marketing/components/FeaturesSection';
import { HeroSection } from '@/features/marketing/components/HeroSection';
import { ServicesSection } from '@/features/marketing/components/ServicesSection';
import { StatsSection } from '@/features/marketing/components/StatsSection';
import { TestimonialsSection } from '@/features/marketing/components/TestimonialsSection';
import { TopPartnersSection } from '@/features/marketing/components/TopPartnersSection';
import { Locale } from '@/i18n/routing';
import { getPublicBusinesses } from '@/server/services/business-service';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'publicSeo.home' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function Page(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params;
  const businesses = await getPublicBusinesses();

  return (
    <>
      <HeroSection locale={locale} />
      <TopPartnersSection locale={locale} businesses={businesses} />
      <StatsSection />
      <FeaturesSection />
      <ServicesSection locale={locale} />
      <AboutSection />
      <FeaturedBusinesses locale={locale} businesses={businesses} />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection locale={locale} />
    </>
  );
}

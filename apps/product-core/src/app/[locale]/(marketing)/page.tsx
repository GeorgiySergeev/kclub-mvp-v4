import { AboutSection } from '@/features/marketing/components/AboutSection';
import { CtaSection } from '@/features/marketing/components/CtaSection';
import { FaqSection } from '@/features/marketing/components/FaqSection';
import { FeaturedBusinesses } from '@/features/marketing/components/FeaturedBusinesses';
import { FeaturesSection } from '@/features/marketing/components/FeaturesSection';
import { Footer } from '@/features/marketing/components/Footer';
import { HeroSection } from '@/features/marketing/components/HeroSection';
import { ServicesSection } from '@/features/marketing/components/ServicesSection';
import { StatsSection } from '@/features/marketing/components/StatsSection';
import { TestimonialsSection } from '@/features/marketing/components/TestimonialsSection';
import { TopBar } from '@/features/marketing/components/TopBar';
import { Locale } from '@/i18n/routing';

export default async function Page(props: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await props.params;

  return (
    <>
      <TopBar locale={locale} />
      <main id="content">
        <HeroSection locale={locale} />
        <StatsSection />
        <FeaturesSection />
        <ServicesSection locale={locale} />
        <AboutSection />
        <FeaturedBusinesses locale={locale} />
        <TestimonialsSection />
        <FaqSection />
        <CtaSection locale={locale} />
      </main>
      <Footer locale={locale} />
    </>
  );
}

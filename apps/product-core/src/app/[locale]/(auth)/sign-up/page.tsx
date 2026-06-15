import { getTranslations } from 'next-intl/server';

import { SignUpForm } from '@/features/auth/components/SignUpForm';
import { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.signUp' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function SignUpPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return <SignUpForm locale={locale} />;
}

import { getTranslations } from 'next-intl/server';

import { SignInForm } from '@/features/auth/components/SignInForm';
import { Locale } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.signIn' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function SignInPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;

  return <SignInForm locale={locale} />;
}

import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Locale, locales } from '@/i18n/routing';

import { ThemeToggle } from './ThemeToggle';

export function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations('home');
  const year = new Date().getFullYear();
  const linkGroups = [
    {
      title: t('footer.links'),
      links: [
        { label: t('footer.directory'), href: `/${locale}/directory` },
        { label: t('footer.signUp'), href: `/${locale}/sign-up` },
        { label: t('footer.signIn'), href: `/${locale}/sign-in` },
        { label: t('footer.verifyCard'), href: `/${locale}/verify-card` },
      ],
    },
    {
      title: t('footer.legal'),
      links: [
        { label: t('footer.terms'), href: `/${locale}/terms` },
        { label: t('footer.privacy'), href: `/${locale}/privacy` },
      ],
    },
  ];

  return (
    <footer className="border-t border-border bg-secondary/40 dark:border-kclub-navy-700 dark:bg-kclub-navy-900/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <h2 className="font-display text-sm font-medium uppercase tracking-[0.18em] text-foreground">
            {t('brand')}
          </h2>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">{t('footer.aboutText')}</p>
        </div>
        {linkGroups.map((group) => (
          <div key={group.title}>
            <h3 className="kclub-overline text-muted-foreground">{group.title}</h3>
            <ul className="mt-5 grid gap-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition duration-200 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-kclub-gold-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="kclub-overline text-muted-foreground">{t('footer.locales')}</h3>
          <ul className="mt-5 grid gap-3">
            {locales.map((item) => (
              <li key={item}>
                <Link
                  href={`/${item}`}
                  className="text-sm text-muted-foreground transition duration-200 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-kclub-gold-500"
                >
                  {t(`locale.${item}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border dark:border-kclub-navy-700">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            {year} {t('brand')}. {t('footer.copyright')}
          </p>
          <ThemeToggle className="h-10 w-10" />
        </div>
      </div>
    </footer>
  );
}

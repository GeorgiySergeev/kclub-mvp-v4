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
    <footer className="border-t kclub-border bg-zinc-100 text-zinc-950 dark:bg-[#18181a] dark:text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10">
        <div>
          <h2 className="inline-flex items-center gap-3 text-sm font-bold uppercase">
            <span className="flex h-10 w-10 items-center justify-center bg-[#ff0030] text-white">
              K
            </span>
            {t('brand')}
          </h2>
          <p className="mt-5 text-sm font-medium leading-7 text-zinc-600 dark:text-white/64">
            {t('footer.aboutText')}
          </p>
        </div>
        {linkGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-bold uppercase text-zinc-500 dark:text-white/50">{group.title}</h3>
            <ul className="mt-5 grid gap-3">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0030] dark:text-white/68 dark:hover:text-white dark:focus-visible:ring-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="text-xs font-bold uppercase text-zinc-500 dark:text-white/50">{t('footer.locales')}</h3>
          <ul className="mt-5 grid gap-3">
            {locales.map((item) => (
              <li key={item}>
                <Link
                  href={`/${item}`}
                  className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0030] dark:text-white/68 dark:hover:text-white dark:focus-visible:ring-white"
                >
                  {t(`locale.${item}`)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t kclub-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10 dark:text-white/54">
          <p>
            {year} {t('brand')}. {t('footer.copyright')}
          </p>
          <ThemeToggle className="h-10 w-10" />
        </div>
      </div>
    </footer>
  );
}

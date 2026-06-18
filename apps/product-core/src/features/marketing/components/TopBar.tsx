'use client';

import { Globe, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { IconButton, cn } from '@kclub/ui';
import { Locale, locales } from '@/i18n/routing';

import { ThemeToggle } from './ThemeToggle';

type NavItem = {
  key: 'directory' | 'signIn' | 'join' | 'cabinet';
  href: string;
};

export function TopBar({ locale, isAuthenticated = false }: { locale: Locale; isAuthenticated?: boolean }) {
  const t = useTranslations('home');
  const [open, setOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const navItems: NavItem[] = isAuthenticated
    ? [
        { key: 'directory', href: `/${locale}/directory` },
        { key: 'cabinet', href: `/${locale}/m/dashboard` },
      ]
    : [
        { key: 'directory', href: `/${locale}/directory` },
        { key: 'signIn', href: `/${locale}/sign-in` },
        { key: 'join', href: `/${locale}/sign-up` },
      ];

  return (
    <header className="sticky top-0 z-50 h-14 border-b border-border bg-background/90 backdrop-blur-md dark:border-kclub-navy-700 dark:bg-kclub-navy-950/90">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="font-display text-sm font-medium uppercase tracking-[0.18em] text-foreground outline-none transition duration-200 hover:text-kclub-gold-600 focus:ring-2 focus:ring-kclub-gold-500 focus:ring-offset-2 focus:ring-offset-background dark:hover:text-kclub-gold-300"
        >
          {t('brand')}
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="transition duration-200 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-kclub-gold-500 focus:ring-offset-2 focus:ring-offset-background"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}

          <div className="relative">
            <IconButton
              aria-label={t('footer.locales')}
              aria-expanded={localeOpen}
              aria-controls="locale-switcher"
              onClick={() => setLocaleOpen((v) => !v)}
            >
              <Globe aria-hidden="true" size={16} strokeWidth={1.5} />
            </IconButton>

            {localeOpen && (
              <div
                id="locale-switcher"
                className="absolute right-0 top-full z-50 mt-1 w-32 rounded-md border border-border bg-card py-1 shadow-panel dark:border-kclub-navy-700 dark:bg-kclub-navy-900"
                onMouseLeave={() => setLocaleOpen(false)}
              >
                {locales.map((item) => (
                  <Link
                    key={item}
                    href={`/${item}`}
                    onClick={() => setLocaleOpen(false)}
                    className={cn(
                      'block px-4 py-2 text-sm transition duration-200 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-kclub-gold-500 dark:hover:bg-kclub-navy-800',
                      item === locale ? 'font-medium text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    {t(`locale.${item}`)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <ThemeToggle className="h-10 w-10" />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? t('common.close') : t('common.menu')}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-card text-foreground transition duration-200 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-kclub-gold-500 focus:ring-offset-2 focus:ring-offset-background dark:border-kclub-navy-700 dark:bg-kclub-navy-900 dark:hover:bg-kclub-navy-800"
          >
            {open ? (
              <X aria-hidden="true" size={20} strokeWidth={1.5} />
            ) : (
              <Menu aria-hidden="true" size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-14 z-50 border-b border-border bg-background dark:border-kclub-navy-700 dark:bg-kclub-navy-950 md:hidden"
        >
          <nav className="mx-auto grid max-w-6xl gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md border border-border px-4 py-3 text-sm text-foreground transition duration-200 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-kclub-gold-500 dark:border-kclub-navy-700 dark:hover:bg-kclub-navy-800"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
            <p className="kclub-overline mt-2 px-4 pt-2 text-muted-foreground">{t('footer.locales')}</p>
            <div className="grid gap-1">
              {locales.map((item) => (
                <Link
                  key={item}
                  href={`/${item}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-md border px-4 py-3 text-sm transition duration-200 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-kclub-gold-500 dark:hover:bg-kclub-navy-800',
                    item === locale
                      ? 'border-kclub-gold-500/40 text-foreground'
                      : 'border-border text-muted-foreground dark:border-kclub-navy-700',
                  )}
                >
                  {t(`locale.${item}`)}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

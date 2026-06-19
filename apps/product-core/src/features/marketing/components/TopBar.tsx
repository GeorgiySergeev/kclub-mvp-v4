'use client';

import { ArrowUpRight, Globe, Menu, X } from 'lucide-react';
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

export function TopBar({
  locale,
  isAuthenticated = false,
}: {
  locale: Locale;
  isAuthenticated?: boolean;
}) {
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
    <header className="sticky top-0 z-50 h-[72px] border-b kclub-border bg-white text-zinc-950 shadow-sm dark:bg-[#202022] dark:text-white dark:shadow-[0_1px_0_rgba(255,255,255,0.04)]">
      <div className="kclub-shell flex h-full items-center justify-between">
        <Link
          href={`/${locale}`}
          className="group inline-flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-[#ff0030] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-[#202022]"
        >
          <span className="flex h-11 w-11 items-center justify-center bg-[#ff0030] text-base font-black uppercase text-white">
            K
          </span>
          <span className="grid text-sm font-semibold leading-none text-zinc-950 dark:text-white">
            <span>KYLYVNYK</span>
            <span className="font-normal text-zinc-500 dark:text-white/72">CLUB</span>
          </span>
        </Link>

        <nav className="hidden h-full items-center text-sm font-semibold uppercase text-zinc-950 dark:text-white md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="flex h-full items-center border-l kclub-border px-5 transition hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ff0030] dark:hover:bg-white/[0.06] dark:hover:text-white dark:focus-visible:ring-white"
            >
              {t(`nav.${item.key}`)}
              {item.key === 'join' ? (
                <ArrowUpRight aria-hidden="true" className="ml-2 text-[#ff0030]" size={15} />
              ) : null}
            </Link>
          ))}

          <div className="relative flex h-full items-center border-l kclub-border px-3">
            <IconButton
              aria-label={t('footer.locales')}
              aria-expanded={localeOpen}
              aria-controls="locale-switcher"
              onClick={() => setLocaleOpen((v) => !v)}
              className="border-zinc-200 bg-transparent text-zinc-950 hover:bg-zinc-100 focus-visible:ring-[#ff0030] focus-visible:ring-offset-white dark:border-white/10 dark:text-white dark:hover:bg-white/[0.06] dark:focus-visible:ring-white dark:focus-visible:ring-offset-[#202022]"
            >
              <Globe aria-hidden="true" size={16} strokeWidth={1.5} />
            </IconButton>

            {localeOpen && (
              <div
                id="locale-switcher"
                className="absolute right-0 top-full z-50 mt-0 w-36 border kclub-border bg-white py-1 shadow-2xl dark:bg-[#202022]"
                onMouseLeave={() => setLocaleOpen(false)}
              >
                {locales.map((item) => (
                  <Link
                    key={item}
                    href={`/${item}`}
                    onClick={() => setLocaleOpen(false)}
                    className={cn(
                      'block px-4 py-3 text-sm normal-case transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ff0030] dark:hover:bg-white/[0.06] dark:focus-visible:ring-white',
                      item === locale
                        ? 'font-semibold text-zinc-950 dark:text-white'
                        : 'text-zinc-500 dark:text-white/68',
                    )}
                  >
                    {t(`locale.${item}`)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex h-full items-center border-l border-r kclub-border px-3">
            <ThemeToggle className="h-10 w-10" />
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className="h-10 w-10" />
          <button
            type="button"
            aria-label={open ? t('common.close') : t('common.menu')}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center border kclub-border bg-transparent text-zinc-950 transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0030] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-white dark:hover:bg-white/[0.06] dark:focus-visible:ring-white dark:focus-visible:ring-offset-[#202022]"
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
          className="fixed inset-x-0 top-[72px] z-50 border-b kclub-border bg-white text-zinc-950 shadow-2xl dark:bg-[#202022] dark:text-white md:hidden"
        >
          <nav className="kclub-shell grid gap-2 py-4">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border kclub-border px-4 py-3 text-sm font-semibold uppercase text-zinc-950 transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0030] dark:text-white dark:hover:bg-white/[0.06] dark:focus-visible:ring-white"
              >
                {t(`nav.${item.key}`)}
                <ArrowUpRight aria-hidden="true" size={16} className="text-[#ff0030]" />
              </Link>
            ))}
            <p className="mt-2 px-4 pt-2 text-xs font-semibold uppercase text-zinc-500 dark:text-white/54">
              {t('footer.locales')}
            </p>
            <div className="grid gap-1">
              {locales.map((item) => (
                <Link
                  key={item}
                  href={`/${item}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'border px-4 py-3 text-sm transition hover:bg-zinc-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0030] dark:hover:bg-white/[0.06] dark:focus-visible:ring-white',
                    item === locale
                      ? 'border-zinc-950 text-zinc-950 dark:border-white dark:text-white'
                      : 'border-zinc-200 text-zinc-500 dark:border-white/10 dark:text-white/68',
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

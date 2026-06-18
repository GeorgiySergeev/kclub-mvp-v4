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
    <header className="sticky top-0 z-50 h-[72px] border-b border-white/10 bg-[#202022] text-white shadow-[0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-10">
        <Link
          href={`/${locale}`}
          className="group inline-flex items-center gap-3 outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#202022]"
        >
          <span className="flex h-11 w-11 items-center justify-center bg-[#ff0030] text-base font-black uppercase text-white">
            K
          </span>
          <span className="grid text-sm font-semibold leading-none text-white">
            <span>KYLYVNYK</span>
            <span className="text-white/72 font-normal">CLUB</span>
          </span>
        </Link>

        <nav className="hidden h-full items-center text-sm font-semibold uppercase text-white md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="flex h-full items-center border-l border-white/10 px-5 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {t(`nav.${item.key}`)}
              {item.key === 'join' ? (
                <ArrowUpRight aria-hidden="true" className="ml-2 text-[#ff0030]" size={15} />
              ) : null}
            </Link>
          ))}

          <div className="relative flex h-full items-center border-l border-white/10 px-3">
            <IconButton
              aria-label={t('footer.locales')}
              aria-expanded={localeOpen}
              aria-controls="locale-switcher"
              onClick={() => setLocaleOpen((v) => !v)}
              className="border-white/10 bg-transparent text-white hover:bg-white/[0.06] focus:ring-white focus:ring-offset-[#202022]"
            >
              <Globe aria-hidden="true" size={16} strokeWidth={1.5} />
            </IconButton>

            {localeOpen && (
              <div
                id="locale-switcher"
                className="absolute right-0 top-full z-50 mt-0 w-36 border border-white/10 bg-[#202022] py-1 shadow-2xl"
                onMouseLeave={() => setLocaleOpen(false)}
              >
                {locales.map((item) => (
                  <Link
                    key={item}
                    href={`/${item}`}
                    onClick={() => setLocaleOpen(false)}
                    className={cn(
                      'block px-4 py-3 text-sm normal-case transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white',
                      item === locale ? 'font-semibold text-white' : 'text-white/68',
                    )}
                  >
                    {t(`locale.${item}`)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex h-full items-center border-l border-r border-white/10 px-3">
            <ThemeToggle className="h-10 w-10 border-white/10 bg-transparent text-white hover:bg-white/[0.06] focus:ring-white focus:ring-offset-[#202022]" />
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle className="border-white/10 bg-transparent text-white hover:bg-white/[0.06] focus:ring-white focus:ring-offset-[#202022]" />
          <button
            type="button"
            aria-label={open ? t('common.close') : t('common.menu')}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center border border-white/10 bg-transparent text-white transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#202022]"
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
          className="fixed inset-x-0 top-[72px] z-50 border-b border-white/10 bg-[#202022] text-white shadow-2xl md:hidden"
        >
          <nav className="mx-auto grid max-w-7xl gap-2 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border border-white/10 px-4 py-3 text-sm font-semibold uppercase text-white transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white"
              >
                {t(`nav.${item.key}`)}
                <ArrowUpRight aria-hidden="true" size={16} className="text-[#ff0030]" />
              </Link>
            ))}
            <p className="text-white/54 mt-2 px-4 pt-2 text-xs font-semibold uppercase">
              {t('footer.locales')}
            </p>
            <div className="grid gap-1">
              {locales.map((item) => (
                <Link
                  key={item}
                  href={`/${item}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'border px-4 py-3 text-sm transition hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-white',
                    item === locale ? 'border-white text-white' : 'text-white/68 border-white/10',
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

'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Locale } from '@/i18n/routing';

import { ThemeToggle } from './ThemeToggle';

type NavItem = {
  key: 'directory' | 'signIn' | 'join';
  href: string;
};

export function TopBar({ locale }: { locale: Locale }) {
  const t = useTranslations('home');
  const [open, setOpen] = useState(false);
  const navItems: NavItem[] = [
    { key: 'directory', href: `/${locale}/directory` },
    { key: 'signIn', href: `/${locale}/sign-in` },
    { key: 'join', href: `/${locale}/sign-up` },
  ];

  return (
    <header className="sticky top-0 z-50 h-12 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="text-sm font-light uppercase tracking-widest text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white dark:text-zinc-50 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950"
        >
          {t('brand')}
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="transition hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white dark:hover:text-zinc-50 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950"
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
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
            className="inline-flex h-11 w-11 items-center justify-center border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950"
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
          className="fixed inset-x-0 top-12 z-50 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:hidden"
        >
          <nav className="mx-auto grid max-w-6xl gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border border-zinc-200 px-4 py-3 text-sm text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:focus:ring-zinc-50"
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}

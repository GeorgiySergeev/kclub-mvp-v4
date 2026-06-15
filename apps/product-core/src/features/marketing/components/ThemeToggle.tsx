'use client';

import { Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const t = useTranslations('home');
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label={t('common.toggleTheme')}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`inline-flex h-11 w-11 items-center justify-center border border-zinc-200 bg-white text-zinc-900 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:ring-offset-white dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:focus:ring-zinc-50 dark:focus:ring-offset-zinc-950 ${className}`}
    >
      {isDark ? (
        <Sun aria-hidden="true" size={18} strokeWidth={1.5} />
      ) : (
        <Moon aria-hidden="true" size={18} strokeWidth={1.5} />
      )}
    </button>
  );
}

import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ru', 'uk'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

export const locales = routing.locales;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = routing.defaultLocale;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function stripLocalePrefix(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) {
      return '/';
    }

    const prefix = `/${locale}/`;
    if (pathname.startsWith(prefix)) {
      const remainder = pathname.slice(`/${locale}`.length);
      return remainder.length > 0 ? remainder : '/';
    }
  }

  return pathname || '/';
}

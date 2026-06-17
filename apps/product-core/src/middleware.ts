import { NextRequest, NextResponse } from 'next/server';

const LOCALES = ['en', 'ru', 'uk'] as const;
type Locale = (typeof LOCALES)[number];

const DEFAULT_LOCALE: Locale = 'en';

function getLocale(request: NextRequest): Locale {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const preferred = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, q = 'q=1'] = lang.trim().split(';');
      const quality = parseFloat(q.replace('q=', ''));
      return { code: code.split('-')[0].toLowerCase(), quality: isNaN(quality) ? 1 : quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { code } of preferred) {
    if (LOCALES.includes(code as Locale)) return code as Locale;
  }

  return DEFAULT_LOCALE;
}

function nextWithPathname(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-kclub-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  const isNonPageRoute =
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt';

  if (isNonPageRoute) return;

  if (pathnameHasLocale) return nextWithPathname(request);

  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);
  response.headers.set('x-locale', locale);

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

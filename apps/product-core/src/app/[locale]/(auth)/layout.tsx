import { ReactNode } from 'react';

import { Locale } from '@/i18n/routing';

export default async function AuthLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  await props.params;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#050505] text-zinc-50">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.075)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:80px_80px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_58%)]" />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 py-8 sm:px-6">
        {props.children}
      </main>
    </div>
  );
}

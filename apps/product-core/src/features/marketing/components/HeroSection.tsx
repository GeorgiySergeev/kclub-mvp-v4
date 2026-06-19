import { ArrowDown, ArrowUpRight, QrCode } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Locale } from '@/i18n/routing';

export function HeroSection({ locale }: { locale: Locale }) {
  const t = useTranslations('home');

  return (
    <section className="kclub-premium-hero relative isolate min-h-[calc(100vh-112px)] overflow-hidden">
      <div className="kclub-hero-visual absolute inset-0" aria-hidden="true" />
      <div className="kclub-premium-hero-tint absolute inset-0" aria-hidden="true" />
      <div
        className="kclub-premium-hero-fade absolute bottom-0 left-0 right-0 h-24"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-12 px-4 py-10 sm:px-6 lg:grid-cols-[1.03fr_0.97fr] lg:px-10">
        <div className="min-w-0 max-w-3xl pt-8 lg:pt-0">
          <p className="dark:text-white/78 mb-6 border-l-2 border-[#ff0030] pl-4 text-sm font-semibold uppercase tracking-[0.22em] text-zinc-600">
            {t('hero.eyebrow')}
          </p>
          <h1 className="max-w-full break-words text-[clamp(2.2rem,10.5vw,5.2rem)] font-black uppercase leading-[0.96] sm:text-[clamp(3rem,5.6vw,5.2rem)]">
            <span className="kclub-outline-text block">{t('hero.titleLine1')}</span>
            <span className="block">{t('hero.titleLine2')}</span>
          </h1>
          <p className="dark:text-white/86 mt-8 max-w-2xl text-base font-semibold leading-8 text-zinc-600 sm:text-lg">
            {t('hero.subline')}
          </p>
          <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={`/${locale}/sign-up`}
              className="inline-flex h-14 w-full items-center justify-between gap-8 border border-[#ff0030] bg-[#ff0030] px-5 text-sm font-bold text-white shadow-[0_18px_42px_rgba(255,0,48,0.22)] transition hover:border-[#d90029] hover:bg-[#d90029] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0030] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f3ef] dark:focus-visible:ring-white dark:focus-visible:ring-offset-[#101012] sm:w-auto sm:min-w-52"
            >
              {t('hero.primaryCta')}
              <ArrowUpRight aria-hidden="true" size={20} strokeWidth={2} />
            </Link>
            <Link
              href={`/${locale}/directory`}
              className="bg-white/62 dark:border-white/18 inline-flex h-14 w-full items-center justify-between gap-8 border border-zinc-300/80 px-5 text-sm font-bold text-zinc-950 shadow-[0_18px_42px_rgba(24,24,27,0.06)] backdrop-blur transition hover:border-zinc-400 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff0030] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f3ef] dark:bg-white/[0.05] dark:text-white dark:hover:border-white/30 dark:hover:bg-white/[0.1] dark:focus-visible:ring-white dark:focus-visible:ring-offset-[#101012] sm:w-auto sm:min-w-52"
            >
              {t('hero.secondaryCta')}
              <ArrowUpRight aria-hidden="true" size={20} strokeWidth={2} />
            </Link>
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="relative ml-auto h-[520px] max-w-[520px]">
            <div
              className="bg-white/28 absolute -inset-6 border border-white/55 shadow-[0_40px_120px_rgba(24,24,27,0.14)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.035] dark:shadow-[0_44px_130px_rgba(0,0,0,0.46)]"
              aria-hidden="true"
            />
            <div
              className="bg-zinc-950/8 dark:border-white/12 absolute left-10 top-8 h-[430px] w-[350px] rotate-[-8deg] border border-zinc-300/80 shadow-[0_32px_90px_rgba(24,24,27,0.14)] dark:bg-white/[0.04]"
              aria-hidden="true"
            />
            <div className="border-zinc-950/12 dark:border-white/14 relative ml-auto flex h-full max-w-[392px] rotate-[3deg] flex-col justify-between overflow-hidden border bg-[linear-gradient(135deg,#151518_0%,#252528_46%,#08080a_100%)] p-7 text-white shadow-[0_34px_100px_rgba(24,24,27,0.34)] dark:shadow-[0_36px_110px_rgba(0,0,0,0.58)]">
              <div
                className="absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.16),transparent_28%,rgba(255,0,48,0.22)_54%,transparent_72%),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.24),transparent_20%)]"
                aria-hidden="true"
              />
              <div className="kclub-noise absolute inset-0 opacity-35" aria-hidden="true" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-white/58 text-[11px] font-semibold uppercase tracking-[0.32em]">
                    Private Access
                  </p>
                  <p className="mt-3 text-3xl font-black uppercase leading-none">KCLUB</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center bg-[#ff0030] text-base font-black">
                  K
                </span>
              </div>

              <div className="relative grid gap-7">
                <div className="h-11 w-16 rounded-md border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.4),rgba(255,255,255,0.08))] shadow-inner" />
                <div>
                  <p className="text-white/46 text-[11px] font-semibold uppercase tracking-[0.28em]">
                    Member
                  </p>
                  <p className="mt-3 text-4xl font-black uppercase tracking-[0.05em]">VIP</p>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-end gap-8">
                  <div>
                    <p className="text-white/46 text-[11px] font-semibold uppercase tracking-[0.28em]">
                      Card No.
                    </p>
                    <p className="text-white/88 mt-3 font-mono text-lg tracking-[0.24em]">
                      VIP-024801
                    </p>
                  </div>
                  <div className="bg-white/8 flex h-20 w-20 items-center justify-center border border-white/20">
                    <QrCode aria-hidden="true" size={42} strokeWidth={1.4} />
                  </div>
                </div>
              </div>

              <div className="relative flex items-end justify-between">
                <p className="text-white/52 max-w-36 text-xs font-semibold uppercase leading-5 tracking-[0.2em]">
                  Verified Member Network
                </p>
                <div className="text-right">
                  <p className="text-white/42 text-[10px] uppercase tracking-[0.28em]">Valid</p>
                  <p className="text-white/78 mt-1 font-mono text-sm tracking-[0.12em]">2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

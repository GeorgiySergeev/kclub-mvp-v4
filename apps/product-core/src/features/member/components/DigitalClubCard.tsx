import type { ClubCardStatus, MemberTier } from '@kclub/contracts';
import { cn } from '@kclub/ui';

import type { Locale } from '@/i18n/routing';

import { formatCardExpiry, formatMaskedCardNumber } from './card-display';

export type DigitalClubCardProps = {
  cardNumber: string;
  memberName: string;
  membershipTier: MemberTier;
  status: ClubCardStatus;
  expiresAt: string | null;
  locale: Locale;
  validThruLabel: string;
  tierLabel: string;
  className?: string;
};

function ClubBrandMark() {
  return (
    <div aria-hidden="true" className="relative h-8 w-12 shrink-0">
      <span className="absolute left-0 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-zinc-400/90" />
      <span className="absolute right-0 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-zinc-500/90" />
    </div>
  );
}

export function DigitalClubCard({
  cardNumber,
  memberName,
  membershipTier,
  status,
  expiresAt,
  locale,
  validThruLabel,
  tierLabel,
  className,
}: DigitalClubCardProps) {
  const maskedNumber = formatMaskedCardNumber(cardNumber);
  const expiry = formatCardExpiry(expiresAt, locale);
  const isActive = status === 'ACTIVE';

  return (
    <div
      className={cn(
        'relative mx-auto flex aspect-[1.586/1] w-full max-w-md flex-col overflow-hidden rounded-[1.25rem] bg-zinc-200 p-6 text-zinc-950 shadow-[0_18px_40px_rgba(0,0,0,0.35)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-lg font-semibold tracking-[-0.02em]">KCLUB</p>
        {!isActive ? (
          <span className="rounded-full bg-zinc-950/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-700">
            {status}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 items-center justify-center">
        <p className="font-mono text-[clamp(1.125rem,4vw,1.5rem)] tracking-[0.22em] text-zinc-900">
          {maskedNumber}
        </p>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0 space-y-4">
          <p className="truncate text-sm font-semibold uppercase tracking-[0.08em]">
            {memberName}
          </p>

          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                {validThruLabel}
              </p>
              <p className="mt-1 font-mono text-sm tracking-[0.08em]">{expiry}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                {tierLabel}
              </p>
              <p className="mt-1 text-sm font-semibold uppercase tracking-[0.08em]">
                {membershipTier}
              </p>
            </div>
          </div>
        </div>

        <ClubBrandMark />
      </div>
    </div>
  );
}

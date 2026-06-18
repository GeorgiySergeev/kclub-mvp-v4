import type { MemberTier } from '@kclub/contracts';
import { cn } from '@kclub/ui';

type ClubCardVisualProps = {
  cardNumber: string;
  membershipTier: MemberTier;
  status: string;
  brandLabel?: string;
  tierLabel?: string;
  statusLabel?: string;
  className?: string;
};

export function ClubCardVisual({
  cardNumber,
  membershipTier,
  status,
  brandLabel = 'KCLUB',
  tierLabel,
  statusLabel,
  className,
}: ClubCardVisualProps) {
  const isVip = membershipTier === 'VIP';
  const maskedNumber = cardNumber.replace(/(.{4})/g, '$1 ').trim();

  return (
    <div
      className={cn(
        'relative aspect-[1.586/1] w-full max-w-md overflow-hidden rounded-2xl p-6 sm:p-8',
        isVip ? 'kclub-card-vip' : 'kclub-card-member',
        className,
      )}
    >
      <div className="kclub-noise pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />

      <div className="relative flex h-full flex-col justify-between text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="kclub-overline text-white/50">{brandLabel}</p>
            {isVip ? (
              <p className="mt-1 font-display text-lg tracking-wide text-kclub-gold-300">✦ VIP ✦</p>
            ) : null}
          </div>
          <span
            className={cn(
              'kclub-overline rounded-full px-2.5 py-1',
              isVip
                ? 'border border-kclub-gold-500/40 bg-kclub-gold-500/15 text-kclub-gold-300'
                : 'border border-white/10 bg-white/5 text-slate-300',
            )}
          >
            {tierLabel ?? membershipTier}
          </span>
        </div>

        <div>
          <p className="font-mono text-xl font-medium tracking-[0.12em] sm:text-2xl">{maskedNumber}</p>
          <div className="mt-6 flex items-end justify-between gap-4">
            <div
              className={cn(
                'flex h-14 w-14 items-center justify-center rounded-md border bg-white/95',
                isVip ? 'border-kclub-gold-500/30' : 'border-white/20',
              )}
              aria-hidden="true"
            >
              <div className="grid grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }).map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      'block h-1 w-1 rounded-[1px]',
                      index % 2 === 0 ? 'bg-kclub-navy-900' : 'bg-transparent',
                    )}
                  />
                ))}
              </div>
            </div>
            <p className="text-right text-xs uppercase tracking-[0.14em] text-white/70">
              {statusLabel ?? status}
            </p>
          </div>
        </div>

        <div
          className={cn(
            'mt-4 h-px w-full',
            isVip
              ? 'bg-gradient-to-r from-transparent via-kclub-gold-500/60 to-transparent'
              : 'bg-white/10',
          )}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

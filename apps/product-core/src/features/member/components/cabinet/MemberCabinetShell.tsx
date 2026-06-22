import Link from 'next/link';

import type { CurrentMemberProfileDto } from '@kclub/contracts';
import { Badge, cn } from '@kclub/ui';

import type { Locale } from '@/i18n/routing';
import type { ImplementedMemberDashboardTab } from '@/features/member/dashboard-tabs';
import {
  memberCabinetNavLinkActiveClasses,
  memberCabinetNavLinkClasses,
  memberCabinetNavLinkInactiveClasses,
  memberCabinetSidebarClasses,
} from './styles';

type MemberCabinetShellProps = {
  locale: Locale;
  profile: CurrentMemberProfileDto;
  activeTab: ImplementedMemberDashboardTab;
  visibleTabs: readonly ImplementedMemberDashboardTab[];
  tabLabels: Record<ImplementedMemberDashboardTab, string>;
  sidebarEyebrow: string;
  tabsAriaLabel: string;
  children: React.ReactNode;
};

export function MemberCabinetShell({
  locale,
  profile,
  activeTab,
  visibleTabs,
  tabLabels,
  sidebarEyebrow,
  tabsAriaLabel,
  children,
}: MemberCabinetShellProps) {
  const isVip = profile.membershipTier === 'VIP';
  const displayName = profile.displayName ?? profile.phone;

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-8">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className={memberCabinetSidebarClasses}>
          <p className="kclub-overline text-muted-foreground">{sidebarEyebrow}</p>

          <div className="mt-4 flex items-center gap-3">
            <div
              className={cn(
                'font-display flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-medium uppercase',
                isVip
                  ? 'border-kclub-gold-500/40 bg-kclub-gold-500/15 text-kclub-gold-300 border'
                  : 'border border-border bg-secondary text-muted-foreground',
              )}
              aria-hidden="true"
            >
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
              <Badge
                variant={isVip ? 'success' : 'outline'}
                className="mt-1 text-[0.65rem] uppercase tracking-[0.1em]"
              >
                {profile.membershipTier}
              </Badge>
            </div>
          </div>

          <nav aria-label={tabsAriaLabel} className="mt-6 space-y-1">
            {visibleTabs.map((tab) => (
              <Link
                key={tab}
                href={`/${locale}/m/dashboard?tab=${tab}`}
                className={cn(
                  memberCabinetNavLinkClasses,
                  activeTab === tab
                    ? memberCabinetNavLinkActiveClasses
                    : memberCabinetNavLinkInactiveClasses,
                )}
                aria-current={activeTab === tab ? 'page' : undefined}
              >
                {tabLabels[tab]}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}

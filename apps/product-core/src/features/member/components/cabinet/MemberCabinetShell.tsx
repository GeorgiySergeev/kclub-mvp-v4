import Link from 'next/link';

import type { CurrentMemberProfileDto } from '@kclub/contracts';
import { cn } from '@kclub/ui';

import type { Locale } from '@/i18n/routing';
import type { ImplementedMemberDashboardTab } from '@/features/member/dashboard-tabs';

import { CabinetSignOut } from './CabinetSignOut';
import {
  cabinetRootClasses,
  cabinetTopTabsNavClasses,
  cabinetTopTabItemClasses,
  cabinetTopTabItemActiveClasses,
  cabinetTopTabItemInactiveClasses,
  cabinetUserBarClasses,
} from './styles';

type MemberCabinetShellProps = {
  locale: Locale;
  profile: CurrentMemberProfileDto;
  activeTab: ImplementedMemberDashboardTab;
  visibleTabs: readonly ImplementedMemberDashboardTab[];
  tabLabels: Record<ImplementedMemberDashboardTab, string>;
  pageTitle: string;
  contactLine: string;
  tabsAriaLabel: string;
  children: React.ReactNode;
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getPlanLabel(tier: CurrentMemberProfileDto['membershipTier']): string {
  return tier === 'VIP' ? 'VIP' : 'MEMBER';
}

function renderTabItem({
  tab,
  locale,
  activeTab,
  tabLabels,
}: {
  tab: ImplementedMemberDashboardTab;
  locale: Locale;
  activeTab: ImplementedMemberDashboardTab;
  tabLabels: Record<ImplementedMemberDashboardTab, string>;
}) {
  const isActive = activeTab === tab;

  return (
    <Link
      key={tab}
      href={`/${locale}/m/dashboard?tab=${tab}`}
      className={cn(
        cabinetTopTabItemClasses,
        isActive ? cabinetTopTabItemActiveClasses : cabinetTopTabItemInactiveClasses,
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {tabLabels[tab]}
    </Link>
  );
}

export function MemberCabinetShell({
  locale,
  profile,
  activeTab,
  visibleTabs,
  tabLabels,
  pageTitle,
  contactLine,
  tabsAriaLabel,
  children,
}: MemberCabinetShellProps) {
  const displayName = profile.displayName ?? profile.phone;
  const planLabel = getPlanLabel(profile.membershipTier);

  return (
    <div className={cabinetRootClasses}>
      <div className={cabinetUserBarClasses}>
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-surface-muted text-sm font-bold text-accent"
            aria-hidden="true"
          >
            {getInitials(displayName)}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{displayName}</span>
            <span className="border border-accent/50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
              {planLabel}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted sm:block">{contactLine}</span>
          <CabinetSignOut locale={locale} />
        </div>
      </div>

      <nav aria-label={tabsAriaLabel} className={cabinetTopTabsNavClasses}>
        {visibleTabs.map((tab) => renderTabItem({ tab, locale, activeTab, tabLabels }))}
      </nav>

      <div className="flex-1">
        <h1 className="sr-only">{pageTitle}</h1>
        {children}
      </div>
    </div>
  );
}

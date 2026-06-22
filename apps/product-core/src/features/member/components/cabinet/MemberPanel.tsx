import { cn } from '@kclub/ui';

import { memberCabinetPanelClasses, memberInfoTileClasses } from './styles';

type MemberPanelProps = {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
};

export function MemberPanel({ children, className, noPadding }: MemberPanelProps) {
  return (
    <section className={cn(memberCabinetPanelClasses, !noPadding && 'p-6 sm:p-8', className)}>
      {children}
    </section>
  );
}

type MemberPanelHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function MemberPanelHeader({ title, description, className }: MemberPanelHeaderProps) {
  return (
    <header className={cn('mb-6', className)}>
      <h2 className="font-display text-xl font-medium tracking-tight text-foreground">{title}</h2>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
    </header>
  );
}

type MemberInfoTileProps = {
  label: string;
  value: React.ReactNode;
};

export function MemberInfoTile({ label, value }: MemberInfoTileProps) {
  return (
    <div className={memberInfoTileClasses}>
      <dt className="kclub-overline text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

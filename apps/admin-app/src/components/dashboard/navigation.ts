import type { LucideIcon } from 'lucide-react';
import {
  BadgeCheck,
  Building2,
  CreditCard,
  Globe,
  LayoutDashboard,
  ListTree,
  Logs,
  MapPinned,
  Settings,
  Shield,
  Sparkles,
  UserCog,
  Users,
} from 'lucide-react';

import type { StaffRole } from '@kclub/contracts';

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: StaffRole[];
};

export const dashboardNav: DashboardNavItem[] = [
  { title: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['OWNER', 'ADMIN', 'MODERATOR', 'SUPPORT'] },
  { title: 'Users', href: '/dashboard/users', icon: Users, roles: ['OWNER', 'ADMIN'] },
  { title: 'Cards', href: '/dashboard/cards', icon: BadgeCheck, roles: ['OWNER', 'ADMIN'] },
  { title: 'Businesses', href: '/dashboard/businesses', icon: Building2, roles: ['OWNER', 'ADMIN', 'MODERATOR'] },
  { title: 'Introductions', href: '/dashboard/introductions', icon: Sparkles, roles: ['OWNER', 'ADMIN', 'MODERATOR'] },
  { title: 'Catalog', href: '/dashboard/catalog', icon: Globe, roles: ['OWNER', 'ADMIN', 'MODERATOR'] },
  { title: 'Categories', href: '/dashboard/categories', icon: ListTree, roles: ['OWNER', 'ADMIN', 'MODERATOR'] },
  { title: 'Countries', href: '/dashboard/countries', icon: MapPinned, roles: ['OWNER', 'ADMIN', 'MODERATOR'] },
  { title: 'Cities', href: '/dashboard/cities', icon: MapPinned, roles: ['OWNER', 'ADMIN', 'MODERATOR'] },
  { title: 'Subscriptions', href: '/dashboard/subscriptions', icon: CreditCard, roles: ['OWNER', 'ADMIN'] },
  { title: 'Memberships', href: '/dashboard/memberships', icon: Shield, roles: ['OWNER', 'ADMIN'] },
  { title: 'Stripe Prices', href: '/dashboard/stripe-prices', icon: CreditCard, roles: ['OWNER'] },
  { title: 'Staff', href: '/dashboard/staff', icon: UserCog, roles: ['OWNER'] },
  { title: 'Audit', href: '/dashboard/audit', icon: Logs, roles: ['OWNER', 'ADMIN', 'SUPPORT'] },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['OWNER'] },
];

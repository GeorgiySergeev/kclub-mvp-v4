import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { requireStaffProfile } from '@/server/auth/profile';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const profile = await requireStaffProfile();

  if (!profile.totpVerified) {
    redirect('/auth/2fa-required');
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AppSidebar className="hidden lg:flex" staffRole={profile.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader
          staffName={profile.name}
          staffRole={profile.role}
          staffInitials={profile.initials}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

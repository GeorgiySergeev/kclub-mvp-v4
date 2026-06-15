import { PageShell } from '@/components/page-shell';

export default function SettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Owner-managed platform-level configuration."
      roleScope="OWNER"
    />
  );
}

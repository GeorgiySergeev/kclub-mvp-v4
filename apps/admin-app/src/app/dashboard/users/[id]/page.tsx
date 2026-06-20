import { notFound } from 'next/navigation';
import { PageShell } from '@/components/page-shell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/status-badge';
import { fetchUserDetail } from '@/features/users/api';
import type { AdminUserDetailDto } from '@kclub/contracts';

type UserDetailsPageProps = {
  params: Promise<{ id: string }>;
};

function ProfileSection({ user }: { user: AdminUserDetailDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-muted-foreground">ID</span>
          <span className="font-mono text-xs">{user.id}</span>
          <span className="text-muted-foreground">Phone</span>
          <span className="font-mono">{user.phone}</span>
          <span className="text-muted-foreground">Display name</span>
          <span>{user.displayName ?? '—'}</span>
          <span className="text-muted-foreground">Status</span>
          <span>
            <StatusBadge status={user.status} />
          </span>
          <span className="text-muted-foreground">Membership tier</span>
          <span>
            <StatusBadge status={user.membershipTier} />
          </span>
          <span className="text-muted-foreground">Locale preference</span>
          <span>{user.localePreference ?? '—'}</span>
          <span className="text-muted-foreground">Onboarding complete</span>
          <span>{user.onboardingComplete ? 'Yes' : 'No'}</span>
          <span className="text-muted-foreground">Terms accepted</span>
          <span>
            {user.termsAcceptedAt ? new Date(user.termsAcceptedAt).toLocaleDateString() : '—'}
          </span>
          <span className="text-muted-foreground">Registered</span>
          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
          <span className="text-muted-foreground">Updated</span>
          <span>{new Date(user.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function CardsSection({ user }: { user: AdminUserDetailDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cards ({user.cards.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {user.cards.length === 0 ? (
          <p className="text-sm text-muted-foreground">No cards issued.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Card #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Expires</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.cards.map((card) => (
                <TableRow key={card.id}>
                  <TableCell className="font-mono text-xs">{card.cardNumber}</TableCell>
                  <TableCell>
                    <StatusBadge status={card.status} />
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{card.membershipTier}</Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(card.issuedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {card.expiresAt ? new Date(card.expiresAt).toLocaleDateString() : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function SubscriptionsSection({ user }: { user: AdminUserDetailDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriptions ({user.subscriptions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {user.subscriptions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No VIP subscription history.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Period start</TableHead>
                <TableHead>Period end</TableHead>
                <TableHead>Cancel at period end</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.subscriptions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <StatusBadge status={sub.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {sub.currentPeriodStart
                      ? new Date(sub.currentPeriodStart).toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {sub.currentPeriodEnd
                      ? new Date(sub.currentPeriodEnd).toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell>{sub.cancelAtPeriodEnd ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function AuditSection({ user }: { user: AdminUserDetailDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit trail ({user.auditEntries.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {user.auditEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No audit entries.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.auditEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <StatusBadge status={entry.action} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {entry.actorStaffId ?? 'System'}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                    {entry.after
                      ? Object.entries(entry.after)
                          .map(([k, v]) => `${k}: ${String(v)}`)
                          .join(', ')
                      : '—'}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = await params;
  const user = await fetchUserDetail(id);

  if (!user) {
    notFound();
  }

  return (
    <PageShell
      title={user.displayName ?? user.phone}
      description={`User detail — ${user.status}, ${user.membershipTier}`}
      roleScope="ADMIN"
    >
      <div className="space-y-6">
        <ProfileSection user={user} />
        <CardsSection user={user} />
        <SubscriptionsSection user={user} />
        <AuditSection user={user} />
      </div>
    </PageShell>
  );
}

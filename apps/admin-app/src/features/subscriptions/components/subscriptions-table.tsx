'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ban, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AdminSubscriptionListItemDto, StaffRole } from '@kclub/contracts';

async function cancelSubscription(id: string) {
  const res = await fetch(`/api/proxy/subscriptions/${id}/cancel`, { method: 'POST' });
  return { ok: res.ok, error: res.ok ? undefined : `Request failed (${res.status})` };
}

function canCancel(role: StaffRole): boolean {
  return role === 'OWNER' || role === 'ADMIN';
}

type SubscriptionsTableProps = {
  subscriptions: AdminSubscriptionListItemDto[];
  staffRole: StaffRole;
};

function CancelDialog({ id, onAction }: { id: string; onAction: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="xs"><Ban className="h-3.5 w-3.5" />Cancel</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Subscription</DialogTitle>
          <DialogDescription>This will set the subscription to cancel at period end. The member will lose VIP access after the current period.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>No, keep it</Button>
          <Button variant="destructive" disabled={loading} onClick={async () => {
            setLoading(true);
            const result = await cancelSubscription(id);
            setLoading(false);
            if (!result.ok) { toast.error(result.error); return; }
            setOpen(false);
            toast.success('Subscription will cancel at period end');
            onAction();
          }}>{loading ? 'Processing...' : 'Yes, cancel'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SubscriptionsTable({ subscriptions, staffRole }: SubscriptionsTableProps) {
  const router = useRouter();
  const showCancel = canCancel(staffRole);

  if (!subscriptions.length) {
    return <p className="py-8 text-center text-muted-foreground">No subscriptions found</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Period Start</TableHead>
          <TableHead>Period End</TableHead>
          <TableHead>Cancel at End</TableHead>
          {showCancel && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((sub) => (
          <TableRow key={sub.id}>
            <TableCell>
              <Badge variant="outline">{sub.kind === 'VIP_MEMBERSHIP' ? 'VIP' : 'Business Placement'}</Badge>
            </TableCell>
            <TableCell>
              <div className="text-sm font-medium">{sub.user?.displayName ?? 'N/A'}</div>
              <div className="text-xs text-muted-foreground">{sub.user?.phone ?? '—'}</div>
            </TableCell>
            <TableCell><StatusBadge status={sub.status} /></TableCell>
            <TableCell className="text-sm text-muted-foreground">{sub.currentPeriodStart ? new Date(sub.currentPeriodStart).toLocaleDateString() : '—'}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : '—'}</TableCell>
            <TableCell>{sub.cancelAtPeriodEnd ? <Badge variant="destructive">Yes</Badge> : <Badge variant="secondary">No</Badge>}</TableCell>
            {showCancel && (
              <TableCell>
                {!sub.cancelAtPeriodEnd && sub.status === 'ACTIVE' && (
                  <CancelDialog id={sub.id} onAction={() => router.refresh()} />
                )}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

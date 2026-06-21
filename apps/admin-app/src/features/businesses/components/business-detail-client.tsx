'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, EyeOff, ShieldX } from 'lucide-react';
import { toast } from 'sonner';

import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AdminBusinessDetailDto, StaffRole } from '@kclub/contracts';

function canMutateBusiness(role: StaffRole): boolean {
  return role === 'OWNER' || role === 'ADMIN' || role === 'MODERATOR';
}

function canSeeAction(status: string, role: StaffRole): string | null {
  if (!canMutateBusiness(role)) return null;
  switch (status) {
    case 'UNDER_REVIEW':
      return 'APPROVE_REJECT';
    case 'APPROVED':
      return 'REJECT';
    case 'PUBLISHED':
      return 'HIDE';
    default:
      return null;
  }
}

async function approveBusiness(businessId: string, notes?: string) {
  const res = await fetch(`/api/proxy/businesses/${businessId}/approve`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(notes ? { notes } : {}),
  });
  return { ok: res.ok, error: res.ok ? undefined : `Request failed (${res.status})` };
}

async function rejectBusiness(businessId: string, reason: string) {
  const res = await fetch(`/api/proxy/businesses/${businessId}/reject`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ reason }),
  });
  return { ok: res.ok, error: res.ok ? undefined : `Request failed (${res.status})` };
}

async function hideBusiness(businessId: string, reason?: string) {
  const res = await fetch(`/api/proxy/businesses/${businessId}/hide`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(reason ? { reason } : {}),
  });
  return { ok: res.ok, error: res.ok ? undefined : `Request failed (${res.status})` };
}

function ProfileSection({ business }: { business: AdminBusinessDetailDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-muted-foreground">ID</span>
          <span className="font-mono text-xs">{business.id}</span>
          <span className="text-muted-foreground">Slug</span>
          <span className="font-mono text-xs">{business.slug}</span>
          <span className="text-muted-foreground">Name</span>
          <span>{business.name}</span>
          <span className="text-muted-foreground">Category</span>
          <span>{business.categoryName}</span>
          <span className="text-muted-foreground">Country / City</span>
          <span>
            {business.countryName}, {business.cityName}
          </span>
          <span className="text-muted-foreground">Brief description</span>
          <span>{business.briefDescription ?? '—'}</span>
          <span className="text-muted-foreground">Description</span>
          <span className="max-w-[300px] whitespace-pre-wrap">{business.description ?? '—'}</span>
          <span className="text-muted-foreground">Representative name</span>
          <span>{business.representativeName ?? '—'}</span>
          <span className="text-muted-foreground">Representative email</span>
          <span className="font-mono text-xs">{business.representativeEmail}</span>
          <span className="text-muted-foreground">Representative phone</span>
          <span className="font-mono text-xs">{business.representativePhone}</span>
          <span className="text-muted-foreground">Website</span>
          <span>{business.websiteUrl ?? '—'}</span>
          <span className="text-muted-foreground">Social URL</span>
          <span>{business.socialUrl ?? '—'}</span>
          <span className="text-muted-foreground">Status</span>
          <span>
            <StatusBadge status={business.status} />
          </span>
          <span className="text-muted-foreground">Created</span>
          <span>{new Date(business.createdAt).toLocaleDateString()}</span>
          <span className="text-muted-foreground">Updated</span>
          <span>{new Date(business.updatedAt).toLocaleDateString()}</span>
          <span className="text-muted-foreground">Approved at</span>
          <span>
            {business.approvedAt ? new Date(business.approvedAt).toLocaleDateString() : '—'}
          </span>
          <span className="text-muted-foreground">Published at</span>
          <span>
            {business.publishedAt ? new Date(business.publishedAt).toLocaleDateString() : '—'}
          </span>
          <span className="text-muted-foreground">Rejection reason</span>
          <span>{business.rejectionReason ?? '—'}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function OwnerSection({ business }: { business: AdminBusinessDetailDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Owner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-muted-foreground">ID</span>
          <span className="font-mono text-xs">{business.owner.id}</span>
          <span className="text-muted-foreground">Phone</span>
          <span className="font-mono text-xs">{business.owner.phone}</span>
          <span className="text-muted-foreground">Display name</span>
          <span>{business.owner.displayName ?? '—'}</span>
          <span className="text-muted-foreground">Status</span>
          <span>
            <StatusBadge status={business.owner.status} />
          </span>
          <span className="text-muted-foreground">Membership tier</span>
          <span>
            <Badge variant="outline">{business.owner.membershipTier}</Badge>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function NotesSection({ business }: { business: AdminBusinessDetailDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Internal notes</CardTitle>
      </CardHeader>
      <CardContent>
        {business.internalNotes ? (
          <p className="whitespace-pre-wrap text-sm">{business.internalNotes}</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No internal notes. Notes can be added during approval.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function PlacementSection({ business }: { business: AdminBusinessDetailDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Placement & Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {business.placementSubscription ? (
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Status</span>
            <span>
              <StatusBadge status={business.placementSubscription.status} />
            </span>
            <span className="text-muted-foreground">Current period end</span>
            <span>
              {business.placementSubscription.currentPeriodEnd
                ? new Date(business.placementSubscription.currentPeriodEnd).toLocaleDateString()
                : '—'}
            </span>
          </div>
        ) : (
          <p className="text-muted-foreground">No placement subscription.</p>
        )}
      </CardContent>
    </Card>
  );
}

function AuditSection({ business }: { business: AdminBusinessDetailDto }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit trail ({business.auditEntries.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {business.auditEntries.length === 0 ? (
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
              {business.auditEntries.map((entry) => (
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

type BusinessDetailClientProps = {
  business: AdminBusinessDetailDto;
  staffRole: StaffRole;
};

export function BusinessDetailClient({ business, staffRole }: BusinessDetailClientProps) {
  const router = useRouter();
  const action = canSeeAction(business.status, staffRole);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status={business.status} />
        {action === 'APPROVE_REJECT' && (
          <>
            <ApproveDialog businessId={business.id} onAction={() => router.refresh()} />
            <RejectDialog
              businessId={business.id}
              businessName={business.name}
              onAction={() => router.refresh()}
            />
          </>
        )}
        {action === 'REJECT' && (
          <RejectDialog
            businessId={business.id}
            businessName={business.name}
            onAction={() => router.refresh()}
          />
        )}
        {action === 'HIDE' && (
          <HideDialog
            businessId={business.id}
            businessName={business.name}
            onAction={() => router.refresh()}
          />
        )}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileSection business={business} />
        <OwnerSection business={business} />
      </div>
      <PlacementSection business={business} />
      <NotesSection business={business} />
      <AuditSection business={business} />
    </div>
  );
}

function ApproveDialog({ businessId, onAction }: { businessId: string; onAction: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm">
            <CheckCircle className="mr-1.5 h-4 w-4" />
            Approve
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve business</DialogTitle>
          <DialogDescription>
            This will transition the business to APPROVED. Publication still requires payment via
            webhook.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="approve-notes">Internal notes (optional)</Label>
          <Input
            id="approve-notes"
            placeholder="Add internal notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const result = await approveBusiness(businessId, notes || undefined);
              setLoading(false);
              if (!result.ok) {
                toast.error(result.error ?? 'Failed to approve');
                return;
              }
              setOpen(false);
              toast.success('Business approved');
              onAction();
            }}
          >
            {loading ? 'Approving...' : 'Approve'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RejectDialog({
  businessId,
  businessName,
  onAction,
}: {
  businessId: string;
  businessName: string;
  onAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="destructive" size="sm">
            <ShieldX className="mr-1.5 h-4 w-4" />
            Reject
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject business</DialogTitle>
          <DialogDescription>
            Are you sure you want to reject {businessName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="reject-reason">Reason (required)</Label>
          <Input
            id="reject-reason"
            placeholder="Why is this business being rejected?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={loading || !reason.trim()}
            onClick={async () => {
              setLoading(true);
              const result = await rejectBusiness(businessId, reason.trim());
              setLoading(false);
              if (!result.ok) {
                toast.error(result.error ?? 'Failed to reject');
                return;
              }
              setOpen(false);
              toast.success('Business rejected');
              onAction();
            }}
          >
            {loading ? 'Rejecting...' : 'Reject'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HideDialog({
  businessId,
  businessName,
  onAction,
}: {
  businessId: string;
  businessName: string;
  onAction: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="secondary" size="sm">
            <EyeOff className="mr-1.5 h-4 w-4" />
            Hide
          </Button>
        }
      ></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hide business</DialogTitle>
          <DialogDescription>
            {businessName} will be hidden from the public directory. Featured flags will be reset.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="hide-reason">Reason (optional)</Label>
          <Input
            id="hide-reason"
            placeholder="Why is this business being hidden?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const result = await hideBusiness(businessId, reason || undefined);
              setLoading(false);
              if (!result.ok) {
                toast.error(result.error ?? 'Failed to hide');
                return;
              }
              setOpen(false);
              toast.success('Business hidden');
              onAction();
            }}
          >
            {loading ? 'Hiding...' : 'Hide'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Ban, CheckCircle, ExternalLink, Search } from 'lucide-react';

import { StatusBadge } from '@/components/status-badge';
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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { AdminUserListItemDto, EntityId } from '@kclub/contracts';

type UsersTableProps = {
  users: AdminUserListItemDto[];
  total: number;
  page: number;
  limit: number;
  search: string;
};

async function blockUser(userId: EntityId) {
  const res = await fetch(`/api/proxy/users/${userId}/block`, { method: 'POST' });
  return res.ok;
}

async function unblockUser(userId: EntityId) {
  const res = await fetch(`/api/proxy/users/${userId}/unblock`, { method: 'POST' });
  return res.ok;
}

function BlockConfirmDialog({ userId, userName, onAction }: { userId: EntityId; userName: string; onAction: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="destructive" size="xs" />}>
        <Ban className="h-3.5 w-3.5" />
        Block
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Block user</DialogTitle>
          <DialogDescription>
            Are you sure you want to block {userName || 'this user'}? They will lose access to their account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              await blockUser(userId);
              setOpen(false);
              onAction();
            }}
          >
            {loading ? 'Blocking...' : 'Block'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UnblockConfirmDialog({ userId, userName, onAction }: { userId: EntityId; userName: string; onAction: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="xs" />}>
        <CheckCircle className="h-3.5 w-3.5" />
        Unblock
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unblock user</DialogTitle>
          <DialogDescription>
            Restore access for {userName || 'this user'}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              await unblockUser(userId);
              setOpen(false);
              onAction();
            }}
          >
            {loading ? 'Unblocking...' : 'Unblock'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UsersTable({ users, total, page, limit, search: initialSearch }: UsersTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const totalPages = Math.ceil(total / limit);

  function navigate(toPage: number) {
    const params = new URLSearchParams();
    if (toPage > 1) params.set('page', String(toPage));
    if (limit !== 20) params.set('limit', String(limit));
    if (search) params.set('search', search);
    router.push(`/dashboard/users${params.toString() ? `?${params.toString()}` : ''}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    router.push(`/dashboard/users${params.toString() ? `?${params.toString()}` : ''}`);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Search by phone or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Phone</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.phone}</TableCell>
                  <TableCell>{user.displayName ?? '—'}</TableCell>
                  <TableCell>
                    <StatusBadge status={user.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/users/${user.id}`}>
                        <Button variant="ghost" size="xs">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      {user.status === 'ACTIVE' ? (
                        <BlockConfirmDialog
                          userId={user.id}
                          userName={user.displayName ?? user.phone}
                          onAction={() => router.refresh()}
                        />
                      ) : (
                        <UnblockConfirmDialog
                          userId={user.id}
                          userName={user.displayName ?? user.phone}
                          onAction={() => router.refresh()}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {page} of {totalPages} ({total} total)
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => navigate(page - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => navigate(page + 1)}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import type { AuditLogDto } from '@kclub/contracts';
import { AUDIT_ACTIONS, STAFF_ROLES } from '@kclub/contracts';
import type { AuditLogSearchParams } from '../api';

type AuditTableProps = {
  logs: AuditLogDto[];
  total: number;
  page: number;
  limit: number;
  filters: AuditLogSearchParams;
};

export function AuditTable({ logs, total, page, limit, filters: initialFilters }: AuditTableProps) {
  const router = useRouter();
  const [action, setAction] = useState(initialFilters.action ?? '');
  const [actorRole, setActorRole] = useState(initialFilters.actorRole ?? '');
  const [entityType, setEntityType] = useState(initialFilters.entityType ?? '');
  const [dateFrom, setDateFrom] = useState(initialFilters.dateFrom ?? '');
  const [dateTo, setDateTo] = useState(initialFilters.dateTo ?? '');

  function applyFilters() {
    const params = new URLSearchParams();
    if (action) params.set('action', action);
    if (actorRole) params.set('actorRole', actorRole);
    if (entityType) params.set('entityType', entityType);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    if (page > 1) params.set('page', String(page));
    const qs = params.toString();
    router.push(`/dashboard/audit${qs ? `?${qs}` : ''}`);
  }

  function goToPage(p: number) {
    const params = new URLSearchParams();
    if (action) params.set('action', action);
    if (actorRole) params.set('actorRole', actorRole);
    if (entityType) params.set('entityType', entityType);
    if (dateFrom) params.set('dateFrom', dateFrom);
    if (dateTo) params.set('dateTo', dateTo);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    router.push(`/dashboard/audit${qs ? `?${qs}` : ''}`);
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-lg border p-4">
        <div className="space-y-1">
          <Label htmlFor="action" className="text-xs">
            Action
          </Label>
          <select
            id="action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">All actions</option>
            {AUDIT_ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="role" className="text-xs">
            Staff Role
          </Label>
          <select
            id="role"
            value={actorRole}
            onChange={(e) => setActorRole(e.target.value)}
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">All roles</option>
            {STAFF_ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="entityType" className="text-xs">
            Entity Type
          </Label>
          <Input
            id="entityType"
            placeholder="e.g. User"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            className="h-9 w-40"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="dateFrom" className="text-xs">
            From
          </Label>
          <Input
            id="dateFrom"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="dateTo" className="text-xs">
            To
          </Label>
          <Input
            id="dateTo"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-9"
          />
        </div>
        <Button size="sm" onClick={applyFilters}>
          <Search className="h-4 w-4" />
          Apply
        </Button>
      </div>

      {logs.length === 0 ? (
        <p className="py-8 text-center text-muted-foreground">No audit logs found</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Entity ID</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <Badge variant="outline">{log.action}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{log.actorRole ?? '—'}</div>
                    <div className="text-xs text-muted-foreground">
                      {log.actorStaffId ? `${log.actorStaffId.slice(0, 8)}...` : 'System'}
                    </div>
                  </TableCell>
                  <TableCell>{log.entityType}</TableCell>
                  <TableCell
                    className="max-w-[120px] truncate text-xs text-muted-foreground"
                    title={log.entityId}
                  >
                    {log.entityId.slice(0, 12)}...
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                Page {page} of {totalPages} ({total} total)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => goToPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

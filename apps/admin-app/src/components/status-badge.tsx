import { Badge } from '@/components/ui/badge';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

const variantMap: Record<string, BadgeVariant> = {
  ACTIVE: 'default',
  PUBLISHED: 'default',
  COMPLETED: 'default',
  UNDER_REVIEW: 'secondary',
  SUBMITTED: 'secondary',
  IN_REVIEW: 'secondary',
  BLOCKED: 'destructive',
  REJECTED: 'destructive',
  REVOKED: 'destructive',
  EXPIRED: 'destructive',
  APPROVED: 'outline',
  CANCELED: 'outline',
  PAST_DUE: 'outline',
  HIDDEN: 'outline',
};

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = variantMap[status] ?? 'outline';
  return <Badge variant={variant}>{status}</Badge>;
}

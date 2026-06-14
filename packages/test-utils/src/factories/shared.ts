export type FactoryOverrides<T> = Partial<T>;

type SequenceName =
  | 'member-user'
  | 'staff-user'
  | 'card'
  | 'vip-subscription'
  | 'business-profile'
  | 'introduction'
  | 'stripe-event';

const DEFAULT_TIMESTAMP_PREFIX = '2026-01';

const sequences: Record<SequenceName, number> = {
  'member-user': 0,
  'staff-user': 0,
  card: 0,
  'vip-subscription': 0,
  'business-profile': 0,
  introduction: 0,
  'stripe-event': 0,
};

export function resetFactorySequences(): void {
  for (const key of Object.keys(sequences) as SequenceName[]) {
    sequences[key] = 0;
  }
}

export function nextSequence(name: SequenceName): number {
  sequences[name] += 1;
  return sequences[name];
}

export function makeEntityId(prefix: string, sequence: number): string {
  return `${prefix}-${sequence.toString().padStart(4, '0')}`;
}

export function makeIsoDate(sequence: number, dayOffset = 0): string {
  const day = ((sequence + dayOffset - 1) % 28) + 1;
  return `${DEFAULT_TIMESTAMP_PREFIX}-${day.toString().padStart(2, '0')}T12:00:00.000Z`;
}

export function makePhone(sequence: number): string {
  return `+1555000${sequence.toString().padStart(4, '0')}`;
}

export function makeCardNumber(tier: 'MEMBER' | 'VIP', sequence: number): string {
  const prefix = tier === 'VIP' ? 'VIP' : 'MEM';
  return `${prefix}-${sequence.toString().padStart(6, '0')}`;
}

export function withOverrides<T>(base: T, overrides?: FactoryOverrides<T>): T {
  return {
    ...base,
    ...overrides,
  };
}

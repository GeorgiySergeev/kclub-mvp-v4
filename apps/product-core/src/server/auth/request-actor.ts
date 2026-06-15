import type { EntityId } from '@kclub/contracts';
import type { StaffRole } from '@kclub/contracts';

export type MemberActor = {
  kind: 'member';
  userId: EntityId;
};

export type StaffActor = {
  kind: 'staff';
  staffId: EntityId;
  role: StaffRole;
};

export type SystemActor = {
  kind: 'system';
};

export type RequestActor = MemberActor | StaffActor | SystemActor | null;

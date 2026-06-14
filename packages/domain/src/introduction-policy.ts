export const INTRODUCTIONS_PER_DAY_LIMIT = 10;
export const INTRODUCTIONS_PER_TARGET_PER_30_DAYS_LIMIT = 3;
export const INTRODUCTION_COOLDOWN_DAYS = 30;
export const INTRODUCTION_SINGLE_PENDING_PER_TARGET = 1;

export function canCreateIntroductionForDay(countToday: number): boolean {
  return countToday < INTRODUCTIONS_PER_DAY_LIMIT;
}

export function canCreateIntroductionForTarget(countForTargetIn30Days: number): boolean {
  return countForTargetIn30Days < INTRODUCTIONS_PER_TARGET_PER_30_DAYS_LIMIT;
}

export function canCreatePendingIntroduction(existingPendingCount: number): boolean {
  return existingPendingCount < INTRODUCTION_SINGLE_PENDING_PER_TARGET;
}

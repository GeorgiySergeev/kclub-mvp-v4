import {
  ADMIN_BUSINESS_ONLY_KEYS,
  PUBLIC_BUSINESS_DTO_KEYS,
  isPublicBusinessDtoKey,
} from '@kclub/contracts';

export function assertPublicBusinessDtoExcludesAdminFields(dto: Record<string, unknown>): void {
  for (const key of ADMIN_BUSINESS_ONLY_KEYS) {
    if (key in dto) {
      throw new Error(`Public business DTO must not include admin-only field "${key}".`);
    }
  }
}

export function assertAdminBusinessDtoIncludesModerationFields(dto: Record<string, unknown>): void {
  for (const key of ADMIN_BUSINESS_ONLY_KEYS) {
    if (!(key in dto)) {
      throw new Error(`Admin business DTO must include moderation field "${key}".`);
    }
  }
}

export function assertKnownPublicBusinessDtoKeys(dto: Record<string, unknown>): void {
  for (const key of Object.keys(dto)) {
    if (!PUBLIC_BUSINESS_DTO_KEYS.includes(key as (typeof PUBLIC_BUSINESS_DTO_KEYS)[number])) {
      throw new Error(`Unexpected public business DTO field "${key}".`);
    }

    if (!isPublicBusinessDtoKey(key)) {
      throw new Error(`Field "${key}" failed public business DTO key guard.`);
    }
  }
}

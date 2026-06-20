export const LOCALES = ['en', 'ru', 'uk'] as const;
export type Locale = (typeof LOCALES)[number];

export const MEMBER_TIERS = ['MEMBER', 'VIP'] as const;
export type MemberTier = (typeof MEMBER_TIERS)[number];

export const USER_STATUSES = ['ACTIVE', 'BLOCKED'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const CLUB_CARD_STATUSES = ['ACTIVE', 'REVOKED', 'EXPIRED'] as const;
export type ClubCardStatus = (typeof CLUB_CARD_STATUSES)[number];

export const BUSINESS_STATUSES = [
  'UNDER_REVIEW',
  'APPROVED',
  'PUBLISHED',
  'REJECTED',
  'HIDDEN',
] as const;
export type BusinessStatus = (typeof BUSINESS_STATUSES)[number];

export const SUBSCRIPTION_STATUSES = ['NONE', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED'] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

export const INTRODUCTION_STATUSES = [
  'SUBMITTED',
  'IN_REVIEW',
  'APPROVED',
  'COMPLETED',
  'REJECTED',
  'CANCELED',
] as const;
export type IntroductionStatus = (typeof INTRODUCTION_STATUSES)[number];

export const AUDIT_ACTIONS = [
  'USER_BLOCKED',
  'USER_UNBLOCKED',
  'CARD_REVOKED',
  'CARD_ISSUED',
  'BUSINESS_APPROVED',
  'BUSINESS_REJECTED',
  'BUSINESS_HIDDEN',
  'BUSINESS_FEATURED_UPDATED',
  'BUSINESS_SUBMITTED',
  'BUSINESS_UPDATED',
  'INTRODUCTION_APPROVED',
  'INTRODUCTION_REJECTED',
  'INTRODUCTION_COMPLETED',
  'INTRODUCTION_SUBMITTED',
  'INTRODUCTION_CANCELED',
  'SUBSCRIPTION_CANCELED',
  'STAFF_ROLE_UPDATED',
  'STRIPE_WEBHOOK_REPLAYED',
] as const;
export type AuditAction = (typeof AUDIT_ACTIONS)[number];

export type IsoDateTime = string;
export type EntityId = string;

export type DashboardMetricsDto = {
  totalUsers: number;
  activeUsers: number;
  blockedUsers: number;
  activeSubscriptions: number;
  pastDueSubscriptions: number;
  expiredSubscriptions: number;
  businessesUnderReview: number;
  introductionsSubmitted: number;
  introductionsInReview: number;
};

export const STAFF_AUTH_STATES = [
  'OTP_REQUIRED',
  'TOTP_REQUIRED',
  'TOTP_SETUP_REQUIRED',
  'AUTHENTICATED',
] as const;
export type StaffAuthState = (typeof STAFF_AUTH_STATES)[number];

export type StaffProfileDto = {
  id: EntityId;
  phone: string;
  displayName: string | null;
  role: StaffRole;
  totpVerified: boolean;
};

export type StaffAuthChallengeDto = {
  state: StaffAuthState;
  phone: string;
};

export type StaffAuthSessionDto = {
  state: StaffAuthState;
  profile: StaffProfileDto;
  token: string;
  expiresAt: IsoDateTime;
};

export type StaffTotpSetupDto = {
  provisioningUri: string;
  manualKey: string;
};

export type AdminUserListItemDto = {
  id: EntityId;
  phone: string;
  displayName: string | null;
  status: UserStatus;
  membershipTier: MemberTier;
  createdAt: IsoDateTime;
};

export type AdminUserDetailDto = AdminUserListItemDto & {
  localePreference: Locale | null;
  onboardingComplete: boolean;
  termsAcceptedAt: IsoDateTime | null;
  updatedAt: IsoDateTime;
  cards: MemberCardDto[];
  subscriptions: SubscriptionDto[];
  auditEntries: AuditLogDto[];
};

export type AdminCardListItemDto = {
  id: EntityId;
  userId: EntityId;
  userPhone: string;
  userDisplayName: string | null;
  cardNumber: string;
  status: ClubCardStatus;
  membershipTier: MemberTier;
  issuedAt: IsoDateTime;
  expiresAt: IsoDateTime | null;
};

export type CurrentMemberProfileDto = {
  id: EntityId;
  phone: string;
  displayName: string | null;
  localePreference: Locale | null;
  membershipTier: MemberTier;
  status: UserStatus;
  onboardingComplete: boolean;
  termsAcceptedAt: IsoDateTime | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
};

export type PublicCardVerificationDto = {
  cardNumber: string;
  status: ClubCardStatus;
  membershipTier: MemberTier;
  displayName: string | null;
  issuedAt: IsoDateTime;
  expiresAt: IsoDateTime | null;
};

export type MemberCardDto = {
  id: EntityId;
  userId: EntityId;
  cardNumber: string;
  status: ClubCardStatus;
  membershipTier: MemberTier;
  qrPayloadUrl: string;
  issuedAt: IsoDateTime;
  expiresAt: IsoDateTime | null;
};

export type PublicBusinessListItemDto = {
  id: EntityId;
  slug: string;
  name: string;
  categoryName: string;
  countryName: string;
  cityName: string;
  briefDescription: string | null;
  websiteUrl: string | null;
  socialUrl: string | null;
  featuredTop: boolean;
  featuredRecommended: boolean;
};

export type PublicBusinessDetailDto = PublicBusinessListItemDto & {
  description: string | null;
  representativeName: string | null;
  publishedAt: IsoDateTime | null;
};

export type AdminBusinessDetailDto = PublicBusinessDetailDto & {
  ownerUserId: EntityId;
  status: BusinessStatus;
  representativeEmail: string;
  representativePhone: string;
  rejectionReason: string | null;
  internalNotes: string | null;
  approvedAt: IsoDateTime | null;
  hiddenAt: IsoDateTime | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  owner: AdminBusinessOwnerSummaryDto;
  placementSubscription: AdminBusinessSubscriptionIndicatorDto | null;
  auditEntries: AuditLogDto[];
};

export type MemberBusinessProfileDto = PublicBusinessDetailDto & {
  status: BusinessStatus;
  representativeEmail: string;
  representativePhone: string;
  rejectionReason: string | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
};

export type SubscriptionDto = {
  id: EntityId;
  userId: EntityId;
  status: SubscriptionStatus;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodStart: IsoDateTime | null;
  currentPeriodEnd: IsoDateTime | null;
  cancelAtPeriodEnd: boolean;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
};

export type IntroductionDto = {
  id: EntityId;
  requesterUserId: EntityId;
  requesterBusinessId: EntityId;
  targetBusinessId: EntityId;
  status: IntroductionStatus;
  message: string | null;
  rejectionReason: string | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
};

export type MemberIntroductionDto = IntroductionDto & {
  requesterBusinessName: string;
  requesterBusinessSlug: string;
  targetBusinessName: string;
  targetBusinessSlug: string;
};

export type AdminBusinessOwnerSummaryDto = {
  id: EntityId;
  phone: string;
  displayName: string | null;
  status: UserStatus;
  membershipTier: MemberTier;
};

export type AdminBusinessSubscriptionIndicatorDto = {
  status: SubscriptionStatus;
  currentPeriodEnd: IsoDateTime | null;
};

export type AdminBusinessListItemDto = {
  id: EntityId;
  slug: string;
  name: string;
  categoryName: string;
  countryName: string;
  cityName: string;
  briefDescription: string | null;
  websiteUrl: string | null;
  socialUrl: string | null;
  featuredTop: boolean;
  featuredRecommended: boolean;
  description: string | null;
  representativeName: string | null;
  publishedAt: IsoDateTime | null;
  ownerUserId: EntityId;
  status: BusinessStatus;
  representativeEmail: string;
  representativePhone: string;
  rejectionReason: string | null;
  internalNotes: string | null;
  approvedAt: IsoDateTime | null;
  hiddenAt: IsoDateTime | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  owner: AdminBusinessOwnerSummaryDto;
  placementSubscription: AdminBusinessSubscriptionIndicatorDto | null;
};

export type AuditLogDto = {
  id: EntityId;
  actorStaffId: EntityId | null;
  actorRole: StaffRole | null;
  action: AuditAction;
  entityType: string;
  entityId: EntityId;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: IsoDateTime;
};

import type { StaffRole } from './permissions';

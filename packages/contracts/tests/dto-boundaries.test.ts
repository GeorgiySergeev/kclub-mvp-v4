import type {
  AdminBusinessDetailDto,
  AdminCardListItemDto,
  MemberCardDto,
  PublicBusinessDetailDto,
  PublicCardVerificationDto,
} from '../src';

type Assert<T extends true> = T;
type HasKey<T, K extends PropertyKey> = K extends keyof T ? true : false;

type PublicBusinessDoesNotExposeAdminEmail = Assert<
  HasKey<PublicBusinessDetailDto, 'representativeEmail'> extends false ? true : false
>;
type PublicBusinessDoesNotExposeAdminPhone = Assert<
  HasKey<PublicBusinessDetailDto, 'representativePhone'> extends false ? true : false
>;
type PublicBusinessDoesNotExposeOwner = Assert<
  HasKey<PublicBusinessDetailDto, 'ownerUserId'> extends false ? true : false
>;
type AdminBusinessExposesModerationFields = Assert<
  HasKey<AdminBusinessDetailDto, 'representativeEmail'> extends true ? true : false
>;

type PublicCardVerifyDoesNotExposeUserId = Assert<
  HasKey<PublicCardVerificationDto, 'userId'> extends false ? true : false
>;
type PublicCardVerifyDoesNotExposeCardId = Assert<
  HasKey<PublicCardVerificationDto, 'id'> extends false ? true : false
>;

type AdminCardListItemExposesUserPhone = Assert<
  HasKey<AdminCardListItemDto, 'userPhone'> extends true ? true : false
>;
type AdminCardListItemExposesUserDisplayName = Assert<
  HasKey<AdminCardListItemDto, 'userDisplayName'> extends true ? true : false
>;
type MemberCardDtoDoesNotExposeUserPhone = Assert<
  HasKey<MemberCardDto, 'userPhone'> extends false ? true : false
>;
type MemberCardDtoDoesNotExposeUserDisplayName = Assert<
  HasKey<MemberCardDto, 'userDisplayName'> extends false ? true : false
>;

export type {
  AdminBusinessExposesModerationFields,
  AdminCardListItemExposesUserPhone,
  AdminCardListItemExposesUserDisplayName,
  MemberCardDtoDoesNotExposeUserPhone,
  MemberCardDtoDoesNotExposeUserDisplayName,
  PublicBusinessDoesNotExposeAdminEmail,
  PublicBusinessDoesNotExposeAdminPhone,
  PublicBusinessDoesNotExposeOwner,
  PublicCardVerifyDoesNotExposeUserId,
  PublicCardVerifyDoesNotExposeCardId,
};

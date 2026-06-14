export type CountrySeedPlan = {
  code2: string;
  code3: string;
  name: string;
  slug: string;
  citySlugs: string[];
};

export type CategorySeedPlan = {
  slug: string;
  name: string;
  isHighRisk: boolean;
};

export const COUNTRY_SEED_PLAN: readonly CountrySeedPlan[] = [
  {
    code2: 'US',
    code3: 'USA',
    name: 'United States',
    slug: 'united-states',
    citySlugs: ['new-york', 'miami', 'los-angeles'],
  },
  {
    code2: 'UA',
    code3: 'UKR',
    name: 'Ukraine',
    slug: 'ukraine',
    citySlugs: ['kyiv'],
  },
  {
    code2: 'GB',
    code3: 'GBR',
    name: 'United Kingdom',
    slug: 'united-kingdom',
    citySlugs: ['london'],
  },
  {
    code2: 'AE',
    code3: 'ARE',
    name: 'United Arab Emirates',
    slug: 'united-arab-emirates',
    citySlugs: ['dubai'],
  },
] as const;

export const CITY_SEED_PLAN = [
  { countrySlug: 'united-states', name: 'New York', slug: 'new-york' },
  { countrySlug: 'united-states', name: 'Miami', slug: 'miami' },
  { countrySlug: 'united-states', name: 'Los Angeles', slug: 'los-angeles' },
  { countrySlug: 'ukraine', name: 'Kyiv', slug: 'kyiv' },
  { countrySlug: 'united-kingdom', name: 'London', slug: 'london' },
  { countrySlug: 'united-arab-emirates', name: 'Dubai', slug: 'dubai' },
] as const;

export const CATEGORY_SEED_PLAN: readonly CategorySeedPlan[] = [
  { slug: 'hospitality', name: 'Hospitality', isHighRisk: false },
  { slug: 'wellness', name: 'Wellness', isHighRisk: false },
  { slug: 'legal-services', name: 'Legal Services', isHighRisk: false },
  { slug: 'real-estate', name: 'Real Estate', isHighRisk: false },
  { slug: 'crypto', name: 'Crypto', isHighRisk: true },
  { slug: 'gambling', name: 'Gambling', isHighRisk: true },
  { slug: 'adult', name: 'Adult', isHighRisk: true },
  { slug: 'firearms', name: 'Firearms', isHighRisk: true },
  { slug: 'unlicensed-financial', name: 'Unlicensed Financial', isHighRisk: true },
  { slug: 'high-risk-investments', name: 'High Risk Investments', isHighRisk: true },
] as const;

export const ADMIN_BOOTSTRAP_PLAN = {
  ownerAccountRequired: true,
  optionalStagingRoles: ['ADMIN', 'MODERATOR'] as const,
  note: 'Create the initial OWNER account out-of-band with approved local, staging, or production credentials.',
} as const;

export const CONFIG_SEED_PLAN = {
  stripePriceKeys: ['vip_membership_monthly', 'business_placement_monthly'] as const,
  initialAdminConfigKeys: ['platform_settings', 'directory_settings'] as const,
} as const;

if (import.meta.main) {
  console.log(
    JSON.stringify(
      {
        countries: COUNTRY_SEED_PLAN,
        cities: CITY_SEED_PLAN,
        categories: CATEGORY_SEED_PLAN,
        adminBootstrap: ADMIN_BOOTSTRAP_PLAN,
        config: CONFIG_SEED_PLAN,
      },
      null,
      2,
    ),
  );
}

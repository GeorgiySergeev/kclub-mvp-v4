import { PrismaClient } from '../generated/client/index.js';
import {
  ADMIN_BOOTSTRAP_PLAN,
  CATEGORY_SEED_PLAN,
  CITY_SEED_PLAN,
  CONFIG_SEED_PLAN,
  COUNTRY_SEED_PLAN,
} from './seed-plan.js';

const DEMO_BUSINESSES = [
  {
    userPhone: '+15551000001',
    userDisplayName: 'Skyline Partner',
    slug: 'skyline-hospitality-group',
    name: 'Skyline Hospitality Group',
    representativeName: 'Alex Morgan',
    representativeEmail: 'alex@skyline-hospitality.example',
    representativePhone: '+15551000001',
    categorySlug: 'hospitality',
    countrySlug: 'united-states',
    citySlug: 'new-york',
    briefDescription: 'Boutique hotels and private dining for members.',
    featuredTop: true,
    featuredRecommended: false,
  },
  {
    userPhone: '+15551000002',
    userDisplayName: 'Wellness Collective',
    slug: 'wellness-collective-miami',
    name: 'Wellness Collective Miami',
    representativeName: 'Jordan Lee',
    representativeEmail: 'hello@wellness-collective.example',
    representativePhone: '+15551000002',
    categorySlug: 'wellness',
    countrySlug: 'united-states',
    citySlug: 'miami',
    briefDescription: 'Concierge wellness, recovery, and longevity programs.',
    featuredTop: false,
    featuredRecommended: true,
  },
  {
    userPhone: '+15551000003',
    userDisplayName: 'Legal Advisory',
    slug: 'harbor-legal-advisors',
    name: 'Harbor Legal Advisors',
    representativeName: 'Taylor Brooks',
    representativeEmail: 'team@harbor-legal.example',
    representativePhone: '+15551000003',
    categorySlug: 'legal-services',
    countrySlug: 'united-states',
    citySlug: 'los-angeles',
    briefDescription: 'Cross-border legal counsel for founders and families.',
    featuredTop: false,
    featuredRecommended: false,
  },
] as const;

function isTruthyFlag(value: string | undefined): boolean {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '').trim();
}

async function seedReferenceData(prisma: PrismaClient): Promise<void> {
  for (const country of COUNTRY_SEED_PLAN) {
    await prisma.country.upsert({
      where: { slug: country.slug },
      create: {
        code2: country.code2,
        code3: country.code3,
        name: country.name,
        slug: country.slug,
        is_active: true,
      },
      update: {
        code2: country.code2,
        code3: country.code3,
        name: country.name,
        is_active: true,
      },
    });
  }

  const countries = await prisma.country.findMany({
    where: { slug: { in: COUNTRY_SEED_PLAN.map((country) => country.slug) } },
  });
  const countryBySlug = new Map(countries.map((country) => [country.slug, country]));

  for (const city of CITY_SEED_PLAN) {
    const country = countryBySlug.get(city.countrySlug);
    if (!country) {
      throw new Error(`Missing country for city seed: ${city.countrySlug}`);
    }

    await prisma.city.upsert({
      where: {
        country_id_slug: {
          country_id: country.id,
          slug: city.slug,
        },
      },
      create: {
        country_id: country.id,
        name: city.name,
        slug: city.slug,
        is_active: true,
      },
      update: {
        name: city.name,
        is_active: true,
      },
    });
  }

  for (const category of CATEGORY_SEED_PLAN) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      create: {
        name: category.name,
        slug: category.slug,
        is_high_risk: category.isHighRisk,
        is_active: true,
      },
      update: {
        name: category.name,
        is_high_risk: category.isHighRisk,
        is_active: true,
      },
    });
  }

  for (const key of CONFIG_SEED_PLAN.initialAdminConfigKeys) {
    await prisma.adminConfig.upsert({
      where: { key },
      create: {
        key,
        value: {},
        description: `Initial ${key} seed placeholder`,
      },
      update: {},
    });
  }

  for (const key of CONFIG_SEED_PLAN.stripePriceKeys) {
    await prisma.adminConfig.upsert({
      where: { key },
      create: {
        key,
        value: { stripePriceId: null },
        description: `Stripe price config placeholder for ${key}`,
      },
      update: {},
    });
  }
}

async function seedBootstrapOwner(prisma: PrismaClient): Promise<void> {
  const ownerPhone = process.env[ADMIN_BOOTSTRAP_PLAN.ownerPhoneEnv];
  if (!ownerPhone) {
    console.log('Skipping admin owner seed: ADMIN_BOOTSTRAP_OWNER_PHONE is not set');
    return;
  }

  const phone = normalizePhone(ownerPhone);
  await prisma.adminUser.upsert({
    where: { phone },
    create: {
      phone,
      role: 'OWNER',
      display_name: 'Bootstrap Owner',
      is_active: true,
    },
    update: {
      role: 'OWNER',
      display_name: 'Bootstrap Owner',
      is_active: true,
    },
  });
}

async function seedDemoBusinesses(prisma: PrismaClient): Promise<void> {
  const countries = await prisma.country.findMany();
  const cities = await prisma.city.findMany({ include: { country: true } });
  const categories = await prisma.category.findMany();

  const countryBySlug = new Map(countries.map((country) => [country.slug, country]));
  const cityByKey = new Map(cities.map((city) => [`${city.country.slug}:${city.slug}`, city]));
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));

  const now = new Date();

  for (const demo of DEMO_BUSINESSES) {
    const country = countryBySlug.get(demo.countrySlug);
    const city = cityByKey.get(`${demo.countrySlug}:${demo.citySlug}`);
    const category = categoryBySlug.get(demo.categorySlug);

    if (!country || !city || !category) {
      throw new Error(`Missing taxonomy for demo business ${demo.slug}`);
    }

    const user = await prisma.user.upsert({
      where: { phone: demo.userPhone },
      create: {
        phone: demo.userPhone,
        display_name: demo.userDisplayName,
        locale_preference: 'en',
        terms_accepted_at: now,
      },
      update: {
        display_name: demo.userDisplayName,
      },
    });

    await prisma.businessProfile.upsert({
      where: { slug: demo.slug },
      create: {
        user_id: user.id,
        slug: demo.slug,
        name: demo.name,
        representative_name: demo.representativeName,
        representative_email: demo.representativeEmail,
        representative_phone: demo.representativePhone,
        country_id: country.id,
        city_id: city.id,
        category_id: category.id,
        status: 'PUBLISHED',
        brief_description: demo.briefDescription,
        featured_top: demo.featuredTop,
        featured_recommended: demo.featuredRecommended,
        approved_at: now,
        published_at: now,
      },
      update: {
        name: demo.name,
        status: 'PUBLISHED',
        brief_description: demo.briefDescription,
        featured_top: demo.featuredTop,
        featured_recommended: demo.featuredRecommended,
        published_at: now,
      },
    });
  }
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL must be set before running db:seed');
  }

  const prisma = new PrismaClient();

  try {
    await seedReferenceData(prisma);
    console.log(
      `Reference seed complete: ${COUNTRY_SEED_PLAN.length} countries, ${CITY_SEED_PLAN.length} cities, ${CATEGORY_SEED_PLAN.length} categories`,
    );

    await seedBootstrapOwner(prisma);
    console.log('Admin bootstrap owner seed complete');

    if (isTruthyFlag(process.env.ALLOW_SEED) && isTruthyFlag(process.env.CONFIRM_SEED)) {
      await seedDemoBusinesses(prisma);
      console.log(`Demo seed complete: ${DEMO_BUSINESSES.length} published businesses`);
    } else {
      console.log(
        'Demo businesses skipped. Set ALLOW_SEED=1 and CONFIRM_SEED=1 to insert demo data.',
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
}

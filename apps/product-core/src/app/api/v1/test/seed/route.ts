import { NextResponse } from 'next/server';

const E2E_SECRET = process.env.E2E_TEST_SECRET;

type SeedRequestBody = {
  scenario: string;
  webhookEvent?: {
    type: string;
    data: Record<string, unknown>;
  };
};

type SeedResult = {
  userId?: string;
  phone?: string;
  cardNumber?: string;
  businessId?: string;
  businessSlug?: string;
  staffPhone?: string;
};

export async function POST(request: Request): Promise<Response> {
  // Guard: only available when E2E_TEST_SECRET is set
  if (!E2E_SECRET) {
    return NextResponse.json(
      { data: null, error: { code: 'NOT_FOUND', message: 'Not found' } },
      { status: 404 },
    );
  }

  // Verify secret header
  const secretHeader = request.headers.get('x-e2e-secret');
  if (secretHeader !== E2E_SECRET) {
    return NextResponse.json(
      { data: null, error: { code: 'UNAUTHORIZED', message: 'Invalid secret' } },
      { status: 401 },
    );
  }

  const body = (await request.json()) as SeedRequestBody;
  const { scenario } = body;

  try {
    const result = await seedScenario(scenario, body.webhookEvent);
    
    // Clear the Next.js router cache so tests see the seeded data immediately
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/', 'layout');

    return NextResponse.json({ data: result, error: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { data: null, error: { code: 'SEED_FAILED', message } },
      { status: 500 },
    );
  }
}

async function seedScenario(
  scenario: string,
  _webhookEvent?: { type: string; data: Record<string, unknown> },
): Promise<SeedResult> {
  // Lazy import to avoid loading Prisma when not needed
  const { getPrismaClient } = await import('@/server/db');
  const prisma = getPrismaClient();

  const timestamp = Date.now();
  const testPhone = `+1${timestamp.toString().slice(-10)}`;

  // Helper to get or create required relations for businesses
  const getBusinessRelations = async () => {
    let category = await prisma.category.findFirst();
    if (!category) {
      category = await prisma.category.create({
        data: { name: `E2E Category ${timestamp}`, slug: `e2e-category-${timestamp}` },
      });
    }

    let country = await prisma.country.findFirst();
    if (!country) {
      country = await prisma.country.create({
        data: { code2: 'US', name: 'United States', slug: 'united-states' },
      });
    }

    let city = await prisma.city.findFirst();
    if (!city) {
      city = await prisma.city.create({
        data: { country_id: country.id, name: 'New York', slug: 'new-york' },
      });
    }

    return { categoryId: category.id, countryId: country.id, cityId: city.id };
  };

  switch (scenario) {
    case 'member-with-card': {
      const user = await prisma.user.create({
        data: {
          phone: testPhone,
          display_name: `E2E Member ${timestamp}`,
          locale_preference: 'en',
          terms_accepted_at: new Date(),
          status: 'ACTIVE',
          supabase_auth_user_id: crypto.randomUUID(),
        },
      });

      const card = await prisma.memberCard.create({
        data: {
          user_id: user.id,
          card_number: `MEM-${timestamp.toString().slice(-6)}`,
          membership_tier: 'MEMBER',
          status: 'ACTIVE',
          issued_at: new Date(),
          expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        userId: user.id,
        phone: testPhone,
        cardNumber: card.card_number,
      };
    }

    case 'vip-member': {
      const user = await prisma.user.create({
        data: {
          phone: testPhone,
          display_name: `E2E VIP ${timestamp}`,
          locale_preference: 'en',
          terms_accepted_at: new Date(),
          status: 'ACTIVE',
          membership_tier: 'VIP',
          supabase_auth_user_id: crypto.randomUUID(),
        },
      });

      return { userId: user.id, phone: testPhone };
    }

    case 'vip-with-business': {
      const user = await prisma.user.create({
        data: {
          phone: testPhone,
          display_name: `E2E VIP Biz ${timestamp}`,
          locale_preference: 'en',
          terms_accepted_at: new Date(),
          status: 'ACTIVE',
          membership_tier: 'VIP',
          supabase_auth_user_id: crypto.randomUUID(),
        },
      });

      const relations = await getBusinessRelations();

      const business = await prisma.businessProfile.create({
        data: {
          user_id: user.id,
          name: `E2E Business ${timestamp}`,
          slug: `e2e-business-${timestamp}`,
          representative_name: 'E2E Representative',
          representative_email: `e2e-${timestamp}@test.com`,
          representative_phone: testPhone,
          country_id: relations.countryId,
          city_id: relations.cityId,
          category_id: relations.categoryId,
          status: 'UNDER_REVIEW',
        },
      });

      return {
        userId: user.id,
        phone: testPhone,
        businessId: business.id,
        businessSlug: business.slug,
      };
    }

    case 'vip-with-published-business': {
      const user = await prisma.user.create({
        data: {
          phone: testPhone,
          display_name: `E2E VIP Published ${timestamp}`,
          locale_preference: 'en',
          terms_accepted_at: new Date(),
          status: 'ACTIVE',
          membership_tier: 'VIP',
          supabase_auth_user_id: crypto.randomUUID(),
        },
      });

      const relations = await getBusinessRelations();

      const business = await prisma.businessProfile.create({
        data: {
          user_id: user.id,
          name: `E2E Published Business ${timestamp}`,
          slug: `e2e-published-${timestamp}`,
          representative_name: 'E2E Rep',
          representative_email: `e2e-pub-${timestamp}@test.com`,
          representative_phone: testPhone,
          country_id: relations.countryId,
          city_id: relations.cityId,
          category_id: relations.categoryId,
          status: 'PUBLISHED',
        },
      });

      return {
        userId: user.id,
        phone: testPhone,
        businessId: business.id,
        businessSlug: business.slug,
      };
    }

    case 'staff-owner': {
      // Staff users come from ADMIN_STAFF_ALLOWLIST_JSON env var
      // Return the bootstrap owner phone for login
      return {
        staffPhone: process.env.ADMIN_BOOTSTRAP_OWNER_PHONE ?? '+10000000000',
      };
    }

    case 'staff-moderator': {
      return {
        staffPhone: process.env.ADMIN_BOOTSTRAP_OWNER_PHONE ?? '+10000000000',
      };
    }

    case 'published-businesses': {
      const relations = await getBusinessRelations();

      const businesses = await Promise.all(
        ['Alpha', 'Beta', 'Gamma'].map(async (name, i) => {
          const owner = await prisma.user.create({
            data: {
              phone: `+1${(timestamp + i).toString().slice(-10)}`,
              display_name: `E2E Directory Owner ${name} ${timestamp}`,
              locale_preference: 'en',
              terms_accepted_at: new Date(),
              status: 'ACTIVE',
              membership_tier: 'VIP',
              supabase_auth_user_id: crypto.randomUUID(),
            },
          });

          return prisma.businessProfile.create({
            data: {
              user_id: owner.id,
              name: `E2E ${name} Business`,
              slug: `e2e-${name.toLowerCase()}-${timestamp}`,
              representative_name: `${name} Rep`,
              representative_email: `e2e-${name.toLowerCase()}-${timestamp}@test.com`,
              representative_phone: owner.phone,
              country_id: relations.countryId,
              city_id: relations.cityId,
              category_id: relations.categoryId,
              status: 'PUBLISHED',
            },
          });
        }),
      );

      return {
        userId: businesses[0]?.user_id,
        phone: testPhone, // Note: We might need to return the first owner's phone for login tests
        businessId: businesses[0]?.id,
        businessSlug: businesses[0]?.slug,
      };
    }

    default:
      throw new Error(`Unknown seed scenario: ${scenario}`);
  }
}

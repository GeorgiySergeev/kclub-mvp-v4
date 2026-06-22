import { NextResponse } from 'next/server';

function getE2eSecret(): string | undefined {
  return process.env.E2E_TEST_SECRET;
}

export async function POST(request: Request): Promise<Response> {
  const e2eSecret = getE2eSecret();
  if (!e2eSecret) {
    return NextResponse.json(
      { data: null, error: { code: 'NOT_FOUND', message: 'Not found' } },
      { status: 404 },
    );
  }

  const secretHeader = request.headers.get('x-e2e-secret');
  if (secretHeader !== e2eSecret) {
    return NextResponse.json(
      { data: null, error: { code: 'UNAUTHORIZED', message: 'Invalid secret' } },
      { status: 401 },
    );
  }

  try {
    const { getPrismaClient } = await import('@/server/db');
    const prisma = getPrismaClient();

    // Delete E2E test data by convention: display names starting with "E2E "
    // Order matters due to foreign key constraints
    await prisma.subscription.deleteMany({
      where: {
        OR: [
          { user: { display_name: { startsWith: 'E2E ' } } },
          { business_profile: { name: { startsWith: 'E2E ' } } },
          { stripe_subscription_id: { startsWith: 'sub_e2e_' } },
        ],
      },
    });
    await prisma.vipSubscription.deleteMany({
      where: {
        OR: [
          { user: { display_name: { startsWith: 'E2E ' } } },
          { stripe_subscription_id: { startsWith: 'sub_e2e_' } },
        ],
      },
    });
    await prisma.businessIntroduction.deleteMany({
      where: { target_business: { name: { startsWith: 'E2E ' } } },
    });
    await prisma.businessProfile.deleteMany({
      where: { name: { startsWith: 'E2E ' } },
    });
    await prisma.memberCard.deleteMany({
      where: { user: { display_name: { startsWith: 'E2E ' } } },
    });
    await prisma.user.deleteMany({
      where: { display_name: { startsWith: 'E2E ' } },
    });

    return NextResponse.json({ data: { cleaned: true }, error: null });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { data: null, error: { code: 'TEARDOWN_FAILED', message } },
      { status: 500 },
    );
  }
}

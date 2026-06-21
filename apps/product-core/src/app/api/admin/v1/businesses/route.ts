import { type NextRequest } from 'next/server';
import { STAFF_PERMISSIONS } from '@kclub/contracts';
import { adminBusinessListSchema } from '@kclub/validation';
import { adminGuard } from '@/server/admin-guard';
import { jsonSuccess, jsonErrorFromUnknown } from '@/server/api';
import { listBusinesses } from '@/server/services/admin-service';

export async function GET(request: NextRequest) {
  try {
    await adminGuard(request, STAFF_PERMISSIONS.BUSINESSES_MODERATE);
    const { searchParams } = request.nextUrl;
    const input = adminBusinessListSchema.parse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      status: searchParams.get('status') ?? undefined,
    });
    const result = await listBusinesses(input);
    return jsonSuccess(result.data, {
      page: input.page,
      limit: input.limit,
      total: result.total,
    });
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

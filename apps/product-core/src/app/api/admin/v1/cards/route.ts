import { type NextRequest } from 'next/server';
import { STAFF_PERMISSIONS } from '@kclub/contracts';
import { adminCardListSchema } from '@kclub/validation';
import { adminGuard } from '@/server/admin-guard';
import { jsonSuccess, jsonErrorFromUnknown } from '@/server/api';
import { listCards } from '@/server/services/admin-service';

export async function GET(request: NextRequest) {
  try {
    await adminGuard(request, STAFF_PERMISSIONS.CARDS_READ);
    const params = adminCardListSchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    const { data, total } = await listCards(params);
    return jsonSuccess(data, { page: params.page, limit: params.limit, total });
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

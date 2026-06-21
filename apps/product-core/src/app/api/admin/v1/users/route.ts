import { type NextRequest } from 'next/server';
import { STAFF_PERMISSIONS } from '@kclub/contracts';
import { adminUserListSchema } from '@kclub/validation';
import { adminGuard } from '@/server/admin-guard';
import { jsonSuccess, jsonErrorFromUnknown } from '@/server/api';
import { listUsers } from '@/server/services/admin-service';

export async function GET(request: NextRequest) {
  try {
    await adminGuard(request, STAFF_PERMISSIONS.USERS_READ);
    const params = adminUserListSchema.parse(Object.fromEntries(request.nextUrl.searchParams));
    const { data, total } = await listUsers(params);
    return jsonSuccess(data, { page: params.page, limit: params.limit, total });
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

import { type NextRequest } from 'next/server';
import { STAFF_PERMISSIONS } from '@kclub/contracts';
import { adminGuard } from '@/server/admin-guard';
import { jsonSuccess, jsonErrorFromUnknown } from '@/server/api';
import { listBusinesses } from '@/server/services/admin-service';

export async function GET(request: NextRequest) {
  try {
    adminGuard(request, STAFF_PERMISSIONS.BUSINESSES_MODERATE);
    const result = await listBusinesses();
    return jsonSuccess(result);
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

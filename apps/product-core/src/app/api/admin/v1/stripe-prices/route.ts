import { type NextRequest } from 'next/server';
import { STAFF_PERMISSIONS } from '@kclub/contracts';
import { adminGuard } from '@/server/admin-guard';
import { jsonSuccess, jsonErrorFromUnknown } from '@/server/api';
import { getStripePrices } from '@/server/services/admin-service';

export async function GET(request: NextRequest) {
  try {
    adminGuard(request, STAFF_PERMISSIONS.STRIPE_PRICES_MANAGE);
    const result = await getStripePrices();
    return jsonSuccess(result);
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

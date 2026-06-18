import { type NextRequest } from 'next/server';
import { STAFF_PERMISSIONS } from '@kclub/contracts';
import { adminGuard } from '@/server/admin-guard';
import { jsonSuccess, jsonErrorFromUnknown } from '@/server/api';
import {
  getStripePrices,
  updateStripePrices,
  STRIPE_PRICE_KEYS,
  type StripePriceKey,
} from '@/server/services/admin-service';

export async function GET(request: NextRequest) {
  try {
    adminGuard(request, STAFF_PERMISSIONS.STRIPE_PRICES_MANAGE);
    const result = await getStripePrices();
    return jsonSuccess(result);
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { profile, context } = adminGuard(request, STAFF_PERMISSIONS.STRIPE_PRICES_MANAGE);
    const body = (await request.json()) as Record<string, unknown>;

    const validKeys = STRIPE_PRICE_KEYS as readonly string[];
    const input: Partial<Record<StripePriceKey, string>> = {};

    for (const key of validKeys) {
      if (key in body) {
        const val = body[key];
        if (typeof val === 'string' && val.length > 0) {
          input[key as StripePriceKey] = val;
        }
      }
    }

    const result = await updateStripePrices(input, context);
    return jsonSuccess(result);
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

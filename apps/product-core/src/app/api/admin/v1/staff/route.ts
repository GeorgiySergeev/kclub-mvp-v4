import { type NextRequest } from 'next/server';
import { ERROR_CODES, STAFF_PERMISSIONS } from '@kclub/contracts';
import { adminGuard } from '@/server/admin-guard';
import { jsonSuccess, jsonError, jsonErrorFromUnknown } from '@/server/api';
import { listStaff } from '@/server/services/admin-service';

export async function GET(request: NextRequest) {
  try {
    const { profile, context } = await adminGuard(request, STAFF_PERMISSIONS.STAFF_MANAGE);
    const result = await listStaff(context);
    return jsonSuccess(result);
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

export async function POST() {
  return jsonError({ code: ERROR_CODES.NOT_IMPLEMENTED, message: 'Not implemented' }, undefined, {
    status: 501,
  });
}

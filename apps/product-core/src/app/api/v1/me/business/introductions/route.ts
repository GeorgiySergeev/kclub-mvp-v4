import { type NextRequest } from 'next/server';

import { ERROR_CODES } from '@kclub/contracts';

import { createSupabaseServerClient } from '@/server/auth';
import { jsonSuccess, jsonError, jsonErrorFromUnknown } from '@/server/api';
import { getMemberBySupabaseUserId } from '@/server/services';
import { getPrismaClient } from '@/server/db';
import { getIncomingIntroductions } from '@/server/services/introduction-service';

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

    if (error || !supabaseUser) {
      return jsonError({ code: ERROR_CODES.AUTH_SESSION_REQUIRED, message: 'Authentication required' }, undefined, { status: 401 });
    }

    const localUser = await getMemberBySupabaseUserId(supabaseUser.id);
    const prisma = getPrismaClient();
    const business = await prisma.businessProfile.findFirst({
      where: { user_id: localUser.id, status: { notIn: ['REJECTED', 'HIDDEN'] } },
    });

    if (!business) {
      return jsonError({ code: ERROR_CODES.PERMISSION_DENIED, message: 'No active business found' }, undefined, { status: 403 });
    }

    const introductions = await getIncomingIntroductions(business.id);
    return jsonSuccess(introductions);
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

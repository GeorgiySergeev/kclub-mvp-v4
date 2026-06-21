import { type NextRequest } from 'next/server';

import { ERROR_CODES } from '@kclub/contracts';

import { createSupabaseServerClient } from '@/server/auth';
import { jsonSuccess, jsonError, jsonErrorFromUnknown } from '@/server/api';
import { getMemberBySupabaseUserId } from '@/server/services';
import { getOwnSubscriptionDetail } from '@/server/services/subscription-service';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: supabaseUser },
      error,
    } = await supabase.auth.getUser();

    if (error || !supabaseUser) {
      return jsonError(
        { code: ERROR_CODES.AUTH_SESSION_REQUIRED, message: 'Authentication required' },
        undefined,
        { status: 401 },
      );
    }

    const localUser = await getMemberBySupabaseUserId(supabaseUser.id);
    const { id } = await params;
    const subscription = await getOwnSubscriptionDetail(localUser.id, id);

    return jsonSuccess(subscription);
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

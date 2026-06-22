import { type NextRequest } from 'next/server';

import { ERROR_CODES } from '@kclub/contracts';
import { businessProfileEditableFieldsSchema } from '@kclub/validation';

import { createSupabaseServerClient } from '@/server/auth';
import { jsonSuccess, jsonError, jsonErrorFromUnknown } from '@/server/api';
import { getMemberBySupabaseUserId, assertMemberOnboardingComplete } from '@/server/services';
import { getBusinessDetail, updateBusiness } from '@/server/services/business-service';
import { createRequestContext } from '@/server/context';

type Params = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createSupabaseServerClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    let userId: string | undefined;
    if (supabaseUser) {
      const localUser = await getMemberBySupabaseUserId(supabaseUser.id);
      userId = localUser.id;
    }

    const business = await getBusinessDetail(id, userId);
    return jsonSuccess(business);
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
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
    assertMemberOnboardingComplete(localUser);
    const context = createRequestContext({
      actor: { kind: 'member', userId: localUser.id },
      headers: request.headers,
    });

    const body = await request.json();
    const input = businessProfileEditableFieldsSchema.parse(body);

    const business = await updateBusiness(id, input, context);
    return jsonSuccess(business);
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

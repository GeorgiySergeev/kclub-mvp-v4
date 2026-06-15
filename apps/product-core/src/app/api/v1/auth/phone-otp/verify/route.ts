import { type NextRequest } from 'next/server';

import { phoneOtpVerifySchema, parseWithValidation } from '@kclub/validation';
import { ERROR_CODES } from '@kclub/contracts';

import { createSupabaseServerClient } from '@/server/auth';
import { jsonSuccess, jsonError, jsonErrorFromUnknown } from '@/server/api';
import { verifyPhoneOtp, getMemberBySupabaseUserId, toCurrentMemberProfileDto } from '@/server/services';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseWithValidation(phoneOtpVerifySchema, body);

    if (!parsed.success) {
      return jsonError(
        {
          code: parsed.error.code,
          message: parsed.error.message,
          details: { issues: parsed.error.issues },
        },
        undefined,
        { status: 400 },
      );
    }

    const { supabase, supabaseResponse } = createSupabaseServerClient(request);
    const { supabaseUserId } = await verifyPhoneOtp(supabase, parsed.data);

    const user = await getMemberBySupabaseUserId(supabaseUserId);
    const profile = toCurrentMemberProfileDto(user);

    return jsonSuccess(profile, undefined, {
      status: 200,
      headers: Object.fromEntries(supabaseResponse.headers.entries()),
    });
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

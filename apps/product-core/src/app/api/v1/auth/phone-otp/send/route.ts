import { type NextRequest } from 'next/server';

import { phoneOtpSendSchema, parseWithValidation } from '@kclub/validation';
import { ERROR_CODES } from '@kclub/contracts';

import { createSupabaseServerClient } from '@/server/auth';
import { jsonSuccess, jsonError, jsonErrorFromUnknown } from '@/server/api';
import { sendPhoneOtp } from '@/server/services';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parseWithValidation(phoneOtpSendSchema, body);

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

    const supabase = await createSupabaseServerClient();
    const result = await sendPhoneOtp(supabase, parsed.data);

    return jsonSuccess(result, undefined, { status: 200 });
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

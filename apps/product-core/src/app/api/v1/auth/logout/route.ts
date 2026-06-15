import { type NextRequest } from 'next/server';

import { createSupabaseServerClient } from '@/server/auth';
import { jsonSuccess, jsonErrorFromUnknown } from '@/server/api';
import { signOutLocal } from '@/server/services';

export async function POST(request: NextRequest) {
  try {
    const { supabase } = createSupabaseServerClient(request);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await signOutLocal(supabase);
    }

    return jsonSuccess({ signedOut: true }, undefined, { status: 200 });
  } catch (error) {
    return jsonErrorFromUnknown(error);
  }
}

import { handleStaffTotpVerify } from '@/server/staff-auth';

export async function POST(request: Request) {
  return handleStaffTotpVerify(request);
}

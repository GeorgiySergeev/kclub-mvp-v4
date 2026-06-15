import { handleStaffOtpVerify } from '@/server/staff-auth';

export async function POST(request: Request) {
  return handleStaffOtpVerify(request);
}

import { handleStaffOtpSend } from '@/server/staff-auth';

export async function POST(request: Request) {
  return handleStaffOtpSend(request);
}

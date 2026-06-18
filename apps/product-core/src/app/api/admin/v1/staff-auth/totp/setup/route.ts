import { handleStaffTotpSetup } from '@/server/staff-auth';

export async function GET(request: Request) {
  return handleStaffTotpSetup(request);
}

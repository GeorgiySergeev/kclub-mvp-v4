import { handleStaffSession } from '@/server/staff-auth';

export async function GET(request: Request) {
  return handleStaffSession(request);
}

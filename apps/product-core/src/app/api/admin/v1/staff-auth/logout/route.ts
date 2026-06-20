import { type NextRequest } from 'next/server';
import { handleStaffLogout } from '@/server/staff-auth';

export async function POST(request: NextRequest) {
  return handleStaffLogout(request);
}

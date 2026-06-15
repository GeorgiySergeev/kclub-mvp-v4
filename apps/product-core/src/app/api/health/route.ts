import { jsonSuccess } from '@/server/api';

export function GET() {
  return jsonSuccess({ status: 'ok', app: 'product-core' });
}

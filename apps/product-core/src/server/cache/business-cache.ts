import { unstable_cache } from 'next/cache';

import {
  getPublicBusinesses as fetchPublicBusinesses,
  getPublicBusinessBySlug as fetchPublicBusinessBySlug,
} from '@/server/services/business-service';

export const getCachedPublicBusinesses = unstable_cache(
  async () => fetchPublicBusinesses(),
  ['public-businesses'],
  {
    revalidate: 60,
    tags: ['businesses', 'public-businesses'],
  },
);

export const getCachedPublicBusinessBySlug = unstable_cache(
  async (slug: string) => fetchPublicBusinessBySlug(slug),
  ['public-business-detail'],
  {
    revalidate: 60,
    tags: ['businesses', 'public-business-detail'],
  },
);

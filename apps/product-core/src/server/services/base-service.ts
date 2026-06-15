import type { RequestContext } from '@/server/context';

export type ServiceDependencies = {
  context: RequestContext;
};

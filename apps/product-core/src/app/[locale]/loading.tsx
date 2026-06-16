import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2
        aria-hidden="true"
        size={32}
        strokeWidth={1.5}
        className="animate-spin text-zinc-300 dark:text-zinc-600"
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

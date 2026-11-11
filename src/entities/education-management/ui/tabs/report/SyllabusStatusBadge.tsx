import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from 'shared/ui';
import { cn } from 'shared/lib/utils';

export type SyllabusReviewStatus = 'under_review' | 'confirmed' | 'revision';

export function normalizeSyllabusStatus(
  input?: string | null,
  isVerified?: boolean
): SyllabusReviewStatus {
  if (input === 'under_review' || input === 'confirmed' || input === 'revision') {
    return input;
  }
  return isVerified ? 'confirmed' : 'under_review';
}

export function SyllabusStatusBadge({
  status,
  className,
}: {
  status: SyllabusReviewStatus;
  className?: string;
}) {
  if (status === 'confirmed') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium',
          'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
          className
        )}
      >
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Подтверждено
      </Badge>
    );
  }

  if (status === 'revision') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium',
          'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-400',
          className
        )}
      >
        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
        На доработку
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium',
        'border-amber-500/25 bg-amber-500/10 text-amber-800 dark:text-amber-400',
        className
      )}
    >
      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
      В рассмотрении
    </Badge>
  );
}

/** @deprecated используйте SyllabusStatusBadge */
export const SyllabusVerificationBadge = SyllabusStatusBadge;

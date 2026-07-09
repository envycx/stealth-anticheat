'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';

interface CounterAnimationProps {
  target: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

/**
 * Displays an animated count-up number driven by the useCountUp hook.
 * Renders `{prefix}{count}{suffix}` where the count smoothly increments
 * from 0 to `target` when mounted.
 */
export function CounterAnimation({
  target,
  suffix,
  prefix,
  className,
}: CounterAnimationProps) {
  const count = useCountUp(target);

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

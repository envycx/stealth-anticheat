import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'default' && 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
        variant === 'info' && 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20',
        variant === 'success' && 'bg-green-500/10 text-green-400 border border-green-500/20',
        variant === 'warning' && 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
        variant === 'danger' && 'bg-red-500/10 text-red-400 border border-red-500/20',
        className
      )}
    >
      {children}
    </span>
  );
}

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  glow = false,
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed',
        // Sizes
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        // Variants
        variant === 'primary' &&
          'bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]',
        variant === 'secondary' &&
          'border border-white/20 bg-white/5 text-slate-200 hover:bg-white/10',
        variant === 'ghost' &&
          'text-slate-400 hover:text-slate-200 hover:bg-white/5',
        variant === 'danger' &&
          'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30',
        // Glow modifier for primary
        glow && variant === 'primary' && 'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
        className
      )}
      disabled={isDisabled}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <span
          className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        icon && <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
      )}
      {children}
    </button>
  );
}

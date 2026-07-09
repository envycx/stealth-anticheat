import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...rest }: InputProps) {
  // Generate a stable id for label association if not provided
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 transition-colors',
          'focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 focus:outline-none',
          error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30',
          className
        )}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <p
          id={inputId ? `${inputId}-error` : undefined}
          role="alert"
          className="text-xs text-red-400"
        >
          {error}
        </p>
      )}
    </div>
  );
}

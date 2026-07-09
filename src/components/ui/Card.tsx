import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'highlighted' | 'danger';
  glow?: boolean;
  className?: string;
}

export function Card({ children, variant = 'default', glow = false, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6',
        variant === 'highlighted' && 'border-cyan-500/50 shadow-[0_0_20px_rgba(0,240,255,0.15)]',
        variant === 'danger' && 'border-red-500/50',
        glow && 'shadow-[0_0_30px_rgba(0,240,255,0.2)] border-cyan-500/30',
        className
      )}
    >
      {children}
    </div>
  );
}

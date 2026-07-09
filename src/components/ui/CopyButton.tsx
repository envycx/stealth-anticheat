'use client';

import React from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClipboard } from '@/hooks/useClipboard';

interface CopyButtonProps {
  value: string;
  className?: string;
}

export function CopyButton({ value, className }: CopyButtonProps) {
  const { copied, copy } = useClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40',
        copied && 'text-green-400 hover:text-green-400',
        className
      )}
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
    </button>
  );
}

'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus the dialog on open
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-w-md bg-[#0d0d14] border border-white/10 rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.6)] focus:outline-none',
          className
        )}
      >
        {/* Header */}
        {(title != null) && (
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h2 id="modal-title" className="text-base font-semibold text-slate-100">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-white/5"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Close button when no title */}
        {title == null && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors p-1 rounded-md hover:bg-white/5"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

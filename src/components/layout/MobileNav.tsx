'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Status', href: '/status' },
  { label: 'Docs', href: '/docs' },
  { label: 'Changelog', href: '/changelog' },
];

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-in panel */}
          <motion.nav
            key="panel"
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-72 md:hidden',
              'bg-[#0a0a0f] border-r border-white/10',
              'flex flex-col'
            )}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
              <Link href="/" onClick={onClose}>
                <span className="font-mono text-xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent tracking-widest">
                  STEALTH
                </span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1.5 text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <ul className="space-y-1" role="list">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={onClose}
                      className="block px-3 py-2.5 text-sm text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded-md transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Auth buttons */}
            <div className="px-4 py-6 border-t border-white/10 space-y-3">
              <Link
                href="/auth/login"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 hover:bg-white/10 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/pricing"
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all"
              >
                Get Started
              </Link>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}

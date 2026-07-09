'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { MobileNav } from './MobileNav';

const NAV_LINKS = [
  { label: 'Features', href: '/#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Status', href: '/status' },
  { label: 'Docs', href: '/docs' },
  { label: 'Changelog', href: '/changelog' },
];

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0f]/80 border-b border-white/10',
          className
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <span className="font-mono text-xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent tracking-widest">
                STEALTH
              </span>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm text-slate-400 hover:text-slate-100 transition-colors rounded-md hover:bg-white/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 px-3 py-1.5 text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 px-3 py-1.5 text-sm bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

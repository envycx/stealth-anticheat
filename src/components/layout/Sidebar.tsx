'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Download,
  Key,
  Code2,
  Users,
  Settings,
  HelpCircle,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAVIGATION_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Downloads', href: '/dashboard/downloads', icon: Download },
  { label: 'License', href: '/dashboard/license', icon: Key },
  { label: 'API Keys', href: '/dashboard/api-keys', icon: Code2 },
  { label: 'Team', href: '/dashboard/team', icon: Users },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Support', href: '/dashboard/support', icon: HelpCircle },
  { label: 'Docs', href: '/docs', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0a0a0f] border-r border-white/10 flex-shrink-0">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="block">
            <span className="font-mono text-xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent tracking-widest">
              STEALTH
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1" aria-label="Dashboard navigation">
          {NAVIGATION_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border-l-2 border-cyan-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} className="flex-shrink-0" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

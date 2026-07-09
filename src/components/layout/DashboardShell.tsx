'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 border-b border-white/10 bg-[#0a0a0f]/95 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-slate-200">Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* User info */}
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-200">
                    {user.username}
                  </p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>

                {/* Logout button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  icon={<LogOut size={16} />}
                  aria-label="Log out"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

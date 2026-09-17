'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardTopBar from '@/components/dashboard/DashboardTopBar';
import { useAuth } from '@/lib/authContext';
import { Lock, LogIn, ArrowRight, Sparkles, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, currentRole, login } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  // If user is not authenticated, display protected route gatekeeper
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface-muted flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface rounded-3xl p-8 border border-surface-border shadow-float text-center space-y-5 animate-in fade-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-[#0A2540]">Authentication Required</h2>
            <p className="text-xs text-ink-muted leading-relaxed">
              This role dashboard is protected. Please sign in with your institutional credentials or choose a quick demo persona to continue.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-full py-3 rounded-xl bg-[#0A2540] hover:bg-[#1E3A8A] text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Access Dashboard</span>
            </Link>

            <Link
              href="/"
              className="w-full inline-block text-center py-2.5 rounded-xl border border-surface-border bg-surface hover:bg-surface-subtle text-xs font-semibold text-ink-muted hover:text-ink transition-colors"
            >
              Return to Public Home Page
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Strict Role Isolation Guard: Students cannot access administrative dashboards
  const isAdminPath = pathname.includes('/dashboard/super-admin') ||
                      pathname.includes('/dashboard/faculty-coordinator') ||
                      pathname.includes('/dashboard/club-admin') ||
                      pathname.includes('/dashboard/department-admin');

  if (currentRole === 'student' && isAdminPath) {
    if (typeof window !== 'undefined') {
      router.replace('/dashboard/student');
    }
    return (
      <div className="min-h-screen bg-surface-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface-muted text-ink">
      {/* Left Persistent Sidebar matching screenshot */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardTopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


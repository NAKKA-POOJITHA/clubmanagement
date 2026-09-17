'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';

export default function DashboardRootPage() {
  const router = useRouter();
  const { currentRole, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(`/dashboard/${currentRole.replace('_', '-')}`);
    } else {
      router.replace('/login');
    }
  }, [currentRole, isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-surface-muted flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
        <p className="text-xs font-semibold text-ink-muted">Routing to your stakeholder dashboard...</p>
      </div>
    </div>
  );
}

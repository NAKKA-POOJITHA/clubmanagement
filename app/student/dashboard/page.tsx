'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StudentDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/student');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
    </div>
  );
}

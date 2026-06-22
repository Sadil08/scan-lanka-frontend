'use client';

import { useAuth } from '@/components/AuthProvider';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/** UX guard for admin routes — server still enforces ADMIN + TOTP. */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user.role !== 'ADMIN') {
      router.replace('/');
    }
  }, [loading, user, router, pathname]);

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <main style={{ padding: '2rem', color: 'var(--muted)' }}>Loading admin…</main>
    );
  }
  return <>{children}</>;
}

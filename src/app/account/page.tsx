'use client';

import Link from 'next/link';
import { AuthGuard } from '@/components/AuthGuard';
import { useAuth } from '@/components/AuthProvider';
import { authApi } from '@/lib/auth';
import { SavedAddresses } from '@/components/SavedAddresses';
import { mutedText, pageWrap, primaryButton, textLink } from '@/components/formStyles';

function AccountContent() {
  const { user, logout } = useAuth();

  if (!user) return null;

  async function logoutEverywhere() {
    await authApi.logoutAll();
    await logout();
  }

  return (
    <main style={pageWrap}>
      <h1 style={{ color: 'var(--primary)' }}>Your account</h1>

      {!user.emailVerified && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: 'var(--bg-muted)',
            borderRadius: 'var(--radius)',
            marginBottom: '1.25rem',
          }}
        >
          <p style={{ margin: 0, ...mutedText }}>
            Verify your email to save your cart and unlock account features.{' '}
            <a href={`/verify-email?email=${encodeURIComponent(user.email)}`} style={textLink}>
              Verify now
            </a>
          </p>
        </div>
      )}

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem' }}>Profile</h2>
        <p style={mutedText}>
          <strong>{user.name ?? 'Customer'}</strong>
          <br />
          {user.email}
          <br />
          Role: {user.role}
        </p>
        <button type="button" onClick={() => void logout()} style={{ ...primaryButton, marginTop: '0.5rem' }}>
          Sign out
        </button>
        <button
          type="button"
          onClick={() => void logoutEverywhere()}
          style={{
            ...primaryButton,
            marginTop: '0.5rem',
            marginLeft: '0.5rem',
            background: 'transparent',
            color: 'var(--primary)',
            border: '1px solid var(--primary)',
          }}
        >
          Sign out everywhere
        </button>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem' }}>Orders</h2>
        <p style={mutedText}>
          <Link href="/account/orders" style={textLink}>
            View order history
          </Link>
          {' · '}
          <Link href="/orders/lookup" style={textLink}>
            Track a guest order
          </Link>
        </p>
      </section>

      {user.emailVerified && <SavedAddresses />}
    </main>
  );
}

export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountContent />
    </AuthGuard>
  );
}

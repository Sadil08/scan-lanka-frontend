'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardView, fetchDashboard } from '@/lib/admin';
import { formatLkr } from '@/lib/money';
import { mutedText, pageWrap } from '@/components/formStyles';

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardView | null>(null);

  useEffect(() => {
    fetchDashboard().then(setData).catch(() => setData(null));
  }, []);

  return (
    <main style={pageWrap}>
      <h1>Dashboard</h1>
      {!data ? (
        <p style={mutedText}>Loading…</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
            <Stat label="Pending payment" value={data.pendingPayment} href="/admin/orders?view=pending_payment" />
            <Stat label="Awaiting bank" value={data.awaitingBank} href="/admin/orders?view=pending_payment" />
            <Stat label="Paid" value={data.paid} href="/admin/orders?view=paid" />
            <Stat label="In fulfilment" value={data.inFulfilment} href="/admin/orders?view=in_fulfilment" />
            <Stat label="Delivered" value={data.delivered} href="/admin/orders?view=delivered" />
            <Stat label="Cancelled" value={data.cancelled} href="/admin/orders?view=cancelled" />
          </div>
          {data.lowStock.length > 0 && (
            <section style={{ marginTop: '2rem' }}>
              <h2 style={{ fontSize: '1.05rem' }}>Low stock</h2>
              <ul>
                {data.lowStock.map((p) => (
                  <li key={p.id}>
                    {p.name} ({p.sku}) — {p.stockQty} left
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}

function Stat({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', textDecoration: 'none', color: 'inherit' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</div>
      <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{label}</div>
    </Link>
  );
}

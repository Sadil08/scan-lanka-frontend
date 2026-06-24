'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { listOrders, OrderSummary } from '@/lib/admin';
import { formatLkr } from '@/lib/money';
import { mutedText, adminMain } from '@/components/formStyles';

const VIEWS = [
  { id: 'pending_payment', label: 'Pending payment' },
  { id: 'paid', label: 'Paid' },
  { id: 'in_fulfilment', label: 'In fulfilment' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
  { id: 'all', label: 'All' },
];

export default function AdminOrdersPage() {
  const params = useSearchParams();
  const view = params.get('view') ?? 'all';
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<OrderSummary[]>([]);

  useEffect(() => {
    listOrders(view, q || undefined).then((p) => setRows(p.content)).catch(() => setRows([]));
  }, [view, q]);

  return (
    <main style={adminMain}>
      <h1>Orders</h1>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {VIEWS.map((v) => (
          <Link
            key={v.id}
            href={`/admin/orders?view=${v.id}`}
            style={{
              padding: '0.35rem 0.7rem',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              background: view === v.id ? 'var(--accent)' : 'transparent',
              color: view === v.id ? 'var(--primary-contrast)' : 'inherit',
              textDecoration: 'none',
            }}
          >
            {v.label}
          </Link>
        ))}
      </div>
      <input
        placeholder="Search order #, name, email…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: '100%', maxWidth: 360, padding: '0.5rem', marginBottom: '1rem' }}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th align="left">Order</th>
            <th align="left">Customer</th>
            <th align="left">Status</th>
            <th align="right">Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((o) => (
            <tr key={o.orderNumber} style={{ borderTop: '1px solid var(--border)' }}>
              <td>
                <Link href={`/admin/orders/${encodeURIComponent(o.orderNumber)}`}>{o.orderNumber}</Link>
              </td>
              <td>{o.contactName}</td>
              <td>{o.status}</td>
              <td align="right">{formatLkr(o.totalCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p style={mutedText}>No orders in this view.</p>}
    </main>
  );
}

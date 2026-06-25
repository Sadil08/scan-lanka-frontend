'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { listCustomerOrders, OrderSummary } from '@/lib/admin';
import { formatLkr } from '@/lib/money';
import { adminMain, mutedText } from '@/components/formStyles';

export default function AdminCustomerOrdersPage() {
  const params = useParams<{ customerId: string }>();
  const customerId = Number(params.customerId);
  const [rows, setRows] = useState<OrderSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(customerId)) return;
    listCustomerOrders(customerId)
      .then(setRows)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'));
  }, [customerId]);

  return (
    <main style={adminMain}>
      <p style={mutedText}>
        <Link href="/admin/orders">← Orders</Link>
      </p>
      <h1 className="page-title" style={{ marginTop: 0 }}>
        Customer #{customerId}
      </h1>
      {error ? (
        <p style={{ color: 'var(--danger)' }}>{error}</p>
      ) : rows.length === 0 ? (
        <p style={mutedText}>No orders for this customer.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--surface)' }}>
          <thead>
            <tr>
              <th style={th}>Order</th>
              <th style={th}>Status</th>
              <th style={th}>Total</th>
              <th style={th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.orderNumber} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={td}>
                  <Link href={`/admin/orders/${encodeURIComponent(o.orderNumber)}`}>{o.orderNumber}</Link>
                </td>
                <td style={td}>{o.status}</td>
                <td style={td}>{formatLkr(o.totalCents)}</td>
                <td style={td}>{new Date(o.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

const th = { textAlign: 'left' as const, padding: '0.6rem', color: 'var(--muted)', fontSize: '0.8rem' };
const td = { padding: '0.6rem' };

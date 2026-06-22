'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  bankConfirm,
  bankReject,
  codReceived,
  downloadAdminReceipt,
  getOrder,
  OrderDetail,
  recordDeliveryActual,
  resendReceipt,
  updateItemStatus,
  updateOrderStatus,
} from '@/lib/admin';
import { saveBlob } from '@/lib/admin-notifications';
import { formatLkr } from '@/lib/money';
import { mutedText, pageWrap } from '@/components/formStyles';

const ITEM_STATUSES = ['PENDING', 'PREPARING', 'PREPARED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const ORDER_STATUSES = ['PACKED', 'SHIPPED', 'READY_FOR_PICKUP', 'COMPLETED', 'CANCELLED'];

export default function AdminOrderDetailPage() {
  const params = useParams();
  const orderNumber = decodeURIComponent(String(params.orderNumber));
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('PACKED');
  const [actualCents, setActualCents] = useState('');
  const [courier, setCourier] = useState('');

  const reload = () => getOrder(orderNumber).then(setOrder).catch(() => setOrder(null));

  useEffect(() => {
    void reload();
  }, [orderNumber]);

  if (!order) {
    return (
      <main style={pageWrap}>
        <p style={mutedText}>Loading…</p>
      </main>
    );
  }

  return (
    <main style={pageWrap}>
      <p>
        <Link href="/admin/orders">← Orders</Link>
      </p>
      <h1>{order.orderNumber}</h1>
      <p style={mutedText}>
        {order.status} · {order.fulfilmentType} · {order.deliveryPayment}
      </p>
      <p>
        {order.contactName} — {order.contactEmail} — {order.contactPhone}
      </p>

      <section style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.05rem' }}>Lines</h2>
        <ul>
          {order.lines.map((l) => (
            <li key={l.id} style={{ marginBottom: '0.5rem' }}>
              {l.name} ({l.sku}) × {l.quantity} — {formatLkr(l.lineTotalCents)}
              <select
                value={l.status}
                onChange={async (e) => {
                  await updateItemStatus(orderNumber, l.id, e.target.value);
                  await reload();
                }}
                style={{ marginLeft: '0.5rem' }}
              >
                {ITEM_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.05rem' }}>Order status</h2>
        <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          style={{ marginLeft: '0.5rem' }}
          onClick={async () => {
            setError(null);
            try {
              await updateOrderStatus(orderNumber, newStatus);
              await reload();
            } catch {
              setError('Status update failed.');
            }
          }}
        >
          Update
        </button>
      </section>

      {order.payment?.method === 'BANK_TRANSFER' && order.payment.slipUrl && (
        <section style={{ marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.05rem' }}>Bank slip</h2>
          <p>
            Status: {order.payment.status} / {order.payment.slipReviewStatus}
          </p>
          <a href={order.payment.slipUrl} target="_blank" rel="noreferrer">
            View slip
          </a>
          <div style={{ marginTop: '0.5rem' }}>
            <button type="button" onClick={() => bankConfirm(orderNumber).then(reload)}>
              Confirm payment
            </button>
            <button type="button" style={{ marginLeft: '0.5rem' }} onClick={() => bankReject(orderNumber).then(reload)}>
              Reject slip
            </button>
          </div>
        </section>
      )}

      {order.deliveryPayment === 'COD' && (
        <section style={{ marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.05rem' }}>COD</h2>
          <p>Estimated delivery: {formatLkr(order.deliveryCodCents)}</p>
          <button type="button" onClick={() => codReceived(orderNumber).then(reload)}>
            Mark COD received
          </button>
        </section>
      )}

      <section style={{ marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.05rem' }}>Actual delivery cost</h2>
        <input
          placeholder="Actual cents"
          value={actualCents}
          onChange={(e) => setActualCents(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <input placeholder="Courier" value={courier} onChange={(e) => setCourier(e.target.value)} />
        <button
          type="button"
          style={{ marginLeft: '0.5rem' }}
          onClick={async () => {
            await recordDeliveryActual(orderNumber, Number(actualCents), courier);
            await reload();
          }}
        >
          Save
        </button>
        {order.actualDeliveryCents != null && (
          <p style={mutedText}>
            Recorded: {formatLkr(order.actualDeliveryCents)}
            {order.deliveryCourier ? ` via ${order.deliveryCourier}` : ''}
          </p>
        )}
      </section>

      <section style={{ marginTop: '1rem' }}>
        <button
          type="button"
          onClick={async () => {
            const blob = await downloadAdminReceipt(orderNumber);
            saveBlob(blob, `SL-${orderNumber}-receipt.pdf`);
          }}
        >
          Download receipt PDF
        </button>
        <button type="button" style={{ marginLeft: '0.5rem' }} onClick={() => resendReceipt(orderNumber)}>
          Resend receipt email
        </button>
      </section>

      {order.timeline.length > 0 && (
        <section style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1.05rem' }}>Timeline</h2>
          <ul style={{ color: 'var(--muted)', paddingLeft: '1.2rem' }}>
            {order.timeline.map((e) => (
              <li key={e.at + e.toStatus}>
                {new Date(e.at).toLocaleString()} — {e.toStatus}
                {e.note ? ` (${e.note})` : ''}
              </li>
            ))}
          </ul>
        </section>
      )}

      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
    </main>
  );
}

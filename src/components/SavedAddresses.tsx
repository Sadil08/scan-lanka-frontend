'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  createAddress,
  deleteAddress,
  listAddresses,
  SavedAddress,
} from '@/lib/addresses';
import { dangerText, fieldInput, formStack, mutedText, primaryButton } from '@/components/formStyles';

export function SavedAddresses() {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: '',
    street: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    email: '',
    isDefault: false,
  });

  function refresh() {
    return listAddresses()
      .then(setAddresses)
      .catch(() => setAddresses([]));
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function onAdd(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createAddress(form);
      setForm({
        label: '',
        street: '',
        city: '',
        province: '',
        postalCode: '',
        phone: '',
        email: '',
        isDefault: false,
      });
      await refresh();
    } catch {
      setError('Could not save address. Verify your email is confirmed.');
    }
  }

  return (
    <section>
      <h2 style={{ fontSize: '1.1rem' }}>Saved addresses</h2>
      {loading ? (
        <p style={mutedText}>Loading…</p>
      ) : addresses.length === 0 ? (
        <p style={mutedText}>No saved addresses yet.</p>
      ) : (
        <ul style={{ paddingLeft: '1.2rem' }}>
          {addresses.map((a) => (
            <li key={a.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{a.label ?? 'Address'}</strong>
              {a.isDefault && ' (default)'}
              <br />
              {a.street}, {a.city}, {a.postalCode}
              <button
                type="button"
                onClick={() => void deleteAddress(a.id).then(refresh)}
                style={{ marginLeft: '0.5rem', border: 'none', background: 'none', color: 'var(--danger)', cursor: 'pointer' }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={onAdd} style={{ ...formStack, marginTop: '1rem' }}>
        <input style={fieldInput} placeholder="Label (e.g. Home)" value={form.label}
          onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} />
        <input style={fieldInput} placeholder="Street" value={form.street} required
          onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))} />
        <input style={fieldInput} placeholder="City" value={form.city} required
          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} />
        <input style={fieldInput} placeholder="Province" value={form.province} required
          onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))} />
        <input style={fieldInput} placeholder="Postal code" value={form.postalCode} required
          onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))} />
        <input style={fieldInput} placeholder="Phone" value={form.phone} required
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        <input style={fieldInput} type="email" placeholder="Email" value={form.email} required
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <label>
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
          />{' '}
          Default address
        </label>
        {error && <p style={dangerText}>{error}</p>}
        <button style={primaryButton} type="submit">
          Save address
        </button>
      </form>
    </section>
  );
}

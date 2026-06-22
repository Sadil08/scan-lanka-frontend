'use client';

import { useEffect, useState } from 'react';
import { getSettings, putSettings, SettingsView } from '@/lib/admin';
import { pageWrap } from '@/components/formStyles';

export default function AdminSettingsPage() {
  const [s, setS] = useState<SettingsView | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    getSettings().then(setS).catch(() => setS(null));
  }, []);

  if (!s) {
    return (
      <main style={pageWrap}>
        <p>Loading…</p>
      </main>
    );
  }

  return (
    <main style={pageWrap}>
      <h1>Store settings</h1>
      {msg && <p>{msg}</p>}
      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        <input type="checkbox" checked={s.codEnabled} onChange={(e) => setS({ ...s, codEnabled: e.target.checked })} />
        {' '}COD enabled
      </label>
      <label style={{ display: 'block', marginBottom: '0.5rem' }}>
        <input
          type="checkbox"
          checked={s.bankTransferEnabled}
          onChange={(e) => setS({ ...s, bankTransferEnabled: e.target.checked })}
        />
        {' '}Bank transfer enabled
      </label>
      <textarea
        placeholder="Bank account details (shown to customers)"
        value={s.bankAccountDetails}
        onChange={(e) => setS({ ...s, bankAccountDetails: e.target.value })}
        style={{ width: '100%', minHeight: 80, marginBottom: '0.5rem' }}
      />
      <input
        placeholder="WhatsApp (local)"
        value={s.whatsappLocal}
        onChange={(e) => setS({ ...s, whatsappLocal: e.target.value })}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <input
        placeholder="WhatsApp (international)"
        value={s.whatsappIntl}
        onChange={(e) => setS({ ...s, whatsappIntl: e.target.value })}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <button
        type="button"
        onClick={async () => {
          await putSettings(s);
          setMsg('Settings saved.');
        }}
      >
        Save
      </button>
    </main>
  );
}

'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  DeliveryConfigView,
  getDeliveryConfig,
  getTaxConfig,
  listZones,
  putDeliveryConfig,
  putTaxConfig,
  TaxConfigView,
  updateZone,
  ZoneView,
} from '@/lib/admin';
import { pageWrap } from '@/components/formStyles';

export default function AdminDeliveryPage() {
  const [zones, setZones] = useState<ZoneView[]>([]);
  const [delivery, setDelivery] = useState<DeliveryConfigView | null>(null);
  const [tax, setTax] = useState<TaxConfigView | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    listZones().then(setZones).catch(() => setZones([]));
    getDeliveryConfig().then(setDelivery).catch(() => setDelivery(null));
    getTaxConfig().then(setTax).catch(() => setTax(null));
  }, []);

  async function saveZone(z: ZoneView, e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      await updateZone(z.id, {
        name: z.name,
        baseChargeCents: z.baseChargeCents,
        perKgChargeCents: z.perKgChargeCents,
        fuelPct: z.fuelPct,
        active: z.active,
        postalCodes: z.postalCodes,
      });
      setMsg('Zone saved.');
      setZones(await listZones());
    } catch {
      setMsg('Save failed (check postal overlap).');
    }
  }

  return (
    <main style={pageWrap}>
      <h1>Delivery & tax</h1>
      {msg && <p>{msg}</p>}

      <section style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.05rem' }}>Zones</h2>
        {zones.map((z) => (
          <form
            key={z.id}
            onSubmit={(e) => saveZone(z, e)}
            style={{ border: '1px solid var(--border)', padding: '1rem', marginBottom: '1rem', borderRadius: 'var(--radius)' }}
          >
            <input
              value={z.name}
              onChange={(e) => setZones((prev) => prev.map((x) => (x.id === z.id ? { ...x, name: e.target.value } : x)))}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <label>
              Base (cents){' '}
              <input
                type="number"
                value={z.baseChargeCents}
                onChange={(e) =>
                  setZones((prev) =>
                    prev.map((x) => (x.id === z.id ? { ...x, baseChargeCents: Number(e.target.value) } : x)),
                  )
                }
              />
            </label>
            <label style={{ marginLeft: '1rem' }}>
              Per kg (cents){' '}
              <input
                type="number"
                value={z.perKgChargeCents}
                onChange={(e) =>
                  setZones((prev) =>
                    prev.map((x) => (x.id === z.id ? { ...x, perKgChargeCents: Number(e.target.value) } : x)),
                  )
                }
              />
            </label>
            <textarea
              value={z.postalCodes.join('\n')}
              onChange={(e) =>
                setZones((prev) =>
                  prev.map((x) =>
                    x.id === z.id ? { ...x, postalCodes: e.target.value.split(/\s+/).filter(Boolean) } : x,
                  ),
                )
              }
              placeholder="Postal codes (one per line)"
              style={{ width: '100%', marginTop: '0.5rem', minHeight: 60 }}
            />
            <button type="submit" style={{ marginTop: '0.5rem' }}>
              Save zone
            </button>
          </form>
        ))}
      </section>

      {delivery && (
        <section>
          <h2 style={{ fontSize: '1.05rem' }}>Pickup surcharges</h2>
          <button
            type="button"
            onClick={async () => {
              await putDeliveryConfig(delivery);
              setMsg('Delivery config saved.');
            }}
          >
            Save delivery config
          </button>
          <pre style={{ fontSize: '0.85rem' }}>{JSON.stringify(delivery, null, 2)}</pre>
        </section>
      )}

      {tax && (
        <section style={{ marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.05rem' }}>Tax</h2>
          <label>
            Rate (bps){' '}
            <input
              type="number"
              value={tax.rateBps}
              onChange={(e) => setTax({ ...tax, rateBps: Number(e.target.value) })}
            />
          </label>
          <button
            type="button"
            style={{ marginLeft: '0.5rem' }}
            onClick={async () => {
              await putTaxConfig(tax);
              setMsg('Tax config saved.');
            }}
          >
            Save tax
          </button>
        </section>
      )}
    </main>
  );
}

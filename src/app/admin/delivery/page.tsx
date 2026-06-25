'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  createZone,
  deleteZone,
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
import { adminMain, fieldInput, mutedText, primaryButton, secondaryButton } from '@/components/formStyles';

const emptyZone = (): ZoneView => ({
  id: 0,
  name: '',
  baseChargeCents: 0,
  perKgChargeCents: 0,
  fuelPct: 0,
  active: true,
  postalCodes: [],
});

export default function AdminDeliveryPage() {
  const [zones, setZones] = useState<ZoneView[]>([]);
  const [delivery, setDelivery] = useState<DeliveryConfigView | null>(null);
  const [tax, setTax] = useState<TaxConfigView | null>(null);
  const [draft, setDraft] = useState<ZoneView>(emptyZone());
  const [msg, setMsg] = useState<string | null>(null);

  async function reload() {
    setZones(await listZones());
    setDelivery(await getDeliveryConfig());
    setTax(await getTaxConfig());
  }

  useEffect(() => {
    reload().catch(() => {});
  }, []);

  async function saveZone(z: ZoneView, e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      const body = {
        name: z.name,
        baseChargeCents: z.baseChargeCents,
        perKgChargeCents: z.perKgChargeCents,
        fuelPct: z.fuelPct,
        active: z.active,
        postalCodes: z.postalCodes,
      };
      await updateZone(z.id, body);
      setMsg('Zone saved.');
      await reload();
    } catch {
      setMsg('Save failed (check postal overlap).');
    }
  }

  async function addZone(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      await createZone({
        name: draft.name,
        baseChargeCents: draft.baseChargeCents,
        perKgChargeCents: draft.perKgChargeCents,
        fuelPct: draft.fuelPct,
        active: draft.active,
        postalCodes: draft.postalCodes,
      });
      setDraft(emptyZone());
      setMsg('Zone created.');
      await reload();
    } catch {
      setMsg('Create failed.');
    }
  }

  return (
    <main style={adminMain}>
      <h1 className="page-title">Delivery & tax</h1>
      {msg && <p>{msg}</p>}

      <section style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '1.05rem' }}>Add zone</h2>
        <form onSubmit={addZone} style={{ border: '1px solid var(--border)', padding: '1rem', borderRadius: 'var(--radius)', marginBottom: '1.5rem' }}>
          <input style={{ ...fieldInput, width: '100%', marginBottom: '0.5rem' }} placeholder="Zone name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} required />
          <label>
            Base (cents){' '}
            <input type="number" value={draft.baseChargeCents} onChange={(e) => setDraft({ ...draft, baseChargeCents: Number(e.target.value) })} />
          </label>
          <label style={{ marginLeft: '1rem' }}>
            Per kg (cents){' '}
            <input type="number" value={draft.perKgChargeCents} onChange={(e) => setDraft({ ...draft, perKgChargeCents: Number(e.target.value) })} />
          </label>
          <textarea
            value={draft.postalCodes.join('\n')}
            onChange={(e) => setDraft({ ...draft, postalCodes: e.target.value.split(/\s+/).filter(Boolean) })}
            placeholder="Postal codes (one per line)"
            style={{ ...fieldInput, width: '100%', marginTop: '0.5rem', minHeight: 60 }}
          />
          <button type="submit" style={{ ...primaryButton, width: 'auto', marginTop: '0.5rem' }}>
            Create zone
          </button>
        </form>

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
              style={{ ...fieldInput, width: '100%', marginBottom: '0.5rem' }}
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
              style={{ ...fieldInput, width: '100%', marginTop: '0.5rem', minHeight: 60 }}
            />
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <button type="submit" style={{ ...primaryButton, width: 'auto' }}>
                Save zone
              </button>
              <button
                type="button"
                style={{ ...secondaryButton, width: 'auto', color: 'var(--danger)' }}
                onClick={async () => {
                  if (!confirm(`Delete zone "${z.name}"?`)) return;
                  await deleteZone(z.id);
                  await reload();
                }}
              >
                Delete
              </button>
            </div>
          </form>
        ))}
      </section>

      {delivery && (
        <section>
          <h2 style={{ fontSize: '1.05rem' }}>Pickup surcharges</h2>
          <div style={{ display: 'grid', gap: '0.5rem', maxWidth: 420 }}>
            {(['pickFirstCents', 'pickNextCents', 'fragileSurchargeCents', 'oversizeSurchargeCents', 'dimDivisor'] as const).map((key) => (
              <label key={key} style={mutedText}>
                {key}{' '}
                <input
                  style={fieldInput}
                  type="number"
                  value={delivery[key]}
                  onChange={(e) => setDelivery({ ...delivery, [key]: Number(e.target.value) })}
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            style={{ ...primaryButton, width: 'auto', marginTop: '0.5rem' }}
            onClick={async () => {
              await putDeliveryConfig(delivery);
              setMsg('Delivery config saved.');
            }}
          >
            Save delivery config
          </button>
        </section>
      )}

      {tax && (
        <section style={{ marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.05rem' }}>Tax</h2>
          <label>
            Rate (bps){' '}
            <input style={fieldInput} type="number" value={tax.rateBps} onChange={(e) => setTax({ ...tax, rateBps: Number(e.target.value) })} />
          </label>
          <label style={{ display: 'block', marginTop: '0.5rem' }}>
            Label{' '}
            <input style={fieldInput} value={tax.label} onChange={(e) => setTax({ ...tax, label: e.target.value })} />
          </label>
          <button
            type="button"
            style={{ ...primaryButton, width: 'auto', marginTop: '0.5rem' }}
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

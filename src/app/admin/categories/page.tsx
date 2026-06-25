'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminCategoryRow, adminListCategories, adminRenameCategory } from '@/lib/admin-catalog';
import { adminMain, fieldInput, mutedText, primaryButton, secondaryButton } from '@/components/formStyles';

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<AdminCategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    try {
      setRows(await adminListCategories());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  function startEdit(name: string) {
    setEditing(name);
    setNewName(name);
    setMsg(null);
  }

  async function saveRename(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const trimmed = newName.trim();
    if (!trimmed) return;
    try {
      const { updated } = await adminRenameCategory(editing, trimmed);
      setMsg(`Renamed “${editing}” → “${trimmed}” on ${updated} product(s).`);
      setEditing(null);
      await reload();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Rename failed');
    }
  }

  return (
    <main style={adminMain}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
        <h1 className="page-title" style={{ margin: 0 }}>
          Categories
        </h1>
        <Link href="/admin/products/new" style={{ ...primaryButton, width: 'auto', textDecoration: 'none' }}>
          + New product
        </Link>
      </div>
      <p style={mutedText}>
        Categories are labels on products. Rename a category here to update every product that uses it. To add a
        category, assign it when creating or editing a product.
      </p>

      {msg && <p>{msg}</p>}
      {loading ? (
        <p style={mutedText}>Loading…</p>
      ) : error ? (
        <p style={{ color: 'var(--danger)' }}>{error}</p>
      ) : rows.length === 0 ? (
        <p style={mutedText}>No categories yet. Add a category on a new product.</p>
      ) : (
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Category</th>
              <th style={th}>Products</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={td}>
                  {editing === r.name ? (
                    <form onSubmit={saveRename} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input style={fieldInput} value={newName} onChange={(e) => setNewName(e.target.value)} required />
                      <button type="submit" style={{ ...primaryButton, width: 'auto', padding: '0.45rem 0.75rem' }}>
                        Save
                      </button>
                      <button type="button" style={{ ...secondaryButton, width: 'auto' }} onClick={() => setEditing(null)}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <Link href={`/products?category=${encodeURIComponent(r.name)}`}>{r.name}</Link>
                  )}
                </td>
                <td style={td}>{r.productCount}</td>
                <td style={td}>
                  {editing !== r.name && (
                    <button type="button" style={secondaryButton} onClick={() => startEdit(r.name)}>
                      Rename
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

const table = { width: '100%', maxWidth: 720, borderCollapse: 'collapse' as const, background: 'var(--surface)', fontSize: '0.9rem' };
const th = { textAlign: 'left' as const, padding: '0.6rem 0.7rem', color: 'var(--muted)', fontWeight: 600, fontSize: '0.8rem' };
const td = { padding: '0.6rem 0.7rem', verticalAlign: 'middle' as const };

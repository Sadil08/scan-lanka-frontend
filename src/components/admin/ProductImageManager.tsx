'use client';

import { useState } from 'react';
import { adminUploadProductImage, adminMediaUrl } from '@/lib/admin-catalog';
import { mutedText, secondaryButton } from '@/components/formStyles';

export function ProductImageManager({
  productId,
  initialUrls,
}: {
  productId: number;
  initialUrls: string[];
}) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [file, setFile] = useState<File | null>(null);
  const [isPreview, setIsPreview] = useState(initialUrls.length === 0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload() {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const stored = await adminUploadProductImage(productId, file, isPreview);
      setUrls((u) => [...u, stored.url]);
      setFile(null);
      setIsPreview(false);
      // reset the file input
      const input = document.getElementById('img-input') as HTMLInputElement | null;
      if (input) input.value = '';
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1rem', background: 'var(--surface)' }}>
      <strong>Images</strong>
      <p style={mutedText}>Images are re-encoded to PNG on upload. Mark one as the preview (shown on cards).</p>

      {urls.length > 0 && (
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', margin: '0.5rem 0' }}>
          {urls.map((u) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={u}
              src={adminMediaUrl(u) ?? ''}
              alt=""
              style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
            />
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <input id="img-input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <label style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.88rem' }}>
          <input type="checkbox" checked={isPreview} onChange={(e) => setIsPreview(e.target.checked)} /> Set as preview
        </label>
        <button type="button" style={{ ...secondaryButton, width: 'auto' }} onClick={upload} disabled={!file || busy}>
          {busy ? 'Uploading…' : 'Upload'}
        </button>
      </div>
      {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>{error}</p>}
    </div>
  );
}

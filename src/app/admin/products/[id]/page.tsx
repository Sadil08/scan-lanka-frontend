'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AdminProductDetail, adminGetProduct, adminListProducts } from '@/lib/admin-catalog';
import { ProductForm } from '@/components/admin/ProductForm';
import { adminMain, mutedText } from '@/components/formStyles';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [product, setProduct] = useState<AdminProductDetail | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(id)) return;
    adminGetProduct(id)
      .then(setProduct)
      .catch((e) => setError(e instanceof Error ? e.message : 'Not found'));
    adminListProducts()
      .then((rows) => setCategories(Array.from(new Set(rows.map((r) => r.category).filter(Boolean))).sort() as string[]))
      .catch(() => setCategories([]));
  }, [id]);

  return (
    <main style={adminMain}>
      <p style={mutedText}>
        <Link href="/admin/products">← Products</Link>
      </p>
      {error ? (
        <p style={{ color: 'var(--danger)' }}>{error}</p>
      ) : !product ? (
        <p style={mutedText}>Loading…</p>
      ) : (
        <>
          <h1 className="page-title" style={{ marginTop: 0 }}>
            {product.name}
          </h1>
          <p style={mutedText}>
            {product.slug} · {product.priceMode === 'VARIANT' ? 'Variant product' : 'Single price'}
            {product.archived ? ' · archived' : ''}
          </p>
          <ProductForm existing={product} categories={categories} />
        </>
      )}
    </main>
  );
}

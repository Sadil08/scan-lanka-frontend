'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminListCategories } from '@/lib/admin-catalog';
import { ProductForm } from '@/components/admin/ProductForm';
import { adminMain, mutedText } from '@/components/formStyles';

export default function NewProductPage() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    adminListCategories()
      .then((rows) => setCategories(rows.map((r) => r.name)))
      .catch(() => setCategories([]));
  }, []);

  return (
    <main style={adminMain}>
      <p style={mutedText}>
        <Link href="/admin/products">← Products</Link>
      </p>
      <h1 className="page-title" style={{ marginTop: 0 }}>
        New product
      </h1>
      <p style={mutedText}>After creating, you’ll be able to add images on the next screen.</p>
      <ProductForm categories={categories} />
    </main>
  );
}

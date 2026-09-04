import { Suspense } from 'react';
import { notFound, permanentRedirect } from 'next/navigation';
import { listProducts, getFacets, getCategoryCounts } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';
import { ProductBrowseToolbar } from '@/components/ProductBrowseToolbar';
import { ProductPagination } from '@/components/ProductPagination';
import { CategoryTiles } from '@/components/CategoryTiles';
import { categoryPath } from '@/lib/categories';

export const revalidate = 60;

export const metadata = {
  title: { absolute: 'Boards & Teaching Equipment | Buy Online | Scan Lanka' },
  description:
    'Shop whiteboards, notice boards, carrom boards and teaching equipment from Sri Lanka’s manufacturer since 1998. Island-wide delivery.',
  alternates: { canonical: '/products' },
};

type SearchParams = {
  q?: string;
  category?: string;
  parentId?: string;
  sort?: string;
  page?: string;
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  // Block schema.org SearchAction template URLs Google sometimes crawls literally.
  if (sp.q && /[{}]/.test(sp.q)) notFound();
  if (sp.category?.trim()) {
    const qs = new URLSearchParams();
    if (sp.q) qs.set('q', sp.q);
    if (sp.parentId) qs.set('parentId', sp.parentId);
    if (sp.sort) qs.set('sort', sp.sort);
    if (sp.page && sp.page !== '0') qs.set('page', sp.page);
    const dest = categoryPath(sp.category);
    permanentRedirect(qs.toString() ? `${dest}?${qs.toString()}` : dest);
  }
  const page = Math.max(0, Number(sp.page ?? 0) || 0);
  const parentId = sp.parentId ? Number(sp.parentId) : undefined;
  const sort = (sp.sort as 'newest' | 'price_asc' | 'price_desc' | 'name') ?? 'newest';

  const [productPage, facets, categoryCounts] = await Promise.all([
    listProducts({
      q: sp.q,
      category: sp.category,
      parentId: Number.isFinite(parentId) ? parentId : undefined,
      sort,
      page,
      size: 24,
    }),
    getFacets(),
    getCategoryCounts(),
  ]);

  const { content: products, totalPages, number } = productPage;
  const hasFilters = Boolean(sp.q || sp.category || sp.parentId);

  return (
    <main className="page">
      <h1 className="page-title">Our Products</h1>
      <p className="page-intro">
        Browse our full range of boards and teaching equipment - manufactured locally, delivered
        island-wide.
      </p>
      <CategoryTiles categories={categoryCounts} active={sp.category} />
      <Suspense fallback={null}>
        <ProductBrowseToolbar
          facets={facets}
          q={sp.q}
          category={sp.category}
          parentId={Number.isFinite(parentId) ? parentId : undefined}
          sort={sort}
        />
      </Suspense>

      {products.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>
          {hasFilters
            ? 'No products match your filters. Try clearing search or choosing a different category.'
            : 'No products yet. Please check back soon.'}
        </p>
      ) : (
        <>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Suspense fallback={null}>
            <ProductPagination page={number} totalPages={totalPages} />
          </Suspense>
        </>
      )}
    </main>
  );
}

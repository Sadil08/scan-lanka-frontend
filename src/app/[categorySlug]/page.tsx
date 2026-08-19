import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { listProducts, getFacets, getCategoryCounts } from '@/lib/catalog';
import { ProductCard } from '@/components/ProductCard';
import { ProductBrowseToolbar } from '@/components/ProductBrowseToolbar';
import { ProductPagination } from '@/components/ProductPagination';
import { CategoryTiles } from '@/components/CategoryTiles';
import { JsonLd } from '@/components/JsonLd';
import { getCategorySeo, isReservedCategorySlug, knownCategorySlugs, resolveCategoryName } from '@/lib/categories';
import { SITE_NAME, siteBase } from '@/lib/site';

export const revalidate = 60;

export function generateStaticParams() {
  return knownCategorySlugs().map((categorySlug) => ({ categorySlug }));
}

type SearchParams = {
  q?: string;
  parentId?: string;
  sort?: string;
  page?: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorySlug: string }>;
}): Promise<Metadata> {
  const { categorySlug } = await params;
  if (isReservedCategorySlug(categorySlug)) return { title: 'Not found' };

  const facets = await getFacets().catch(() => ({ categories: [] as string[], parents: [] }));
  const name = resolveCategoryName(categorySlug, facets.categories);
  if (!name) return { title: 'Not found' };

  const seo = getCategorySeo(name);
  const url = `${siteBase()}/${seo.slug}`;
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: { canonical: url, languages: { 'en-LK': url, 'x-default': url } },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { categorySlug } = await params;
  const sp = await searchParams;
  if (isReservedCategorySlug(categorySlug)) notFound();

  const page = Math.max(0, Number(sp.page ?? 0) || 0);
  const parentId = sp.parentId ? Number(sp.parentId) : undefined;
  const sort = (sp.sort as 'newest' | 'price_asc' | 'price_desc' | 'name') ?? 'newest';

  const [facets, categoryCounts] = await Promise.all([getFacets(), getCategoryCounts()]);
  const name = resolveCategoryName(categorySlug, facets.categories);
  if (!name) notFound();

  const seo = getCategorySeo(name);
  const productPage = await listProducts({
    q: sp.q,
    category: name,
    parentId: Number.isFinite(parentId) ? parentId : undefined,
    sort,
    page,
    size: 24,
  });

  const base = siteBase();
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: base },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${base}/products` },
      { '@type': 'ListItem', position: 3, name: seo.h1, item: `${base}/${seo.slug}` },
    ],
  };

  return (
    <main className="page">
      <JsonLd data={breadcrumbs as Record<string, unknown>} />
      <h1 className="page-title">{seo.h1}</h1>
      <p className="page-intro">{seo.intro}</p>
      <CategoryTiles categories={categoryCounts} active={name} />
      <Suspense fallback={null}>
        <ProductBrowseToolbar
          facets={facets}
          q={sp.q}
          category={name}
          parentId={Number.isFinite(parentId) ? parentId : undefined}
          sort={sort}
        />
      </Suspense>

      {productPage.content.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>
          No products in this category yet. Browse all products or try another category.
        </p>
      ) : (
        <>
          <div className="product-grid">
            {productPage.content.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <Suspense fallback={null}>
            <ProductPagination page={productPage.number} totalPages={productPage.totalPages} />
          </Suspense>
        </>
      )}
    </main>
  );
}

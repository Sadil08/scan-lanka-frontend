'use client';

import Link from 'next/link';
import { HomeBanner, HomeView } from '@/lib/home';
import { ProductCard } from '@/components/ProductCard';
import { mediaUrl } from '@/lib/catalog';

export function HomePageView({ home }: { home: HomeView }) {
  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--primary)' }}>Scan Lanka</h1>
        <p style={{ color: 'var(--muted)', fontSize: '1.1rem' }}>
          Boards &amp; teaching equipment — since 1998.
        </p>
        <Link href="/products" style={cta}>
          Browse all products
        </Link>
      </section>

      {home.banners.length > 0 && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {home.banners.map((b) => (
              <BannerSlide key={b.id} banner={b} />
            ))}
          </div>
        </section>
      )}

      {home.featured.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Featured products</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            {home.featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function BannerSlide({ banner }: { banner: HomeBanner }) {
  const img = mediaUrl(banner.imageUrl);
  const inner = img ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={img} alt="" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 8 }} />
  ) : null;

  if (banner.linkUrl) {
    const external = banner.linkUrl.startsWith('http');
    if (external) {
      return (
        <a href={banner.linkUrl} target="_blank" rel="noreferrer" style={slide}>
          {inner}
        </a>
      );
    }
    return (
      <Link href={banner.linkUrl} style={slide}>
        {inner}
      </Link>
    );
  }
  return <div style={slide}>{inner}</div>;
}

const cta = {
  display: 'inline-block',
  marginTop: '1rem',
  padding: '0.7rem 1.6rem',
  background: 'var(--primary)',
  color: 'var(--primary-contrast)',
  borderRadius: 'var(--radius)',
  textDecoration: 'none',
} as const;

const slide = {
  flex: '0 0 min(100%, 520px)',
  display: 'block',
  textDecoration: 'none',
} as const;

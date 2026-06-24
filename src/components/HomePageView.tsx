'use client';

import Link from 'next/link';
import { HomeBanner, HomeView } from '@/lib/home';
import { ProductCard } from '@/components/ProductCard';
import { mediaUrl } from '@/lib/catalog';

const CATEGORIES = [
  'Whiteboards',
  'Notice Boards',
  'Carrom Boards',
  'Glass Boards',
  'Easel Stands',
  'Menu Boards',
  'Cork Boards',
  'Accessories',
];

const TRUST = [
  { t: 'Since 1998', d: 'Two decades of trusted supply' },
  { t: 'Island-wide delivery', d: 'To homes, schools & offices' },
  { t: 'Quality guaranteed', d: 'Manufacturer-direct pricing' },
  { t: 'Bulk & institutional', d: 'Custom quotes for orders' },
];

export function HomePageView({ home }: { home: HomeView }) {
  return (
    <main>
      {/* Hero */}
      <section style={hero}>
        <div className="container" style={heroInner}>
          <div style={{ flex: '1 1 360px' }}>
            <p style={heroEyebrow}>Scan Lanka Trading Co.</p>
            <h1 style={heroTitle}>Leading Teaching Equipment Supplier in Sri Lanka</h1>
            <p style={heroText}>
              The biggest quality supplier of whiteboards, notice boards, carrom boards and teaching
              equipment — manufactured locally and delivered island-wide since 1998.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link href="/products" className="btn btn-accent">
                Shop all products
              </Link>
              <Link href="/quote" className="btn btn-ghost-light">
                Request a quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={trustGrid}>
          {TRUST.map((x) => (
            <div key={x.t} style={trustItem}>
              <strong style={{ color: 'var(--primary)' }}>{x.t}</strong>
              <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{x.d}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="container" style={{ padding: '2.5rem 1.25rem 3rem' }}>
        {/* Categories */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={sectionHead}>
            <h2 className="section-title">Shop by category</h2>
            <Link href="/products" className="nav-link" style={{ color: 'var(--primary)' }}>
              View all →
            </Link>
          </div>
          <div style={catGrid}>
            {CATEGORIES.map((c) => (
              <Link key={c} href={`/products?category=${encodeURIComponent(c)}`} className="card-hover" style={catCard}>
                <span style={catIcon}>▦</span>
                <span style={{ fontWeight: 600 }}>{c}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Banners */}
        {home.banners.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
              {home.banners.map((b) => (
                <BannerSlide key={b.id} banner={b} />
              ))}
            </div>
          </section>
        )}

        {/* Featured */}
        {home.featured.length > 0 && (
          <section>
            <div style={sectionHead}>
              <h2 className="section-title">Featured products</h2>
              <Link href="/products" className="nav-link" style={{ color: 'var(--primary)' }}>
                Browse all →
              </Link>
            </div>
            <div style={productGrid}>
              {home.featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Quote CTA band */}
      <section style={ctaBand}>
        <div className="container" style={ctaInner}>
          <div>
            <h2 style={{ margin: 0, color: '#fff' }}>Need a bulk or custom order?</h2>
            <p style={{ margin: '0.35rem 0 0', color: '#cfe3ee' }}>
              Schools, offices and resellers — get an institutional quote tailored to you.
            </p>
          </div>
          <Link href="/quote" className="btn btn-accent" style={{ whiteSpace: 'nowrap' }}>
            Request a quote
          </Link>
        </div>
      </section>
    </main>
  );
}

function BannerSlide({ banner }: { banner: HomeBanner }) {
  const img = mediaUrl(banner.imageUrl);
  const inner = img ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={img} alt="" style={{ width: '100%', height: 220, objectFit: 'cover', borderRadius: 'var(--radius)' }} />
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

const hero = {
  background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
  color: '#fff',
} as const;
const heroInner = { display: 'flex', alignItems: 'center', gap: '2rem', padding: '3.5rem 1.25rem', flexWrap: 'wrap' as const };
const heroEyebrow = {
  textTransform: 'uppercase' as const,
  letterSpacing: '1.5px',
  fontSize: '0.8rem',
  color: '#bfe0f0',
  margin: 0,
  fontWeight: 600,
};
const heroTitle = { fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', margin: '0.5rem 0 0.75rem', color: '#fff', maxWidth: 620 } as const;
const heroText = { fontSize: '1.05rem', color: '#dcebf4', maxWidth: 560, margin: 0, lineHeight: 1.7 } as const;

const trustGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1rem',
  padding: '1.25rem',
} as const;
const trustItem = { display: 'flex', flexDirection: 'column' as const, gap: '0.15rem' };

const sectionHead = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: '1.5rem',
  flexWrap: 'wrap' as const,
  gap: '0.5rem',
} as const;

const catGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
  gap: '1rem',
} as const;
const catCard = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.6rem',
  padding: '1.5rem 1rem',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  textDecoration: 'none',
  color: 'var(--text)',
  textAlign: 'center' as const,
  boxShadow: 'var(--shadow)',
};
const catIcon = {
  fontSize: '1.6rem',
  color: 'var(--primary)',
  width: 52,
  height: 52,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--bg-muted)',
  borderRadius: 999,
} as const;

const productGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '1.25rem',
} as const;

const slide = { flex: '0 0 min(100%, 640px)', display: 'block', textDecoration: 'none' } as const;

const ctaBand = { background: 'var(--primary-dark)' } as const;
const ctaInner = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1.5rem',
  padding: '2.5rem 1.25rem',
  flexWrap: 'wrap' as const,
};

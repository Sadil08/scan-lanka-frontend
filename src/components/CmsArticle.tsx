/* eslint-disable react/no-danger */
import { fetchContent } from '@/lib/content';
import { notFound } from 'next/navigation';

export async function CmsArticle({ slug, children }: { slug: string; children?: React.ReactNode }) {
  const page = await fetchContent(slug);
  if (!page) notFound();
  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <h1 style={{ color: 'var(--primary)' }}>{page.title}</h1>
      <article
        style={{ lineHeight: 1.7, color: 'var(--text)' }}
        dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
      />
      {children}
    </main>
  );
}

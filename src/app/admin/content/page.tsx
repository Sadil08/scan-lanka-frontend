'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ContentPage, listContentPages, saveContentPage } from '@/lib/content';
import { mutedText, adminMain, primaryButton, fieldInput } from '@/components/formStyles';

const SLUGS = ['about', 'delivery', 'clientele', 'contact', 'returns', 'privacy', 'terms'];

export default function AdminContentPage() {
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [slug, setSlug] = useState('privacy');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    listContentPages().then((list: ContentPage[]) => {
      setPages(list);
      const current = list.find((p) => p.slug === 'privacy') ?? list[0];
      if (current) {
        setSlug(current.slug);
        setTitle(current.title);
        setBody(current.bodyHtml);
      }
    });
  }, []);

  function select(next: string) {
    setSlug(next);
    const p = pages.find((x) => x.slug === next);
    if (p) {
      setTitle(p.title);
      setBody(p.bodyHtml);
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    await saveContentPage(slug, title, body);
    const list = await listContentPages();
    setPages(list);
  }

  return (
    <main style={adminMain}>
      <h1>Content pages</h1>
      <p style={mutedText}>
        HTML is sanitized on save. Public pages:{' '}
        {SLUGS.map((s) => (
          <Link key={s} href={`/${s}`} style={{ marginRight: '0.5rem' }}>
            /{s}
          </Link>
        ))}
      </p>
      <div style={{ marginBottom: '1rem' }}>
        {SLUGS.map((s) => (
          <button key={s} type="button" onClick={() => select(s)} style={{ marginRight: '0.5rem' }}>
            {s}
          </button>
        ))}
      </div>
      <form onSubmit={onSave}>
        <input style={{ ...fieldInput, width: '100%', marginBottom: '0.5rem' }} value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea
          style={{ ...fieldInput, width: '100%', minHeight: 240 }}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button type="submit" style={{ ...primaryButton, marginTop: '0.5rem' }}>
          Save {slug}
        </button>
      </form>
    </main>
  );
}

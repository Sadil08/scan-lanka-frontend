const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080';

export interface ContentPage {
  slug: string;
  title: string;
  bodyHtml: string;
  updatedAt: string;
}

export async function fetchContent(slug: string): Promise<ContentPage | null> {
  try {
    const res = await fetch(`${API_BASE}/api/content/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export const listContentPages = () =>
  fetch(`${process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080'}/api/admin/content`, {
    credentials: 'include',
  }).then((r) => (r.ok ? r.json() : []));

export const saveContentPage = (slug: string, title: string, bodyHtml: string) =>
  fetch(`${process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080'}/api/admin/content/${encodeURIComponent(slug)}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, bodyHtml }),
  }).then((r) => {
    if (!r.ok) throw new Error('Save failed');
    return r.json();
  });

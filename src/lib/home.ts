import { api } from './api';
import type { ProductChip } from './catalog';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:8080';

export interface HomeBanner {
  id: number;
  imageUrl: string;
  linkUrl: string | null;
  displayOrder: number;
  startsAt: string | null;
  endsAt: string | null;
  active: boolean;
}

export interface HomeView {
  featured: ProductChip[];
  banners: HomeBanner[];
}

export async function fetchHome(): Promise<HomeView> {
  try {
    const res = await fetch(`${API_BASE}/api/home`, { next: { revalidate: 120 } });
    if (!res.ok) return { featured: [], banners: [] };
    return res.json();
  } catch {
    return { featured: [], banners: [] };
  }
}

export interface FeaturedEntry {
  productId: number;
  displayOrder: number;
}

export const listFeatured = () => api<FeaturedEntry[]>('/api/admin/merch/featured');

export const saveFeatured = (items: FeaturedEntry[]) =>
  api<FeaturedEntry[]>('/api/admin/merch/featured', {
    method: 'PUT',
    body: JSON.stringify({ items }),
  });

export const listBanners = () => api<HomeBanner[]>('/api/admin/merch/banners');

export const createBanner = (body: Omit<HomeBanner, 'id'>) =>
  api<HomeBanner>('/api/admin/merch/banners', { method: 'POST', body: JSON.stringify(body) });

export const updateBanner = (id: number, body: Omit<HomeBanner, 'id'>) =>
  api<HomeBanner>(`/api/admin/merch/banners/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const deleteBanner = (id: number) =>
  api<void>(`/api/admin/merch/banners/${id}`, { method: 'DELETE' });

export async function uploadBannerImage(id: number, file: File): Promise<HomeBanner> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/api/admin/merch/banners/${id}/image`, {
    method: 'POST',
    credentials: 'include',
    body: form,
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

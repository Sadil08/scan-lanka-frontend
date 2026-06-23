import { fetchHome } from '@/lib/home';
import { HomePageView } from '@/components/HomePageView';

export const revalidate = 120;

export const metadata = {
  title: 'Scan Lanka — Boards & Teaching Equipment',
  description: 'Manufacturer & supplier of boards and teaching equipment in Sri Lanka since 1998.',
};

export default async function Home() {
  const home = await fetchHome();
  return <HomePageView home={home} />;
}

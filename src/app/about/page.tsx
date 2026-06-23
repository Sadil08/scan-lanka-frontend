import { CmsArticle } from '@/components/CmsArticle';

export const revalidate = 300;

export const metadata = {
  title: 'About Scan Lanka',
  description: 'Scan Lanka Trading Co. — boards and teaching equipment since 1998.',
};

export default function AboutPage() {
  return <CmsArticle slug="about" />;
}

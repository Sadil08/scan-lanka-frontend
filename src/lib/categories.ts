import { HOTLINE } from '@/lib/contactInfo';

/** App routes that must never be treated as a product-category slug. */
const RESERVED = new Set([
  'about',
  'account',
  'admin',
  'api',
  'cart',
  'checkout',
  'clientele',
  'contact',
  'delivery',
  'forgot-password',
  'icon',
  'login',
  'orders',
  'privacy',
  'products',
  'quote',
  'quotes',
  'register',
  'reset-password',
  'returns',
  'robots.txt',
  'sitemap.xml',
  'terms',
  'verify-email',
  'wishlist',
]);

export type CategorySeo = {
  /** Catalog `product.category` value from the API. */
  name: string;
  slug: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
};

function slugify(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (!slug) return 'boards';
  if (RESERVED.has(slug)) return `c-${slug}`;
  return slug;
}

/** Clean storefront paths from the SEO audit, plus extras in the live catalog. */
const OVERRIDES: Record<string, Partial<CategorySeo>> = {
  'White Board': {
    slug: 'whiteboards',
    title: 'White Board Price in Sri Lanka | Buy Online | Scan Lanka',
    description:
      'Whiteboards from Rs 400. Aluminium & wooden frames, sizes 1x1 to 8x4 ft. Made in Sri Lanka since 1998. Island-wide delivery, cash on delivery available.',
    h1: 'White Board Price in Sri Lanka',
    intro:
      'Scan Lanka manufactures white boards in Malabe for classrooms, offices, tuition centres and homes across Sri Lanka. Choose a wall-mounted aluminium-frame board, a magnetic surface, a board with a mobile stand, or a compact A4 writing board. Sizes run from 1×1 ft up to 8×4 ft so you can match a small meeting room or a full lecture hall. Every board is made locally, supplied ready to hang with aluminium hooks, and finished with plastic corner caps. We deliver island-wide from Malabe. Call ' +
      HOTLINE +
      ' if you need a size, stand, or bulk quote for a school or office.',
  },
  'Green Board': {
    slug: 'green-boards',
    title: 'Green Board Price in Sri Lanka | Chalk Boards | Scan Lanka',
    description:
      'Green chalk boards from Rs 520. Aluminium and wooden frames, all sizes, with or without stand. Manufacturer-direct pricing, delivered island-wide.',
    h1: 'Green Board Price in Sri Lanka',
    intro:
      'Green chalk boards are still the standard writing surface in many Sri Lankan schools. Scan Lanka makes melamine green boards in aluminium or pine-wood frames, single-sided or double-sided with a white board on the reverse, and optional rotating stands with caster wheels. Surfaces are made for chalk, with less glare for online teaching on the wooden-frame range. Boards ship ready to hang. Island-wide delivery from our Malabe factory. Ask about classroom packs and Ministry or school orders on ' +
      HOTLINE +
      '.',
  },
  'Black Board': {
    slug: 'black-boards',
    title: 'Black Board Price in Sri Lanka | Chalk Boards | Scan Lanka',
    description:
      'Black chalk boards from Rs 520 in aluminium or wooden frame. Sizes 1x1 to 8x4 ft. Sri Lankan manufacturer since 1998. Island-wide delivery.',
    h1: 'Black Board Price in Sri Lanka',
    intro:
      'Black boards from Scan Lanka are chalk-writing surfaces for schools, tuition classes and studios that prefer a classic dark board. Frames are aluminium or wood, with sizes from small wall boards to large classroom panels. Boards are manufactured in Sri Lanka and supplied with hanging hooks. We deliver across the island from Malabe. For bulk classroom supply, call ' +
      HOTLINE +
      '.',
  },
  'Pin Board / Notice Board': {
    slug: 'notice-boards',
    title: 'Notice Board & Pin Board Price in Sri Lanka | Scan Lanka',
    description:
      'Pin boards, cork boards and combination notice boards from Rs 625. Aluminium and wooden frames for schools and offices. Delivered island-wide.',
    h1: 'Notice Board Price in Sri Lanka',
    intro:
      'Pin boards and cork notice boards are used in Sri Lankan offices, schools, factories and apartment lobbies to display circulars and staff notices. Scan Lanka supplies felt pin boards, cork boards, and combination boards that pair a pin surface with a writing board. Frames are aluminium or pine wood, with metal hooks for hanging. Sizes cover small office boards up to large corridor notices. Made in Sri Lanka since 1998, with island-wide delivery. Call ' +
      HOTLINE +
      ' for institutional quantities.',
  },
  'Glass Writing Board': {
    slug: 'glass-writing-boards',
    title: 'Glass Writing Board Price in Sri Lanka | Scan Lanka',
    description:
      'Tempered glass writing boards for modern offices. Wall-mounted or with stand. Manufacturer-direct pricing and island-wide delivery from Malabe.',
    h1: 'Glass Writing Board Price in Sri Lanka',
    intro:
      'Tempered glass writing boards give offices and meeting rooms a modern dry-erase surface. Scan Lanka glass boards use 6 mm strengthened glass with flat edges and round corners, fixed on stainless-steel studs. They can be installed on partition or gypsum walls as well as masonry. Write with a standard whiteboard marker. Wall-mounted and stand-mounted options are available. Manufactured and delivered in Sri Lanka from Malabe. Call ' +
      HOTLINE +
      ' to confirm size and installation.',
  },
  'Carrom Board': {
    slug: 'carrom-boards',
    title: 'Carrom Board Price in Sri Lanka | Teak & Satin Wood | Scan Lanka',
    description:
      'Tournament, champion and special teak carrom boards from Rs 6,150. Sri Lankan made since 1998. Stands and carrom men available. Island-wide delivery.',
    h1: 'Carrom Board Price in Sri Lanka',
    intro:
      'Scan Lanka has made carrom boards in Sri Lanka since 1998 — tournament, champion, practice, teak, satin wood and baby sizes. Boards are built for home play and club use, with matching stands and carrom men sold separately. We deliver island-wide from Malabe. For a family board or a club order, browse the sizes below or call ' +
      HOTLINE +
      '.',
  },
  Canvas: {
    slug: 'canvas-boards',
    title: 'Canvas Board Price in Sri Lanka | Artist Canvas | Scan Lanka',
    description:
      'Scan canvas boards from Rs 216. Triple-primed 100% cotton canvas on sturdy wood, for acrylic, oil and watercolour. All sizes, delivered island-wide.',
    h1: 'Canvas Board Price in Sri Lanka',
    intro:
      'Scan canvas boards are cotton artist canvases on wood, primed for acrylic, oil and watercolour. They are made in Sri Lanka and sold in a range of sizes for students and studios. Island-wide delivery from Malabe. Call ' +
      HOTLINE +
      ' for class packs.',
  },
  'Flip Chart and Paper Set': {
    slug: 'flip-charts',
    title: 'Flip Chart Price in Sri Lanka | Tripod & Wheels | Scan Lanka',
    description:
      'Tripod flip charts and caster wheel flip charts with paper sets. For training rooms, offices and workshops. Manufacturer-direct, island-wide delivery.',
    h1: 'Flip Chart Price in Sri Lanka',
    intro:
      'Flip chart stands with a writing surface and paper pad are used in Sri Lankan training rooms, hotels and workshops. Scan Lanka supplies tripod and caster-wheel models with a height-adjustable stand and a 2×3 ft writing board. Paper sets are available. Delivered island-wide from Malabe. Call ' +
      HOTLINE +
      ' for training-room packages.',
  },
  'Wooden Easel': {
    slug: 'wooden-easels',
    title: 'Wooden Easel Price in Sri Lanka | Artist Easels | Scan Lanka',
    description:
      'Wooden artist easels from Rs 400. Sri Lankan made, suitable for students and professional artists. Island-wide delivery from Malabe.',
    h1: 'Wooden Easel Price in Sri Lanka',
    intro:
      'Wooden easels from Scan Lanka hold drawing boards, canvases and classroom boards. They are made in Sri Lanka for students, studios and schools. Island-wide delivery. Call ' +
      HOTLINE +
      ' for bulk school orders.',
  },
  'Architectural Drawing Board': {
    slug: 'drawing-boards',
    title: 'Drawing Board Price in Sri Lanka | Architectural | Scan Lanka',
    description:
      'Architectural drawing boards in mahogany and plywood from Rs 3,500. For architecture and engineering students. Delivered island-wide.',
    h1: 'Drawing Board Price in Sri Lanka',
    intro:
      'Architectural drawing boards in mahogany and plywood are made for architecture and engineering students in Sri Lanka. Scan Lanka supplies them manufacturer-direct with island-wide delivery from Malabe. Call ' +
      HOTLINE +
      ' for campus orders.',
  },
  'Mobile Partition': {
    slug: 'mobile-partitions',
    title: 'Mobile Partition Boards Sri Lanka | Office Dividers | Scan Lanka',
    description:
      'Double-sided mobile partition boards, 5x3ft three-panel. Whiteboard, notice board and fabric options for offices and event spaces.',
    h1: 'Mobile Partition Boards Sri Lanka',
    intro:
      'Mobile partition boards divide offices, exam halls and event spaces. Scan Lanka makes three-panel 5×3 ft units, double-sided, as whiteboard, notice board or fabric. They roll into place and fold for storage. Delivered island-wide from Malabe. Call ' +
      HOTLINE +
      ' for layout advice.',
  },
  'Menu Board and Name Tags': {
    slug: 'menu-boards',
    title: 'Menu Board Price in Sri Lanka | Restaurant Boards | Scan Lanka',
    description:
      'Single, double and dual-sided menu boards for restaurants and cafes. Table top displays and name tags. Sri Lankan made, delivered island-wide.',
    h1: 'Menu Board Price in Sri Lanka',
    intro:
      'Restaurant and cafe menu boards — single-sided, double-sided and table-top — are made by Scan Lanka in Sri Lanka. Name tags and display boards are in the same range. Island-wide delivery. Call ' +
      HOTLINE +
      ' for cafe fit-outs.',
  },
  'Dam / Chess Board': {
    slug: 'dam-chess-boards',
    title: 'Dam & Chess Board Price in Sri Lanka | Scan Lanka',
    description:
      'Dam boards and chess boards in standard and teak wood. Made in Sri Lanka since 1998. Island-wide delivery from Malabe.',
    h1: 'Dam and Chess Board Price in Sri Lanka',
    intro:
      'Dam (draughts) boards and chess boards from Scan Lanka are made in Sri Lanka in standard and teak-wood finishes. Suitable for homes, schools and clubs. Island-wide delivery from Malabe. Call ' +
      HOTLINE +
      '.',
  },
  'Key Holder': {
    slug: 'key-holders',
    title: 'Key Holder Price in Sri Lanka | Scan Lanka',
    description:
      'Wall key holders made in Sri Lanka by Scan Lanka. Practical office and home organisers, delivered island-wide.',
    h1: 'Key Holder Price in Sri Lanka',
    intro:
      'Wall-mounted key holders from Scan Lanka keep office and home keys in one place. Made in Sri Lanka and delivered island-wide. Call ' +
      HOTLINE +
      ' for bulk orders.',
  },
  'Sports Items': {
    slug: 'sports-items',
    title: 'Sports Items Sri Lanka | Scan Lanka Sports',
    description:
      'Sports accessories from Scan Lanka Sports, including carrom and board-game supplies. Island-wide delivery in Sri Lanka.',
    h1: 'Sports Items in Sri Lanka',
    intro:
      'Sports and game accessories from Scan Lanka Sports — strikers, powder, stands and related items — ship island-wide from Malabe. Call ' +
      HOTLINE +
      '.',
  },
};

function fallbackSeo(name: string): CategorySeo {
  const slug = slugify(name);
  return {
    name,
    slug,
    title: `${name} Price in Sri Lanka | Scan Lanka`,
    description: `Buy ${name} from Scan Lanka, Sri Lanka's board manufacturer since 1998. Island-wide delivery. Call ${HOTLINE}.`,
    h1: `${name} Price in Sri Lanka`,
    intro: `${name} from Scan Lanka Trading Co. in Malabe, Sri Lanka. Manufacturer-direct pricing since 1998, with island-wide delivery. Call ${HOTLINE} for sizes, stands and bulk orders.`,
  };
}

export function getCategorySeo(name: string): CategorySeo {
  const n = name.trim();
  const extra = OVERRIDES[n];
  const base = fallbackSeo(n);
  return extra ? { ...base, ...extra, name: n } : base;
}

export function categorySlug(name: string): string {
  return getCategorySeo(name).slug;
}

export function categoryPath(name: string): string {
  return `/${categorySlug(name)}`;
}

export function isReservedCategorySlug(slug: string): boolean {
  return RESERVED.has(slug);
}

const SLUG_TO_NAME: Record<string, string> = {};
for (const name of Object.keys(OVERRIDES)) {
  SLUG_TO_NAME[getCategorySeo(name).slug] = name;
}

export function categoryNameFromSlug(slug: string): string | null {
  if (SLUG_TO_NAME[slug]) return SLUG_TO_NAME[slug];
  return null;
}

/** Resolve a URL slug to a catalog category name using known maps, then live facet names. */
export function resolveCategoryName(slug: string, liveNames: string[]): string | null {
  const known = categoryNameFromSlug(slug);
  if (known) return known;
  const match = liveNames.find((n) => categorySlug(n) === slug);
  return match ?? null;
}

export function knownCategorySlugs(): string[] {
  return Object.values(OVERRIDES)
    .map((o) => o.slug)
    .filter((s): s is string => Boolean(s));
}

export function productImageAlt(name: string, opts?: { index?: number; total?: number }): string {
  const n = name.trim();
  if (opts?.total && opts.total > 1 && opts.index != null) {
    return `${n} product photo ${opts.index + 1} of ${opts.total}`;
  }
  return n;
}

import Link from 'next/link';

export function Footer() {
  return (
    <footer style={footer}>
      <nav style={nav}>
        <Link href="/about" style={link}>About</Link>
        <Link href="/delivery" style={link}>Delivery</Link>
        <Link href="/returns" style={link}>Returns</Link>
        <Link href="/privacy" style={link}>Privacy</Link>
        <Link href="/terms" style={link}>Terms</Link>
        <Link href="/contact" style={link}>Contact</Link>
      </nav>
      <p style={copy}>© {new Date().getFullYear()} Scan Lanka Trading Co.</p>
    </footer>
  );
}

const footer = {
  marginTop: '3rem',
  padding: '2rem 1.5rem',
  borderTop: '1px solid var(--border)',
  textAlign: 'center' as const,
  color: 'var(--muted)',
  fontSize: '0.9rem',
};

const nav = {
  display: 'flex',
  flexWrap: 'wrap' as const,
  justifyContent: 'center',
  gap: '1.25rem',
  marginBottom: '0.75rem',
};

const link = { color: 'var(--muted)', textDecoration: 'none' } as const;

const copy = { margin: 0 };

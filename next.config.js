/** @type {import('next').NextConfig} */

// Security headers: CSP is set per-request in src/middleware.ts (nonce + report-uri).
// Set CSP_ENFORCE=true in production after soak in report-only mode (global/02 §7).

const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;

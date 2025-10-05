import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the correct workspace root to avoid lockfile warnings
  outputFileTracingRoot: __dirname,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_BACKEND_WS_PROTOCOL: process.env.NEXT_PUBLIC_BACKEND_WS_PROTOCOL || 'wss',
    NEXT_PUBLIC_BACKEND_WS_HOST: process.env.NEXT_PUBLIC_BACKEND_WS_HOST || 'urekaibackendpython.onrender.com',
    NEXT_PUBLIC_SHOPIFY_API_KEY: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://urekaibackendpython.onrender.com',
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://urekaibackendpython.onrender.com';
    
    return [
      {
        source: '/v1/:path*',
        destination: `${apiUrl}/v1/:path*`,
      },
      {
        source: '/v2/:path*',
        destination: `${apiBaseUrl}/v2/:path*`,
      },
    ];
  },
  // Enable WebSocket connections
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: [
                {
                  key: 'Cross-Origin-Opener-Policy',
                  value: 'unsafe-none',
                },
                {
                  key: 'Cross-Origin-Embedder-Policy',
                  value: 'unsafe-none',
                },
                {
                  key: 'Cross-Origin-Resource-Policy',
                  value: 'cross-origin',
                },
                // Security headers to prevent data leakage
                {
                  key: 'X-Content-Type-Options',
                  value: 'nosniff',
                },
                {
                  key: 'X-Frame-Options',
                  value: 'DENY',
                },
                {
                  key: 'X-XSS-Protection',
                  value: '1; mode=block',
                },
                {
                  key: 'Referrer-Policy',
                  value: 'strict-origin-when-cross-origin',
                },
                {
                  key: 'Permissions-Policy',
                  value: 'camera=(), microphone=(), geolocation=()',
                },
                // Content Security Policy
                {
                  key: 'Content-Security-Policy',
                  value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://127.0.0.1:10000 https://urekaibackendpython.onrender.com wss://urekaibackendpython.onrender.com https://www.googleapis.com; frame-src 'self' https://accounts.google.com;",
                },
              ],
            },
          ];
        },
};

export default nextConfig;

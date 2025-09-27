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
  async rewrites() {
    return [
      {
        source: '/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/v1/:path*`,
      },
      {
        source: '/v2/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/v2/:path*`,
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
              ],
            },
          ];
        },
};

export default nextConfig;

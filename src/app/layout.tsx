import React from 'react';
import { Inter } from 'next/font/google'
import './global.css'
import Providers from './providers';
import { ConditionalFooter } from '@/layouts/ConditionalFooter';
import '@/styles/theme.css';
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata = {
  title: 'UrekAI - Intelligent Business Analysis',
  description: 'Your intelligent business analyst is here to help you understand your data, uncover insights, and make smarter decisions.',
  keywords: 'business intelligence, AI analysis, data insights, business analytics',
  authors: [{ name: 'UrekAI Team' }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta httpEquiv="Cross-Origin-Opener-Policy" content="unsafe-none" />
        <meta httpEquiv="Cross-Origin-Embedder-Policy" content="unsafe-none" />
        <link rel="icon" href="/favicon.svg" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
        {/* Shopify App Bridge script removed to avoid missing `shop` errors outside embedded context */}
        <script dangerouslySetInnerHTML={{__html: `
          (function() {
            try {
              var saved = localStorage.getItem('theme');
              var theme = saved || 'system';
              var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
              var useDark = theme === 'dark' || (theme === 'system' && prefersDark);
              var doc = document.documentElement;
              if (useDark) doc.classList.add('dark'); else doc.classList.remove('dark');
              doc.setAttribute('data-theme', useDark ? 'dark' : 'light');
            } catch (e) {}
          })();
        `}} />
      </head>
      <body className={`font-sans ${inter.className}`}>
        <Providers>
          {children}
          <ConditionalFooter />
        </Providers>
        {/* Vercel Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}



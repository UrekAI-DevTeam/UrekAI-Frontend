"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/shared/Footer';

export const ConditionalFooter: React.FC = () => {
  const rawPathname = usePathname();
  const pathname = rawPathname ?? '';
  
  // Define public pages that should show the footer
  const publicPages = [
    '/',
    '/solutions',
    '/about',
    '/help',
    '/terms',
    '/privacy',
    '/pricing',
    '/docs'
  ];
  
  // Show footer only on public pages
  const shouldShowFooter = publicPages.includes(pathname);
  
  if (!shouldShowFooter) {
    return null;
  }
  
  return <Footer />;
};

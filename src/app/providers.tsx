"use client";
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function Providers({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string | undefined;
  React.useEffect(() => {
    const handleTheme = () => {
      try { window.location.reload(); } catch {}
    };
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme') {
        try { window.location.reload(); } catch {}
      }
    };
    window.addEventListener('themechange', handleTheme as EventListener);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('themechange', handleTheme as EventListener);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);
  return clientId ? (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  ) : (
    <>{children}</>
  );
}



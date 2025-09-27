"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/state/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    console.log("ProtectedRoute: Checking authentication.");
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("ProtectedRoute: Auth state changed - isLoading:", isLoading, "isAuthenticated:", isAuthenticated);
    if (!isLoading && !isAuthenticated) {
      console.log("ProtectedRoute: Redirecting to home page...");
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-almost-black dark:to-smoky-gray flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blood-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
};
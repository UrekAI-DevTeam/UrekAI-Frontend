"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/shared/Sidebar';
import { SidebarBody, SidebarLink } from '@/components/shared/Sidebar';
import { useAuthStore } from '@/state/authStore';
import { sessionManager } from '@/utils/sessionManager';
import { Home as HomeIcon, BarChart3, MessageSquare, FolderOpen, Brain, User as UserIcon, Settings as SettingsIcon, Menu, X, LogOut, FolderOpen as ProjectsIcon } from 'lucide-react';
// Removed sidebar toggle icons as sidebar auto-expands on hover

// LogoutButton component that adapts to sidebar state
const LogoutButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center group/sidebar py-2 px-3 rounded-lg hover:bg-interactive-hover hover:shadow-sm transition-all duration-200 text-text-secondary hover:text-text-primary justify-center md:justify-start gap-0 md:gap-2"
    >
      <LogOut className="h-5 w-5 flex-shrink-0 text-text-muted group-hover/sidebar:text-primary transition-colors duration-200" />
      {/* <span className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre hidden md:inline-block">
        Logout
      </span> */}
    </button>
  );
};

interface GlobalLayoutProps {
  children: React.ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);
  const { user, logout, isAuthenticated, isLoading, checkAuth, setUser } = useAuthStore();
  const [avatarError, setAvatarError] = useState(false);

  const displayName = (() => {
    const fallback = user?.email ? user.email.split('@')[0] : 'Account';
    if (!user?.name) return fallback;
    if (user.name.trim().toLowerCase() === 'google user') return fallback;
    return user.name;
  })();
  const initial = (displayName || 'A').charAt(0).toUpperCase();

  // Debug logging (dev only)
  if (process.env.NODE_ENV !== 'production') {
    console.log('GlobalLayout render - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'pathname:', pathname, 'hasCheckedAuth:', hasCheckedAuth);
  }

  // Get current page from pathname
  const getCurrentPage = () => {
    if (pathname === '/' || pathname == null) return 'home';
    const path = (pathname || '').split('/').pop() || 'dashboard';
    return path === 'dashboard' ? 'dashboard' : path;
  };

  const [currentPage, setCurrentPage] = useState(getCurrentPage());

  // Update current page when pathname changes
  useEffect(() => {
    setCurrentPage(getCurrentPage());
  }, [pathname]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      if (isMobileDevice) {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check authentication on mount
  useEffect(() => {
    if (!hasCheckedAuth) {
      if (process.env.NODE_ENV !== 'production') console.log('GlobalLayout: Checking authentication...');
      setHasCheckedAuth(true);
      // Only check auth if we're not already authenticated
      if (!isAuthenticated) {
        checkAuth();
      }
    }
  }, [checkAuth, hasCheckedAuth, isAuthenticated]);

  // Listen for cross-tab session changes
  useEffect(() => {
    const unsubscribe = sessionManager.subscribe((sessionData) => {
      if (process.env.NODE_ENV !== 'production') console.log('GlobalLayout: Received session change:', sessionData);
      
      const incomingUser = sessionData && sessionData.isAuthenticated ? sessionData.user : null;
      const currentUser = user;
      const same = (incomingUser?.id ?? null) === (currentUser?.id ?? null);
      if (same) return;

      setUser(incomingUser);
    });

    return unsubscribe;
  }, [setUser, user]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Default to dark theme
      setIsDark(true);
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      console.log('Logout: Starting logout process...');
      await logout();
      console.log('Logout: Logout successful, redirecting to landing page...');
      
      // Force hard refresh to ensure clean state across client caches
      if (typeof window !== 'undefined') {
        window.location.replace('/');
        // Fallback in case replace doesn't fully reload in some browsers
        setTimeout(() => {
          try { window.location.reload(); } catch {}
        }, 50);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, redirect to landing page
      if (typeof window !== 'undefined') {
        window.location.replace('/');
      } else {
        router.push('/');
      }
    }
  };

  const handlePageChange = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleChatSelect = (chat: any, folder?: any) => {
    // Handle chat selection logic
    console.log('Chat selected:', chat, folder);
  };

  // Sidebar auto-expands on hover; no manual toggle buttons required

  // Redirect to home if not authenticated
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') console.log('GlobalLayout: Auth state - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated, 'hasCheckedAuth:', hasCheckedAuth);
    if (hasCheckedAuth && !isLoading && !isAuthenticated) {
      if (process.env.NODE_ENV !== 'production') console.log('GlobalLayout: Redirecting to home page...');
      router.push('/');
    }
  }, [isLoading, isAuthenticated, hasCheckedAuth, router]);

  // Don't show sidebar on landing page
  if (pathname === '/') {
    return <>{children}</>;
  }

  // Show loading state for authenticated pages
  if (isLoading || (!hasCheckedAuth && !isAuthenticated)) {
    if (process.env.NODE_ENV !== 'production') console.log('GlobalLayout: Showing loading state...', 'isLoading:', isLoading, 'hasCheckedAuth:', hasCheckedAuth, 'isAuthenticated:', isAuthenticated);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex transition-colors duration-300 bg-background">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed position for desktop */}
      <div className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'fixed inset-y-0 left-0 z-50'} z-50`}>
        <Sidebar open={isMobile ? sidebarOpen : undefined} setOpen={setSidebarOpen} animate={!isMobile}>
          <SidebarBody className="justify-between gap-2 h-screen">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <div className="mt-8 flex flex-col gap-1">
                {/* Sidebar navigation with theme colors and active states */}
                <SidebarLink 
                  link={{ 
                    label: 'Home', 
                    href: '/', 
                    icon: <HomeIcon className="h-5 w-5" /> 
                  }} 
                  data-active={pathname === '/'}
                />
                <SidebarLink 
                  link={{ 
                    label: 'Dashboard', 
                    href: '/dashboard', 
                    icon: <BarChart3 className="h-5 w-5" /> 
                  }} 
                  data-active={pathname === '/dashboard'}
                />
                <SidebarLink 
                  link={{ 
                    label: 'Chat', 
                    href: '/chat', 
                    icon: <MessageSquare className="h-5 w-5" /> 
                  }} 
                  data-active={pathname === '/chat'}
                />
                <SidebarLink 
                  link={{ 
                    label: 'Projects', 
                    href: '/projects', 
                    icon: <ProjectsIcon className="h-5 w-5" /> 
                  }} 
                  data-active={pathname === '/projects'}
                />
                <SidebarLink 
                  link={{ 
                    label: 'Insights', 
                    href: '/insights', 
                    icon: <Brain className="h-5 w-5" /> 
                  }} 
                  data-active={pathname === '/insights'}
                />
                <SidebarLink 
                  link={{ 
                    label: 'Profile', 
                    href: '/profile', 
                    icon: <UserIcon className="h-5 w-5" /> 
                  }} 
                  data-active={pathname === '/profile'}
                />
                <SidebarLink 
                  link={{ 
                    label: 'Settings', 
                    href: '/settings', 
                    icon: <SettingsIcon className="h-5 w-5" /> 
                  }} 
                  data-active={pathname === '/settings'}
                />
              </div>
            </div>
            <div className="flex-shrink-0 space-y-1 pb-2">
              <SidebarLink 
                link={{ 
                  label: (displayName || 'Account'), 
                  href: '/profile', 
                  icon: (
                    <span className="relative inline-flex items-center justify-center h-7 w-7 rounded-full overflow-hidden bg-gradient-primary text-white shadow-sm ring-1 ring-white/20">
                      {user?.avatar && !avatarError ? (
                        <Image 
                          src={user.avatar}
                          alt={displayName}
                          width={28}
                          height={28}
                          className="object-cover"
                          sizes="28px"
                          referrerPolicy="no-referrer"
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <span className="text-xs font-semibold tracking-wide">{initial}</span>
                      )}
                    </span>
                  ) 
                }} 
                data-active={pathname === '/profile'}
              />
              <LogoutButton onClick={handleLogout} />
            </div>
          </SidebarBody>
        </Sidebar>
      </div>

      {/* Mobile Menu Button */}
      {isMobile && pathname !== '/chat' && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-background-surface border border-border rounded-lg shadow-lg lg:hidden"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      )}

      {/* Main Content (header removed) */}
      <div className={`flex-1 overflow-y-auto transition-all duration-200 ease-in-out ${isMobile ? 'ml-0' : 'ml-[60px] md:ml-[60px]'}`}>
        {children}
      </div>
    </div>
  );
}

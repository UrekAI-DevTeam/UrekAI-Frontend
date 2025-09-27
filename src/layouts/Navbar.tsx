"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Brain, Menu, X, User } from 'lucide-react';
import { Button } from '@/ui/Button';
import { AuthModal } from '@/features/auth/AuthModal';
import { useAuthStore } from '@/state/authStore';

export const Navbar: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
  };

  const handleGetStarted = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleProfileClick = () => {
    router.push('/profile');
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background-surface/10 backdrop-blur-xl border-b border-border shadow-lg' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-sm opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Brain className="relative h-8 w-8 text-text-white" />
              </div>
              <span className="font-bold text-xl text-text-white group-hover:text-primary-bright transition-colors duration-300">
                UrekAI
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/solutions" 
                className="text-text-white/80 hover:text-text-white transition-colors duration-300 font-medium"
              >
                Solutions
              </Link>
              <Link 
                href="/docs" 
                className="text-text-white/80 hover:text-text-white transition-colors duration-300 font-medium"
              >
                Docs
              </Link>
              <Link 
                href="/pricing" 
                className="text-text-white/80 hover:text-text-white transition-colors duration-300 font-medium"
              >
                Pricing
              </Link>
              
              {/* Show profile button if authenticated, otherwise show auth buttons */}
              {isAuthenticated && user ? (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleProfileClick}
                  className="text-text-white/90 hover:text-text-white hover:bg-background-surface/10 border border-border rounded-xl px-6 py-2 font-medium transition-all duration-300 flex items-center space-x-2"
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="h-4 w-4 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span>{user.name}</span>
                </Button>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleSignIn}
                    className="text-text-white/90 hover:text-text-white hover:bg-background-surface/10 border border-border rounded-xl px-6 py-2 font-medium transition-all duration-300"
                  >
                    Sign In
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleGetStarted}
                    className="bg-gradient-primary hover:opacity-90 text-text-white font-semibold rounded-xl px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl text-text-white hover:bg-background-surface/10 transition-colors duration-300"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-background-surface/10 backdrop-blur-xl rounded-2xl border border-border mt-2 p-6 space-y-4">
              <Link 
                href="/solutions" 
                className="block text-text-white/80 hover:text-text-white transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link 
                href="/docs" 
                className="block text-text-white/80 hover:text-text-white transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <Link 
                href="/pricing" 
                className="block text-text-white/80 hover:text-text-white transition-colors duration-300 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                {/* Show profile button if authenticated, otherwise show auth buttons */}
                {isAuthenticated && user ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleProfileClick}
                    className="text-text-white/90 hover:text-text-white hover:bg-background-surface/10 border border-border rounded-xl px-6 py-3 font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    {user.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name}
                        className="h-4 w-4 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span>{user.name}</span>
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        handleSignIn();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-text-white/90 hover:text-text-white hover:bg-background-surface/10 border border-border rounded-xl px-6 py-3 font-medium transition-all duration-300"
                    >
                      Sign In
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        handleGetStarted();
                        setIsMobileMenuOpen(false);
                      }}
                      className="bg-gradient-primary hover:opacity-90 text-text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </>
  );
};
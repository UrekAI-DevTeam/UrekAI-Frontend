"use client";
import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/state/authStore';
import { GoogleLoginButton } from './GoogleLoginButton';
import { googleAuthCallback } from '@/services/api/auth';

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultMode = 'signin' 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });
  const [showPasswordValidation, setShowPasswordValidation] = useState(false);
  const router = useRouter();

  const { login, signup, googleLogin, isLoading } = useAuthStore();

  const validatePassword = (password: string): PasswordValidation => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const isPasswordValid = (validation: PasswordValidation): boolean => {
    return Object.values(validation).every(Boolean);
  };

  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    if (mode === 'signup') {
      const validation = validatePassword(password);
      setPasswordValidation(validation);
      setShowPasswordValidation(password.length > 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Additional password validation for signup
    if (mode === 'signup') {
      const validation = validatePassword(formData.password);
      if (!isPasswordValid(validation)) {
        setErrors({ password: 'Password does not meet all requirements' });
        return;
      }
    }

    try {
      console.log('Auth attempt:', { mode, email: formData.email, isMobile: window.innerWidth < 1024 });
      
      if (mode === 'signin') {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password);
      }
      
      console.log('Auth successful, closing modal and redirecting');
      onClose();
      router.push('/dashboard');
    } catch (error: unknown) {
      console.error('Auth error:', error);
      // Extract error message from Error object
      const message = error instanceof Error 
        ? error.message 
        : 'An error occurred. Please try again.';

      setErrors({ general: message });
    }
  };
    
  // Handle Google OAuth callback on component mount (runs on page load after redirect)
  useEffect(() => {
    const handleCallback = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const storedState = sessionStorage.getItem('oauth_state');
        const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
        
        // Only process if we have OAuth callback params
        if (!code || !state || !storedState || !codeVerifier) {
          return;
        }

        // Validate CSRF protection
        if (state !== storedState) {
          console.error('State mismatch. Possible CSRF attack.');
          sessionStorage.removeItem('oauth_state');
          sessionStorage.removeItem('oauth_code_verifier');
          return;
        }

        try {
          console.log('Processing Google OAuth callback...');
          
          // Exchange code for tokens
          const data = await googleAuthCallback(code, codeVerifier);
          
          // Clean up session storage
          sessionStorage.removeItem('oauth_state');
          sessionStorage.removeItem('oauth_code_verifier');
          
          // Clear query params from URL without reloading
          window.history.replaceState({}, document.title, window.location.pathname);
          
          // Complete login with backend data
          await googleLogin(data);
          
          console.log('Google Login Successful - Redirecting to dashboard');
          
          // Navigate to dashboard after successful login
          router.push('/dashboard');
        } catch (error) {
          console.error('Google login callback error:', error);
          
          // Clean up session storage on error
          sessionStorage.removeItem('oauth_state');
          sessionStorage.removeItem('oauth_code_verifier');
          
          // Show error to user (only if modal is open)
          if (isOpen) {
            setErrors({ general: 'Google login failed. Please try again.' });
          }
        }
    };
    
    handleCallback();
  }, [router, googleLogin, isOpen]);

  // Handle Google login error
  const handleGoogleError = (error: string) => {
    setErrors({ general: error });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background-surface rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-border" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <h2 id="auth-modal-title" className="text-xl sm:text-2xl font-semibold text-text-primary mb-2">
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-text-muted">
            {mode === 'signin' 
              ? 'Sign in to continue to UrekAI' 
              : 'Join UrekAI to start analyzing your data'
            }
          </p>
        </div>

        {errors.general && (
          <div className="bg-error/10 border border-error/20 rounded-xl p-3 mb-4">
            <p className="text-sm text-error">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'signup' && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
              <Input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="!pl-10"
                required
                autoComplete="name"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="!pl-10"
              required
              autoComplete="email"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <Input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className="!pl-10"
              error={errors.password}
              required
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </div>

          {/* Password Validation for Signup */}
          {mode === 'signup' && showPasswordValidation && (
            <div className="bg-background-surface-secondary border border-border rounded-xl p-4 space-y-2">
              <h4 className="text-sm font-medium text-text-primary mb-2">Password Requirements:</h4>
              <div className="space-y-1">
                <div className={`flex items-center text-xs ${
                  passwordValidation.minLength ? 'text-success' : 'text-text-muted'
                }`}>
                  <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center text-xs ${
                    passwordValidation.minLength ? 'bg-success/20 text-success' : 'bg-background-surface-tertiary text-text-muted'
                  }`}>
                    {passwordValidation.minLength ? '✓' : '○'}
                  </span>
                  At least 8 characters
                </div>
                <div className={`flex items-center text-xs ${
                  passwordValidation.hasUppercase ? 'text-success' : 'text-text-muted'
                }`}>
                  <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center text-xs ${
                    passwordValidation.hasUppercase ? 'bg-success/20 text-success' : 'bg-background-surface-tertiary text-text-muted'
                  }`}>
                    {passwordValidation.hasUppercase ? '✓' : '○'}
                  </span>
                  One uppercase letter
                </div>
                <div className={`flex items-center text-xs ${
                  passwordValidation.hasLowercase ? 'text-success' : 'text-text-muted'
                }`}>
                  <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center text-xs ${
                    passwordValidation.hasLowercase ? 'bg-success/20 text-success' : 'bg-background-surface-tertiary text-text-muted'
                  }`}>
                    {passwordValidation.hasLowercase ? '✓' : '○'}
                  </span>
                  One lowercase letter
                </div>
                <div className={`flex items-center text-xs ${
                  passwordValidation.hasNumber ? 'text-success' : 'text-text-muted'
                }`}>
                  <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center text-xs ${
                    passwordValidation.hasNumber ? 'bg-success/20 text-success' : 'bg-background-surface-tertiary text-text-muted'
                  }`}>
                    {passwordValidation.hasNumber ? '✓' : '○'}
                  </span>
                  One number
                </div>
                <div className={`flex items-center text-xs ${
                  passwordValidation.hasSpecialChar ? 'text-success' : 'text-text-muted'
                }`}>
                  <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center text-xs ${
                    passwordValidation.hasSpecialChar ? 'bg-success/20 text-success' : 'bg-background-surface-tertiary text-text-muted'
                  }`}>
                    {passwordValidation.hasSpecialChar ? '✓' : '○'}
                  </span>
                  One special character (!@#$%^&*...)
                </div>
              </div>
              
              {/* Overall Status */}
              <div className={`mt-3 pt-2 border-t border-border text-xs font-medium ${
                isPasswordValid(passwordValidation) ? 'text-success' : 'text-text-muted'
              }`}>
                {isPasswordValid(passwordValidation) ? (
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-success/20 text-success rounded-full mr-2 flex items-center justify-center text-xs">✓</span>
                    Password meets all requirements
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="w-4 h-4 bg-background-surface-tertiary text-text-muted rounded-full mr-2 flex items-center justify-center text-xs">○</span>
                    Password requirements not met
                  </div>
                )}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background-surface text-text-muted">Or continue with</span>
            </div>
          </div>

          <GoogleLoginButton 
            onClose={onClose} 
            onError={handleGoogleError} 
          />
        </div>

        <div className="mt-5 text-center">
          <p className="text-sm text-text-muted">
            {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="ml-1 text-primary hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
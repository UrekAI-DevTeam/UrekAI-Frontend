"use client";
import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/state/authStore';
import { useGoogleLogin, TokenResponse } from '@react-oauth/google';
import { FastAPIAuthError } from '@/types';
import { AxiosError } from 'axios';

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
      const axiosError = error as AxiosError<FastAPIAuthError>;
      const message =
      axiosError.response?.data?.detail || 'An error occurred. Try again.';

      setErrors({ general: message });
    }
  };

  // const handleGoogleLogin = useGoogleLogin({
  //   flow: "auth-code",
  //   onSuccess: async (codeResponse) => {
  //     try {
  //       const authCode = codeResponse.code;   // 👈 this is what you get
  //       await googleLogin(authCode);          // send code to FastAPI backend
  //       onClose();
  //       navigate('/dashboard');
  //     } catch (error: unknown) {
  //       const axiosError = error as AxiosError<FastAPIAuthError>;
  //       const message =
  //         axiosError.response?.data?.detail || "An error occurred. Try again.";

  //       setErrors({ general: message });
  //     }
  //   },
  //   onError: (error: unknown) => {
  //     console.error("Google login error:", error);
  //     setErrors({
  //       general: "An error occurred during Google login. Please try again.",
  //     });
  //   },
  // });

  const handleGoogleLogin = useGoogleLogin({
    flow: 'implicit', // Try implicit flow instead of auth-code
    onSuccess: async (tokenResponse) => {
      try {
        console.log('Google access token received:', tokenResponse.access_token);
        // For implicit flow, we get an access token directly
        await googleLogin(tokenResponse.access_token);
        console.log('Google login completed, closing modal and redirecting...');
        onClose();
        console.log('Modal closed, waiting for auth state to update...');
        // Small delay to ensure auth state is updated
        setTimeout(() => {
          console.log('Pushing to dashboard...');
          router.push('/dashboard');
          console.log('Redirect initiated to dashboard');
        }, 100);
      } catch (error: unknown) {
        console.error('Google login error:', error);
        const axiosError = error as AxiosError<FastAPIAuthError>;
        const message =
          axiosError.response?.data?.detail || 'An error occurred. Try again.';

        setErrors({ general: message });
      }
    },
    onError: (error: unknown) => {
      console.error('Google login error:', error);
      setErrors({ general: 'An error occurred during Google login. Please try again.' });
    },
    // Add configuration for implicit flow
    scope: 'openid email profile',
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background-surface rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative shadow-2xl border border-border">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-text-primary mb-2">
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

          <Button
            variant="secondary"
            className="w-full mt-4"
            onClick={() => handleGoogleLogin()}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
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
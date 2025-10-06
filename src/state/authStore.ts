import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '../types';
import { useChatStore } from './chatStore';
import { useFilesStore } from './filesStore';
import { useArchivedChatsStore } from './archivedChatsStore';
import { useFoldersStore } from './foldersStore';
import { firebaseClient } from '@/utils/firebase/FirebaseClient';
import { sessionManager, SessionData } from '@/utils/sessionManager';

interface AuthStore extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  googleLogin: (profile: User) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateProfile: (user: User) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isFirebaseAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          // Call backend API for authentication
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com'}/v1/api/users/sign-in`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            credentials: 'include', // Important: send/receive cookies
            body: JSON.stringify({ email, password })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Login failed' }));
            throw new Error(errorData.detail || 'Login failed');
          }

          const userData = await response.json();
          
          // Extract user data from backend response
          const user: User = {
            id: userData.id || userData.user_id || Date.now().toString(),
            name: userData.name || userData.username || email.split('@')[0],
            email: userData.email || email,
            avatar: userData.avatar || userData.profile_picture,
            firebase_token: userData.firebase_token
          };
          
          // Update store with authenticated user
          get().setUser(user);
          set({ 
            isFirebaseAuthenticated: true,
            isLoading: false 
          });
          
          // Save session
          sessionManager.saveSession({
            user,
            isAuthenticated: true,
            isFirebaseAuthenticated: true,
            timestamp: Date.now()
          });
        } catch (error) {
          set({ isLoading: false });
          console.error('Login error:', error);
          throw error;
        }
      },

      signup: async (name: string, email: string, password: string, firebase_token?: string) => {
        set({ isLoading: true });
        try {
          // Call backend API for registration
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com'}/v1/api/users/sign-up`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            credentials: 'include', // Important: send/receive cookies
            body: JSON.stringify({ name, email, password, firebase_token })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Signup failed' }));
            throw new Error(errorData.detail || 'Signup failed');
          }

          const userData = await response.json();
          
          // Extract user data from backend response
          const user: User = {
            id: userData.id || userData.user_id || Date.now().toString(),
            name: userData.name || userData.username || name,
            email: userData.email || email,
            avatar: userData.avatar || userData.profile_picture,
            firebase_token: userData.firebase_token || firebase_token
          };
          
          // Update store with authenticated user
          get().setUser(user);
          set({ 
            isFirebaseAuthenticated: true,
            isLoading: false 
          });
          
          // Save session
          sessionManager.saveSession({
            user,
            isAuthenticated: true,
            isFirebaseAuthenticated: true,
            timestamp: Date.now()
          });
        } catch (error) {
          set({ isLoading: false });
          console.error('Signup error:', error);
          throw error;
        }
      },

      googleLogin: async (profile) => {
        set({ isLoading: true });
        try {
          // Display optional message from profile while logging in
          const maybeMessage = (profile as any)?.message;
          if (typeof maybeMessage === 'string' && maybeMessage.trim()) {
            alert(maybeMessage);
          }

          const googleUser: User = {
            id: profile.id || Date.now().toString(),
            name: profile.name || 'Google User',
            email: profile.email || 'user@gmail.com',
            avatar: profile.avatar,
            firebase_token: profile.firebase_token
          };

          // Use setUser to update profile section consistently
          get().setUser(googleUser);
          set({ 
            isFirebaseAuthenticated: true,
            isLoading: false 
          });

          // Note: setUser already saves session; keeping broadcast consistent
          sessionManager.saveSession({
            user: googleUser,
            isAuthenticated: true,
            isFirebaseAuthenticated: true,
            timestamp: Date.now()
          });
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') console.error('Google login: Authentication failed:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          // Call backend to invalidate session (SECURITY FIX)
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com'}/v1/api/users/log-out`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              credentials: 'include' // Send session cookie to be invalidated
            });

            if (!response.ok) {
              console.warn('Backend logout failed:', response.status);
              // Continue with local cleanup even if backend fails
            }
          } catch (backendError) {
            console.error('Backend logout request failed:', backendError);
            // Continue with local cleanup even if backend is unreachable
          }

          // Clear Firebase session
          await firebaseClient.firebaseSignOut();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Always clear local state, even if backend/firebase fails
          set({ user: null, isAuthenticated: false, isFirebaseAuthenticated: false });
          
          // Clear all stores on logout
          useChatStore.getState().chats = {};
          useChatStore.getState().activeChat = null;
          useFilesStore.getState().uploadedFiles = [];
          useFilesStore.getState().attachedFiles = {};
          useFoldersStore.getState().folders = [];
          useFoldersStore.getState().selectedFolderId = null;
          useFoldersStore.getState().expandedFolders = new Set();
          useArchivedChatsStore.getState().archivedChats = [];
          
          // Clear session and broadcast to other tabs
          sessionManager.clearSession();
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          // First check local session
          const session = sessionManager.loadSession();
          
          // If we have a local session, verify it with backend
          if (session && session.isAuthenticated) {
            try {
              // Verify session with backend
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com'}/v1/api/users/check-user`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                credentials: 'include' // Send cookies for verification
              });

              if (response.ok) {
                const userData = await response.json();
                
                // Update user data from backend (in case it changed)
                const user: User = {
                  id: userData.id || userData.user_id || session.user.id,
                  name: userData.name || userData.username || session.user.name,
                  email: userData.email || session.user.email,
                  avatar: userData.avatar || userData.profile_picture || session.user.avatar,
                  firebase_token: userData.firebase_token || session.user.firebase_token
                };
                
                set({ 
                  user, 
                  isAuthenticated: true, 
                  isFirebaseAuthenticated: true, 
                  isLoading: false 
                });
                
                // Update session with fresh data
                sessionManager.saveSession({
                  user,
                  isAuthenticated: true,
                  isFirebaseAuthenticated: true,
                  timestamp: Date.now()
                });
                return;
              } else {
                // Backend rejected session, clear local data
                console.warn('Backend session invalid, clearing local session');
                sessionManager.clearSession();
              }
            } catch (verifyError) {
              console.error('Session verification failed:', verifyError);
              // Network error or backend down - keep local session for now
              // but don't update timestamp (will retry next time)
              set({ 
                user: session.user, 
                isAuthenticated: true, 
                isFirebaseAuthenticated: true, 
                isLoading: false 
              });
              return;
            }
          }
          
          // No valid session, clear auth
          set({ user: null, isAuthenticated: false, isFirebaseAuthenticated: false, isLoading: false });
        } catch (error) {
          console.error('Auth check error:', error);
          // Clear all stores on auth failure
          useChatStore.getState().chats = {};
          useChatStore.getState().activeChat = null;
          useFilesStore.getState().uploadedFiles = [];
          useFilesStore.getState().attachedFiles = {};
          useFoldersStore.getState().folders = [];
          useFoldersStore.getState().selectedFolderId = null;
          useFoldersStore.getState().expandedFolders = new Set();
          useArchivedChatsStore.getState().archivedChats = [];
          set({ user: null, isAuthenticated: false, isFirebaseAuthenticated: false, isLoading: false });
        }
      },

      setUser: (nextUser: User | null) => {
        const prev = get().user;
        const same = (prev?.id ?? null) === (nextUser?.id ?? null);
        if (same && get().isAuthenticated === !!nextUser) return;

        set({ user: nextUser, isAuthenticated: !!nextUser });
        
        if (nextUser) {
          sessionManager.saveSession({
            user: nextUser,
            isAuthenticated: true,
            isFirebaseAuthenticated: true,
            timestamp: Date.now()
          });
        } else {
          const hasSession = !!sessionManager.loadSession();
          if (hasSession) sessionManager.clearSession();
        }
      },
      setLoading: (isLoading: boolean) => set({ isLoading }),
      
      // Update user profile
      updateProfile: async (updatedUser: User) => {
        try {
          // Call backend API to update profile
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://urekaibackendpython.onrender.com'}/v1/api/users/profile`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            credentials: 'include', // Send cookies for auth
            body: JSON.stringify({
              name: updatedUser.name,
              email: updatedUser.email,
              avatar: updatedUser.avatar
            })
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Profile update failed' }));
            throw new Error(errorData.detail || 'Profile update failed');
          }

          const userData = await response.json();
          
          // Update with backend response (in case backend modified data)
          const user: User = {
            id: userData.id || userData.user_id || updatedUser.id,
            name: userData.name || userData.username || updatedUser.name,
            email: userData.email || updatedUser.email,
            avatar: userData.avatar || userData.profile_picture || updatedUser.avatar,
            firebase_token: userData.firebase_token || updatedUser.firebase_token
          };
          
          // Update the store with backend-confirmed data
          get().setUser(user);
          
          console.log('Profile updated successfully:', user);
        } catch (error) {
          console.error('Failed to update profile:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated, 
        isFirebaseAuthenticated: state.isFirebaseAuthenticated 
      }),
      // Add storage configuration for better cross-tab sync
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
          // Broadcast storage change to other tabs
          window.dispatchEvent(new CustomEvent('storage-changed', { 
            detail: { name, value } 
          }));
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
          // Broadcast storage removal to other tabs
          window.dispatchEvent(new CustomEvent('storage-removed', { 
            detail: { name } 
          }));
        },
      },
    }
  )
);
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
  googleLogin: (authCodeOrToken: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
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
          // For now, create a mock user since API is commented out
          const mockUser: User = {
            id: Date.now().toString(),
            name: email.split('@')[0],
            email: email,
          };
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isFirebaseAuthenticated: true,
            isLoading: false 
          });
          
          // Save session and broadcast to other tabs
          sessionManager.saveSession({
            user: mockUser,
            isAuthenticated: true,
            isFirebaseAuthenticated: true,
            timestamp: Date.now()
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          // For now, create a mock user since API is commented out
          const mockUser: User = {
            id: Date.now().toString(),
            name: name,
            email: email,
          };
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isFirebaseAuthenticated: true,
            isLoading: false 
          });
          
          // Save session and broadcast to other tabs
          sessionManager.saveSession({
            user: mockUser,
            isAuthenticated: true,
            isFirebaseAuthenticated: true,
            timestamp: Date.now()
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      googleLogin: async (accessToken: string) => {
        set({ isLoading: true });
        try {
          console.log('Google login: Starting authentication via backend...');

          // Delegate token exchange and profile fetch to backend to respect CSP
          const response = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ access_token: accessToken, redirect_uri: window.location.origin })
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Google authentication failed');
          }

          const data = await response.json();
          const profile = data?.user || data; // normalize

          const googleUser: User = {
            id: profile.id || Date.now().toString(),
            name: profile.name || profile.given_name || 'Google User',
            email: profile.email || 'user@gmail.com',
            avatar: profile.picture,
          };

          set({ 
            user: googleUser, 
            isAuthenticated: true, 
            isFirebaseAuthenticated: true,
            isLoading: false 
          });

          sessionManager.saveSession({
            user: googleUser,
            isAuthenticated: true,
            isFirebaseAuthenticated: true,
            timestamp: Date.now()
          });
        } catch (error) {
          console.error('Google login: Authentication failed:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await firebaseClient.firebaseSignOut();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
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
          // Check session using session manager
          const session = sessionManager.loadSession();
          if (session && session.isAuthenticated) {
            set({ 
              user: session.user, 
              isAuthenticated: true, 
              isFirebaseAuthenticated: true, 
              isLoading: false 
            });
            return;
          }
          
          // If no valid session, clear auth
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

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
        
        if (user) {
          // Save session when user is set
          sessionManager.saveSession({
            user,
            isAuthenticated: true,
            isFirebaseAuthenticated: true,
            timestamp: Date.now()
          });
        } else {
          // Clear session when user is null
          sessionManager.clearSession();
        }
      },
      setLoading: (isLoading: boolean) => set({ isLoading }),
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
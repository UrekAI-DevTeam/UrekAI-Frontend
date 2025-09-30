/**
 * Session Management Utility
 * Handles cross-tab session synchronization and persistence
 */

export interface SessionData {
  user: any;
  isAuthenticated: boolean;
  isFirebaseAuthenticated: boolean;
  timestamp: number;
}

export class SessionManager {
  private static instance: SessionManager;
  private sessionKey = 'ureka-session';
  private listeners: Set<(data: SessionData | null) => void> = new Set();
  private isBroadcasting = false;

  private constructor() {
    this.setupStorageListener();
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Save session data to localStorage and broadcast to other tabs
   */
  public saveSession(data: SessionData): void {
    try {
      if (typeof window === 'undefined') return;
      
      const sessionData = {
        ...data,
        timestamp: Date.now(),
      };
      
      localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
      
      // Broadcast to other tabs
      this.broadcastSessionChange(sessionData);
      
      console.log('SessionManager: Session saved', sessionData);
    } catch (error) {
      console.error('SessionManager: Failed to save session', error);
    }
  }

  /**
   * Load session data from localStorage
   */
  public loadSession(): SessionData | null {
    try {
      if (typeof window === 'undefined') return null;
      
      const sessionData = localStorage.getItem(this.sessionKey);
      if (!sessionData) return null;

      const parsed = JSON.parse(sessionData);
      
      // Check if session is expired (24 hours)
      const isExpired = Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000;
      if (isExpired) {
        this.clearSession();
        return null;
      }

      return parsed;
    } catch (error) {
      console.error('SessionManager: Failed to load session', error);
      return null;
    }
  }

  /**
   * Clear session data and broadcast to other tabs
   */
  public clearSession(): void {
    try {
      if (typeof window === 'undefined') return;
      
      localStorage.removeItem(this.sessionKey);
      this.broadcastSessionChange(null);
      console.log('SessionManager: Session cleared');
    } catch (error) {
      console.error('SessionManager: Failed to clear session', error);
    }
  }

  /**
   * Check if session is valid
   */
  public isSessionValid(): boolean {
    const session = this.loadSession();
    return session !== null && session.isAuthenticated;
  }

  /**
   * Subscribe to session changes
   */
  public subscribe(listener: (data: SessionData | null) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Broadcast session changes to all listeners
   */
  private broadcastSessionChange(data: SessionData | null): void {
    if (this.isBroadcasting) return;
    this.isBroadcasting = true;
    try {
      this.listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error('SessionManager: Error in listener', error);
        }
      });
    } finally {
      this.isBroadcasting = false;
    }
  }

  /**
   * Setup storage event listener for cross-tab synchronization
   */
  private setupStorageListener(): void {
    // Only setup listeners in browser environment
    if (typeof window === 'undefined') return;

    // Listen for storage events from other tabs
    window.addEventListener('storage', (e) => {
      if (e.key === this.sessionKey) {
        console.log('SessionManager: Storage event received', e);
        
        if (e.newValue) {
          try {
            const sessionData = JSON.parse(e.newValue);
            this.broadcastSessionChange(sessionData);
          } catch (error) {
            console.error('SessionManager: Failed to parse storage event', error);
          }
        } else {
          this.broadcastSessionChange(null);
        }
      }
    });

    // Listen for custom events from same tab
    window.addEventListener('session-changed', (e: any) => {
      console.log('SessionManager: Custom session event received', e.detail);
      this.broadcastSessionChange(e.detail);
    });
  }

  /**
   * Broadcast session change to same tab
   */
  public broadcastToSameTab(data: SessionData | null): void {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('session-changed', { detail: data }));
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance();

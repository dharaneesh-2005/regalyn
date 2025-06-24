/**
 * Centralized session management to ensure consistent session IDs across cart operations
 */

const SESSION_KEY = 'cartSessionId';

export class SessionManager {
  private static instance: SessionManager;
  private sessionId: string | null = null;

  private constructor() {
    this.initializeSession();
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  private initializeSession(): void {
    // Try to get existing session ID
    this.sessionId = localStorage.getItem(SESSION_KEY);
    
    if (!this.sessionId) {
      // Generate new session ID
      this.sessionId = this.generateSessionId();
      localStorage.setItem(SESSION_KEY, this.sessionId);
    }
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }

  getSessionId(): string {
    if (!this.sessionId) {
      this.initializeSession();
    }
    return this.sessionId!;
  }

  refreshSession(): string {
    this.sessionId = this.generateSessionId();
    localStorage.setItem(SESSION_KEY, this.sessionId);
    return this.sessionId;
  }

  clearSession(): void {
    this.sessionId = null;
    localStorage.removeItem(SESSION_KEY);
  }
}

export const sessionManager = SessionManager.getInstance();
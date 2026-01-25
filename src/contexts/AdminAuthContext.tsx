import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  sessionTimeout: number;
  resetSessionTimer: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_PIN = import.meta.env.VITE_ADMIN_PIN || '345345'; // Default PIN - in production, this should be stored securely
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTimestamp');
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
    setSessionTimeout(null);
    
    // Log logout securely
    // TODO: Implement proper logging service
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTimestamp');
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
      sessionTimeoutRef.current = null;
    }
    setSessionTimeout(null);
  }, []);

  const startSessionTimer = useCallback(() => {
    if (sessionTimeoutRef.current) {
      clearTimeout(sessionTimeoutRef.current);
    }

    const timeout = setTimeout(() => {
      logout();
    }, SESSION_DURATION);

    sessionTimeoutRef.current = timeout;
    setSessionTimeout(timeout);
  }, [logout]);

  const resetSessionTimer = useCallback(() => {
    if (isAuthenticated) {
      localStorage.setItem('adminAuthTimestamp', Date.now().toString());
      startSessionTimer();
    }
  }, [isAuthenticated, startSessionTimer]);

  // Check for existing session on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuth');
    const storedTimestamp = localStorage.getItem('adminAuthTimestamp');
    
    if (storedAuth === 'true' && storedTimestamp) {
      const timestamp = parseInt(storedTimestamp);
      const now = Date.now();
      
      // Check if session is still valid (within 30 minutes)
      if (now - timestamp < SESSION_DURATION) {
        setIsAuthenticated(true);
        // Start timer inline to avoid dependency issues
        const timeout = setTimeout(() => {
          logout();
        }, SESSION_DURATION - (now - timestamp));
        sessionTimeoutRef.current = timeout;
        setSessionTimeout(timeout);
      } else {
        // Session expired, clear it inline
        localStorage.removeItem('adminAuth');
        localStorage.removeItem('adminAuthTimestamp');
      }
    }
    
    setIsLoading(false);
  }, [logout]);

  // Activity monitoring
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      if (isAuthenticated) {
        localStorage.setItem('adminAuthTimestamp', Date.now().toString());
        // Reset timer inline to avoid dependency issues
        if (sessionTimeoutRef.current) {
          clearTimeout(sessionTimeoutRef.current);
        }
        const timeout = setTimeout(() => {
          logout();
        }, SESSION_DURATION);
        sessionTimeoutRef.current = timeout;
        setSessionTimeout(timeout);
      }
    };

    // Monitor user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [isAuthenticated, logout]);

  // Auto-logout check
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSession = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity >= SESSION_DURATION) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkSession);
  }, [isAuthenticated, lastActivity, logout]);


  const login = async (pin: string): Promise<boolean> => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (pin === ADMIN_PIN) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminAuthTimestamp', Date.now().toString());
        startSessionTimer();
        
        // Log successful login attempt securely
        // TODO: Implement proper logging service
        
        return true;
      } else {
        // Log failed login attempt securely
        // TODO: Implement proper logging service
        return false;
      }
    } catch (error) {
      // Log error securely
      // TODO: Implement proper logging service
      return false;
    }
  };


  const value: AdminAuthContextType = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    sessionTimeout: sessionTimeout ? SESSION_DURATION : 0,
    resetSessionTimer,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export { AdminAuthContext };


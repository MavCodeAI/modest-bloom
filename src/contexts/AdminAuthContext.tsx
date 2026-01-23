import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
  sessionTimeout: number;
  resetSessionTimer: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_PIN = '345345'; // Default 6-digit PIN - in production, this should be stored securely
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTimestamp');
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
    
    // Log logout
    console.log('Admin logout at:', new Date().toISOString());
  }, [sessionTimeout]);

  const clearSession = useCallback(() => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTimestamp');
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
  }, [sessionTimeout]);

  const startSessionTimer = useCallback(() => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }

    const timeout = setTimeout(() => {
      logout();
    }, SESSION_DURATION);

    setSessionTimeout(timeout);
  }, [sessionTimeout, logout]);

  const resetSessionTimer = useCallback(() => {
    if (isAuthenticated) {
      localStorage.setItem('adminAuthTimestamp', Date.now().toString());
      startSessionTimer();
    }
  }, [isAuthenticated, startSessionTimer]);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      const storedAuth = localStorage.getItem('adminAuth');
      const storedTimestamp = localStorage.getItem('adminAuthTimestamp');
      
      if (storedAuth === 'true' && storedTimestamp) {
        const timestamp = parseInt(storedTimestamp);
        const now = Date.now();
        
        // Check if session is still valid (within 30 minutes)
        if (now - timestamp < SESSION_DURATION) {
          setIsAuthenticated(true);
          startSessionTimer();
        } else {
          // Session expired, clear it
          clearSession();
        }
      }
      
      setIsLoading(false);
    };

    checkExistingSession();
  }, [clearSession, startSessionTimer]);

  // Activity monitoring
  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      if (isAuthenticated) {
        resetSessionTimer();
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
  }, [isAuthenticated, resetSessionTimer]);

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
        
        // Log successful login attempt
        console.log('Admin login successful at:', new Date().toISOString());
        
        return true;
      } else {
        // Log failed login attempt
        console.log('Failed admin login attempt at:', new Date().toISOString());
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
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


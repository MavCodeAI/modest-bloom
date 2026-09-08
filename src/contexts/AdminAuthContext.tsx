import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  email: string | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  // Server-side role check (RLS-protected user_roles table)
  const checkAdmin = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    return !error && !!data;
  }, []);

  useEffect(() => {
    let active = true;

    const evaluate = async (userId?: string, userEmail?: string | null) => {
      if (!userId) {
        if (active) {
          setIsAuthenticated(false);
          setEmail(null);
          setIsLoading(false);
        }
        return;
      }
      const admin = await checkAdmin(userId);
      if (active) {
        setIsAuthenticated(admin);
        setEmail(admin ? userEmail ?? null : null);
        setIsLoading(false);
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoading(true);
      // defer supabase calls out of the callback
      setTimeout(() => evaluate(session?.user?.id, session?.user?.email), 0);
    });

    supabase.auth.getSession().then(({ data }) => {
      evaluate(data.session?.user?.id, data.session?.user?.email);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [checkAdmin]);

  const login = useCallback(
    async (loginEmail: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password,
      });

      if (error || !data.user) {
        return { ok: false, error: 'Invalid email or password.' };
      }

      const admin = await checkAdmin(data.user.id);
      if (!admin) {
        await supabase.auth.signOut();
        return { ok: false, error: 'This account does not have admin access.' };
      }

      setIsAuthenticated(true);
      setEmail(data.user.email ?? null);
      return { ok: true };
    },
    [checkAdmin]
  );

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setEmail(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, isLoading, email, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export { AdminAuthContext };

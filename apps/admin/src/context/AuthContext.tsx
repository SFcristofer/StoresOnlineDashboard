import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  tenantId: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchTenantProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchTenantProfile(session.user.id);
      else {
        setTenantId(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchTenantProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('tenant_id')
        .eq('id', userId)
        .maybeSingle(); // Usamos maybeSingle para evitar el error 406 si no existe
      
      if (error) throw error;
      setTenantId(data?.tenant_id || null);
    } catch (e) {
      console.error('Error cargando perfil:', e);
      // Fallback: Si falla, intentamos buscar el primer tenant disponible para no bloquear al usuario
      const { data: fallbackTenant } = await supabase.from('tenants').select('id').limit(1).maybeSingle();
      setTenantId(fallbackTenant?.id || null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, tenantId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};

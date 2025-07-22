import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  cnpj?: string;
  endereco?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  complemento?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  role: 'admin' | 'funcionario' | 'cliente';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: 'admin' | 'funcionario' | 'cliente' | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, nome: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isFuncionario: boolean;
  isCliente: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'funcionario' | 'cliente' | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data.role;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  };

  const refreshAuth = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        
        const [profileData, roleData] = await Promise.all([
          fetchUserProfile(currentSession.user.id),
          fetchUserRole(currentSession.user.id)
        ]);
        
        setProfile(profileData);
        setUserRole(roleData);
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
        setUserRole(null);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const [profileData, roleData] = await Promise.all([
            fetchUserProfile(session.user.id),
            fetchUserRole(session.user.id)
          ]);
          
          setProfile(profileData);
          setUserRole(roleData);
        } else {
          setProfile(null);
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    refreshAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        return { error };
      }

      // Force refresh auth data
      await refreshAuth();
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            nome: nome
          }
        }
      });

      if (error) {
        console.error('Sign up error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Erro",
          description: "Erro ao fazer logout",
          variant: "destructive",
        });
      }
      
      // Clear local state
      setSession(null);
      setUser(null);
      setProfile(null);
      setUserRole(null);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = userRole === 'admin';
  const isFuncionario = userRole === 'funcionario';
  const isCliente = userRole === 'cliente';

  const value = {
    user,
    session,
    profile,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isFuncionario,
    isCliente,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
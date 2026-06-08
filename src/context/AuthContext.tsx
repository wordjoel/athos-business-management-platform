import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthUser, signIn, signOut as authSignOut, getCurrentSession, onAuthStateChange, AUTH_CONFIG, isTokenExpired } from '../lib/auth';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const syncLocalUser = useCallback((userData: AuthUser) => {
    localStorage.setItem('athos_usuario_logado', JSON.stringify({
      email: userData.email,
      nome: userData.nome,
      avatar: userData.avatar,
      telefone: userData.telefone || '',
      cargo: userData.role,
    }));
  }, []);

  const clearLocalUser = useCallback(() => {
    localStorage.removeItem('athos_usuario_logado');
  }, []);

  const checkSession = useCallback(async () => {
    try {
      const savedSession = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
      if (!savedSession) {
        setLoading(false);
        return;
      }

      const sessionData = JSON.parse(savedSession);
      if (!sessionData.access_token || isTokenExpired(sessionData.expires_at)) {
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
        setLoading(false);
        return;
      }

      if (sessionData.isLocal === true) {
        const email = sessionData.email || '';
        const nome = sessionData.user?.user_metadata?.nome || email.split('@')[0];
        const avatar = sessionData.user?.user_metadata?.avatar || 'US';
        const role = sessionData.user?.user_metadata?.role || 'user';
        const permissions = sessionData.user?.user_metadata?.permissions || ['read'];
        const authUser: AuthUser = {
          id: `local-${avatar.toLowerCase()}`,
          email,
          nome,
          avatar,
          role,
          permissions,
        };
        setUser(authUser);
        syncLocalUser(authUser);
        setLoading(false);
        return;
      }

      const session = await getCurrentSession();
      if (session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          nome: session.user.user_metadata?.nome || session.user.email?.split('@')[0] || 'Usuário',
          avatar: session.user.user_metadata?.avatar || 'US',
          telefone: session.user.user_metadata?.telefone || '',
          role: session.user.user_metadata?.role || 'user',
          permissions: session.user.user_metadata?.permissions || ['read'],
        };
        setUser(authUser);
        syncLocalUser(authUser);
      }
    } catch (err) {
      console.error('Erro ao verificar sessão:', err);
    } finally {
      setLoading(false);
    }
  }, [syncLocalUser]);

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        clearLocalUser();
        localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
      } else if (session?.user) {
        const authUser: AuthUser = {
          id: session.user.id,
          email: session.user.email || '',
          nome: session.user.user_metadata?.nome || session.user.email?.split('@')[0] || 'Usuário',
          avatar: session.user.user_metadata?.avatar || 'US',
          telefone: session.user.user_metadata?.telefone || '',
          role: session.user.user_metadata?.role || 'user',
          permissions: session.user.user_metadata?.permissions || ['read'],
        };
        setUser(authUser);
        syncLocalUser(authUser);
      }
    });

    return () => subscription.unsubscribe();
  }, [checkSession, syncLocalUser]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    const { user: authUser, error: authError } = await signIn(email, password);

    if (authError || !authUser) {
      setError(authError || 'Erro ao fazer login');
      setLoading(false);
      return false;
    }

    setUser(authUser);
    syncLocalUser(authUser);
    setLoading(false);
    return true;
  }, [syncLocalUser]);

  const logout = useCallback(async () => {
    setLoading(true);
    await authSignOut();
    setUser(null);
    clearLocalUser();
    setLoading(false);
  }, [clearLocalUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
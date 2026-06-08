import { createClient, User, Session } from '@supabase/supabase-js';
import { useApp } from '../context/AppContext';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ Variáveis de ambiente do Supabase ausentes!');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
  avatar: string;
  telefone?: string;
  role: 'admin' | 'manager' | 'user';
  permissions: string[];
}

export const AUTH_CONFIG = {
  STORAGE_KEY: 'athos_auth_session',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000,
} as const;

const LOCAL_USERS: Array<{ email: string; nome: string; avatar: string; cargo: string; role: 'admin' | 'manager' | 'user'; permissions: string[]; defaultPassword: string }> = [
  { email: 'kleber@athos.com', nome: 'Kleber Duarte', avatar: 'KD', cargo: 'CEO - Chief Executive Officer', role: 'admin', permissions: ['all'], defaultPassword: 'kleber' },
  { email: 'joel@athos.com', nome: 'Joel Oliveira', avatar: 'JO', cargo: 'Diretor Administrativo e Financeiro', role: 'admin', permissions: ['all'], defaultPassword: 'joel123' },
  { email: 'oscar@athos.com', nome: 'Oscar Carvalho', avatar: 'OC', cargo: 'Diretor de Qualidade e Desenvolvimento', role: 'admin', permissions: ['all'], defaultPassword: 'oscar123' },
  { email: 'mauricio@athos.com', nome: 'Mauricio Baro', avatar: 'MB', cargo: 'Diretor de Produtos', role: 'admin', permissions: ['all'], defaultPassword: 'mauricio' },
  { email: 'luiz@athos.com', nome: 'Luiz Victor', avatar: 'LV', cargo: 'Diretor Comercial e Expansão', role: 'admin', permissions: ['all'], defaultPassword: 'luiz123' },
];

function getPassword(email: string, defaultPwd: string): string {
  const saved = localStorage.getItem('athos_local_passwords');
  if (saved) {
    const passwords = JSON.parse(saved);
    return passwords[email] || defaultPwd;
  }
  return defaultPwd;
}

function savePassword(email: string, password: string): void {
  const saved = localStorage.getItem('athos_local_passwords');
  const passwords = saved ? JSON.parse(saved) : {};
  passwords[email] = password;
  localStorage.setItem('athos_local_passwords', JSON.stringify(passwords));
}

export function getLocalUsers() {
  const saved = localStorage.getItem('athos_local_passwords');
  const pwdMap = saved ? JSON.parse(saved) : {};
  return LOCAL_USERS.map(u => ({
    ...u,
    password: pwdMap[u.email] || u.defaultPassword,
  }));
}

export function updatePassword(email: string, newPassword: string): boolean {
  const user = LOCAL_USERS.find(u => u.email === email);
  if (!user) return false;
  savePassword(email, newPassword);
  return true;
}

function buildLocalUserSession(user: AuthUser): Session {
  return {
    access_token: `local_${Date.now()}`,
    refresh_token: `local_refresh_${Date.now()}`,
    expires_at: Math.floor(Date.now() / 1000) + 86400,
    expires_in: 86400,
    token_type: 'bearer',
    user: {
      id: user.id,
      email: user.email,
      app_metadata: {},
      user_metadata: {
        nome: user.nome,
        role: user.role,
        permissions: user.permissions,
        avatar: user.avatar,
        cargo: (LOCAL_USERS.find(u => u.email === user.email)?.cargo) || '',
      },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as User,
  };
}

export async function signIn(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
  // Check all local users (works offline, no Supabase needed)
  const localUser = LOCAL_USERS.find(u => u.email === email);
  if (localUser) {
    const expectedPwd = getPassword(email, localUser.defaultPassword);
    if (password !== expectedPwd) {
      return { user: null, error: 'E-mail ou senha inválidos' };
    }
    const user: AuthUser = {
      id: `local-${localUser.avatar.toLowerCase()}`,
      email: localUser.email,
      nome: localUser.nome,
      avatar: localUser.avatar,
      role: localUser.role,
      permissions: localUser.permissions,
    };
    const session = buildLocalUserSession(user);
    await saveLocalSession(session, user.email);
    return { user, error: null };
  }

  // Fallback to Supabase authentication
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Usuário não encontrado' };
    }

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email || email,
      nome: data.user.user_metadata?.nome || email.split('@')[0],
      avatar: data.user.user_metadata?.avatar || 'US',
      telefone: data.user.user_metadata?.telefone || '',
      role: data.user.user_metadata?.role || 'user',
      permissions: data.user.user_metadata?.permissions || ['read'],
    };

    if (data.session) {
      supabase.auth.setSession(data.session);
    }

    await saveSession(data.session);
    return { user, error: null };
  } catch (err) {
    console.error('Erro na autenticação:', err);
    return { user: null, error: 'Erro ao conectar com o servidor' };
  }
}

export async function signUp(
  email: string,
  password: string,
  nome: string,
  telefone?: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome,
          telefone,
          avatar: nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          role: 'user',
          permissions: ['read'],
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Falha ao criar usuário' };
    }

    // Note: signUp does not immediately return a session, it sends a confirmation email
    // We don't set session here because the user needs to confirm email first
    return { user: null, error: null };
  } catch (err) {
    return { user: null, error: 'Erro ao criar conta' };
  }
}

export async function signOut(): Promise<void> {
  const savedSession = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
  const sessionData = savedSession ? JSON.parse(savedSession) : null;
  const isLocal = sessionData?.isLocal === true;

  if (!isLocal) {
    try {
      await supabase.auth.signOut();
      supabase.auth.setSession(null);
    } catch {
      // Ignore Supabase errors on logout
    }
  }

  clearSession();
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function refreshSession(): Promise<boolean> {
  const { data, error } = await supabase.auth.refreshSession();
  if (error || !data.session) return false;
  supabase.auth.setSession(data.session);
  await saveSession(data.session);
  return true;
}

export function onAuthStateChange(callback: (event: string, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange(callback);
}

async function saveSession(session: Session): Promise<void> {
  const sessionData = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    user: session.user,
    isLocal: false,
  };
  localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(sessionData));
}

async function saveLocalSession(session: Session, email: string): Promise<void> {
  const sessionData = {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at,
    user: session.user,
    isLocal: true,
    email,
  };
  localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(sessionData));
}

function clearSession(): void {
  localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
}

export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  return user.permissions.includes(permission);
}

export function isTokenExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt * 1000;
}
import { createClient, User, Session } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export type UserRole = 'master' | 'admin' | 'gerente' | 'supervisor' | 'operador' | 'financeiro' | 'rh' | 'comercial' | 'juridico' | 'cliente' | 'visualizador';

export interface AuthUser {
  id: string;
  email: string;
  nome: string;
  avatar: string;
  telefone?: string;
  role: UserRole;
  permissions: string[];
}

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  master: 10,
  admin: 9,
  gerente: 8,
  supervisor: 7,
  operador: 6,
  financeiro: 6,
  rh: 6,
  comercial: 6,
  juridico: 6,
  cliente: 3,
  visualizador: 1,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  master: 'Master',
  admin: 'Administrador',
  gerente: 'Gerente',
  supervisor: 'Supervisor',
  operador: 'Operador',
  financeiro: 'Financeiro',
  rh: 'Recursos Humanos',
  comercial: 'Comercial',
  juridico: 'Jurídico',
  cliente: 'Cliente',
  visualizador: 'Visualizador',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  master: 'bg-gradient-to-r from-yellow-500 to-amber-600',
  admin: 'bg-gradient-to-r from-red-500 to-rose-600',
  gerente: 'bg-gradient-to-r from-blue-500 to-indigo-600',
  supervisor: 'bg-gradient-to-r from-purple-500 to-violet-600',
  operador: 'bg-gradient-to-r from-cyan-500 to-teal-600',
  financeiro: 'bg-gradient-to-r from-green-500 to-emerald-600',
  rh: 'bg-gradient-to-r from-pink-500 to-rose-500',
  comercial: 'bg-gradient-to-r from-orange-500 to-amber-500',
  juridico: 'bg-gradient-to-r from-slate-500 to-gray-600',
  cliente: 'bg-gradient-to-r from-sky-500 to-blue-500',
  visualizador: 'bg-gradient-to-r from-gray-400 to-gray-500',
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  master: ['all'],
  admin: ['all'],
  gerente: ['read', 'write', 'manage_team', 'reports', 'approve'],
  supervisor: ['read', 'write', 'manage_team', 'reports'],
  operador: ['read', 'write'],
  financeiro: ['read', 'write', 'finance', 'reports'],
  rh: ['read', 'write', 'people', 'reports'],
  comercial: ['read', 'write', 'crm', 'reports'],
  juridico: ['read', 'write', 'legal', 'contracts'],
  cliente: ['read', 'portal'],
  visualizador: ['read'],
};

export const AUTH_CONFIG = {
  STORAGE_KEY: 'athos_auth_session',
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000,
} as const;

const LOCAL_USERS: Array<{
  email: string;
  nome: string;
  avatar: string;
  cargo: string;
  role: UserRole;
  permissions: string[];
  defaultPassword: string;
}> = [
  { email: 'admin@atos.com.br', nome: 'Administrador', avatar: 'AD', cargo: 'Master do Sistema', role: 'master', permissions: ['all'], defaultPassword: 'admin123' },
  { email: 'joel@atos.com', nome: 'Joel Oliveira', avatar: 'JO', cargo: 'Sócio', role: 'admin', permissions: ['all'], defaultPassword: 'joel123' },
  { email: 'kleber@atos.com', nome: 'Kleber Duarte', avatar: 'KD', cargo: 'Sócio', role: 'admin', permissions: ['all'], defaultPassword: 'kleber123' },
  { email: 'oscar@atos.com', nome: 'Oscar Carvalho', avatar: 'OC', cargo: 'Sócio', role: 'admin', permissions: ['all'], defaultPassword: 'oscar123' },
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
  const cleanEmail = email.trim().toLowerCase();
  const emailPrefix = cleanEmail.split('@')[0];

  const localUser = LOCAL_USERS.find(u => {
    const uEmail = u.email.toLowerCase();
    const uPrefix = uEmail.split('@')[0];
    return uEmail === cleanEmail || uPrefix === emailPrefix;
  });

  if (localUser) {
    const expectedPwd = getPassword(localUser.email, localUser.defaultPassword);
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

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };
    if (!data.user) return { user: null, error: 'Usuário não encontrado' };

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email || email,
      nome: data.user.user_metadata?.nome || email.split('@')[0],
      avatar: data.user.user_metadata?.avatar || 'US',
      telefone: data.user.user_metadata?.telefone || '',
      role: data.user.user_metadata?.role || 'visualizador',
      permissions: data.user.user_metadata?.permissions || ['read'],
    };

    if (data.session) supabase.auth.setSession(data.session);
    await saveSession(data.session);
    return { user, error: null };
  } catch (err) {
    console.error('Erro na autenticação:', err);
    return { user: null, error: 'Erro ao conectar com o servidor' };
  }
}

export async function signUp(email: string, password: string, nome: string, telefone?: string): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { nome, telefone, avatar: nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2), role: 'visualizador', permissions: ['read'] } },
    });
    if (error) return { user: null, error: error.message };
    if (!data.user) return { user: null, error: 'Falha ao criar usuário' };
    return { user: null, error: null };
  } catch {
    return { user: null, error: 'Erro ao criar conta' };
  }
}

export async function signOut(): Promise<void> {
  const savedSession = localStorage.getItem(AUTH_CONFIG.STORAGE_KEY);
  const sessionData = savedSession ? JSON.parse(savedSession) : null;
  const isLocal = sessionData?.isLocal === true;
  if (!isLocal) {
    try { await supabase.auth.signOut(); supabase.auth.setSession(null); } catch {}
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
  const sessionData = { access_token: session.access_token, refresh_token: session.refresh_token, expires_at: session.expires_at, user: session.user, isLocal: false };
  localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(sessionData));
}

async function saveLocalSession(session: Session, email: string): Promise<void> {
  const sessionData = { access_token: session.access_token, refresh_token: session.refresh_token, expires_at: session.expires_at, user: session.user, isLocal: true, email };
  localStorage.setItem(AUTH_CONFIG.STORAGE_KEY, JSON.stringify(sessionData));
}

function clearSession(): void {
  localStorage.removeItem(AUTH_CONFIG.STORAGE_KEY);
}

export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user) return false;
  if (user.permissions.includes('all')) return true;
  return user.permissions.includes(permission);
}

export function hasMinimumRole(user: AuthUser | null, minRole: UserRole): boolean {
  if (!user) return false;
  return (ROLE_HIERARCHY[user.role] || 0) >= (ROLE_HIERARCHY[minRole] || 0);
}

export function canAccess(user: AuthUser | null, requiredRoles: UserRole[]): boolean {
  if (!user) return false;
  if (user.role === 'master' || user.role === 'admin') return true;
  return requiredRoles.includes(user.role);
}

export function isTokenExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt * 1000;
}

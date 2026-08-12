import { supabase } from '../lib/supabase';

// ============================================
// SEED DATA FOR SUPABASE
// ============================================
// Only essential data - no fake/mock data
// ============================================

const defaultUsuarios = [
  {
    email: 'admin@atos.com.br',
    nome: 'Administrador',
    avatar: 'AD',
    cargo: 'Master do Sistema',
    role: 'master',
    permissions: ['all'],
    ativo: true,
  },
  {
    email: 'joel@atos.com',
    nome: 'Joel Oliveira',
    avatar: 'JO',
    cargo: 'Diretor Administrativo e Financeiro',
    role: 'admin',
    permissions: ['all'],
    ativo: true,
  },
  {
    email: 'kleber@atos.com',
    nome: 'Kleber Duarte',
    avatar: 'KD',
    cargo: 'CEO - Chief Executive Officer',
    role: 'admin',
    permissions: ['all'],
    ativo: true,
  },
  {
    email: 'oscar@atos.com',
    nome: 'Oscar Carvalho',
    avatar: 'OC',
    cargo: 'Diretor de Qualidade e Desenvolvimento',
    role: 'gerente',
    permissions: ['read', 'write', 'manage_team', 'reports', 'approve'],
    ativo: true,
  },
];

const defaultContasBancarias = [
  {
    nome: 'Banco do Brasil',
    banco: '001',
    agencia: '1234-5',
    conta: '67890-1',
    tipo: 'corrente',
    saldo_inicial: 50000,
    saldo_atual: 50000,
    ativa: true,
  },
  {
    nome: 'Itaú Unibanco',
    banco: '341',
    agencia: '6789-0',
    conta: '12345-6',
    tipo: 'corrente',
    saldo_inicial: 35000,
    saldo_atual: 35000,
    ativa: true,
  },
  {
    nome: 'Nubank',
    banco: '260',
    agencia: '0001',
    conta: '98765-4',
    tipo: 'poupanca',
    saldo_inicial: 15000,
    saldo_atual: 15000,
    ativa: true,
  },
];

// ============================================
// SEED FUNCTION
// ============================================

export async function seedSupabase(): Promise<{ success: boolean; message: string }> {
  try {
    // Check if data already exists
    const { count: usuariosCount } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true });

    if (usuariosCount && usuariosCount > 0) {
      return { success: true, message: 'Dados já existem no banco' };
    }

    // Seed usuarios
    const { error: usuariosError } = await supabase
      .from('usuarios')
      .insert(defaultUsuarios);

    if (usuariosError) throw usuariosError;

    // Seed contas bancarias
    const { error: contasError } = await supabase
      .from('contas_bancarias')
      .insert(defaultContasBancarias);

    if (contasError) throw contasError;

    return { success: true, message: 'Dados inseridos com sucesso!' };

  } catch (error) {
    console.error('Erro ao popular banco:', error);
    return { success: false, message: `Erro: ${error}` };
  }
}

// ============================================
// MIGRATION FROM LOCALSTORAGE
// ============================================

export async function migrateFromLocalStorage(): Promise<{ success: boolean; migrated: number }> {
  let migrated = 0;

  try {
    // Migrate usuarios
    const usuarios = JSON.parse(localStorage.getItem('athos_usuarios') || '[]');
    if (usuarios.length > 0) {
      for (const usuario of usuarios) {
        const { error } = await supabase
          .from('usuarios')
          .upsert(usuario, { onConflict: 'email' });
        if (!error) migrated++;
      }
    }

    // Migrate lancamentos
    const lancamentos = JSON.parse(localStorage.getItem('athos_lancamentos') || '[]');
    if (lancamentos.length > 0) {
      for (const lancamento of lancamentos) {
        const { error } = await supabase
          .from('lancamentos')
          .upsert(lancamento, { onConflict: 'id' });
        if (!error) migrated++;
      }
    }

    // Migrate leads
    const leads = JSON.parse(localStorage.getItem('athos_leads') || '[]');
    if (leads.length > 0) {
      for (const lead of leads) {
        const { error } = await supabase
          .from('leads')
          .upsert(lead, { onConflict: 'id' });
        if (!error) migrated++;
      }
    }

    return { success: true, migrated };

  } catch (error) {
    console.error('Erro na migração:', error);
    return { success: false, migrated };
  }
}

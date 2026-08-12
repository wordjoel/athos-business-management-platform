import { supabase } from '../lib/supabase';

// ============================================
// TYPES
// ============================================

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  avatar: string;
  telefone?: string;
  cargo?: string;
  role: string;
  permissions: string[];
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface Lancamento {
  id: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  contraparte?: string;
  valor: number;
  vencimento: string;
  data: string;
  status: 'pendente' | 'pago' | 'recebido' | 'atrasado';
  categoria: string;
  usuario_id?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface ContaBancaria {
  id: string;
  nome: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo: 'corrente' | 'poupanca' | 'investimento';
  saldo_inicial: number;
  saldo_atual: number;
  ativa: boolean;
  criado_em: string;
}

export interface ExtratoBancario {
  id: string;
  conta_id?: string;
  data: string;
  descricao: string;
  valor: number;
  tipo: 'credito' | 'debito';
  categoria: string;
  conciliado: boolean;
  lancamento_id?: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  criado_em: string;
}

export interface PixChave {
  id: string;
  tipo: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria';
  valor: string;
  banco: string;
  conta: string;
  ativa: boolean;
  criado_em: string;
}

export interface PixTransacao {
  id: string;
  tipo: 'enviada' | 'recebida';
  chave: string;
  chave_tipo: string;
  valor: number;
  descricao?: string;
  contraparte?: string;
  status: 'pendente' | 'processando' | 'concluida' | 'falha';
  data: string;
  hora: string;
  txid: string;
  criado_em: string;
}

export interface Boleto {
  id: string;
  sacado: string;
  cpf_cnpj: string;
  sacado_endereco?: string;
  valor: number;
  vencimento: string;
  data_emissao: string;
  linha_digitavel: string;
  codigo_barras: string;
  carteira: string;
  nosso_numero: string;
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado' | 'baixado';
  observacao?: string;
  criado_em: string;
}

export interface CartaoSocio {
  id: string;
  socio_nome: string;
  socio_email?: string;
  bandeira: 'visa' | 'mastercard' | 'elo' | 'amex' | 'outros';
  ultimos4digitos: string;
  limite_total: number;
  limite_usado: number;
  limite_disponivel: number;
  status: 'ativo' | 'bloqueado' | 'cancelado';
  criado_em: string;
}

export interface DespesaCartao {
  id: string;
  cartao_id: string;
  socio_nome: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  parcela_atual?: number;
  total_parcelas?: number;
  status: 'pendente' | 'paga' | 'atrasada';
  criado_em: string;
}

export interface Lead {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  empresa?: string;
  valor: number;
  etapa: 'novo' | 'contatado' | 'qualificado' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';
  responsavel?: string;
  ultimo_contato?: string;
  notas?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Tarefa {
  id: string;
  projeto_id?: string;
  titulo: string;
  descricao?: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  responsavel?: string;
  data_limite?: string;
  tipo: 'epic' | 'story' | 'bug' | 'task';
  pontos: number;
  epic_id?: string;
  sprint?: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: 'critica' | 'alta' | 'normal' | 'baixa';
  status: 'aberto' | 'em_atendimento' | 'resolvido' | 'fechado';
  categoria: string;
  solicitante: string;
  responsavel?: string;
  sla_horas?: number;
  criado_em: string;
  atualizado_em: string;
}

export interface Arquivo {
  id: string;
  nome: string;
  tipo: 'projeto' | 'contrato' | 'documento' | 'imagem' | 'outro';
  tamanho: number;
  url?: string;
  descricao?: string;
  tags: string[];
  categoria: string;
  uploaded_por: string;
  data_upload: string;
  versao_atual: number;
  privado: boolean;
  criado_em: string;
}

export interface ArquivoVersao {
  id: string;
  arquivo_id: string;
  numero: number;
  data_upload: string;
  uploaded_por: string;
  tamanho: number;
  changelog?: string;
  criado_em: string;
}

export interface Contrato {
  id: string;
  titulo: string;
  parte: string;
  cnpj?: string;
  telefone?: string;
  endereco?: string;
  tipo: 'licenca' | 'parceria' | 'fornecimento' | 'servico' | 'outro';
  categoria: string;
  valor: number;
  status: 'rascunho' | 'ativo' | 'suspenso' | 'encerrado' | 'cancelado';
  data_inicio?: string;
  data_fim?: string;
  observacoes?: string;
  criado_em: string;
  atualizado_em: string;
}

// ============================================
// GENERIC SERVICE
// ============================================

class SupabaseService<T extends { id: string }> {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getAll(): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error(`Erro ao buscar ${this.tableName}:`, error);
      return [];
    }

    return data || [];
  }

  async getById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erro ao buscar ${this.tableName} por ID:`, error);
      return null;
    }

    return data;
  }

  async create(item: Omit<T, 'id' | 'criado_em' | 'atualizado_em'>): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert([item])
      .select()
      .single();

    if (error) {
      console.error(`Erro ao criar ${this.tableName}:`, error);
      return null;
    }

    return data;
  }

  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Erro ao atualizar ${this.tableName}:`, error);
      return null;
    }

    return data;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erro ao deletar ${this.tableName}:`, error);
      return false;
    }

    return true;
  }

  async query(filters: Record<string, any>): Promise<T[]> {
    let query = supabase.from(this.tableName).select('*');

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(key, value);
      }
    });

    const { data, error } = await query;

    if (error) {
      console.error(`Erro ao consultar ${this.tableName}:`, error);
      return [];
    }

    return data || [];
  }

  async count(): Promise<number> {
    const { count, error } = await supabase
      .from(this.tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`Erro ao contar ${this.tableName}:`, error);
      return 0;
    }

    return count || 0;
  }
}

// ============================================
// SERVICE INSTANCES
// ============================================

export const usuariosService = new SupabaseService<Usuario>('usuarios');
export const lancamentosService = new SupabaseService<Lancamento>('lancamentos');
export const contasBancariasService = new SupabaseService<ContaBancaria>('contas_bancarias');
export const extratosService = new SupabaseService<ExtratoBancario>('extratos_bancarios');
export const pixChavesService = new SupabaseService<PixChave>('pix_chaves');
export const pixTransacoesService = new SupabaseService<PixTransacao>('pix_transacoes');
export const boletosService = new SupabaseService<Boleto>('boletos');
export const cartoesService = new SupabaseService<CartaoSocio>('cartoes');
export const despesasCartaoService = new SupabaseService<DespesaCartao>('despesas_cartao');
export const leadsService = new SupabaseService<Lead>('leads');
export const tarefasService = new SupabaseService<Tarefa>('tarefas');
export const chamadosService = new SupabaseService<Chamado>('chamados');
export const arquivosService = new SupabaseService<Arquivo>('arquivos');
export const arquivoVersoesService = new SupabaseService<ArquivoVersao>('arquivo_versoes');
export const contratosService = new SupabaseService<Contrato>('contratos');

// ============================================
// FINANCE SERVICE (aggregated)
// ============================================

export const financeService = {
  async getResumo() {
    const lancamentos = await lancamentosService.getAll();
    
    const receitas = lancamentos
      .filter(l => l.tipo === 'receita' && l.status === 'recebido')
      .reduce((s, l) => s + Number(l.valor), 0);
    
    const despesas = lancamentos
      .filter(l => l.tipo === 'despesa' && l.status === 'pago')
      .reduce((s, l) => s + Number(l.valor), 0);
    
    const pendenteReceber = lancamentos
      .filter(l => l.tipo === 'receita' && l.status === 'pendente')
      .reduce((s, l) => s + Number(l.valor), 0);
    
    const pendentePagar = lancamentos
      .filter(l => l.tipo === 'despesa' && l.status === 'pendente')
      .reduce((s, l) => s + Number(l.valor), 0);

    return {
      receitas,
      despesas,
      saldo: receitas - despesas,
      pendenteReceber,
      pendentePagar,
      totalLancamentos: lancamentos.length,
    };
  },

  async getFluxoCaixa() {
    const lancamentos = await lancamentosService.getAll();
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const mapa: Record<string, { receita: number; despesa: number }> = {};

    lancamentos.forEach(l => {
      const mes = l.vencimento.split('/')[0];
      const nomeMes = meses[parseInt(mes) - 1] || mes;
      if (!mapa[nomeMes]) mapa[nomeMes] = { receita: 0, despesa: 0 };
      if (l.tipo === 'receita') mapa[nomeMes].receita += Number(l.valor);
      else mapa[nomeMes].despesa += Number(l.valor);
    });

    return Object.entries(mapa).map(([mes, v]) => ({
      mes,
      receita: v.receita,
      despesa: v.despesa,
      saldo: v.receita - v.despesa,
    }));
  },

  async getDRE() {
    const lancamentos = await lancamentosService.getAll();
    const receitas = lancamentos.filter(l => l.tipo === 'receita' && (l.status === 'recebido' || l.status === 'pendente'));
    const despesas = lancamentos.filter(l => l.tipo === 'despesa' && (l.status === 'pago' || l.status === 'pendente'));

    const receitaBruta = receitas.reduce((s, l) => s + Number(l.valor), 0);
    const categorias = despesas.reduce((acc, l) => {
      acc[l.categoria] = (acc[l.categoria] || 0) + Number(l.valor);
      return acc;
    }, {} as Record<string, number>);

    const deducoes = categorias['Impostos'] || 0;
    const cpv = (categorias['CPV'] || 0) + (categorias['Mercadorias'] || 0);
    const despesasOperacionais = (categorias['Operacional'] || 0) + (categorias['Marketing'] || 0) + (categorias['Aluguel'] || 0);
    const despesasFinanceiras = categorias['Financeiro'] || 0;
    const irContribuicoes = categorias['IR'] || 0;

    const receitaLiquida = receitaBruta - deducoes;
    const lucroBruto = receitaLiquida - cpv;
    const ebit = lucroBruto - despesasOperacionais - despesasFinanceiras;
    const lucroLiquido = ebit - irContribuicoes;

    return { receitaBruta, deducoes, receitaLiquida, cpv, lucroBruto, despesasOperacionais, despesasFinanceiras, ebit, irContribuicoes, lucroLiquido };
  },
};

// ============================================
// SYNC SERVICE
// ============================================

export const syncService = {
  async push(operation: string, table: string, data: any) {
    const deviceId = localStorage.getItem('athos_device_id') || 'unknown';
    
    const { error } = await supabase
      .from('sync_queue')
      .insert([{
        operacao: operation,
        tabela: table,
        registro_id: data.id,
        dados: data,
        dispositivo: deviceId,
      }]);

    if (error) {
      console.error('Erro ao sincronizar:', error);
      return false;
    }

    return true;
  },

  async pull(since?: string) {
    let query = supabase
      .from('sync_queue')
      .select('*')
      .eq('sincronizado', false)
      .order('criado_em', { ascending: true });

    if (since) {
      query = query.gte('criado_em', since);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar sync queue:', error);
      return [];
    }

    return data || [];
  },

  async markSynced(ids: string[]) {
    const { error } = await supabase
      .from('sync_queue')
      .update({ sincronizado: true })
      .in('id', ids);

    if (error) {
      console.error('Erro ao marcar como sincronizado:', error);
      return false;
    }

    return true;
  },
};

// ============================================
// AI SERVICE
// ============================================

export const aiService = {
  async getDadosContexto() {
    const [lancamentos, leads, tarefas, chamados] = await Promise.all([
      lancamentosService.getAll(),
      leadsService.getAll(),
      tarefasService.getAll(),
      chamadosService.getAll(),
    ]);

    return {
      lancamentos: lancamentos.slice(0, 20),
      leads: leads.slice(0, 10),
      tarefas: tarefas.slice(0, 10),
      chamados: chamados.slice(0, 10),
      resumo: await financeService.getResumo(),
    };
  },

  async salvarConversa(agente: string, titulo: string) {
    const { data, error } = await supabase
      .from('ai_conversas')
      .insert([{ agente, titulo }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar conversa:', error);
      return null;
    }

    return data;
  },

  async salvarMensagem(conversaId: string, papel: string, conteudo: string) {
    const { data, error } = await supabase
      .from('ai_mensagens')
      .insert([{ conversa_id: conversaId, papel, conteudo }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar mensagem:', error);
      return null;
    }

    return data;
  },

  async getConversas() {
    const { data, error } = await supabase
      .from('ai_conversas')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Erro ao buscar conversas:', error);
      return [];
    }

    return data || [];
  },

  async getMensagens(conversaId: string) {
    const { data, error } = await supabase
      .from('ai_mensagens')
      .select('*')
      .eq('conversa_id', conversaId)
      .order('criado_em', { ascending: true });

    if (error) {
      console.error('Erro ao buscar mensagens:', error);
      return [];
    }

    return data || [];
  },
};

// ============================================
// AUTOMATION SERVICE
// ============================================

export const automationService = {
  async getRegras() {
    const { data, error } = await supabase
      .from('automacoes_regras')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Erro ao buscar regras:', error);
      return [];
    }

    return data || [];
  },

  async criarRegra(nome: string, descricao: string, gatilho: string, acoes: any[]) {
    const { data, error } = await supabase
      .from('automacoes_regras')
      .insert([{ nome, descricao, gatilho, acoes }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar regra:', error);
      return null;
    }

    return data;
  },

  async executarRegra(regraId: string, status: string, detalhes: any) {
    const { error } = await supabase
      .from('automacoes_logs')
      .insert([{
        regra_id: regraId,
        status,
        detalhes,
      }]);

    if (error) {
      console.error('Erro ao registrar execução:', error);
      return false;
    }

    return true;
  },
};

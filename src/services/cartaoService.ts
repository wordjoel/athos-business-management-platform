import { DataService } from './dataService';
import { cartoesService as cartoesDb, despesasCartaoService as despesasCartaoDb } from './supabaseService';

export interface CartaoSocio {
  id: string;
  socioNome: string;
  socioEmail: string;
  bandeira: 'visa' | 'mastercard' | 'elo' | 'amex' | 'outros';
  ultimos4digitos: string;
  limiteTotal: number;
  limiteUsado: number;
  limiteDisponivel: number;
  status: 'ativo' | 'bloqueado' | 'cancelado';
  criadaEm: string;
}

export interface DespesaCartao {
  id: string;
  cartaoId: string;
  socioNome: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  parcelaAtual?: number;
  totalParcelas?: number;
  status: 'pendente' | 'paga' | 'atrasada';
  criadaEm: string;
}

const CARTAO_KEY = 'athos_cartoes_socio';
const DESPESA_KEY = 'athos_despesas_cartao';

// Cache local (leitura síncrona). O Supabase é a fonte de verdade;
// isto existe só pra UI ter dado disponível antes do primeiro refresh
// e pra funcionar offline. Nunca é gravado aqui sem o Supabase confirmar antes.
export const cartaoService = new DataService<CartaoSocio>(CARTAO_KEY);
export const despesaCartaoService = new DataService<DespesaCartao>(DESPESA_KEY);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(id: string): boolean {
  return UUID_RE.test(id);
}

function fromDbCartao(row: {
  id: string;
  socio_nome: string;
  socio_email?: string | null;
  bandeira: CartaoSocio['bandeira'];
  ultimos4digitos: string;
  limite_total: number | string;
  limite_usado: number | string;
  limite_disponivel: number | string;
  status: CartaoSocio['status'];
  criado_em: string;
}): CartaoSocio {
  return {
    id: row.id,
    socioNome: row.socio_nome,
    socioEmail: row.socio_email || '',
    bandeira: row.bandeira,
    ultimos4digitos: row.ultimos4digitos,
    limiteTotal: Number(row.limite_total),
    limiteUsado: Number(row.limite_usado),
    limiteDisponivel: Number(row.limite_disponivel),
    status: row.status,
    criadaEm: row.criado_em ? row.criado_em.slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
}

function fromDbDespesa(row: {
  id: string;
  cartao_id: string;
  socio_nome: string;
  descricao: string;
  valor: number | string;
  categoria: string;
  data: string;
  parcela_atual?: number | null;
  total_parcelas?: number | null;
  status: DespesaCartao['status'];
  criado_em: string;
}): DespesaCartao {
  return {
    id: row.id,
    cartaoId: row.cartao_id,
    socioNome: row.socio_nome,
    descricao: row.descricao,
    valor: Number(row.valor),
    categoria: row.categoria,
    data: row.data,
    parcelaAtual: row.parcela_atual ?? undefined,
    totalParcelas: row.total_parcelas ?? undefined,
    status: row.status,
    criadaEm: row.criado_em ? row.criado_em.slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
}

/** Busca cartões e despesas completos no Supabase e atualiza o cache local. Fonte de verdade. */
export async function refreshCartoes(): Promise<CartaoSocio[]> {
  const rows = await cartoesDb.getAll();
  const cartoes = rows.map(fromDbCartao);
  localStorage.setItem(CARTAO_KEY, JSON.stringify(cartoes));
  return cartoes;
}

export async function refreshDespesasCartao(): Promise<DespesaCartao[]> {
  const rows = await despesasCartaoDb.getAll();
  const despesas = rows.map(fromDbDespesa);
  localStorage.setItem(DESPESA_KEY, JSON.stringify(despesas));
  return despesas;
}

/** Leitura síncrona do cache local (pode estar desatualizada até o próximo refresh). */
export function getCartoes(): CartaoSocio[] {
  return cartaoService.getAll();
}

export function getDespesasCartao(cartaoId?: string): DespesaCartao[] {
  const todas = despesaCartaoService.getAll();
  return cartaoId ? todas.filter(d => d.cartaoId === cartaoId) : todas;
}

export async function criarCartao(data: Omit<CartaoSocio, 'id' | 'criadaEm' | 'status' | 'limiteUsado' | 'limiteDisponivel'>): Promise<CartaoSocio> {
  const created = await cartoesDb.create({
    socio_nome: data.socioNome,
    socio_email: data.socioEmail,
    bandeira: data.bandeira,
    ultimos4digitos: data.ultimos4digitos,
    limite_total: data.limiteTotal,
    limite_usado: 0,
    limite_disponivel: data.limiteTotal,
    status: 'ativo',
  } as any);

  if (!created) {
    throw new Error('Não foi possível salvar o cartão no Supabase.');
  }

  const completo = fromDbCartao(created as any);
  cartaoService.create(completo);
  return completo;
}

async function persistirCartao(id: string, updates: Partial<{
  socioNome: string; socioEmail: string; limiteUsado: number; limiteDisponivel: number; status: CartaoSocio['status'];
}>): Promise<CartaoSocio | undefined> {
  if (!isUuid(id)) {
    console.warn(`Cartão ${id} não tem UUID válido — não sincroniza com o Supabase. Atualizado só localmente.`);
    return cartaoService.update(id, updates);
  }

  const dbUpdates: Record<string, unknown> = {};
  if (updates.socioNome !== undefined) dbUpdates.socio_nome = updates.socioNome;
  if (updates.socioEmail !== undefined) dbUpdates.socio_email = updates.socioEmail;
  if (updates.limiteUsado !== undefined) dbUpdates.limite_usado = updates.limiteUsado;
  if (updates.limiteDisponivel !== undefined) dbUpdates.limite_disponivel = updates.limiteDisponivel;
  if (updates.status !== undefined) dbUpdates.status = updates.status;

  const updated = await cartoesDb.update(id, dbUpdates as any);
  if (!updated) {
    throw new Error('Não foi possível atualizar o cartão no Supabase.');
  }
  const completo = fromDbCartao(updated as any);
  cartaoService.update(id, completo);
  return completo;
}

export async function atualizarCartao(id: string, data: Partial<CartaoSocio>): Promise<CartaoSocio | undefined> {
  return persistirCartao(id, data);
}

export async function bloquearCartao(id: string): Promise<CartaoSocio | undefined> {
  return persistirCartao(id, { status: 'bloqueado' });
}

export async function desbloquearCartao(id: string): Promise<CartaoSocio | undefined> {
  return persistirCartao(id, { status: 'ativo' });
}

export async function cancelarCartao(id: string): Promise<CartaoSocio | undefined> {
  return persistirCartao(id, { status: 'cancelado' });
}

export async function excluirCartao(id: string): Promise<boolean> {
  if (!isUuid(id)) {
    console.warn(`Cartão ${id} não tem UUID válido — não existe no Supabase. Removido só localmente.`);
    return cartaoService.delete(id);
  }
  const ok = await cartoesDb.delete(id);
  if (!ok) throw new Error('Não foi possível excluir o cartão no Supabase.');
  cartaoService.delete(id);
  return true;
}

export async function criarDespesaCartao(data: Omit<DespesaCartao, 'id' | 'criadaEm' | 'status'>): Promise<DespesaCartao> {
  const created = await despesasCartaoDb.create({
    cartao_id: data.cartaoId,
    socio_nome: data.socioNome,
    descricao: data.descricao,
    valor: data.valor,
    categoria: data.categoria,
    data: data.data,
    parcela_atual: data.parcelaAtual,
    total_parcelas: data.totalParcelas,
    status: 'pendente',
  } as any);

  if (!created) {
    throw new Error('Não foi possível salvar a despesa no Supabase.');
  }

  const completo = fromDbDespesa(created as any);
  despesaCartaoService.create(completo);

  const cartao = cartaoService.getById(data.cartaoId);
  if (cartao) {
    const novoUsado = cartao.limiteUsado + data.valor;
    await persistirCartao(cartao.id, {
      limiteUsado: novoUsado,
      limiteDisponivel: Math.max(0, cartao.limiteTotal - novoUsado),
    });
  }

  return completo;
}

export async function pagarDespesaCartao(id: string): Promise<DespesaCartao | undefined> {
  const despesa = despesaCartaoService.getById(id);
  if (!despesa) return undefined;

  if (!isUuid(id)) {
    console.warn(`Despesa ${id} não tem UUID válido — não sincroniza com o Supabase. Atualizada só localmente.`);
    return despesaCartaoService.update(id, { status: 'paga' });
  }

  const updated = await despesasCartaoDb.update(id, { status: 'paga' } as any);
  if (!updated) throw new Error('Não foi possível marcar a despesa como paga no Supabase.');

  const completo = fromDbDespesa(updated as any);
  despesaCartaoService.update(id, completo);

  const cartao = cartaoService.getById(despesa.cartaoId);
  if (cartao) {
    const novoUsado = Math.max(0, cartao.limiteUsado - despesa.valor);
    await persistirCartao(cartao.id, {
      limiteUsado: novoUsado,
      limiteDisponivel: cartao.limiteTotal - novoUsado,
    });
  }

  return completo;
}

export async function excluirDespesaCartao(id: string): Promise<boolean> {
  const despesa = despesaCartaoService.getById(id);

  if (isUuid(id)) {
    const ok = await despesasCartaoDb.delete(id);
    if (!ok) throw new Error('Não foi possível excluir a despesa no Supabase.');
  } else {
    console.warn(`Despesa ${id} não tem UUID válido — não existe no Supabase. Removida só localmente.`);
  }

  if (despesa && despesa.status === 'pendente') {
    const cartao = cartaoService.getById(despesa.cartaoId);
    if (cartao) {
      const novoUsado = Math.max(0, cartao.limiteUsado - despesa.valor);
      await persistirCartao(cartao.id, {
        limiteUsado: novoUsado,
        limiteDisponivel: cartao.limiteTotal - novoUsado,
      });
    }
  }

  despesaCartaoService.delete(id);
  return true;
}

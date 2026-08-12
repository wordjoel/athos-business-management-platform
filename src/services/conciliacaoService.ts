import { DataService } from './dataService';
import { extratosService as extratosDb, contasBancariasService as contasDb } from './supabaseService';

export interface ExtratoBancario {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  tipo: 'credito' | 'debito';
  categoria: string;
  conciliado: boolean;
  lancamentoId?: string;
  banco: string;
  agencia: string;
  conta: string;
  criadaEm: string;
}

export interface ContaBancaria {
  id: string;
  nome: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo: 'corrente' | 'poupanca' | 'investimento';
  saldoInicial: number;
  saldoAtual: number;
  ativa: boolean;
  criadaEm: string;
}

const EXTRATO_KEY = 'athos_extratos';
const CONTA_KEY = 'athos_contas_bancarias';

// Cache local (leitura síncrona). O Supabase é a fonte de verdade;
// isto existe só pra UI ter dado disponível antes do primeiro refresh
// e pra funcionar offline. Nunca é gravado aqui sem o Supabase confirmar antes.
export const extratoService = new DataService<ExtratoBancario>(EXTRATO_KEY);
export const contaService = new DataService<ContaBancaria>(CONTA_KEY);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(id: string): boolean {
  return UUID_RE.test(id);
}

function fromDbExtrato(row: {
  id: string;
  data: string;
  descricao: string;
  valor: number | string;
  tipo: ExtratoBancario['tipo'];
  categoria: string;
  conciliado: boolean;
  lancamento_id?: string | null;
  banco?: string | null;
  agencia?: string | null;
  conta?: string | null;
  criado_em: string;
}): ExtratoBancario {
  return {
    id: row.id,
    data: row.data,
    descricao: row.descricao,
    valor: Number(row.valor),
    tipo: row.tipo,
    categoria: row.categoria,
    conciliado: row.conciliado,
    lancamentoId: row.lancamento_id || undefined,
    banco: row.banco || '',
    agencia: row.agencia || '',
    conta: row.conta || '',
    criadaEm: row.criado_em ? row.criado_em.slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
}

function fromDbConta(row: {
  id: string;
  nome: string;
  banco: string;
  agencia: string;
  conta: string;
  tipo: ContaBancaria['tipo'];
  saldo_inicial: number | string;
  saldo_atual: number | string;
  ativa: boolean;
  criado_em: string;
}): ContaBancaria {
  return {
    id: row.id,
    nome: row.nome,
    banco: row.banco,
    agencia: row.agencia,
    conta: row.conta,
    tipo: row.tipo,
    saldoInicial: Number(row.saldo_inicial),
    saldoAtual: Number(row.saldo_atual),
    ativa: row.ativa,
    criadaEm: row.criado_em ? row.criado_em.slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
}

/** Busca extratos/contas completos no Supabase e atualiza o cache local. Fonte de verdade. */
export async function refreshExtratos(): Promise<ExtratoBancario[]> {
  const rows = await extratosDb.getAll();
  const extratos = rows.map(fromDbExtrato);
  localStorage.setItem(EXTRATO_KEY, JSON.stringify(extratos));
  return extratos;
}

export async function refreshContas(): Promise<ContaBancaria[]> {
  const rows = await contasDb.getAll();
  const contas = rows.map(fromDbConta);
  localStorage.setItem(CONTA_KEY, JSON.stringify(contas));
  return contas;
}

/** Leitura síncrona do cache local (pode estar desatualizada até o próximo refresh). */
export function getExtratos(): ExtratoBancario[] {
  return extratoService.getAll();
}

export function getExtratosNaoConciliados(): ExtratoBancario[] {
  return extratoService.getAll().filter(e => !e.conciliado);
}

export function getContas(): ContaBancaria[] {
  return contaService.getAll();
}

export async function criarExtrato(data: Omit<ExtratoBancario, 'id' | 'criadaEm' | 'conciliado'>): Promise<ExtratoBancario> {
  const created = await extratosDb.create({
    data: data.data,
    descricao: data.descricao,
    valor: data.valor,
    tipo: data.tipo,
    categoria: data.categoria,
    conciliado: false,
    banco: data.banco,
    agencia: data.agencia,
    conta: data.conta,
  } as any);

  if (!created) throw new Error('Não foi possível salvar o extrato no Supabase.');

  const completo = fromDbExtrato(created as any);
  extratoService.create(completo);
  return completo;
}

export async function conciliarExtrato(extratoId: string, lancamentoId: string): Promise<ExtratoBancario | undefined> {
  if (!isUuid(extratoId)) {
    console.warn(`Extrato ${extratoId} não tem UUID válido — não sincroniza com o Supabase. Atualizado só localmente.`);
    return extratoService.update(extratoId, { conciliado: true, lancamentoId });
  }
  const updated = await extratosDb.update(extratoId, { conciliado: true, lancamento_id: lancamentoId } as any);
  if (!updated) throw new Error('Não foi possível conciliar o extrato no Supabase.');
  const completo = fromDbExtrato(updated as any);
  extratoService.update(extratoId, completo);
  return completo;
}

export async function excluirExtrato(id: string): Promise<boolean> {
  if (!isUuid(id)) {
    console.warn(`Extrato ${id} não tem UUID válido — não existe no Supabase. Removido só localmente.`);
    return extratoService.delete(id);
  }
  const ok = await extratosDb.delete(id);
  if (!ok) throw new Error('Não foi possível excluir o extrato no Supabase.');
  extratoService.delete(id);
  return true;
}

export async function criarConta(data: Omit<ContaBancaria, 'id' | 'criadaEm' | 'saldoAtual'>): Promise<ContaBancaria> {
  const created = await contasDb.create({
    nome: data.nome,
    banco: data.banco,
    agencia: data.agencia,
    conta: data.conta,
    tipo: data.tipo,
    saldo_inicial: data.saldoInicial,
    saldo_atual: data.saldoInicial,
    ativa: data.ativa,
  } as any);

  if (!created) throw new Error('Não foi possível salvar a conta bancária no Supabase.');

  const completo = fromDbConta(created as any);
  contaService.create(completo);
  return completo;
}

export async function atualizarConta(id: string, data: Partial<ContaBancaria>): Promise<ContaBancaria | undefined> {
  if (!isUuid(id)) {
    console.warn(`Conta ${id} não tem UUID válido — não sincroniza com o Supabase. Atualizada só localmente.`);
    return contaService.update(id, data);
  }

  const dbUpdates: Record<string, unknown> = {};
  if (data.nome !== undefined) dbUpdates.nome = data.nome;
  if (data.banco !== undefined) dbUpdates.banco = data.banco;
  if (data.agencia !== undefined) dbUpdates.agencia = data.agencia;
  if (data.conta !== undefined) dbUpdates.conta = data.conta;
  if (data.tipo !== undefined) dbUpdates.tipo = data.tipo;
  if (data.saldoAtual !== undefined) dbUpdates.saldo_atual = data.saldoAtual;
  if (data.ativa !== undefined) dbUpdates.ativa = data.ativa;

  const updated = await contasDb.update(id, dbUpdates as any);
  if (!updated) throw new Error('Não foi possível atualizar a conta bancária no Supabase.');
  const completo = fromDbConta(updated as any);
  contaService.update(id, completo);
  return completo;
}

export async function excluirConta(id: string): Promise<boolean> {
  if (!isUuid(id)) {
    console.warn(`Conta ${id} não tem UUID válido — não existe no Supabase. Removida só localmente.`);
    return contaService.delete(id);
  }
  const ok = await contasDb.delete(id);
  if (!ok) throw new Error('Não foi possível excluir a conta bancária no Supabase.');
  contaService.delete(id);
  return true;
}

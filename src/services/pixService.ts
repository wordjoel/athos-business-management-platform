import { DataService } from './dataService';
import { pixChavesService as pixChavesDb, pixTransacoesService as pixTransacoesDb } from './supabaseService';

export interface PixChave {
  id: string;
  tipo: 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria';
  valor: string;
  banco: string;
  conta: string;
  ativa: boolean;
  criadaEm: string;
}

export interface PixTransacao {
  id: string;
  tipo: 'enviada' | 'recebida';
  chave: string;
  chaveTipo: string;
  valor: number;
  descricao: string;
  contraparte: string;
  status: 'pendente' | 'processando' | 'concluida' | 'falha';
  data: string;
  hora: string;
  txid: string;
  criadaEm: string;
}

// QR codes expiram em 30 minutos por natureza — não há tabela no Supabase pra isso
// de propósito, não faz sentido persistir dado que morre sozinho tão rápido.
export interface PixQrCode {
  id: string;
  chave: string;
  valor: number;
  descricao: string;
  txid: string;
  copiaECola: string;
  criadaEm: string;
  expiraEm: string;
}

const CHAVE_KEY = 'athos_pix_chaves';
const TRANSACAO_KEY = 'athos_pix_transacoes';
const QR_KEY = 'athos_pix_qrcodes';

// Cache local (leitura síncrona). O Supabase é a fonte de verdade pra chaves e
// transações; isto existe só pra UI ter dado disponível antes do primeiro refresh
// e pra funcionar offline. Nunca é gravado aqui sem o Supabase confirmar antes.
export const pixChaveService = new DataService<PixChave>(CHAVE_KEY);
export const pixTransacaoService = new DataService<PixTransacao>(TRANSACAO_KEY);
export const pixQrCodeService = new DataService<PixQrCode>(QR_KEY);

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(id: string): boolean {
  return UUID_RE.test(id);
}

function generateTxid(): string {
  return 'pix' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function generateCopiaECola(chave: string, valor: number, txid: string): string {
  const payload = `00020126580014br.gov.bcb.pix0136${chave}5204000053039865404${valor.toFixed(2)}5802BR5925ATHOS BUSINESS MANAGEMENT6009SAO PAULO62070503${txid.slice(0, 25)}6304`;
  return btoa(payload).slice(0, 100);
}

function fromDbChave(row: {
  id: string;
  tipo: PixChave['tipo'];
  valor: string;
  banco: string;
  conta: string;
  ativa: boolean;
  criado_em: string;
}): PixChave {
  return {
    id: row.id,
    tipo: row.tipo,
    valor: row.valor,
    banco: row.banco,
    conta: row.conta,
    ativa: row.ativa,
    criadaEm: row.criado_em ? row.criado_em.slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
}

function fromDbTransacao(row: {
  id: string;
  tipo: PixTransacao['tipo'];
  chave: string;
  chave_tipo: string;
  valor: number | string;
  descricao?: string | null;
  contraparte?: string | null;
  status: PixTransacao['status'];
  data: string;
  hora: string;
  txid: string;
  criado_em: string;
}): PixTransacao {
  return {
    id: row.id,
    tipo: row.tipo,
    chave: row.chave,
    chaveTipo: row.chave_tipo,
    valor: Number(row.valor),
    descricao: row.descricao || '',
    contraparte: row.contraparte || '',
    status: row.status,
    data: row.data,
    hora: row.hora,
    txid: row.txid,
    criadaEm: row.criado_em ? row.criado_em.slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
}

/** Busca chaves/transações completas no Supabase e atualiza o cache local. Fonte de verdade. */
export async function refreshChaves(): Promise<PixChave[]> {
  const rows = await pixChavesDb.getAll();
  const chaves = rows.map(fromDbChave);
  localStorage.setItem(CHAVE_KEY, JSON.stringify(chaves));
  return chaves;
}

export async function refreshTransacoes(): Promise<PixTransacao[]> {
  const rows = await pixTransacoesDb.getAll();
  const transacoes = rows.map(fromDbTransacao);
  localStorage.setItem(TRANSACAO_KEY, JSON.stringify(transacoes));
  return transacoes;
}

/** Leitura síncrona do cache local (pode estar desatualizada até o próximo refresh). */
export function getChaves(): PixChave[] {
  return pixChaveService.getAll();
}

export function getTransacoes(): PixTransacao[] {
  return pixTransacaoService.getAll();
}

export async function criarChave(data: Omit<PixChave, 'id' | 'criadaEm' | 'ativa'>): Promise<PixChave> {
  const created = await pixChavesDb.create({
    tipo: data.tipo,
    valor: data.valor,
    banco: data.banco,
    conta: data.conta,
    ativa: true,
  } as any);

  if (!created) throw new Error('Não foi possível salvar a chave PIX no Supabase.');

  const completo = fromDbChave(created as any);
  pixChaveService.create(completo);
  return completo;
}

export async function desativarChave(id: string): Promise<PixChave | undefined> {
  if (!isUuid(id)) {
    console.warn(`Chave PIX ${id} não tem UUID válido — não sincroniza com o Supabase. Atualizada só localmente.`);
    return pixChaveService.update(id, { ativa: false });
  }
  const updated = await pixChavesDb.update(id, { ativa: false } as any);
  if (!updated) throw new Error('Não foi possível desativar a chave PIX no Supabase.');
  const completo = fromDbChave(updated as any);
  pixChaveService.update(id, completo);
  return completo;
}

export async function excluirChave(id: string): Promise<boolean> {
  if (!isUuid(id)) {
    console.warn(`Chave PIX ${id} não tem UUID válido — não existe no Supabase. Removida só localmente.`);
    return pixChaveService.delete(id);
  }
  const ok = await pixChavesDb.delete(id);
  if (!ok) throw new Error('Não foi possível excluir a chave PIX no Supabase.');
  pixChaveService.delete(id);
  return true;
}

export async function criarTransacao(data: Omit<PixTransacao, 'id' | 'criadaEm' | 'txid'>): Promise<PixTransacao> {
  const txid = generateTxid();

  const created = await pixTransacoesDb.create({
    tipo: data.tipo,
    chave: data.chave,
    chave_tipo: data.chaveTipo,
    valor: data.valor,
    descricao: data.descricao,
    contraparte: data.contraparte,
    status: data.status,
    data: data.data,
    hora: data.hora,
    txid,
  } as any);

  if (!created) throw new Error('Não foi possível salvar a transação PIX no Supabase.');

  const completo = fromDbTransacao(created as any);
  pixTransacaoService.create(completo);
  return completo;
}

export async function criarPixEnvio(chave: string, valor: number, descricao: string, contraparte: string): Promise<PixTransacao> {
  return criarTransacao({
    tipo: 'enviada',
    chave,
    chaveTipo: 'aleatoria',
    valor,
    descricao,
    contraparte,
    status: 'concluida',
    data: new Date().toLocaleDateString('pt-BR'),
    hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  });
}

export async function criarPixRecebido(chave: string, valor: number, descricao: string, contraparte: string): Promise<PixTransacao> {
  return criarTransacao({
    tipo: 'recebida',
    chave,
    chaveTipo: 'aleatoria',
    valor,
    descricao,
    contraparte,
    status: 'concluida',
    data: new Date().toLocaleDateString('pt-BR'),
    hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
  });
}

export function getQrCodes(): PixQrCode[] {
  return pixQrCodeService.getAll();
}

export function gerarQrCode(chave: string, valor: number, descricao: string): PixQrCode {
  const txid = generateTxid();
  const copiaECola = generateCopiaECola(chave, valor, txid);
  const now = new Date();
  const expira = new Date(now.getTime() + 30 * 60 * 1000);

  const qr: PixQrCode = {
    id: uuid(),
    chave,
    valor,
    descricao,
    txid,
    copiaECola,
    criadaEm: now.toISOString(),
    expiraEm: expira.toISOString(),
  };

  pixQrCodeService.create(qr);
  return qr;
}

export function excluirQrCode(id: string): boolean {
  return pixQrCodeService.delete(id);
}

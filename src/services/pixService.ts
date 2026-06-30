import { DataService } from './dataService';
import { api } from './api';

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

export const pixChaveService = new DataService<PixChave>(CHAVE_KEY);
export const pixTransacaoService = new DataService<PixTransacao>(TRANSACAO_KEY);
export const pixQrCodeService = new DataService<PixQrCode>(QR_KEY);

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function generateTxid(): string {
  return 'pix' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function generateCopiaECola(chave: string, valor: number, txid: string): string {
  const payload = `00020126580014br.gov.bcb.pix0136${chave}5204000053039865404${valor.toFixed(2)}5802BR5925ATHOS BUSINESS MANAGEMENT6009SAO PAULO62070503${txid.slice(0, 25)}6304`;
  return btoa(payload).slice(0, 100);
}

export function getChaves(): PixChave[] {
  return pixChaveService.getAll();
}

export function criarChave(data: Omit<PixChave, 'id' | 'criadaEm' | 'ativa'>): PixChave {
  const completo: PixChave = { ...data, id: uuid(), ativa: true, criadaEm: new Date().toISOString().slice(0, 10) };
  pixChaveService.create(completo);
  api.notifyChange('create', CHAVE_KEY, completo.id, completo);
  return completo;
}

export function desativarChave(id: string): PixChave | undefined {
  const result = pixChaveService.update(id, { ativa: false });
  if (result) api.notifyChange('update', CHAVE_KEY, id, { ativa: false });
  return result;
}

export function excluirChave(id: string): boolean {
  const result = pixChaveService.delete(id);
  if (result) api.notifyChange('delete', CHAVE_KEY, id);
  return result;
}

export function getTransacoes(): PixTransacao[] {
  return pixTransacaoService.getAll();
}

export function criarTransacao(data: Omit<PixTransacao, 'id' | 'criadaEm' | 'txid'>): PixTransacao {
  const txid = generateTxid();
  const completo: PixTransacao = { ...data, id: uuid(), txid, criadaEm: new Date().toISOString().slice(0, 10) };
  pixTransacaoService.create(completo);
  api.notifyChange('create', TRANSACAO_KEY, completo.id, completo);
  return completo;
}

export function criarPixEnvio(chave: string, valor: number, descricao: string, contraparte: string): PixTransacao {
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

export function criarPixRecebido(chave: string, valor: number, descricao: string, contraparte: string): PixTransacao {
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
  api.notifyChange('create', QR_KEY, qr.id, qr);
  return qr;
}

export function excluirQrCode(id: string): boolean {
  const result = pixQrCodeService.delete(id);
  if (result) api.notifyChange('delete', QR_KEY, id);
  return result;
}

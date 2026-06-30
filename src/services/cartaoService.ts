import { DataService } from './dataService';
import { api } from './api';

export interface Cartao {
  id: string;
  nome: string;
  bandeira: 'visa' | 'mastercard' | 'elo' | 'amex' | 'outros';
  ultimos4digitos: string;
  limite: number;
  limiteDisponivel: number;
  faturaAtual: number;
  diaFechamento: number;
  diaVencimento: number;
  status: 'ativo' | 'bloqueado' | 'cancelado';
  criadaEm: string;
}

export interface FaturaCartao {
  id: string;
  cartaoId: string;
  mes: string;
  ano: number;
  valorTotal: number;
  pago: boolean;
  dataPagamento?: string;
  criadaEm: string;
}

export interface TransacaoCartao {
  id: string;
  cartaoId: string;
  faturaId: string;
  descricao: string;
  valor: number;
  data: string;
  categoria: string;
  parcelaAtual?: number;
  totalParcelas?: number;
  status: 'pendente' | 'processada' | 'estornada';
  criadaEm: string;
}

const CARTAO_KEY = 'athos_cartoes';
const FATURA_KEY = 'athos_faturas_cartao';
const TRANSACAO_KEY = 'athos_transacoes_cartao';

export const cartaoService = new DataService<Cartao>(CARTAO_KEY);
export const faturaService = new DataService<FaturaCartao>(FATURA_KEY);
export const transacaoCartaoService = new DataService<TransacaoCartao>(TRANSACAO_KEY);

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function getCartoes(): Cartao[] {
  return cartaoService.getAll();
}

export function criarCartao(data: Omit<Cartao, 'id' | 'criadaEm' | 'status' | 'faturaAtual' | 'limiteDisponivel'>): Cartao {
  const completo: Cartao = {
    ...data,
    id: uuid(),
    status: 'ativo',
    faturaAtual: 0,
    limiteDisponivel: data.limite,
    criadaEm: new Date().toISOString().slice(0, 10),
  };
  cartaoService.create(completo);
  api.notifyChange('create', CARTAO_KEY, completo.id, completo);
  return completo;
}

export function atualizarCartao(id: string, data: Partial<Cartao>): Cartao | undefined {
  const result = cartaoService.update(id, data);
  if (result) api.notifyChange('update', CARTAO_KEY, id, data);
  return result;
}

export function bloquearCartao(id: string): Cartao | undefined {
  return atualizarCartao(id, { status: 'bloqueado' });
}

export function desbloquearCartao(id: string): Cartao | undefined {
  return atualizarCartao(id, { status: 'ativo' });
}

export function cancelarCartao(id: string): Cartao | undefined {
  return atualizarCartao(id, { status: 'cancelado' });
}

export function excluirCartao(id: string): boolean {
  const result = cartaoService.delete(id);
  if (result) api.notifyChange('delete', CARTAO_KEY, id);
  return result;
}

export function getFaturas(cartaoId?: string): FaturaCartao[] {
  const todas = faturaService.getAll();
  return cartaoId ? todas.filter(f => f.cartaoId === cartaoId) : todas;
}

export function criarFatura(cartaoId: string, mes: string, ano: number): FaturaCartao {
  const completo: FaturaCartao = {
    id: uuid(),
    cartaoId,
    mes,
    ano,
    valorTotal: 0,
    pago: false,
    criadaEm: new Date().toISOString().slice(0, 10),
  };
  faturaService.create(completo);
  api.notifyChange('create', FATURA_KEY, completo.id, completo);
  return completo;
}

export function pagarFatura(id: string): FaturaCartao | undefined {
  const result = faturaService.update(id, {
    pago: true,
    dataPagamento: new Date().toLocaleDateString('pt-BR'),
  });
  if (result) {
    const cartao = cartaoService.getById(result.cartaoId);
    if (cartao) {
      cartaoService.update(cartao.id, {
        faturaAtual: 0,
        limiteDisponivel: cartao.limite,
      });
    }
    api.notifyChange('update', FATURA_KEY, id, result);
  }
  return result;
}

export function excluirFatura(id: string): boolean {
  const result = faturaService.delete(id);
  if (result) api.notifyChange('delete', FATURA_KEY, id);
  return result;
}

export function getTransacoesCartao(cartaoId?: string, faturaId?: string): TransacaoCartao[] {
  let todas = transacaoCartaoService.getAll();
  if (cartaoId) todas = todas.filter(t => t.cartaoId === cartaoId);
  if (faturaId) todas = todas.filter(t => t.faturaId === faturaId);
  return todas;
}

export function criarTransacaoCartao(data: Omit<TransacaoCartao, 'id' | 'criadaEm' | 'status'>): TransacaoCartao {
  const completo: TransacaoCartao = {
    ...data,
    id: uuid(),
    status: 'processada',
    criadaEm: new Date().toISOString().slice(0, 10),
  };
  transacaoCartaoService.create(completo);

  const cartao = cartaoService.getById(data.cartaoId);
  if (cartao) {
    const novoFatura = cartao.faturaAtual + data.valor;
    const novoDisponivel = cartao.limiteDisponivel - data.valor;
    cartaoService.update(cartao.id, {
      faturaAtual: novoFatura,
      limiteDisponivel: Math.max(0, novoDisponivel),
    });
  }

  const fatura = faturaService.getById(data.faturaId);
  if (fatura) {
    faturaService.update(fatura.id, { valorTotal: fatura.valorTotal + data.valor });
  }

  api.notifyChange('create', TRANSACAO_KEY, completo.id, completo);
  return completo;
}

export function estornarTransacao(id: string): TransacaoCartao | undefined {
  const transacao = transacaoCartaoService.getById(id);
  if (!transacao) return undefined;

  const result = transacaoCartaoService.update(id, { status: 'estornada' });
  if (result) {
    const cartao = cartaoService.getById(transacao.cartaoId);
    if (cartao) {
      cartaoService.update(cartao.id, {
        faturaAtual: Math.max(0, cartao.faturaAtual - transacao.valor),
        limiteDisponivel: cartao.limiteDisponivel + transacao.valor,
      });
    }

    const fatura = faturaService.getById(transacao.faturaId);
    if (fatura) {
      faturaService.update(fatura.id, { valorTotal: Math.max(0, fatura.valorTotal - transacao.valor) });
    }

    api.notifyChange('update', TRANSACAO_KEY, id, result);
  }
  return result;
}

export function excluirTransacaoCartao(id: string): boolean {
  const result = transacaoCartaoService.delete(id);
  if (result) api.notifyChange('delete', TRANSACAO_KEY, id);
  return result;
}

export function seedCartoesPadrao(): void {
  if (cartaoService.getAll().length === 0) {
    const cartoes: Omit<Cartao, 'id' | 'criadaEm' | 'status' | 'faturaAtual' | 'limiteDisponivel'>[] = [
      { nome: 'Visa Platinum', bandeira: 'visa', ultimos4digitos: '1234', limite: 15000, diaFechamento: 5, diaVencimento: 15 },
      { nome: 'Mastercard Gold', bandeira: 'mastercard', ultimos4digitos: '5678', limite: 10000, diaFechamento: 10, diaVencimento: 20 },
    ];
    cartoes.forEach(c => criarCartao(c));
  }
}

import { DataService } from './dataService';
import { api } from './api';

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

export const cartaoService = new DataService<CartaoSocio>(CARTAO_KEY);
export const despesaCartaoService = new DataService<DespesaCartao>(DESPESA_KEY);

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function getCartoes(): CartaoSocio[] {
  return cartaoService.getAll();
}

export function criarCartao(data: Omit<CartaoSocio, 'id' | 'criadaEm' | 'status' | 'limiteUsado' | 'limiteDisponivel'>): CartaoSocio {
  const completo: CartaoSocio = {
    ...data,
    id: uuid(),
    status: 'ativo',
    limiteUsado: 0,
    limiteDisponivel: data.limiteTotal,
    criadaEm: new Date().toISOString().slice(0, 10),
  };
  cartaoService.create(completo);
  api.notifyChange('create', CARTAO_KEY, completo.id, completo);
  return completo;
}

export function atualizarCartao(id: string, data: Partial<CartaoSocio>): CartaoSocio | undefined {
  const result = cartaoService.update(id, data);
  if (result) api.notifyChange('update', CARTAO_KEY, id, data);
  return result;
}

export function bloquearCartao(id: string): CartaoSocio | undefined {
  return atualizarCartao(id, { status: 'bloqueado' });
}

export function desbloquearCartao(id: string): CartaoSocio | undefined {
  return atualizarCartao(id, { status: 'ativo' });
}

export function cancelarCartao(id: string): CartaoSocio | undefined {
  return atualizarCartao(id, { status: 'cancelado' });
}

export function excluirCartao(id: string): boolean {
  const result = cartaoService.delete(id);
  if (result) api.notifyChange('delete', CARTAO_KEY, id);
  return result;
}

export function getDespesasCartao(cartaoId?: string): DespesaCartao[] {
  const todas = despesaCartaoService.getAll();
  return cartaoId ? todas.filter(d => d.cartaoId === cartaoId) : todas;
}

export function criarDespesaCartao(data: Omit<DespesaCartao, 'id' | 'criadaEm' | 'status'>): DespesaCartao {
  const completo: DespesaCartao = {
    ...data,
    id: uuid(),
    status: 'pendente',
    criadaEm: new Date().toISOString().slice(0, 10),
  };
  despesaCartaoService.create(completo);

  const cartao = cartaoService.getById(data.cartaoId);
  if (cartao) {
    const novoUsado = cartao.limiteUsado + data.valor;
    cartaoService.update(cartao.id, {
      limiteUsado: novoUsado,
      limiteDisponivel: Math.max(0, cartao.limiteTotal - novoUsado),
    });
  }

  api.notifyChange('create', DESPESA_KEY, completo.id, completo);
  return completo;
}

export function pagarDespesaCartao(id: string): DespesaCartao | undefined {
  const despesa = despesaCartaoService.getById(id);
  if (!despesa) return undefined;

  const result = despesaCartaoService.update(id, { status: 'paga' });
  if (result) {
    const cartao = cartaoService.getById(despesa.cartaoId);
    if (cartao) {
      const novoUsado = Math.max(0, cartao.limiteUsado - despesa.valor);
      cartaoService.update(cartao.id, {
        limiteUsado: novoUsado,
        limiteDisponivel: cartao.limiteTotal - novoUsado,
      });
    }
    api.notifyChange('update', DESPESA_KEY, id, result);
  }
  return result;
}

export function excluirDespesaCartao(id: string): boolean {
  const despesa = despesaCartaoService.getById(id);
  if (despesa && despesa.status === 'pendente') {
    const cartao = cartaoService.getById(despesa.cartaoId);
    if (cartao) {
      const novoUsado = Math.max(0, cartao.limiteUsado - despesa.valor);
      cartaoService.update(cartao.id, {
        limiteUsado: novoUsado,
        limiteDisponivel: cartao.limiteTotal - novoUsado,
      });
    }
  }
  const result = despesaCartaoService.delete(id);
  if (result) api.notifyChange('delete', DESPESA_KEY, id);
  return result;
}

export function seedCartoesPadrao(): void {
  if (cartaoService.getAll().length === 0) {
    const cartoes: Omit<CartaoSocio, 'id' | 'criadaEm' | 'status' | 'limiteUsado' | 'limiteDisponivel'>[] = [
      { socioNome: 'Kleber Duarte', socioEmail: 'kleber@athos.com', bandeira: 'visa', ultimos4digitos: '1234', limiteTotal: 25000 },
      { socioNome: 'Joel Oliveira', socioEmail: 'joel@athos.com', bandeira: 'mastercard', ultimos4digitos: '5678', limiteTotal: 20000 },
      { socioNome: 'Oscar Carvalho', socioEmail: 'oscar@athos.com', bandeira: 'elo', ultimos4digitos: '9012', limiteTotal: 18000 },
    ];
    cartoes.forEach(c => criarCartao(c));
  }
}

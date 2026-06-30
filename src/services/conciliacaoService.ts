import { DataService } from './dataService';
import { api } from './api';

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

export const extratoService = new DataService<ExtratoBancario>(EXTRATO_KEY);
export const contaService = new DataService<ContaBancaria>(CONTA_KEY);

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function getExtratos(): ExtratoBancario[] {
  return extratoService.getAll();
}

export function getExtratosNaoConciliados(): ExtratoBancario[] {
  return extratoService.getAll().filter(e => !e.conciliado);
}

export function criarExtrato(data: Omit<ExtratoBancario, 'id' | 'criadaEm' | 'conciliado'>): ExtratoBancario {
  const completo: ExtratoBancario = { ...data, id: uuid(), conciliado: false, criadaEm: new Date().toISOString().slice(0, 10) };
  extratoService.create(completo);
  api.notifyChange('create', EXTRATO_KEY, completo.id, completo);
  return completo;
}

export function conciliarExtrato(extratoId: string, lancamentoId: string): ExtratoBancario | undefined {
  const result = extratoService.update(extratoId, { conciliado: true, lancamentoId });
  if (result) api.notifyChange('update', EXTRATO_KEY, extratoId, { conciliado: true, lancamentoId });
  return result;
}

export function excluirExtrato(id: string): boolean {
  const result = extratoService.delete(id);
  if (result) api.notifyChange('delete', EXTRATO_KEY, id);
  return result;
}

export function getContas(): ContaBancaria[] {
  return contaService.getAll();
}

export function criarConta(data: Omit<ContaBancaria, 'id' | 'criadaEm' | 'saldoAtual'>): ContaBancaria {
  const completo: ContaBancaria = { ...data, id: uuid(), saldoAtual: data.saldoInicial, criadaEm: new Date().toISOString().slice(0, 10) };
  contaService.create(completo);
  api.notifyChange('create', CONTA_KEY, completo.id, completo);
  return completo;
}

export function atualizarConta(id: string, data: Partial<ContaBancaria>): ContaBancaria | undefined {
  const result = contaService.update(id, data);
  if (result) api.notifyChange('update', CONTA_KEY, id, data);
  return result;
}

export function excluirConta(id: string): boolean {
  const result = contaService.delete(id);
  if (result) api.notifyChange('delete', CONTA_KEY, id);
  return result;
}

export function seedContasPadrao(): void {
  if (contaService.getAll().length === 0) {
    const contas: Omit<ContaBancaria, 'id' | 'criadaEm' | 'saldoAtual'>[] = [
      { nome: 'Banco do Brasil', banco: '001', agencia: '1234-5', conta: '67890-1', tipo: 'corrente', saldoInicial: 50000, ativa: true },
      { nome: 'Itaú Unibanco', banco: '341', agencia: '6789-0', conta: '12345-6', tipo: 'corrente', saldoInicial: 35000, ativa: true },
      { nome: 'Nubank', banco: '260', agencia: '0001', conta: '98765-4', tipo: 'poupanca', saldoInicial: 15000, ativa: true },
    ];
    contas.forEach(c => criarConta(c));
  }
}

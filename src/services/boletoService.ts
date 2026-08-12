import { DataService } from './dataService';
import { api } from './api';

export interface Boleto {
  id: string;
  cedenteNome: string;
  cedenteCnpj: string;
  cedenteEndereco: string;
  cedenteCidade: string;
  cedenteUf: string;
  cedenteCep: string;
  cedenteBanco: string;
  cedenteAgencia: string;
  cedenteConta: string;
  cedenteCarteira: string;
  sacado: string;
  cpfCnpj: string;
  sacadoEndereco: string;
  valor: number;
  vencimento: string;
  dataEmissao: string;
  linhaDigitavel: string;
  codigoBarras: string;
  nossoNumero: string;
  status: 'pendente' | 'pago' | 'vencido' | 'cancelado' | 'baixado';
  observacao: string;
  criadaEm: string;
}

export interface BoletoTemplate {
  id: string;
  nome: string;
  carteira: string;
  descricao: string;
  ativo: boolean;
  criadaEm: string;
}

const BOLETO_KEY = 'athos_boletos';
const TEMPLATE_KEY = 'athos_boleto_templates';

export const boletoService = new DataService<Boleto>(BOLETO_KEY);
export const boletoTemplateService = new DataService<BoletoTemplate>(TEMPLATE_KEY);

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function generateNossoNumero(): string {
  return (100000 + Math.floor(Math.random() * 900000)).toString();
}

function generateLinhaDigitavel(valor: number, _vencimento: string): string {
  const parts = [
    '23793.38128',
    '60000.000003',
    '90000.040000',
    '00000.00' + String(Math.floor(valor * 100)).slice(0, 2),
    String(Math.floor(Math.random() * 10)),
  ];
  return parts.join(' ');
}

function generateCodigoBarras(valor: number): string {
  const rand = Math.random().toString(36).slice(2, 35);
  return `2379338128${rand.slice(0, 15)}${String(Math.floor(valor * 100)).padStart(10, '0')}`;
}

export function getCedentePadrao() {
  return {
    cedenteNome: 'ATHOS Solution Tecnologia LTDA',
    cedenteCnpj: '00.000.000/0001-00',
    cedenteEndereco: 'Rua Exemplo, 123 - Centro',
    cedenteCidade: 'São Paulo',
    cedenteUf: 'SP',
    cedenteCep: '01000-000',
    cedenteBanco: 'Bradesco',
    cedenteAgencia: '0001',
    cedenteConta: '000000',
    cedenteCarteira: '109',
  };
}

export function getBoletos(): Boleto[] {
  return boletoService.getAll();
}

export function criarBoleto(data: Omit<Boleto, 'id' | 'criadaEm' | 'linhaDigitavel' | 'codigoBarras' | 'nossoNumero' | 'status' | 'cedenteNome' | 'cedenteCnpj' | 'cedenteEndereco' | 'cedenteCidade' | 'cedenteUf' | 'cedenteCep' | 'cedenteBanco' | 'cedenteAgencia' | 'cedenteConta' | 'cedenteCarteira'>): Boleto {
  const nossoNumero = generateNossoNumero();
  const linhaDigitavel = generateLinhaDigitavel(data.valor, data.vencimento);
  const codigoBarras = generateCodigoBarras(data.valor);
  const cedente = getCedentePadrao();

  const completo: Boleto = {
    ...cedente,
    ...data,
    id: uuid(),
    nossoNumero,
    linhaDigitavel,
    codigoBarras,
    status: 'pendente',
    criadaEm: new Date().toISOString().slice(0, 10),
  };

  boletoService.create(completo);
  api.notifyChange('create', BOLETO_KEY, completo.id, completo);
  return completo;
}

export function baixarBoleto(id: string): Boleto | undefined {
  const result = boletoService.update(id, { status: 'pago' });
  if (result) api.notifyChange('update', BOLETO_KEY, id, { status: 'pago' });
  return result;
}

export function cancelarBoleto(id: string): Boleto | undefined {
  const result = boletoService.update(id, { status: 'cancelado' });
  if (result) api.notifyChange('update', BOLETO_KEY, id, { status: 'cancelado' });
  return result;
}

export function excluirBoleto(id: string): boolean {
  const result = boletoService.delete(id);
  if (result) api.notifyChange('delete', BOLETO_KEY, id);
  return result;
}

export function verificarVencidos(): Boleto[] {
  const hoje = new Date().toLocaleDateString('pt-BR');
  return boletoService.getAll().filter(b => b.status === 'pendente' && b.vencimento < hoje);
}

export function getTemplates(): BoletoTemplate[] {
  return boletoTemplateService.getAll();
}

export function criarTemplate(data: Omit<BoletoTemplate, 'id' | 'criadaEm' | 'ativo'>): BoletoTemplate {
  const completo: BoletoTemplate = { ...data, id: uuid(), ativo: true, criadaEm: new Date().toISOString().slice(0, 10) };
  boletoTemplateService.create(completo);
  api.notifyChange('create', TEMPLATE_KEY, completo.id, completo);
  return completo;
}

export function excluirTemplate(id: string): boolean {
  const result = boletoTemplateService.delete(id);
  if (result) api.notifyChange('delete', TEMPLATE_KEY, id);
  return result;
}

export function seedTemplatesPadrao(): void {
  if (boletoTemplateService.getAll().length === 0) {
    const templates: Omit<BoletoTemplate, 'id' | 'criadaEm' | 'ativo'>[] = [
      { nome: 'Cobrança Padrão', carteira: '109', descricao: 'Boleto de cobrança básica com vencimento em 30 dias' },
      { nome: 'Cobrança Desconto', carteira: '109', descricao: 'Boleto com desconto de 2% para pagamento antecipado' },
      { nome: 'Cobrança Parcelada', carteira: '109', descricao: 'Boleto para parcela de financiamento' },
    ];
    templates.forEach(t => criarTemplate(t));
  }
}

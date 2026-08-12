import { DataService } from './dataService';
import { boletosService as boletosDb } from './supabaseService';

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

// Cache local (leitura síncrona). O Supabase é a fonte de verdade;
// isto existe só pra UI ter dado disponível antes do primeiro refresh
// e pra funcionar offline. Nunca é gravado aqui sem o Supabase confirmar antes.
export const boletoService = new DataService<Boleto>(BOLETO_KEY);

// Templates de boleto são só um preset local (não têm tabela própria no Supabase).
export const boletoTemplateService = new DataService<BoletoTemplate>(TEMPLATE_KEY);

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isUuid(id: string): boolean {
  return UUID_RE.test(id);
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

function fromDb(row: {
  id: string;
  sacado: string;
  cpf_cnpj: string;
  sacado_endereco?: string | null;
  valor: number | string;
  vencimento: string;
  data_emissao: string;
  linha_digitavel: string;
  codigo_barras: string;
  nosso_numero: string;
  status: Boleto['status'];
  observacao?: string | null;
  criado_em: string;
}): Boleto {
  return {
    ...getCedentePadrao(),
    id: row.id,
    sacado: row.sacado,
    cpfCnpj: row.cpf_cnpj,
    sacadoEndereco: row.sacado_endereco || '',
    valor: Number(row.valor),
    vencimento: row.vencimento,
    dataEmissao: row.data_emissao,
    linhaDigitavel: row.linha_digitavel,
    codigoBarras: row.codigo_barras,
    nossoNumero: row.nosso_numero,
    status: row.status,
    observacao: row.observacao || '',
    criadaEm: row.criado_em ? row.criado_em.slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
}

/** Busca a lista completa no Supabase e atualiza o cache local. Fonte de verdade. */
export async function refreshBoletos(): Promise<Boleto[]> {
  const rows = await boletosDb.getAll();
  const boletos = rows.map(fromDb);
  localStorage.setItem(BOLETO_KEY, JSON.stringify(boletos));
  return boletos;
}

/** Leitura síncrona do cache local (pode estar desatualizada até o próximo refreshBoletos). */
export function getBoletos(): Boleto[] {
  return boletoService.getAll();
}

export async function criarBoleto(data: Omit<Boleto, 'id' | 'criadaEm' | 'linhaDigitavel' | 'codigoBarras' | 'nossoNumero' | 'status' | 'cedenteNome' | 'cedenteCnpj' | 'cedenteEndereco' | 'cedenteCidade' | 'cedenteUf' | 'cedenteCep' | 'cedenteBanco' | 'cedenteAgencia' | 'cedenteConta' | 'cedenteCarteira'>): Promise<Boleto> {
  const nossoNumero = generateNossoNumero();
  const linhaDigitavel = generateLinhaDigitavel(data.valor, data.vencimento);
  const codigoBarras = generateCodigoBarras(data.valor);
  const cedente = getCedentePadrao();

  const created = await boletosDb.create({
    sacado: data.sacado,
    cpf_cnpj: data.cpfCnpj,
    sacado_endereco: data.sacadoEndereco,
    valor: data.valor,
    vencimento: data.vencimento,
    data_emissao: data.dataEmissao,
    linha_digitavel: linhaDigitavel,
    codigo_barras: codigoBarras,
    carteira: cedente.cedenteCarteira,
    nosso_numero: nossoNumero,
    status: 'pendente',
    observacao: data.observacao,
  } as any);

  if (!created) {
    throw new Error('Não foi possível salvar o boleto no Supabase.');
  }

  const completo = fromDb(created as any);
  boletoService.create(completo);
  return completo;
}

export async function baixarBoleto(id: string): Promise<Boleto | undefined> {
  if (!isUuid(id)) {
    console.warn(`Boleto ${id} não tem UUID válido — não sincroniza com o Supabase. Atualizado só localmente.`);
    return boletoService.update(id, { status: 'pago' });
  }
  const updated = await boletosDb.update(id, { status: 'pago' });
  if (!updated) throw new Error('Não foi possível baixar o boleto no Supabase.');
  const completo = fromDb(updated as any);
  boletoService.update(id, completo);
  return completo;
}

export async function cancelarBoleto(id: string): Promise<Boleto | undefined> {
  if (!isUuid(id)) {
    console.warn(`Boleto ${id} não tem UUID válido — não sincroniza com o Supabase. Atualizado só localmente.`);
    return boletoService.update(id, { status: 'cancelado' });
  }
  const updated = await boletosDb.update(id, { status: 'cancelado' });
  if (!updated) throw new Error('Não foi possível cancelar o boleto no Supabase.');
  const completo = fromDb(updated as any);
  boletoService.update(id, completo);
  return completo;
}

export async function excluirBoleto(id: string): Promise<boolean> {
  if (!isUuid(id)) {
    console.warn(`Boleto ${id} não tem UUID válido — não existe no Supabase. Removido só localmente.`);
    return boletoService.delete(id);
  }
  const ok = await boletosDb.delete(id);
  if (!ok) throw new Error('Não foi possível excluir o boleto no Supabase.');
  boletoService.delete(id);
  return true;
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
  return completo;
}

export function excluirTemplate(id: string): boolean {
  return boletoTemplateService.delete(id);
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

import { DataService } from './dataService';

export interface Lancamento {
  id: string;
  tipo: 'receita' | 'despesa';
  descricao: string;
  valor: number;
  vencimento: string;
  data: string;
  status: 'pendente' | 'pago' | 'recebido' | 'atrasado';
  categoria: string;
  contraparte: string;
  criadaEm: string;
}

const STORAGE_KEY = 'athos_lancamentos';
const OLD_PAGAR_KEY = 'athos_contas_pagar';
const OLD_RECEBER_KEY = 'athos_contas_receber';

export const lancamentoService = new DataService<Lancamento>(STORAGE_KEY);

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function migrar(): void {
  if (localStorage.getItem('athos_migracao_feita')) return;

  const oldPagar = localStorage.getItem(OLD_PAGAR_KEY);
  const oldReceber = localStorage.getItem(OLD_RECEBER_KEY);
  const novos: Lancamento[] = [];

  if (oldPagar) {
    try {
      const itens = JSON.parse(oldPagar);
      itens.forEach((i: any) => {
        novos.push({
          id: i.id || uuid(),
          tipo: 'despesa',
          descricao: i.descricao,
          valor: i.valor,
          vencimento: i.vencimento,
          data: i.vencimento,
          status: i.status === 'pago' ? 'pago' : i.status === 'atrasado' ? 'atrasado' : 'pendente',
          categoria: 'Geral',
          contraparte: i.fornecedor || '',
          criadaEm: new Date().toISOString().slice(0, 10),
        });
      });
    } catch {}
  }

  if (oldReceber) {
    try {
      const itens = JSON.parse(oldReceber);
      itens.forEach((i: any) => {
        novos.push({
          id: i.id || uuid(),
          tipo: 'receita',
          descricao: i.descricao,
          valor: i.valor,
          vencimento: i.vencimento,
          data: i.vencimento,
          status: i.status === 'recebido' ? 'recebido' : i.status === 'atrasado' ? 'atrasado' : 'pendente',
          categoria: 'Geral',
          contraparte: i.cliente || '',
          criadaEm: new Date().toISOString().slice(0, 10),
        });
      });
    } catch {}
  }

  if (novos.length > 0) {
    const existentes = lancamentoService.getAll();
    if (existentes.length === 0) {
      novos.forEach(n => lancamentoService.create(n));
    }
  }

  localStorage.setItem('athos_migracao_feita', '1');
}

export function getLancamentos(): Lancamento[] {
  migrar();
  return lancamentoService.getAll();
}

export function getDespesas(): Lancamento[] {
  return getLancamentos().filter(l => l.tipo === 'despesa');
}

export function getReceitas(): Lancamento[] {
  return getLancamentos().filter(l => l.tipo === 'receita');
}

export function criarLancamento(data: Omit<Lancamento, 'id' | 'criadaEm'>): Lancamento {
  const completo: Lancamento = { ...data, id: uuid(), criadaEm: new Date().toISOString().slice(0, 10) };
  lancamentoService.create(completo);
  return completo;
}

export function atualizarLancamento(id: string, data: Partial<Lancamento>): Lancamento | undefined {
  return lancamentoService.update(id, data);
}

export function excluirLancamento(id: string): boolean {
  return lancamentoService.delete(id);
}

export function getFluxoCaixaMensal(): { mes: string; receita: number; despesa: number; saldo: number }[] {
  const lancamentos = getLancamentos();
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const mapa: Record<string, { receita: number; despesa: number }> = {};

  lancamentos.forEach(l => {
    const mes = l.vencimento.split('/')[0];
    const nomeMes = meses[parseInt(mes) - 1] || mes;
    if (!mapa[nomeMes]) mapa[nomeMes] = { receita: 0, despesa: 0 };
    if (l.tipo === 'receita') mapa[nomeMes].receita += l.valor;
    else mapa[nomeMes].despesa += l.valor;
  });

  return Object.entries(mapa).map(([mes, v]) => ({
    mes,
    receita: v.receita,
    despesa: v.despesa,
    saldo: v.receita - v.despesa,
  }));
}

export function getDREValores(): {
  receitaBruta: number;
  deducoes: number;
  receitaLiquida: number;
  cpv: number;
  lucroBruto: number;
  despesasOperacionais: number;
  despesasFinanceiras: number;
  ebit: number;
  irContribuicoes: number;
  lucroLiquido: number;
} {
  const lancamentos = getLancamentos();
  const receitas = lancamentos.filter(l => l.tipo === 'receita' && (l.status === 'recebido' || l.status === 'pendente'));
  const despesas = lancamentos.filter(l => l.tipo === 'despesa' && (l.status === 'pago' || l.status === 'pendente'));

  const receitaBruta = receitas.reduce((s, l) => s + l.valor, 0);

  const categorias = despesas.reduce((acc, l) => {
    acc[l.categoria] = (acc[l.categoria] || 0) + l.valor;
    return acc;
  }, {} as Record<string, number>);

  const deducoes = categorias['Deduções'] || categorias['Deducoes'] || categorias['Impostos'] || 0;
  const cpv = (categorias['CPV'] || categorias['Custo'] || 0) + (categorias['Mercadorias'] || 0);
  const despesasOperacionais = (categorias['Operacional'] || categorias['Administrativo'] || categorias['Pessoal'] || categorias['Operacionais'] || 0)
    + (categorias['Marketing'] || 0) + (categorias['Aluguel'] || 0) + (categorias['Utilidades'] || 0);
  const despesasFinanceiras = categorias['Financeiro'] || categorias['Financeiras'] || categorias['Juros'] || 0;
  const irContribuicoes = categorias['IR'] || categorias['Impostos'] || categorias['Taxas'] || 0;

  const receitaLiquida = receitaBruta - deducoes;
  const lucroBruto = receitaLiquida - cpv;
  const ebit = lucroBruto - despesasOperacionais - despesasFinanceiras;
  const lucroLiquido = ebit - irContribuicoes;

  return { receitaBruta, deducoes, receitaLiquida, cpv, lucroBruto, despesasOperacionais, despesasFinanceiras, ebit, irContribuicoes, lucroLiquido };
}

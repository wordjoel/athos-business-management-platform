export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  sector: string;
  avatar: string;
  active: boolean;
  lastLogin: string;
  permissions: string[];
}

export interface Socio {
  id: string;
  name: string;
  email: string;
  participation: number;
  proLabore: number;
  active: boolean;
}

export interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  setor: string;
  fornecedor: string;
  vencimento: string;
  pago: boolean;
  dataPagamento?: string;
  centroCusto: string;
  recorrente: boolean;
  notaFiscal?: string;
  anormal?: boolean;
}

export interface Receita {
  id: string;
  descricao: string;
  valor: number;
  cliente: string;
  categoria: string;
  vencimento: string;
  recebido: boolean;
  dataRecebimento?: string;
  recorrente: boolean;
}

export interface Categoria {
  id: string;
  nome: string;
  tipo: 'despesa' | 'receita';
  cor: string;
  orcamento: number;
}

export interface Setor {
  id: string;
  nome: string;
  responsavel: string;
  orcamento: number;
  gastos: number;
  funcionarios: number;
  kpis: Record<string, number>;
  cor: string;
  status: 'ativo' | 'alerta' | 'critico';
}

export interface Fornecedor {
  id: string;
  nome: string;
  cnpj: string;
  contato: string;
  email: string;
  telefone: string;
  categoria: string;
  status: 'ativo' | 'inativo';
  valorMensal: number;
}

export interface Contrato {
  id: string;
  titulo: string;
  fornecedor: string;
  valor: number;
  inicio: string;
  fim: string;
  status: 'ativo' | 'encerrado' | 'pendente';
  renovacaoAutomatica: boolean;
}

export interface FluxoCaixa {
  mes: string;
  receitas: number;
  despesas: number;
  saldo: number;
  projetado?: boolean;
}

export interface Alerta {
  id: string;
  tipo: 'vencimento' | 'anormal' | 'orcamento' | 'sugestao';
  titulo: string;
  descricao: string;
  gravidade: 'alta' | 'media' | 'baixa';
  data: string;
  lido: boolean;
}

export interface Log {
  id: string;
  usuario: string;
  acao: string;
  modulo: string;
  data: string;
  detalhes: string;
}

export interface Relatorio {
  id: string;
  titulo: string;
  tipo: 'financeiro' | 'setorial' | 'executivo' | 'operacional' | 'performance';
  data: string;
  geradoPor: string;
  status: 'gerado' | 'pendente';
  pdf?: string;
}

export interface InsightIA {
  id: string;
  tipo: 'economia' | 'alerta' | 'oportunidade' | 'analise';
  titulo: string;
  descricao: string;
  impacto: 'alto' | 'medio' | 'baixo';
  data: string;
}

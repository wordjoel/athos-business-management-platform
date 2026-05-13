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

export interface ModuloATHOS {
  id: string;
  nome: string;
  icon: string;
  descricao: string;
  ativo: boolean;
  badge?: string;
}

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  origem: 'whatsapp' | 'site' | 'indicacao' | 'campanha' | 'cold';
  etapa: 'novo' | 'contatado' | 'qualificado' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';
  valor: number;
  probabilidade: number;
  ultimoContato: string;
  proximoContato: string;
  responsavel: string;
  tags: string[];
  score: number;
}

export interface Oportunidade {
  id: string;
  titulo: string;
  leadId: string;
  leadNome: string;
  valor: number;
  etapa: 'proposta' | 'negociacao' | 'fechamento' | 'ganho' | 'perdido';
  probFechamento: number;
  dataFechamentoPrevista: string;
  responsavel: string;
  notas: string[];
}

export interface ContaPagar {
  id: string;
  descricao: string;
  valor: number;
  fornecedor: string;
  categoria: string;
  centroCusto: string;
  vencimento: string;
  status: 'pendente' | 'pago' | 'atrasado' | 'cancelado';
  dataPagamento?: string;
  formaPagamento?: string;
  documento?: string;
  recorrente: boolean;
  parcela?: number;
  totalParcelas?: number;
}

export interface ContaReceber {
  id: string;
  descricao: string;
  valor: number;
  cliente: string;
  categoria: string;
  centroCusto: string;
  vencimento: string;
  status: 'pendente' | 'recebido' | 'atrasado' | 'cancelado';
  dataRecebimento?: string;
  formaPagamento?: string;
  documento?: string;
  recorrente: boolean;
  parcela?: number;
  totalParcelas?: number;
}

export interface CentroCusto {
  id: string;
  nome: string;
  tipo: 'departamento' | 'projeto' | 'filial';
  orcamento: number;
  utilizado: number;
  responsavel: string;
  cor: string;
}

export interface ContratoDigital {
  id: string;
  titulo: string;
  tipo: 'prestacao_servico' | 'licenca' | 'comodato' | 'parceria' | 'fornecimento';
  partes: { nome: string; documento: string; email: string }[];
  valor: number;
 Periodicidade: 'mensal' | 'trimestral' | 'semestral' | 'anual' | 'unica';
  inicio: string;
  fim: string;
  status: 'rascunho' | 'enviado' | 'assinado' | 'ativo' | 'encerrado' | 'cancelado';
  arquivo?: string;
  assinaturas: { parte: string; data?: string; ip?: string; hash?: string }[];
  versao: number;
  historico: { versao: number; data: string; alteracao: string }[];
  automacoes: { tipo: 'renovacao' | 'alerta_vencimento' | 'faturamento'; config: Record<string, unknown> }[];
}

export interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  categoria: 'incidente' | 'solicitacao' | 'duvida' | 'sugestao';
  prioridade: 'critica' | 'alta' | 'media' | 'baixa';
  status: 'aberto' | 'em_andamento' | 'pendente' | 'resolvido' | 'fechado';
  solicitante: string;
  responsavel?: string;
  SLA: { inicio: string; limite: string; resposta?: string; solucao?: string };
  historico: { data: string; acao: string; usuario: string; observacao?: string }[];
  avaliacao?: number;
  solucao?: string;
  tempoResposta?: number;
  tempoResolucao?: number;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  projetoId: string;
  responsavel: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'bloqueada';
  prioridade: 'critica' | 'alta' | 'media' | 'baixa';
  estimativa: number;
  complexidade: 'simples' | 'media' | 'complexa';
  tags: string[];
  prazo: string;
  dependencias?: string[];
}

export interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  status: 'planejamento' | 'em_andamento' | 'pausado' | 'concluido' | 'cancelado';
  metodologia: 'kanban' | 'scrum' | 'waterfall' | 'hibrida';
  responsavel: string;
  dataInicio: string;
  dataFimPrevista: string;
  orcamento: number;
  gastos: number;
  progresso: number;
  sprints?: { nome: string; inicio: string; fim: string; status: 'ativa' | 'concluida' }[];
  sprintsAtivas?: number;
  membros: { usuario: string; funcao: string }[];
  tarefasConcluidas: number;
  tarefasTotal: number;
}

export interface Funcionario {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: 'ativo' | 'afastado' | 'desligado';
  salario: number;
  beneficios: string[];
  documentos: { tipo: string; arquivo: string; validade?: string }[];
  registrosPonto: { data: string; entrada?: string; saida?: string; localizacao?: string }[];
}

export interface Ativo {
  id: string;
  nome: string;
  tipo: 'equipamento' | 'veiculo' | 'imovel' | 'software' | 'mobiliario';
  descricao: string;
  localizacao: string;
  responsavel: string;
  dataAquisicao: string;
  valor: number;
  vidaUtil: number;
  depreciacao: number;
  status: 'disponivel' | 'em_uso' | 'manutencao' | 'baixa';
 Serial?: string;
  patrimonio?: string;
  historico: { data: string; acao: string; usuario: string }[];
}

export interface Camera {
  id: string;
  nome: string;
  local: string;
  ip: string;
  status: 'online' | 'offline' | 'manutencao';
  ultimoAcesso?: string;
  alertas: { tipo: string; data: string; descricao: string }[];
}

export interface AlertaSistema {
  id: string;
  tipo: 'acesso' | 'movimento' | 'intrusao' | 'falha' | 'manutencao';
  gravidade: 'critica' | 'alta' | 'media' | 'baixa';
  titulo: string;
  descricao: string;
  origem: string;
  data: string;
 Ack?: { usuario: string; data: string };
  resolvido: boolean;
}
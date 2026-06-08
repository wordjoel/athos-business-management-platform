import { DataService } from './dataService';
import { Lancamento, lancamentoService } from './lancamentoService';

export interface MesFiscal {
  id: string;
  mes: string;
  receita: number;
  despesa: number;
  saldo: number;
  projetado?: boolean;
}

export interface DreItem {
  id: string;
  descricao: string;
  valor: number;
  soma?: boolean;
  destaque?: boolean;
  competencia: string;
}

export interface PrevisaoIA {
  id: string;
  indicador: string;
  atual: string;
  projetado: string;
  variacao: string;
}

export interface AlertaIA {
  id: string;
  tipo: 'receita' | 'despesa' | 'fluxo';
  mensagem: string;
  impacto: 'alto' | 'medio' | 'baixo';
}

export interface Modelo {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  clausulas: number;
  updatedAt: string;
}

export interface Assinatura {
  id: string;
  documento: string;
  signatario: string;
  email: string;
  status: 'pendente' | 'assinado' | 'expirado';
  dataEnvio: string;
  dataAssinatura?: string;
}

export interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  solicitante: string;
  setor: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'aberto' | 'em_andamento' | 'resolvido' | 'fechado';
  dataAbertura: string;
  dataFechamento?: string;
}

export interface InventarioItem {
  id: string;
  nome: string;
  categoria: string;
  quantidade: number;
  localizacao: string;
  status: 'disponivel' | 'em_uso' | 'manutencao';
  observacao?: string;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  responsavel: string;
  prioridade: 'baixa' | 'media' | 'alta';
  status: 'pendente' | 'em_andamento' | 'concluida';
  dataCriacao: string;
  dataConclusao?: string;
}

export interface ColunaKanban {
  id: string;
  titulo: string;
  tarefas: string[];
}

export interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  email: string;
  telefone: string;
  dataAdmissao: string;
  status: 'ativo' | 'ferias' | 'afastado';
  salario: number;
}

export interface RegistroPonto {
  id: string;
  funcionario: string;
  data: string;
  entrada: string;
  saida: string;
  horas: number;
  status: 'normal' | 'atraso' | 'hora_extra';
}

export interface OnboardingItem {
  id: string;
  funcionario: string;
  cargo: string;
  dataInicio: string;
  tutor: string;
  etapas: number;
  etapasConcluidas: number;
  status: 'em_andamento' | 'concluido';
}

export const fluxoCaixaService = new DataService<MesFiscal>('athos_fluxo_caixa');
export const dreService = new DataService<DreItem>('athos_dre_itens');
export const previsaoIAService = new DataService<PrevisaoIA>('athos_previsoes_ia');
export const alertaIAService = new DataService<AlertaIA>('athos_alertas_ia');
export const modelosService = new DataService<Modelo>('athos_modelos');
export const assinaturasService = new DataService<Assinatura>('athos_assinaturas');
export const chamadosService = new DataService<Chamado>('athos_chamados');
export const inventarioService = new DataService<InventarioItem>('athos_inventario');
export const tarefasService = new DataService<Tarefa>('athos_tarefas');
export const colunasKanbanService = new DataService<ColunaKanban>('athos_kanban_colunas');
export const funcionariosService = new DataService<Funcionario>('athos_funcionarios');
export const pontoService = new DataService<RegistroPonto>('athos_ponto_digital');
export const onboardingService = new DataService<OnboardingItem>('athos_onboarding');

function uuid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

export function seedAllData(): void {
  // Seed removido - apenas dados reais do usuário são preservados
}

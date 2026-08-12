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
  fluxoCaixaService.seed([
    { id: uuid(), mes: 'Jan', receita: 95000, despesa: 72000, saldo: 23000 },
    { id: uuid(), mes: 'Fev', receita: 88000, despesa: 68000, saldo: 20000 },
    { id: uuid(), mes: 'Mar', receita: 102000, despesa: 75000, saldo: 27000 },
    { id: uuid(), mes: 'Abr', receita: 115000, despesa: 82000, saldo: 33000 },
    { id: uuid(), mes: 'Mai', receita: 125000, despesa: 87500, saldo: 37500 },
    { id: uuid(), mes: 'Jun', receita: 130000, despesa: 90000, saldo: 40000, projetado: true },
    { id: uuid(), mes: 'Jul', receita: 0, despesa: 0, saldo: 0, projetado: true },
  ]);

  dreService.seed([]);

  previsaoIAService.seed([
    { id: uuid(), indicador: 'Receita Junho', atual: 'R$ 130.000', projetado: 'R$ 142.000', variacao: '+9%' },
    { id: uuid(), indicador: 'Receita Julho', atual: '-', projetado: 'R$ 155.000', variacao: '+19%' },
    { id: uuid(), indicador: 'Despesas Junho', atual: 'R$ 90.000', projetado: 'R$ 92.000', variacao: '+2%' },
  ]);

  alertaIAService.seed([
    { id: uuid(), tipo: 'receita', mensagem: 'Sazonalidade positiva detectada para os próximos meses', impacto: 'alto' },
    { id: uuid(), tipo: 'despesa', mensagem: 'Aumento esperado em custos de pessoal (reajuste coletivo)', impacto: 'medio' },
    { id: uuid(), tipo: 'fluxo', mensagem: 'Saldo negativo previsto para terceira semana de Junho', impacto: 'baixo' },
  ]);

  modelosService.seed([
    { id: uuid(), nome: 'Contrato de Prestação de Serviços', descricao: 'Modelo genérico para prestação de serviços', categoria: 'Serviços', clausulas: 12, updatedAt: '15/05/2026' },
    { id: uuid(), nome: 'Acordo de Confidencialidade (NDA)', descricao: 'Proteção de informações sensíveis', categoria: 'Jurídico', clausulas: 8, updatedAt: '10/05/2026' },
    { id: uuid(), nome: 'Contrato de Locação', descricao: 'Locação comercial e residencial', categoria: 'Imobiliário', clausulas: 15, updatedAt: '22/04/2026' },
    { id: uuid(), nome: 'Termo de Responsabilidade', descricao: 'Termo para entrega de equipamentos', categoria: 'RH', clausulas: 6, updatedAt: '05/04/2026' },
  ]);

  assinaturasService.seed([
    { id: uuid(), documento: 'Contrato - Cliente ABC Ltda', signatario: 'Carlos Andrade', email: 'carlos@abc.com', status: 'assinado', dataEnvio: '20/05/2026', dataAssinatura: '22/05/2026' },
    { id: uuid(), documento: 'NDA - Projeto X', signatario: 'Marina Silva', email: 'marina@tech.com', status: 'pendente', dataEnvio: '24/05/2026' },
    { id: uuid(), documento: 'Contrato de Locação - Filial', signatario: 'José Santos', email: 'jose@imob.com', status: 'assinado', dataEnvio: '15/05/2026', dataAssinatura: '18/05/2026' },
  ]);

  chamadosService.seed([
    { id: uuid(), titulo: 'Notebook não liga', descricao: 'Equipamento do setor financeiro não responde', solicitante: 'Ana Oliveira', setor: 'Financeiro', prioridade: 'alta', status: 'aberto', dataAbertura: '25/05/2026' },
    { id: uuid(), titulo: 'Acesso ao sistema ERP', descricao: 'Novo funcionário sem permissão', solicitante: 'RH', setor: 'TI', prioridade: 'media', status: 'em_andamento', dataAbertura: '23/05/2026' },
    { id: uuid(), titulo: 'Impressora com defeito', descricao: 'Impressora do andar 3 não imprime', solicitante: 'Pedro Costa', setor: 'Administrativo', prioridade: 'baixa', status: 'resolvido', dataAbertura: '20/05/2026', dataFechamento: '22/05/2026' },
    { id: uuid(), titulo: 'Vazamento no ar-condicionado', descricao: 'Sala de reuniões 2 com infiltração', solicitante: 'Recepção', setor: 'Facilities', prioridade: 'critica', status: 'aberto', dataAbertura: '26/05/2026' },
  ]);

  inventarioService.seed([
    { id: uuid(), nome: 'Notebook Dell Latitude', categoria: 'Informática', quantidade: 15, localizacao: 'Sala 201', status: 'disponivel' },
    { id: uuid(), nome: 'Monitor 27" LG', categoria: 'Informática', quantidade: 8, localizacao: 'Sala 202', status: 'em_uso' },
    { id: uuid(), nome: 'Impressora HP LaserJet', categoria: 'Impressão', quantidade: 3, localizacao: 'Andar Térreo', status: 'disponivel' },
    { id: uuid(), nome: 'Projetor Epson', categoria: 'Multimídia', quantidade: 2, localizacao: 'Sala 101', status: 'manutencao' },
    { id: uuid(), nome: 'Mesa de Reunião 8 lugares', categoria: 'Mobiliário', quantidade: 4, localizacao: 'Salas de Reunião', status: 'disponivel' },
  ]);

  tarefasService.seed([
    { id: uuid(), titulo: 'Revisar balancete mensal', descricao: 'Conferir lançamentos contábeis do mês', responsavel: 'Joel Oliveira', prioridade: 'alta', status: 'em_andamento', dataCriacao: '24/05/2026' },
    { id: uuid(), titulo: 'Atualizar contrato cliente Y', responsavel: 'Oscar Carvalho', prioridade: 'media', status: 'pendente', dataCriacao: '25/05/2026' },
    { id: uuid(), titulo: 'Comprar suprimentos de escritório', descricao: 'Papel, toners, canetas', responsavel: 'Administrativo', prioridade: 'baixa', status: 'concluida', dataCriacao: '20/05/2026', dataConclusao: '21/05/2026' },
    { id: uuid(), titulo: 'Preparar apresentação conselho', descricao: 'Slides com resultados do trimestre', responsavel: 'Kleber Duarte', prioridade: 'alta', status: 'pendente', dataCriacao: '26/05/2026' },
  ]);

  colunasKanbanService.seed([
    { id: 'kanban-todo', titulo: 'A Fazer', tarefas: ['Atualizar contrato cliente Y', 'Preparar apresentação conselho'] },
    { id: 'kanban-doing', titulo: 'Em Andamento', tarefas: ['Revisar balancete mensal'] },
    { id: 'kanban-done', titulo: 'Concluído', tarefas: ['Comprar suprimentos de escritório'] },
  ]);

  funcionariosService.seed([
    { id: uuid(), nome: 'Kleber Duarte', cargo: 'CEO - Chief Executive Officer', departamento: 'Diretoria', email: 'kleber@athos.com', telefone: '(11) 99999-0001', dataAdmissao: '02/01/2020', status: 'ativo', salario: 45000 },
    { id: uuid(), nome: 'Joel Oliveira', cargo: 'Diretor Administrativo e Financeiro', departamento: 'Financeiro', email: 'joel@athos.com', telefone: '(11) 99999-0002', dataAdmissao: '02/01/2020', status: 'ativo', salario: 35000 },
    { id: uuid(), nome: 'Oscar Carvalho', cargo: 'Diretor de Qualidade e Desenvolvimento', departamento: 'Qualidade', email: 'oscar@athos.com', telefone: '(11) 99999-0003', dataAdmissao: '02/01/2020', status: 'ativo', salario: 32000 },
  ]);

  pontoService.seed([
    { id: uuid(), funcionario: 'Kleber Duarte', data: '26/05/2026', entrada: '07:55', saida: '19:10', horas: 9.25, status: 'hora_extra' },
    { id: uuid(), funcionario: 'Joel Oliveira', data: '26/05/2026', entrada: '08:10', saida: '18:20', horas: 8.25, status: 'normal' },
    { id: uuid(), funcionario: 'Oscar Carvalho', data: '26/05/2026', entrada: '08:00', saida: '18:00', horas: 8, status: 'normal' },
  ]);

  onboardingService.seed([]);

  // Forçar migração e limpeza do localStorage existente
  try {
    const existingFuncs = localStorage.getItem('athos_funcionarios');
    if (existingFuncs) {
      const list = JSON.parse(existingFuncs);
      const filtered = list.filter((f: any) =>
        f.nome === 'Kleber Duarte' || f.nome === 'Joel Oliveira' || f.nome === 'Oscar Carvalho'
      ).map((f: any) => {
        if (f.nome === 'Kleber Duarte') f.cargo = 'CEO - Chief Executive Officer';
        if (f.nome === 'Joel Oliveira') f.cargo = 'Diretor Administrativo e Financeiro';
        if (f.nome === 'Oscar Carvalho') f.cargo = 'Diretor de Qualidade e Desenvolvimento';
        return f;
      });
      localStorage.setItem('athos_funcionarios', JSON.stringify(filtered));
    }

    const existingPonto = localStorage.getItem('athos_ponto_digital');
    if (existingPonto) {
      const list = JSON.parse(existingPonto);
      const filtered = list.filter((p: any) =>
        p.funcionario === 'Kleber Duarte' || p.funcionario === 'Joel Oliveira' || p.funcionario === 'Oscar Carvalho'
      );
      localStorage.setItem('athos_ponto_digital', JSON.stringify(filtered));
    }

    localStorage.setItem('athos_onboarding', JSON.stringify([]));
  } catch (e) {
    console.error('Erro na migração de dados do localStorage:', e);
  }

  // Migrar dados do formato antigo se existirem
  const oldPagar = localStorage.getItem('athos_contas_pagar');
  const oldReceber = localStorage.getItem('athos_contas_receber');
  if ((!localStorage.getItem('athos_lancamentos') || JSON.parse(localStorage.getItem('athos_lancamentos')!).length === 0) && (oldPagar || oldReceber)) {
    try {
      if (oldPagar) JSON.parse(oldPagar).forEach((i: any) => lancamentoService.create({ id: Math.random().toString(36).substring(2, 9), tipo: 'despesa', descricao: i.descricao, contraparte: i.fornecedor || '', valor: i.valor, vencimento: i.vencimento, data: i.vencimento, status: i.status === 'pago' ? 'pago' : i.status === 'atrasado' ? 'atrasado' : 'pendente', categoria: i.categoria || 'Geral', criadaEm: new Date().toISOString().slice(0, 10) }));
      if (oldReceber) JSON.parse(oldReceber).forEach((i: any) => lancamentoService.create({ id: Math.random().toString(36).substring(2, 9), tipo: 'receita', descricao: i.descricao, contraparte: i.cliente || '', valor: i.valor, vencimento: i.vencimento, data: i.vencimento, status: i.status === 'recebido' ? 'recebido' : i.status === 'atrasado' ? 'atrasado' : 'pendente', categoria: i.categoria || 'Geral', criadaEm: new Date().toISOString().slice(0, 10) }));
    } catch {}
  }
}

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

export interface Camera {
  id: string;
  nome: string;
  localizacao: string;
  status: 'online' | 'offline' | 'manutencao';
  ultimoEvento: string;
  resolucao: string;
}

export interface AlertaSeguranca {
  id: string;
  tipo: string;
  descricao: string;
  localizacao: string;
  data: string;
  gravidade: 'baixa' | 'media' | 'alta' | 'critica';
  status: 'novo' | 'em_analise' | 'resolvido';
}

export interface Ativo {
  id: string;
  nome: string;
  categoria: string;
  valor: number;
  localizacao: string;
  dataAquisicao: string;
  status: 'operacional' | 'manutencao' | 'inativo';
  vidaUtil: number;
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
export const camerasService = new DataService<Camera>('athos_cameras');
export const alertasService = new DataService<AlertaSeguranca>('athos_alertas_seguranca');
export const ativosService = new DataService<Ativo>('athos_ativos');

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
    { id: uuid(), nome: 'Kleber Duarte', cargo: 'CEO', departamento: 'Diretoria', email: 'kleber@athos.com', telefone: '(11) 99999-0001', dataAdmissao: '02/01/2020', status: 'ativo', salario: 45000 },
    { id: uuid(), nome: 'Joel Oliveira', cargo: 'Diretor Adm/Financeiro', departamento: 'Financeiro', email: 'joel@athos.com', telefone: '(11) 99999-0002', dataAdmissao: '02/01/2020', status: 'ativo', salario: 35000 },
    { id: uuid(), nome: 'Oscar Carvalho', cargo: 'Diretor de Qualidade', departamento: 'Qualidade', email: 'oscar@athos.com', telefone: '(11) 99999-0003', dataAdmissao: '02/01/2020', status: 'ativo', salario: 32000 },
    { id: uuid(), nome: 'Mauricio Baro', cargo: 'Diretor de Produtos', departamento: 'Produtos', email: 'mauricio@athos.com', telefone: '(11) 99999-0004', dataAdmissao: '02/01/2020', status: 'ferias', salario: 33000 },
    { id: uuid(), nome: 'Luiz Victor', cargo: 'Diretor Comercial', departamento: 'Comercial', email: 'luiz@athos.com', telefone: '(11) 99999-0005', dataAdmissao: '02/01/2020', status: 'ativo', salario: 34000 },
    { id: uuid(), nome: 'Ana Oliveira', cargo: 'Analista Financeiro', departamento: 'Financeiro', email: 'ana@athos.com', telefone: '(11) 98888-0001', dataAdmissao: '10/03/2021', status: 'ativo', salario: 8500 },
    { id: uuid(), nome: 'Carlos Santos', cargo: 'Desenvolvedor', departamento: 'TI', email: 'carlos@athos.com', telefone: '(11) 97777-0001', dataAdmissao: '15/07/2022', status: 'ativo', salario: 12000 },
  ]);

  pontoService.seed([
    { id: uuid(), funcionario: 'Ana Oliveira', data: '26/05/2026', entrada: '08:02', saida: '18:05', horas: 8.5, status: 'normal' },
    { id: uuid(), funcionario: 'Carlos Santos', data: '26/05/2026', entrada: '08:45', saida: '18:30', horas: 8.75, status: 'atraso' },
    { id: uuid(), funcionario: 'Kleber Duarte', data: '26/05/2026', entrada: '07:55', saida: '19:10', horas: 9.25, status: 'hora_extra' },
    { id: uuid(), funcionario: 'Ana Oliveira', data: '25/05/2026', entrada: '08:00', saida: '17:50', horas: 8, status: 'normal' },
    { id: uuid(), funcionario: 'Carlos Santos', data: '25/05/2026', entrada: '07:58', saida: '18:00', horas: 8, status: 'normal' },
    { id: uuid(), funcionario: 'Joel Oliveira', data: '26/05/2026', entrada: '08:10', saida: '18:20', horas: 8.25, status: 'normal' },
  ]);

  onboardingService.seed([
    { id: uuid(), funcionario: 'Marina Rocha', cargo: 'Analista de Marketing', dataInicio: '20/05/2026', tutor: 'Luiz Victor', etapas: 8, etapasConcluidas: 5, status: 'em_andamento' },
    { id: uuid(), funcionario: 'Rafael Torres', cargo: 'Dev Jr', dataInicio: '02/05/2026', tutor: 'Carlos Santos', etapas: 8, etapasConcluidas: 8, status: 'concluido' },
  ]);

  camerasService.seed([
    { id: uuid(), nome: 'Câmera Principal - Hall', localizacao: 'Hall de Entrada', status: 'online', ultimoEvento: 'Movimento detectado 08:23', resolucao: '4K' },
    { id: uuid(), nome: 'Câmera Estacionamento', localizacao: 'Estacionamento Subsolo', status: 'online', ultimoEvento: 'Placa XXX-0000 07:45', resolucao: '1080p' },
    { id: uuid(), nome: 'Câmera Almoxarifado', localizacao: 'Almoxarifado', status: 'offline', ultimoEvento: 'Queda de conexão 25/05', resolucao: '1080p' },
    { id: uuid(), nome: 'Câmera Sala Servidores', localizacao: 'Datacenter', status: 'manutencao', ultimoEvento: 'Manutenção programada', resolucao: '4K' },
  ]);

  alertasService.seed([
    { id: uuid(), tipo: 'Acesso não autorizado', descricao: 'Tentativa de acesso à sala de servidores sem credencial', localizacao: 'Datacenter', data: '26/05/2026 14:32', gravidade: 'critica', status: 'novo' },
    { id: uuid(), tipo: 'Porta aberta', descricao: 'Porta lateral do estacionamento permaneceu aberta por 15min', localizacao: 'Estacionamento', data: '26/05/2026 03:15', gravidade: 'media', status: 'em_analise' },
    { id: uuid(), tipo: 'Câmera offline', descricao: 'Câmera do almoxarifado sem conexão', localizacao: 'Almoxarifado', data: '25/05/2026 18:00', gravidade: 'alta', status: 'em_analise' },
    { id: uuid(), tipo: 'Movimento suspeito', descricao: 'Movimento identificado após horário comercial no andar 2', localizacao: 'Andar 2', data: '25/05/2026 22:10', gravidade: 'alta', status: 'novo' },
  ]);

  ativosService.seed([
    { id: uuid(), nome: 'Servidor Dell PowerEdge', categoria: 'Servidores', valor: 85000, localizacao: 'Datacenter', dataAquisicao: '15/01/2023', status: 'operacional', vidaUtil: 60 },
    { id: uuid(), nome: 'Switch Cisco 48 portas', categoria: 'Redes', valor: 12000, localizacao: 'Datacenter', dataAquisicao: '15/01/2023', status: 'operacional', vidaUtil: 72 },
    { id: uuid(), nome: 'Gerador de Energia', categoria: 'Infraestrutura', valor: 45000, localizacao: 'Subsolo', dataAquisicao: '20/03/2024', status: 'manutencao', vidaUtil: 120 },
    { id: uuid(), nome: 'Sistema de Refrigeração', categoria: 'Infraestrutura', valor: 32000, localizacao: 'Cobertura', dataAquisicao: '20/03/2024', status: 'operacional', vidaUtil: 96 },
    { id: uuid(), nome: 'No-break APC 10kVA', categoria: 'Infraestrutura', valor: 18000, localizacao: 'Datacenter', dataAquisicao: '15/01/2023', status: 'operacional', vidaUtil: 60 },
  ]);

  // Migrar dados do formato antigo se existirem (sem dados ficticios)
  const oldPagar = localStorage.getItem('athos_contas_pagar');
  const oldReceber = localStorage.getItem('athos_contas_receber');
  if ((!localStorage.getItem('athos_lancamentos') || JSON.parse(localStorage.getItem('athos_lancamentos')!).length === 0) && (oldPagar || oldReceber)) {
    try {
      if (oldPagar) JSON.parse(oldPagar).forEach((i: any) => lancamentoService.create({ tipo: 'despesa', descricao: i.descricao, contraparte: i.fornecedor || '', valor: i.valor, vencimento: i.vencimento, data: i.vencimento, status: i.status === 'pago' ? 'pago' : i.status === 'atrasado' ? 'atrasado' : 'pendente', categoria: i.categoria || 'Geral', criadaEm: new Date().toISOString().slice(0, 10) }));
      if (oldReceber) JSON.parse(oldReceber).forEach((i: any) => lancamentoService.create({ tipo: 'receita', descricao: i.descricao, contraparte: i.cliente || '', valor: i.valor, vencimento: i.vencimento, data: i.vencimento, status: i.status === 'recebido' ? 'recebido' : i.status === 'atrasado' ? 'atrasado' : 'pendente', categoria: i.categoria || 'Geral', criadaEm: new Date().toISOString().slice(0, 10) }));
    } catch {}
  }
}

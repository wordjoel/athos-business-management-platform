import { User, Socio, Despesa, Receita, Categoria, Setor, Fornecedor, Contrato, FluxoCaixa, Alerta, Log, Relatorio, InsightIA } from '../types';

export const users: User[] = [
  { id: '1', name: 'Carlos Mendes', email: 'carlos@athos.com', role: 'admin', sector: 'Administrativo', avatar: 'CM', active: true, lastLogin: '2025-01-15 09:30', permissions: ['all'] },
  { id: '2', name: 'Ana Oliveira', email: 'ana@athos.com', role: 'manager', sector: 'Financeiro', avatar: 'AO', active: true, lastLogin: '2025-01-15 08:45', permissions: ['financeiro', 'relatorios'] },
  { id: '3', name: 'Roberto Silva', email: 'roberto@athos.com', role: 'manager', sector: 'Comercial', avatar: 'RS', active: true, lastLogin: '2025-01-14 17:20', permissions: ['comercial', 'relatorios'] },
  { id: '4', name: 'Juliana Costa', email: 'juliana@athos.com', role: 'user', sector: 'RH', avatar: 'JC', active: true, lastLogin: '2025-01-15 07:00', permissions: ['rh'] },
  { id: '5', name: 'Marcos Pereira', email: 'marcos@athos.com', role: 'user', sector: 'Tecnologia', avatar: 'MP', active: true, lastLogin: '2025-01-14 22:15', permissions: ['tecnologia'] },
  { id: '6', name: 'Fernanda Lima', email: 'fernanda@athos.com', role: 'viewer', sector: 'Operacional', avatar: 'FL', active: false, lastLogin: '2024-12-20 14:00', permissions: ['operacional'] },
];

export const socios: Socio[] = [
  { id: '1', name: 'Carlos Mendes', email: 'carlos@athos.com', participation: 45, proLabore: 15000, active: true },
  { id: '2', name: 'Ricardo Almeida', email: 'ricardo@athos.com', participation: 35, proLabore: 12000, active: true },
  { id: '3', name: 'Patricia Santos', email: 'patricia@athos.com', participation: 20, proLabore: 10000, active: true },
];

export const despesas: Despesa[] = [
  { id: '1', descricao: 'Aluguel escritório', valor: 12500, categoria: 'Infraestrutura', setor: 'Administrativo', fornecedor: 'Imobiliária Central', vencimento: '2025-01-10', pago: true, dataPagamento: '2025-01-09', centroCusto: 'ADM-001', recorrente: true, notaFiscal: 'NF-2024-001' },
  { id: '2', descricao: 'Licenças software', valor: 4800, categoria: 'Tecnologia', setor: 'Tecnologia', fornecedor: 'Microsoft Corp', vencimento: '2025-01-15', pago: true, dataPagamento: '2025-01-14', centroCusto: 'TEC-001', recorrente: true, notaFiscal: 'NF-2024-002' },
  { id: '3', descricao: 'Folha de pagamento', valor: 85000, categoria: 'Pessoal', setor: 'RH', fornecedor: 'Funcionários', vencimento: '2025-01-05', pago: true, dataPagamento: '2025-01-05', centroCusto: 'RH-001', recorrente: true, notaFiscal: '' },
  { id: '4', descricao: 'Marketing digital', valor: 8500, categoria: 'Marketing', setor: 'Comercial', fornecedor: 'Agência Digital X', vencimento: '2025-01-20', pago: false, centroCusto: 'COM-001', recorrente: true },
  { id: '5', descricao: 'Energia elétrica', valor: 2200, categoria: 'Infraestrutura', setor: 'Operacional', fornecedor: 'CPFL', vencimento: '2025-01-18', pago: false, centroCusto: 'OPE-001', recorrente: true },
  { id: '6', descricao: 'Consultoria jurídica', valor: 6500, categoria: 'Serviços', setor: 'Administrativo', fornecedor: 'Advocacia Santos', vencimento: '2025-01-25', pago: false, centroCusto: 'ADM-002', recorrente: false },
  { id: '7', descricao: 'Material de escritório', valor: 1200, categoria: 'Material', setor: 'Administrativo', fornecedor: 'Papelaria Express', vencimento: '2025-01-22', pago: false, centroCusto: 'ADM-003', recorrente: false },
  { id: '8', descricao: 'Servidor AWS', valor: 3200, categoria: 'Tecnologia', setor: 'Tecnologia', fornecedor: 'Amazon Web Services', vencimento: '2025-01-08', pago: true, dataPagamento: '2025-01-08', centroCusto: 'TEC-002', recorrente: true, notaFiscal: 'NF-2024-003' },
  { id: '9', descricao: 'Treinamento equipe', valor: 15000, categoria: 'Capacitação', setor: 'RH', fornecedor: 'Training Corp', vencimento: '2025-02-01', pago: false, centroCusto: 'RH-002', recorrente: false, anormal: true },
  { id: '10', descricao: 'Manutenção equipamentos', valor: 3800, categoria: 'Manutenção', setor: 'Operacional', fornecedor: 'TechFix', vencimento: '2025-01-28', pago: false, centroCusto: 'OPE-002', recorrente: false },
  { id: '11', descricao: 'Telefone/Internet', valor: 1800, categoria: 'Infraestrutura', setor: 'Administrativo', fornecedor: 'Vivo', vencimento: '2025-01-12', pago: true, dataPagamento: '2025-01-11', centroCusto: 'ADM-004', recorrente: true },
  { id: '12', descricao: 'Contabilidade', valor: 3500, categoria: 'Serviços', setor: 'Financeiro', fornecedor: 'Contábil Plus', vencimento: '2025-01-15', pago: true, dataPagamento: '2025-01-15', centroCusto: 'FIN-001', recorrente: true },
  { id: '13', descricao: 'Seguros', valor: 4200, categoria: 'Seguros', setor: 'Administrativo', fornecedor: 'Porto Seguro', vencimento: '2025-01-30', pago: false, centroCusto: 'ADM-005', recorrente: true },
  { id: '14', descricao: 'Impostos - Simples', valor: 18500, categoria: 'Impostos', setor: 'Financeiro', fornecedor: 'Receita Federal', vencimento: '2025-01-20', pago: false, centroCusto: 'FIN-002', recorrente: true },
  { id: '15', descricao: 'Viagem negócios', valor: 7500, categoria: 'Viagem', setor: 'Comercial', fornecedor: 'Vários', vencimento: '2025-01-16', pago: false, centroCusto: 'COM-002', recorrente: false, anormal: true },
];

export const receitas: Receita[] = [
  { id: '1', descricao: 'Projeto Alpha Corp', valor: 45000, cliente: 'Alpha Corp', categoria: 'Serviços', vencimento: '2025-01-10', recebido: true, dataRecebimento: '2025-01-10', recorrente: false },
  { id: '2', descricao: 'Consultoria Beta Ltda', valor: 28000, cliente: 'Beta Ltda', categoria: 'Consultoria', vencimento: '2025-01-15', recebido: true, dataRecebimento: '2025-01-14', recorrente: false },
  { id: '3', descricao: 'Mensalidade Gamma SA', valor: 12000, cliente: 'Gamma SA', categoria: 'Recorrente', vencimento: '2025-01-05', recebido: true, dataRecebimento: '2025-01-05', recorrente: true },
  { id: '4', descricao: 'Projeto Delta Tech', valor: 67000, cliente: 'Delta Tech', categoria: 'Projetos', vencimento: '2025-01-25', recebido: false, recorrente: false },
  { id: '5', descricao: 'Mensalidade Epsilon', valor: 15000, cliente: 'Epsilon Group', categoria: 'Recorrente', vencimento: '2025-01-20', recebido: false, recorrente: true },
  { id: '6', descricao: 'Suporte Zeta Inc', valor: 8500, cliente: 'Zeta Inc', categoria: 'Suporte', vencimento: '2025-01-30', recebido: false, recorrente: true },
  { id: '7', descricao: 'Projeto Theta Soluções', valor: 35000, cliente: 'Theta Soluções', categoria: 'Projetos', vencimento: '2025-02-10', recebido: false, recorrente: false },
  { id: '8', descricao: 'Mensalidade Iota Systems', valor: 9500, cliente: 'Iota Systems', categoria: 'Recorrente', vencimento: '2025-01-08', recebido: true, dataRecebimento: '2025-01-08', recorrente: true },
];

export const categorias: Categoria[] = [
  { id: '1', nome: 'Infraestrutura', tipo: 'despesa', cor: '#6366F1', orcamento: 20000 },
  { id: '2', nome: 'Tecnologia', tipo: 'despesa', cor: '#8B5CF6', orcamento: 10000 },
  { id: '3', nome: 'Pessoal', tipo: 'despesa', cor: '#EC4899', orcamento: 90000 },
  { id: '4', nome: 'Marketing', tipo: 'despesa', cor: '#F59E0B', orcamento: 12000 },
  { id: '5', nome: 'Serviços', tipo: 'despesa', cor: '#10B981', orcamento: 15000 },
  { id: '6', nome: 'Impostos', tipo: 'despesa', cor: '#EF4444', orcamento: 20000 },
  { id: '7', nome: 'Capacitação', tipo: 'despesa', cor: '#06B6D4', orcamento: 10000 },
  { id: '8', nome: 'Projetos', tipo: 'receita', cor: '#22C55E', orcamento: 0 },
  { id: '9', nome: 'Consultoria', tipo: 'receita', cor: '#3B82F6', orcamento: 0 },
  { id: '10', nome: 'Recorrente', tipo: 'receita', cor: '#A855F7', orcamento: 0 },
];

export const setores: Setor[] = [
  { id: '1', nome: 'Financeiro', responsavel: 'Ana Oliveira', orcamento: 50000, gastos: 25700, funcionarios: 4, kpis: { eficiencia: 92, produtividade: 88, satisfação: 85 }, cor: '#22C55E', status: 'ativo' },
  { id: '2', nome: 'Comercial', responsavel: 'Roberto Silva', orcamento: 40000, gastos: 16000, funcionarios: 6, kpis: { eficiencia: 78, produtividade: 82, satisfação: 90 }, cor: '#3B82F6', status: 'ativo' },
  { id: '3', nome: 'RH', responsavel: 'Juliana Costa', orcamento: 100000, gastos: 100000, funcionarios: 3, kpis: { eficiencia: 95, produtividade: 91, satisfação: 88 }, cor: '#EC4899', status: 'alerta' },
  { id: '4', nome: 'Tecnologia', responsavel: 'Marcos Pereira', orcamento: 15000, gastos: 8000, funcionarios: 5, kpis: { eficiencia: 88, produtividade: 94, satisfação: 82 }, cor: '#8B5CF6', status: 'ativo' },
  { id: '5', nome: 'Administrativo', responsavel: 'Carlos Mendes', orcamento: 30000, gastos: 24000, funcionarios: 3, kpis: { eficiencia: 85, produtividade: 80, satisfação: 79 }, cor: '#F59E0B', status: 'ativo' },
  { id: '6', nome: 'Operacional', responsavel: 'Fernanda Lima', orcamento: 20000, gastos: 6000, funcionarios: 8, kpis: { eficiencia: 72, produtividade: 68, satisfação: 75 }, cor: '#EF4444', status: 'critico' },
];

export const fornecedores: Fornecedor[] = [
  { id: '1', nome: 'Imobiliária Central', cnpj: '12.345.678/0001-90', contato: 'João Silva', email: 'joao@central.com', telefone: '(11) 99999-0001', categoria: 'Infraestrutura', status: 'ativo', valorMensal: 12500 },
  { id: '2', nome: 'Microsoft Corp', cnpj: '98.765.432/0001-10', contato: 'Suporte', email: 'suporte@microsoft.com', telefone: '(11) 99999-0002', categoria: 'Tecnologia', status: 'ativo', valorMensal: 4800 },
  { id: '3', nome: 'Amazon Web Services', cnpj: '11.222.333/0001-44', contato: 'AWS Support', email: 'aws@amazon.com', telefone: '(11) 99999-0003', categoria: 'Tecnologia', status: 'ativo', valorMensal: 3200 },
  { id: '4', nome: 'Agência Digital X', cnpj: '55.666.777/0001-88', contato: 'Maria Santos', email: 'maria@digitalx.com', telefone: '(11) 99999-0004', categoria: 'Marketing', status: 'ativo', valorMensal: 8500 },
  { id: '5', nome: 'Contábil Plus', cnpj: '33.444.555/0001-66', contato: 'Pedro Costa', email: 'pedro@contabilplus.com', telefone: '(11) 99999-0005', categoria: 'Serviços', status: 'ativo', valorMensal: 3500 },
  { id: '6', nome: 'CPFL', cnpj: '77.888.999/0001-22', contato: 'Atendimento', email: 'empresas@cpfl.com', telefone: '0800-000-000', categoria: 'Infraestrutura', status: 'ativo', valorMensal: 2200 },
  { id: '7', nome: 'Vivo', cnpj: '22.333.444/0001-55', contato: 'Corporativo', email: 'corp@vivo.com', telefone: '0800-111-111', categoria: 'Infraestrutura', status: 'ativo', valorMensal: 1800 },
  { id: '8', nome: 'Porto Seguro', cnpj: '66.777.888/0001-33', contato: 'Carlos Ribeiro', email: 'carlos@porto.com', telefone: '(11) 99999-0008', categoria: 'Seguros', status: 'ativo', valorMensal: 4200 },
];

export const contratos: Contrato[] = [
  { id: '1', titulo: 'Aluguel Escritório', fornecedor: 'Imobiliária Central', valor: 12500, inicio: '2024-01-01', fim: '2025-12-31', status: 'ativo', renovacaoAutomatica: false },
  { id: '2', titulo: 'Licenças Microsoft 365', fornecedor: 'Microsoft Corp', valor: 4800, inicio: '2024-06-01', fim: '2025-05-31', status: 'ativo', renovacaoAutomatica: true },
  { id: '3', titulo: 'AWS Cloud Services', fornecedor: 'Amazon Web Services', valor: 3200, inicio: '2024-03-01', fim: '2026-02-28', status: 'ativo', renovacaoAutomatica: true },
  { id: '4', titulo: 'Marketing Digital', fornecedor: 'Agência Digital X', valor: 8500, inicio: '2024-09-01', fim: '2025-08-31', status: 'ativo', renovacaoAutomatica: false },
  { id: '5', titulo: 'Contabilidade Mensal', fornecedor: 'Contábil Plus', valor: 3500, inicio: '2024-01-01', fim: '2025-12-31', status: 'ativo', renovacaoAutomatica: true },
];

export const fluxoCaixa: FluxoCaixa[] = [
  { mes: 'Jul', receitas: 185000, despesas: 142000, saldo: 43000 },
  { mes: 'Ago', receitas: 195000, despesas: 148000, saldo: 47000 },
  { mes: 'Set', receitas: 210000, despesas: 155000, saldo: 55000 },
  { mes: 'Out', receitas: 198000, despesas: 162000, saldo: 36000 },
  { mes: 'Nov', receitas: 220000, despesas: 158000, saldo: 62000 },
  { mes: 'Dez', receitas: 245000, despesas: 175000, saldo: 70000 },
  { mes: 'Jan', receitas: 220000, despesas: 162200, saldo: 57800 },
  { mes: 'Fev', receitas: 230000, despesas: 155000, saldo: 75000, projetado: true },
  { mes: 'Mar', receitas: 240000, despesas: 160000, saldo: 80000, projetado: true },
  { mes: 'Abr', receitas: 255000, despesas: 165000, saldo: 90000, projetado: true },
];

export const alertas: Alerta[] = [
  { id: '1', tipo: 'vencimento', titulo: 'Conta a vencer', descricao: 'Marketing digital vence em 5 dias - R$ 8.500,00', gravidade: 'media', data: '2025-01-15', lido: false },
  { id: '2', tipo: 'anormal', titulo: 'Gasto anormal detectado', descricao: 'Treinamento equipe 40% acima da média histórica', gravidade: 'alta', data: '2025-01-14', lido: false },
  { id: '3', tipo: 'orcamento', titulo: 'Orçamento RH excedido', descricao: 'Setor RH atingiu 100% do orçamento mensal', gravidade: 'alta', data: '2025-01-13', lido: true },
  { id: '4', tipo: 'sugestao', titulo: 'Oportunidade de economia', descricao: 'Negociar contrato AWS pode gerar economia de 15%', gravidade: 'baixa', data: '2025-01-12', lido: false },
  { id: '5', tipo: 'vencimento', titulo: 'Impostos a pagar', descricao: 'Simples Nacional vence em 10 dias - R$ 18.500,00', gravidade: 'alta', data: '2025-01-15', lido: false },
  { id: '6', tipo: 'anormal', titulo: 'Viagem acima do padrão', descricao: 'Viagem de negócios 25% acima do budget aprovado', gravidade: 'media', data: '2025-01-14', lido: true },
];

export const logs: Log[] = [
  { id: '1', usuario: 'Carlos Mendes', acao: 'Login', modulo: 'Sistema', data: '2025-01-15 09:30', detalhes: 'Acesso via desktop - IP 192.168.1.1' },
  { id: '2', usuario: 'Ana Oliveira', acao: 'Pagamento registrado', modulo: 'Financeiro', data: '2025-01-15 08:45', detalhes: 'Despesa #12 - Contabilidade - R$ 3.500,00' },
  { id: '3', usuario: 'Roberto Silva', acao: 'Novo contrato', modulo: 'Comercial', data: '2025-01-14 17:20', detalhes: 'Contrato Delta Tech - R$ 67.000,00' },
  { id: '4', usuario: 'Marcos Pereira', acao: 'Relatório gerado', modulo: 'TI', data: '2025-01-14 22:15', detalhes: 'Relatório de performance do servidor' },
  { id: '5', usuario: 'Juliana Costa', acao: 'Cadastro funcionário', modulo: 'RH', data: '2025-01-14 14:30', detalhes: 'Novo desenvolvedor - Setor Tecnologia' },
  { id: '6', usuario: 'Sistema', acao: 'Backup automático', modulo: 'Sistema', data: '2025-01-15 00:00', detalhes: 'Backup diário concluído com sucesso' },
  { id: '7', usuario: 'Ana Oliveira', acao: 'Aprovação despesa', modulo: 'Financeiro', data: '2025-01-13 11:00', detalhes: 'Aprovada despesa #8 - Servidor AWS' },
  { id: '8', usuario: 'Carlos Mendes', acao: 'Alteração permissão', modulo: 'Administração', data: '2025-01-12 16:45', detalhes: 'Permissão de visualização concedida a Fernanda Lima' },
];

export const relatorios: Relatorio[] = [
  { id: '1', titulo: 'Relatório Financeiro - Dezembro 2024', tipo: 'financeiro', data: '2025-01-05', geradoPor: 'Sistema', status: 'gerado', pdf: 'rel-fin-dez24.pdf' },
  { id: '2', titulo: 'Relatório Executivo - Q4 2024', tipo: 'executivo', data: '2025-01-10', geradoPor: 'Sistema', status: 'gerado', pdf: 'rel-exec-q4.pdf' },
  { id: '3', titulo: 'Performance Comercial - Janeiro', tipo: 'performance', data: '2025-01-15', geradoPor: 'Ana Oliveira', status: 'pendente' },
  { id: '4', titulo: 'Relatório Setorial - RH', tipo: 'setorial', data: '2025-01-12', geradoPor: 'Juliana Costa', status: 'gerado', pdf: 'rel-rh-jan.pdf' },
  { id: '5', titulo: 'Relatório Operacional - Mensal', tipo: 'operacional', data: '2025-01-14', geradoPor: 'Sistema', status: 'gerado', pdf: 'rel-op-jan.pdf' },
];

export const insightsIA: InsightIA[] = [
  { id: '1', tipo: 'economia', titulo: 'Redução custos AWS', descricao: 'Análise indica que otimização de instâncias EC2 pode reduzir custos em ~18% (R$ 576/mês). Recomenda-se revisar configurações de auto-scaling.', impacto: 'alto', data: '2025-01-15' },
  { id: '2', tipo: 'alerta', titulo: 'Tendência de gastos em RH', descricao: 'Gastos com pessoal cresceram 12% nos últimos 3 meses. Se mantida a tendência, o orçamento anual será excedido em março.', impacto: 'alto', data: '2025-01-15' },
  { id: '3', tipo: 'oportunidade', titulo: 'Negociação de contratos', descricao: '3 contratos com renovação nos próximos 6 meses. Negociação antecipada pode gerar desconto médio de 10% (R$ 3.050/mês).', impacto: 'medio', data: '2025-01-14' },
  { id: '4', tipo: 'analise', titulo: 'Fluxo de caixa projetado', descricao: 'Projeção indica saldo positivo crescente para Q1 2025. Recomendado investimento de excedente em aplicações de liquidez diária.', impacto: 'medio', data: '2025-01-14' },
  { id: '5', tipo: 'economia', titulo: 'Consolidação de licenças', descricao: 'Identificadas licenças de software subutilizadas no setor Comercial. Cancelamento pode economizar R$ 2.400/mês.', impacto: 'medio', data: '2025-01-13' },
  { id: '6', tipo: 'oportunidade', titulo: 'Novo segmento de receita', descricao: 'Análise de mercado sugere demanda não atendida para consultoria em transformação digital no segmento PMEs.', impacto: 'alto', data: '2025-01-12' },
];

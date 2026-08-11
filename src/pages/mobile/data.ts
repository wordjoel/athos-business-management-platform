import { BankAccount, CreditCard, Transaction, Category, CostCenter, FinancialGoal, NotificationItem, AgendaItem, OCRDocument, UserProfile } from './types';

export const initialAccounts: BankAccount[] = [
  {
    id: 'acc-1',
    bankName: 'Banco do Brasil',
    accountType: 'Conta principal',
    balance: 145820.00,
    agency: '0123-4',
    accountNumber: '45.890-1',
    status: 'active',
    icon: 'Building2',
    color: '#FBBF24', // Amarelo BB
  },
  {
    id: 'acc-2',
    bankName: 'Itaú',
    accountType: 'Conta PJ',
    balance: 12350.75,
    agency: '4056',
    accountNumber: '12.345-6',
    status: 'active',
    icon: 'Building2',
    color: '#EC6608', // Laranja Itaú
  },
  {
    id: 'acc-3',
    bankName: 'Caixa Econômica',
    accountType: 'Caixa Interno',
    balance: 1250.00,
    agency: '0001',
    accountNumber: '00.123-4',
    status: 'active',
    icon: 'Wallet',
    color: '#005CA9', // Azul Caixa
  },
  {
    id: 'acc-4',
    bankName: 'PagBank',
    accountType: 'Carteira Digital',
    balance: 2810.00,
    agency: '0001',
    accountNumber: '98.765-4',
    status: 'active',
    icon: 'Smartphone',
    color: '#00B55E', // Verde PagBank
  },
  {
    id: 'acc-5',
    bankName: 'Nubank',
    accountType: 'Cartão Corporativo',
    balance: -1120.00,
    agency: '0001',
    accountNumber: '54.321-0',
    status: 'active',
    icon: 'CreditCard',
    color: '#820AD1', // Roxo Nubank
  }
];

export const initialCards: CreditCard[] = [
  {
    id: 'card-1',
    cardName: 'Athos Black Platinum',
    bankName: 'Itaú Empresas',
    cardNumber: '•••• •••• •••• 8842',
    limit: 100000.00,
    availableLimit: 85420.00,
    invoiceValue: 14580.00,
    color: 'from-slate-800 to-slate-950',
  },
  {
    id: 'card-2',
    cardName: 'Nubank Business',
    bankName: 'Nubank',
    cardNumber: '•••• •••• •••• 5321',
    limit: 25000.00,
    availableLimit: 23880.00,
    invoiceValue: 1120.00,
    color: 'from-purple-800 to-purple-950',
  },
  {
    id: 'card-3',
    cardName: 'Corporate Visa Gold',
    bankName: 'Banco do Brasil',
    cardNumber: '•••• •••• •••• 2419',
    limit: 50000.00,
    availableLimit: 48950.00,
    invoiceValue: 1050.00,
    color: 'from-blue-800 to-blue-950',
  }
];

export const initialCategories: Category[] = [
  // Despesas
  { id: 'cat-1', name: 'Alimentação', type: 'expense', icon: 'Utensils', color: '#EF4444', value: 2450.00 },
  { id: 'cat-2', name: 'Transporte', type: 'expense', icon: 'Car', color: '#F59E0B', value: 1120.00 },
  { id: 'cat-3', name: 'Marketing', type: 'expense', icon: 'Megaphone', color: '#3B82F6', value: 3500.00 },
  { id: 'cat-4', name: 'Salários', type: 'expense', icon: 'Users', color: '#10B981', value: 12000.00 },
  { id: 'cat-5', name: 'Serviços', type: 'expense', icon: 'Wrench', color: '#8B5CF6', value: 2780.00 },
  { id: 'cat-6', name: 'Outros', type: 'expense', icon: 'Folder', color: '#6B7280', value: 1559.25 },
  
  // Receitas
  { id: 'cat-7', name: 'Venda de produtos', type: 'revenue', icon: 'ShoppingBag', color: '#10B981', value: 38240.00 },
  { id: 'cat-8', name: 'Serviços de Consultoria', type: 'revenue', icon: 'Laptop', color: '#06B6D4', value: 20000.00 },
  { id: 'cat-9', name: 'Rendimentos', type: 'revenue', icon: 'TrendingUp', color: '#3B82F6', value: 450.00 }
];

export const initialCostCenters: CostCenter[] = [
  { id: 'cc-1', name: 'Financeiro', value: 18500.00, color: '#10B981', percentage: 22 },
  { id: 'cc-2', name: 'Comercial', value: 12500.00, color: '#3B82F6', percentage: 15 },
  { id: 'cc-3', name: 'Marketing', value: 8500.00, color: '#F59E0B', percentage: 10 },
  { id: 'cc-4', name: 'Projetos', value: 32000.00, color: '#8B5CF6', percentage: 38 },
  { id: 'cc-5', name: 'RH', value: 6500.00, color: '#EC4899', percentage: 8 },
  { id: 'cc-6', name: 'Administrativo', value: 6000.00, color: '#6B7280', percentage: 7 }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'revenue',
    value: 4500.00,
    description: 'Receita - Venda de serviço',
    category: 'Serviços de Consultoria',
    costCenter: 'Projetos',
    account: 'Banco do Brasil',
    clientOrSupplier: 'Tech Corp S/A',
    date: '2026-07-10',
    createdAt: '2026-07-10T10:00:00Z'
  },
  {
    id: 'tx-2',
    type: 'expense',
    value: 450.00,
    description: 'Conta de energia',
    category: 'Serviços',
    costCenter: 'Financeiro',
    account: 'Banco do Brasil',
    clientOrSupplier: 'Enel Distribuidora',
    date: '2026-07-10',
    paymentMethod: 'PIX',
    createdAt: '2026-07-10T09:15:00Z'
  },
  {
    id: 'tx-3',
    type: 'expense',
    value: 1800.00,
    description: 'Aluguel sala comercial',
    category: 'Serviços',
    costCenter: 'Administrativo',
    account: 'Itaú',
    clientOrSupplier: 'Imobiliária Nova Era',
    date: '2026-07-05',
    paymentMethod: 'Boleto Bancário',
    createdAt: '2026-07-05T08:00:00Z'
  },
  {
    id: 'tx-4',
    type: 'revenue',
    value: 12500.00,
    description: 'Aporte Financeiro Consultoria',
    category: 'Serviços de Consultoria',
    costCenter: 'Comercial',
    account: 'Itaú',
    clientOrSupplier: 'Global Investimentos',
    date: '2026-07-02',
    createdAt: '2026-07-02T14:30:00Z'
  },
  {
    id: 'tx-5',
    type: 'expense',
    value: 150.00,
    description: 'Serviço de Internet Fibra',
    category: 'Serviços',
    costCenter: 'Projetos',
    account: 'Caixa Econômica',
    clientOrSupplier: 'Vivo Fibra',
    date: '2026-06-29',
    paymentMethod: 'Débito Automático',
    createdAt: '2026-06-29T11:00:00Z'
  },
  {
    id: 'tx-6',
    type: 'expense',
    value: 12000.00,
    description: 'Salário colaboradores',
    category: 'Salários',
    costCenter: 'RH',
    account: 'Banco do Brasil',
    clientOrSupplier: 'Equipe de Desenvolvimento',
    date: '2026-06-30',
    paymentMethod: 'Transferência',
    createdAt: '2026-06-30T17:00:00Z'
  },
  {
    id: 'tx-7',
    type: 'expense',
    value: 960.00,
    description: 'Compra de suprimentos de escritório',
    category: 'Alimentação',
    costCenter: 'Administrativo',
    account: 'Nubank',
    clientOrSupplier: 'Papelaria Central',
    date: '2026-07-08',
    paymentMethod: 'Cartão de Crédito',
    createdAt: '2026-07-08T15:20:00Z'
  }
];

export const initialGoals: FinancialGoal[] = [
  {
    id: 'g-1',
    name: 'Faturamento mensal',
    targetValue: 100000.00,
    currentValue: 58240.00,
    deadline: '2026-07-31',
    color: '#10B981', // Verde
  },
  {
    id: 'g-2',
    name: 'Reduzir despesas',
    targetValue: 30000.00,
    currentValue: 33409.25, // Reduzir significa manter abaixo. Podemos inverter para mostrar percentual
    deadline: '2026-07-31',
    color: '#EF4444', // Vermelho (estouro)
  },
  {
    id: 'g-3',
    name: 'Lucro líquido',
    targetValue: 20000.00,
    currentValue: 18830.75,
    deadline: '2026-07-31',
    color: '#3B82F6', // Azul
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Cobrança Próxima',
    message: 'Aluguel da sala comercial vence amanhã: R$ 1.800,00',
    time: 'Há 15 min',
    type: 'billing',
    read: false,
  },
  {
    id: 'n-2',
    title: 'Recebimento Confirmado',
    message: 'Serviço de Consultoria da Tech Corp S/A compensado: R$ 4.500,00',
    time: 'Há 2 horas',
    type: 'receipt',
    read: false,
  },
  {
    id: 'n-3',
    title: 'Projeto Aprovado',
    message: 'Centro de custos "Projetos" recebeu alocação de saldo',
    time: 'Há 1 dia',
    type: 'project',
    read: true,
  },
  {
    id: 'n-4',
    title: 'Alerta Financeiro',
    message: 'Sua meta de redução de despesas ultrapassou em 11%',
    time: 'Há 2 dias',
    type: 'financial',
    read: true,
  },
  {
    id: 'n-5',
    title: 'Atualização do Sistema',
    message: 'ATHOS Mobile atualizado para a versão 2.4.0 com OCR aprimorado',
    time: 'Há 3 dias',
    type: 'system',
    read: true,
  }
];

export const initialAgenda: AgendaItem[] = [
  { id: 'ag-1', title: 'Conta de energia', value: 450.00, date: '2026-07-10', type: 'pay', status: 'completed' },
  { id: 'ag-2', title: 'Aluguel sala comercial', value: 1800.00, date: '2026-07-15', type: 'pay', status: 'pending' },
  { id: 'ag-3', title: 'Internet Fibra', value: 150.00, date: '2026-07-18', type: 'pay', status: 'pending' },
  { id: 'ag-4', title: 'Salário colaboradores', value: 12000.00, date: '2026-07-30', type: 'pay', status: 'pending' },
  { id: 'ag-5', title: 'Fornecedor Tech S/A', value: 960.00, date: '2026-07-22', type: 'pay', status: 'pending' },
  { id: 'ag-6', title: 'Recebimento Consultoria', value: 58240.00, date: '2026-07-28', type: 'receive', status: 'pending' }
];

export const initialOCRDocuments: OCRDocument[] = [
  {
    id: 'ocr-1',
    name: 'Nota_Fiscal_Almoço_09_07.pdf',
    date: '2026-07-09',
    status: 'processed',
    extractedValue: 85.90,
    extractedDescription: 'Almoço de Negócios',
    extractedCategory: 'Alimentação',
    extractedSupplier: 'Restaurante Central'
  },
  {
    id: 'ocr-2',
    name: 'Recibo_Uber_Viagem_08_07.pdf',
    date: '2026-07-08',
    status: 'processed',
    extractedValue: 42.50,
    extractedDescription: 'Uber Viagem Administrativo',
    extractedCategory: 'Transporte',
    extractedSupplier: 'Uber Technologies Inc.'
  },
  {
    id: 'ocr-3',
    name: 'Fatura_AWS_Hospedagem.pdf',
    date: '2026-07-05',
    status: 'processing'
  }
];

export const defaultProfile: UserProfile = {
  name: 'Gustavo Martins',
  company: 'Athos Tecnologia Ltda.',
  role: 'Diretor Financeiro (CFO)',
  email: 'admin@athos.com',
  phone: '(11) 98765-4321',
  theme: 'midnight',
  language: 'pt',
  currency: 'BRL',
  notificationsEnabled: true
};

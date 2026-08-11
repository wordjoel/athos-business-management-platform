export interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  balance: number;
  agency: string;
  accountNumber: string;
  status: 'active' | 'inactive';
  icon: string;
  color: string;
}

export interface CreditCard {
  id: string;
  cardName: string;
  bankName: string;
  cardNumber: string;
  limit: number;
  availableLimit: number;
  invoiceValue: number;
  color: string;
}

export interface Transaction {
  id: string;
  type: 'revenue' | 'expense';
  value: number;
  description: string;
  category: string;
  costCenter: string;
  account: string;
  clientOrSupplier: string;
  date: string;
  paymentMethod?: string;
  attachment?: string;
  attachmentLocation?: string;
  observation?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'revenue' | 'expense';
  icon: string;
  color: string;
  value: number;
}

export interface CostCenter {
  id: string;
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetValue: number;
  currentValue: number;
  deadline: string;
  color: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'billing' | 'receipt' | 'project' | 'financial' | 'system';
  read: boolean;
}

export interface AgendaItem {
  id: string;
  title: string;
  value: number;
  date: string;
  type: 'receive' | 'pay';
  status: 'pending' | 'completed' | 'overdue';
}

export interface OCRDocument {
  id: string;
  name: string;
  date: string;
  status: 'processed' | 'processing' | 'failed';
  extractedValue?: number;
  extractedDescription?: string;
  extractedCategory?: string;
  extractedSupplier?: string;
}

export interface UserProfile {
  name: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  theme: 'midnight' | 'nordic' | 'corporate';
  language: 'pt' | 'en' | 'es';
  currency: 'BRL' | 'USD' | 'EUR';
  notificationsEnabled: boolean;
}

export type ScreenId =
  | 'splash'
  | 'login'
  | 'face_id'
  | 'dashboard'
  | 'new_revenue'
  | 'new_expense'
  | 'cash_flow'
  | 'bank_accounts'
  | 'credit_cards'
  | 'categories'
  | 'cost_centers'
  | 'agenda'
  | 'ocr_scanner'
  | 'reports'
  | 'analytical_dashboard'
  | 'resources'
  | 'goals'
  | 'profile'
  | 'settings'
  | 'notifications'
  | 'more_menu'
  | 'success_screen';

export type TabId = 'home' | 'financial' | 'new_launch' | 'reports' | 'more' | 'settings';

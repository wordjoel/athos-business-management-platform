import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  EyeOff, 
  ChevronRight, 
  Bell, 
  Search,
  Building2,
  Wallet,
  Smartphone,
  CreditCard,
  Utensils,
  Car,
  Megaphone,
  Users,
  Wrench,
  Folder,
  ShoppingBag,
  Laptop,
  Plus
} from 'lucide-react';
import { Transaction, BankAccount, UserProfile } from '../types';
import { motion } from 'motion/react';

// Icon Map helper to safely display icons by string key
export const getIconComponent = (iconName: string, className = "w-5 h-5") => {
  switch (iconName) {
    case 'Building2': return <Building2 className={className} />;
    case 'Wallet': return <Wallet className={className} />;
    case 'Smartphone': return <Smartphone className={className} />;
    case 'CreditCard': return <CreditCard className={className} />;
    case 'Utensils': return <Utensils className={className} />;
    case 'Car': return <Car className={className} />;
    case 'Megaphone': return <Megaphone className={className} />;
    case 'Users': return <Users className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    case 'Folder': return <Folder className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    case 'Laptop': return <Laptop className={className} />;
    case 'TrendingUp': return <TrendingUp className={className} />;
    case 'TrendingDown': return <TrendingDown className={className} />;
    default: return <Folder className={className} />;
  }
};

interface DashboardScreenProps {
  accounts: BankAccount[];
  transactions: Transaction[];
  profile: UserProfile;
  onNavigate: (screen: any) => void;
  onOpenFAB: () => void;
  unreadNotificationsCount: number;
}

export default function DashboardScreen({
  accounts,
  transactions,
  profile,
  onNavigate,
  onOpenFAB,
  unreadNotificationsCount
}: DashboardScreenProps) {
  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'US';
  const firstName = profile.name.split(' ')[0] || 'Usuário';
  const [showBalance, setShowBalance] = useState(true);

  // Calculate overall metrics from transactions
  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);
  const totalRevenues = transactions
    .filter(tx => tx.type === 'revenue')
    .reduce((acc, tx) => acc + tx.value, 0);
  const totalExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.value, 0);
  
  const netCashFlow = totalRevenues - totalExpenses;

  // Formatting helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="flex-1 flex flex-col pb-24">
      {/* Executive Header */}
      <div className="flex justify-between items-center px-5 pt-4 pb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold font-display tracking-tight text-white">
              Olá, {firstName}! 👋
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Athos Tecnologia Ltda.</p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('notifications')}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition active:scale-95"
          >
            <Bell className="w-5 h-5 text-slate-300" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
            )}
          </button>
          
          <button
            onClick={() => onNavigate('profile')}
            title={profile.name}
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md hover:opacity-90 active:scale-95 transition"
          >
            {initials}
          </button>
        </div>
      </div>

      {/* Search Bar Accent */}
      <div className="px-5 mb-5 mt-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Pesquisar lançamentos, contas..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-800/80 rounded-xl text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Primary Balance Card */}
      <div className="px-5 mb-5">
        <div className="relative p-5 bg-gradient-to-b from-[#1E2430] to-[#0B0E14] border border-[#C9A961]/30 rounded-2xl shadow-glow overflow-hidden">
          {/* Subtle background glow circle */}
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-[#C9A961]/10 rounded-full blur-2xl"></div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saldo total</span>
            <button 
              onClick={() => setShowBalance(!showBalance)}
              className="text-slate-400 hover:text-slate-200 transition p-1"
            >
              {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="font-mono text-2xl sm:text-3xl font-bold text-white tracking-tight mb-4">
            {showBalance ? formatCurrency(totalBalance) : 'R$ ••••••••'}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px]">
            <span className="text-slate-400">Conta principal ativa</span>
            <button 
              onClick={() => onNavigate('bank_accounts')}
              className="flex items-center gap-1 text-[#C9A961] font-semibold hover:text-[#D9B96D] transition"
            >
              Gerenciar contas <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Monthly Revenues & Expenses Side-by-Side */}
      <div className="px-5 grid grid-cols-2 gap-4 mb-5">
        {/* Receitas */}
        <div 
          onClick={() => onNavigate('new_revenue')}
          className="p-4 bg-slate-900/90 border border-slate-800/80 rounded-xl hover:border-emerald-500/30 transition duration-200 active:scale-98 cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl"></div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Receitas</span>
          </div>
          <div className="font-mono text-base font-bold text-emerald-400">
            {showBalance ? formatCurrency(totalRevenues) : 'R$ ••••'}
          </div>
        </div>

        {/* Despesas */}
        <div 
          onClick={() => onNavigate('new_expense')}
          className="p-4 bg-slate-900/90 border border-slate-800/80 rounded-xl hover:border-rose-500/30 transition duration-200 active:scale-98 cursor-pointer relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full blur-xl"></div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Despesas</span>
          </div>
          <div className="font-mono text-base font-bold text-rose-400">
            {showBalance ? formatCurrency(totalExpenses) : 'R$ ••••'}
          </div>
        </div>
      </div>

      {/* Cash Flow Card & Sparkline */}
      <div className="px-5 mb-5">
        <div 
          onClick={() => onNavigate('cash_flow')}
          className="p-4 bg-slate-900/95 border border-slate-800 rounded-xl cursor-pointer hover:border-[#C9A961]/30 transition duration-200"
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Fluxo de Caixa</span>
              <span className="font-mono text-lg font-bold text-white mt-1 block">
                {showBalance ? formatCurrency(netCashFlow) : 'R$ •••••••'}
              </span>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                +18%
              </span>
              <span className="block text-[10px] text-slate-500 mt-1">vs mês anterior</span>
            </div>
          </div>

          {/* Glowing Animated Sparkline Chart */}
          <div className="h-14 w-full flex items-end relative overflow-hidden mt-4">
            <svg viewBox="0 0 100 20" className="w-full h-full text-[#C9A961] filter drop-shadow-[0_0_6px_rgba(201,169,97,0.5)]">
              <defs>
                <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C9A961" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#C9A961" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,15 Q10,12 20,18 T40,10 T60,5 T80,14 T100,8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M0,15 Q10,12 20,18 T40,10 T60,5 T80,14 T100,8 L100,20 L0,20 Z"
                fill="url(#chart-glow)"
              />
            </svg>
            <div className="absolute top-1 right-2 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
              <span className="text-[9px] text-blue-400 font-mono font-medium">tempo real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Launches (Últimos lançamentos) */}
      <div className="px-5 mb-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold font-display text-white">Últimos lançamentos</h3>
          <button 
            onClick={() => onNavigate('cash_flow')}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center transition"
          >
            Ver todos <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {transactions.slice(0, 4).map((tx) => (
            <div 
              key={tx.id}
              className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800/60 hover:bg-slate-900 transition rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${
                  tx.type === 'revenue' 
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                }`}>
                  {tx.type === 'revenue' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                </div>

                <div className="text-left">
                  <p className="text-xs font-bold text-white leading-tight max-w-[140px] truncate">{tx.description}</p>
                  <p className="text-[10px] text-slate-500 mt-1 leading-none">{tx.category} • {tx.clientOrSupplier}</p>
                </div>
              </div>

              <div className="text-right font-mono">
                <p className={`text-xs font-bold ${
                  tx.type === 'revenue' ? 'text-emerald-400' : 'text-slate-300'
                }`}>
                  {tx.type === 'revenue' ? '+' : '-'} {formatCurrency(tx.value)}
                </p>
                <p className="text-[9px] text-slate-500 mt-1 leading-none">
                  {new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

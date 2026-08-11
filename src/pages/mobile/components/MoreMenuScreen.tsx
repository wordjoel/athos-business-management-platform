import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Briefcase, 
  Users, 
  FileText, 
  HardDrive, 
  Calendar, 
  Package, 
  BarChart3, 
  Settings, 
  HelpCircle,
  TrendingUp,
  CreditCard,
  Target,
  Sparkles,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { ScreenId } from '../types';

interface MoreMenuScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onNavigateSubScreen: (screen: ScreenId, subScreen: string) => void;
  onBack: () => void;
}

export default function MoreMenuScreen({ onNavigate, onNavigateSubScreen, onBack }: MoreMenuScreenProps) {
  // 12-item Grid matching Phase 20 list precisely
  const menuItems = [
    { label: 'Dashboard', desc: 'Resumo executivo', icon: <LayoutDashboard className="text-blue-400" />, action: () => onNavigate('dashboard') },
    { label: 'Fluxo de Caixa', desc: 'Entradas e saídas', icon: <TrendingUp className="text-emerald-400" />, action: () => onNavigateSubScreen('cash_flow', 'cash_flow') },
    { label: 'Contas Bancárias', desc: 'Saldos corporativos', icon: <Building2 className="text-cyan-400" />, action: () => onNavigateSubScreen('bank_accounts', 'bank_accounts') },
    { label: 'Cartões PJ', desc: 'Crédito corporativo', icon: <CreditCard className="text-purple-400" />, action: () => onNavigateSubScreen('credit_cards', 'credit_cards') },
    { label: 'CRM Comercial', desc: 'Pipeline de clientes', icon: <Users className="text-yellow-400" />, action: () => alert('Recurso CRM Comercial simulado na Fase de Mock!') },
    { label: 'Contratos', desc: 'Documentos e termos', icon: <FileText className="text-orange-400" />, action: () => alert('Módulo de Contratos simulado!') },
    { label: 'Drive Digital', desc: 'Nuvem corporativa', icon: <HardDrive className="text-indigo-400" />, action: () => alert('Drive de Documentos simulado!') },
    { label: 'Agenda Financeira', desc: 'Calendário de contas', icon: <Calendar className="text-red-400" />, action: () => onNavigateSubScreen('agenda', 'agenda') },
    { label: 'Inventário', desc: 'Ativos corporativos', icon: <Package className="text-slate-400" />, action: () => alert('Módulo de Inventário de Estoque simulado!') },
    { label: 'Relatórios PDF', desc: 'Demonstrativos XLS', icon: <BarChart3 className="text-pink-400" />, action: () => onNavigateSubScreen('reports', 'reports') },
    { label: 'Configurações', desc: 'Preferências do app', icon: <Settings className="text-slate-200" />, action: () => onNavigateSubScreen('settings', 'settings') },
    { label: 'Ajuda & Suporte', desc: 'Central de suporte', icon: <HelpCircle className="text-blue-300" />, action: () => alert('Suporte Online 24h ATHOS simulado!') }
  ];

  return (
    <div className="flex-1 flex flex-col bg-black text-white pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900 bg-slate-950/80 sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-bold font-display uppercase tracking-widest text-slate-200">
          Menu Corporativo
        </h2>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 p-5 space-y-6 overflow-y-auto">
        <div className="text-center py-4 bg-slate-950/20 border border-slate-900 rounded-2xl">
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-1">PLATAFORMA INTEGRADA</span>
          <h3 className="font-bold font-display text-sm text-white">Ecossistema Corporativo ATHOS</h3>
          <p className="text-[10px] text-slate-500 mt-1">Acesso unificado a todas as operações empresariais</p>
        </div>

        {/* 12-item Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {menuItems.map((item, i) => (
            <div
              key={i}
              onClick={item.action}
              className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl hover:bg-slate-900 hover:border-slate-700/60 transition active:scale-98 cursor-pointer text-left flex flex-col justify-between aspect-square"
            >
              <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl w-fit">
                {item.icon}
              </div>

              <div>
                <h4 className="text-xs font-bold text-white leading-tight mt-3">{item.label}</h4>
                <p className="text-[9px] text-slate-500 mt-1 leading-snug">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button: Sair (Logout) */}
        <div className="pt-2">
          <button
            onClick={() => onNavigate('login')}
            className="w-full py-4 bg-red-950/20 hover:bg-red-950/40 border border-red-900/40 rounded-2xl text-xs font-bold text-red-400 hover:text-red-300 transition active:scale-98 flex items-center justify-center gap-2.5 shadow-sm"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            Sair da Conta (Logout)
          </button>
        </div>
      </div>
    </div>
  );
}

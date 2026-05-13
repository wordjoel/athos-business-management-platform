import React from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Target, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Receipt, BarChart3, Brain } from 'lucide-react';
import StatCard from '../../components/StatCard';

const ATHOSFinance: React.FC = () => {
  const { darkMode } = useApp();

  const stats = [
    { title: 'Receita Mês', value: 'R$ 125.000', change: '+8%', icon: ArrowUpRight, color: 'emerald' },
    { title: 'Despesas Mês', value: 'R$ 87.500', change: '-3%', icon: ArrowDownRight, color: 'red' },
    { title: 'Saldo', value: 'R$ 37.500', change: '+15%', icon: Wallet, color: 'amber' },
    { title: 'Meta Fiscal', value: '78%', change: '+5%', icon: Target, color: 'violet' },
  ];

  const categorias = [
    { nome: 'Receitas', valor: 125000, cor: 'emerald' },
    { nome: 'Despesas Fixas', valor: 45000, cor: 'gray' },
    { nome: 'Despesas Variáveis', valor: 25000, cor: 'amber' },
    { nome: 'Impostos', valor: 17500, cor: 'red' },
  ];

  const ultimasTransacoes = [
    { tipo: 'receita', descricao: 'Tech Solutions - Janeiro', valor: 15000, data: '13/05' },
    { tipo: 'despesa', descricao: 'Aluguel - Maio', valor: -8500, data: '12/05' },
    { tipo: 'receita', descricao: 'Clínica Viva', valor: 8500, data: '11/05' },
    { tipo: 'despesa', descricao: 'Contabilidade', valor: -2500, data: '10/05' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS Finance</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gestão Financeira Inteligente</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg">
          <Brain size={16} className="text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">Previsão IA Ativa</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} darkMode={darkMode} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Fluxo de Caixa</h2>
            <div className="flex gap-2">
              <button className="px-3 py-1 text-xs font-medium rounded-lg bg-emerald-500/20 text-emerald-400">Receitas</button>
              <button className="px-3 py-1 text-xs font-medium rounded-lg bg-red-500/20 text-red-400">Despesas</button>
            </div>
          </div>
          <div className="h-48 flex items-end gap-2">
            {[65, 80, 45, 90, 75, 85, 95, 70, 88, 92, 78, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full rounded-t-lg ${h > 70 ? 'bg-emerald-500' : 'bg-gray-400'}`} style={{ height: `${h * 2}px` }} />
                <span className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{(i + 1).toString().padStart(2, '0')}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-4">
            <PieChart size={16} className="text-emerald-400" />
            <h2 className="font-semibold">Por Categoria</h2>
          </div>
          <div className="space-y-3">
            {categorias.map((cat, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{cat.nome}</span>
                  <span className="text-sm font-medium">R$ {cat.valor.toLocaleString()}</span>
                </div>
                <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                  <div className={`h-2 rounded-full bg-${cat.cor}-500`} style={{ width: `${(cat.valor / 125000) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Últimas Transações</h2>
            <Receipt size={16} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {ultimasTransacoes.map((t, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.tipo === 'receita' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {t.tipo === 'receita' ? <ArrowUpRight size={14} className="text-emerald-400" /> : <ArrowDownRight size={14} className="text-red-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.descricao}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t.data}</p>
                  </div>
                </div>
                <span className={`font-semibold ${t.tipo === 'receita' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {t.valor > 0 ? '+' : ''}R$ {Math.abs(t.valor).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-emerald-400 hover:text-emerald-300">
            Ver extrato completo →
          </button>
        </div>

        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">DRE - Demonstrativo</h2>
            <BarChart3 size={16} className="text-emerald-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Receita Bruta</span>
              <span className="text-sm font-medium">R$ 125.000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">(-) Impostos</span>
              <span className="text-sm text-gray-400">R$ 17.500</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium">Receita Líquida</span>
              <span className="text-sm font-bold text-emerald-400">R$ 107.500</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">(-) Despesas</span>
              <span className="text-sm text-gray-400">R$ 70.000</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-semibold">Lucro Líquido</span>
              <span className="text-sm font-bold text-emerald-400">R$ 37.500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATHOSFinance;
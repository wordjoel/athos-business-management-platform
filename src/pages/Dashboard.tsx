import React from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import {
  DollarSign, TrendingUp, Wallet, Users, CreditCard,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Activity, PieChart,
  BarChart3, Sparkles, Target, Clock
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Line, Legend
} from 'recharts';
import { fluxoCaixa, despesas, receitas, alertas as mockAlertas, insightsIA, setores } from '../data/mockData';

const Dashboard: React.FC = () => {
  const { darkMode, setCurrentPage, toggleAIPanel } = useApp();

  const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0);
  const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0);
  const totalPago = despesas.filter(d => d.pago).reduce((sum, d) => sum + d.valor, 0);
  const totalRecebido = receitas.filter(r => r.recebido).reduce((sum, r) => sum + r.valor, 0);
  const lucroLiquido = totalReceitas - totalDespesas;
  const margemLucro = ((lucroLiquido / totalReceitas) * 100).toFixed(1);
  const contasPagar = despesas.filter(d => !d.pago).length;
  const contasReceber = receitas.filter(r => !r.recebido).length;

  const pieData = setores.map(s => ({ name: s.nome, value: s.gastos, cor: s.cor }));

  const despesasPagas = despesas.filter(d => d.pago).map(d => ({
    tipo: 'despesa' as const, descricao: d.descricao, valor: d.valor,
    origem: d.fornecedor, data: d.dataPagamento || ''
  }));
  const receitasRecebidas = receitas.filter(r => r.recebido).map(r => ({
    tipo: 'receita' as const, descricao: r.descricao, valor: r.valor,
    origem: r.cliente, data: r.dataRecebimento || ''
  }));
  const recentTransactions = [...despesasPagas, ...receitasRecebidas]
    .sort((a, b) => b.data.localeCompare(a.data)).slice(0, 8);

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const tooltipFmt = (value: unknown) => typeof value === 'number' ? fmt(value) : String(value);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard Executivo</h1>
            <Sparkles size={18} className="text-athos-400" />
          </div>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Visão geral da empresa • Janeiro 2025
          </p>
        </div>
        <button
          onClick={toggleAIPanel}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-athos text-white text-sm font-medium shadow-glow hover:shadow-lg transition-all"
        >
          <Sparkles size={14} />
          Assistente IA
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
        <StatCard title="Receita Total" value={fmt(totalReceitas)} change="+8.3% vs mês anterior" changeType="up" icon={DollarSign} color="green" darkMode={darkMode} subtitle={`${receitas.filter(r => r.recebido).length} recebidas de ${receitas.length}`} />
        <StatCard title="Despesas Totais" value={fmt(totalDespesas)} change="+2.6% vs mês anterior" changeType="down" icon={CreditCard} color="red" darkMode={darkMode} subtitle={`${despesas.filter(d => d.pago).length} pagas de ${despesas.length}`} />
        <StatCard title="Lucro Líquido" value={fmt(lucroLiquido)} change={`Margem: ${margemLucro}%`} changeType="up" icon={TrendingUp} color="purple" darkMode={darkMode} subtitle="Receitas - Despesas" />
        <StatCard title="Fluxo de Caixa" value={fmt(totalRecebido - totalPago)} change={`${contasReceber} a receber • ${contasPagar} a pagar`} changeType="neutral" icon={Wallet} color="blue" darkMode={darkMode} subtitle="Saldo disponível" />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'A Receber', value: fmt(receitas.filter(r => !r.recebido).reduce((s, r) => s + r.valor, 0)), icon: ArrowUpRight, color: 'green' },
          { label: 'A Pagar', value: fmt(despesas.filter(d => !d.pago).reduce((s, d) => s + d.valor, 0)), icon: ArrowDownRight, color: 'red' },
          { label: 'Clientes Ativos', value: '8', icon: Users, color: 'blue' },
          { label: 'Contratos Ativos', value: '5', icon: Target, color: 'purple' },
          { label: 'Alertas Ativos', value: mockAlertas.filter(a => !a.lido).length.toString(), icon: AlertTriangle, color: 'amber' },
          { label: 'Setores Ativos', value: '6', icon: Activity, color: 'cyan' },
        ].map((item, i) => {
          const colorMap: Record<string, string> = { green: 'text-emerald-400', red: 'text-red-400', blue: 'text-blue-400', purple: 'text-athos-400', amber: 'text-amber-400', cyan: 'text-cyan-400' };
          return (
            <div key={i} className={`p-4 rounded-xl border text-center transition-all hover:scale-[1.02] ${darkMode ? 'bg-gray-900/60 border-white/5 hover:border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
              <item.icon size={18} className={`mx-auto mb-2 ${colorMap[item.color]}`} />
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
              <p className={`text-[10px] font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Fluxo de Caixa - Últimos 10 meses</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={fluxoCaixa}>
              <defs>
                <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <XAxis dataKey="mes" tick={{ fill: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <RTooltip contentStyle={{ background: darkMode ? '#111827' : '#fff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px', fontSize: '12px' }} formatter={tooltipFmt} />
              <Legend />
              <Area type="monotone" dataKey="receitas" name="Receitas" stroke="#22C55E" fillOpacity={1} fill="url(#colorReceitas)" strokeWidth={2} />
              <Area type="monotone" dataKey="despesas" name="Despesas" stroke="#EF4444" fillOpacity={1} fill="url(#colorDespesas)" strokeWidth={2} />
              <Line type="monotone" dataKey="saldo" name="Saldo" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Despesas por Setor</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
              </Pie>
              <RTooltip formatter={tooltipFmt} contentStyle={{ background: darkMode ? '#111827' : '#fff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px', fontSize: '12px' }} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.cor }} />
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.name}</span>
                </div>
                <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-6">
            <Activity size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Comparativo Mensal - Receitas vs Despesas</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fluxoCaixa}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <XAxis dataKey="mes" tick={{ fill: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <RTooltip formatter={tooltipFmt} contentStyle={{ background: darkMode ? '#111827' : '#fff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px', fontSize: '12px' }} />
              <Bar dataKey="receitas" name="Receitas" fill="#22C55E" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesas" name="Despesas" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Alertas</h3>
            </div>
            <span className="text-xs text-athos-400 font-medium">{mockAlertas.filter(a => !a.lido).length} novos</span>
          </div>
          <div className="space-y-3">
            {mockAlertas.slice(0, 5).map(alerta => (
              <div key={alerta.id} className={`p-3 rounded-xl border transition-all ${darkMode ? 'border-white/5 hover:border-white/10' : 'border-gray-100 hover:border-gray-200'} ${!alerta.lido ? (darkMode ? 'bg-athos-500/5' : 'bg-athos-50/50') : ''}`}>
                <div className="flex items-start gap-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alerta.gravidade === 'alta' ? 'bg-red-400' : alerta.gravidade === 'media' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <div>
                    <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{alerta.titulo}</p>
                    <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{alerta.descricao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-athos-400" />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Insights IA</h3>
            </div>
            <button onClick={toggleAIPanel} className="text-xs text-athos-400 font-medium hover:underline">Ver todos</button>
          </div>
          <div className="space-y-3">
            {insightsIA.slice(0, 4).map(insight => (
              <div key={insight.id} className={`p-3 rounded-xl border transition-all ${darkMode ? 'border-white/5 hover:border-white/10' : 'border-gray-100 hover:border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${insight.impacto === 'alto' ? 'bg-red-500/10 text-red-400' : insight.impacto === 'medio' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{insight.impacto.toUpperCase()}</span>
                </div>
                <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{insight.titulo}</p>
                <p className={`text-[11px] mt-1 leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{insight.descricao}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`lg:col-span-2 rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-athos-400" />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Transações Recentes</h3>
            </div>
            <button onClick={() => setCurrentPage('financeiro')} className="text-xs text-athos-400 font-medium hover:underline">Ver todas</button>
          </div>
          <div className="space-y-2">
            {recentTransactions.map((tx, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tx.tipo === 'receita' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {tx.tipo === 'receita' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{tx.descricao}</p>
                    <p className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{tx.origem}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.tipo === 'receita' ? 'text-emerald-400' : 'text-red-400'}`}>{tx.tipo === 'receita' ? '+' : '-'}{fmt(tx.valor)}</p>
                  <p className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{tx.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

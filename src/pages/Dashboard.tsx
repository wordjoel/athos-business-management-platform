import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import {
  DollarSign, TrendingUp, Wallet, Users, CreditCard,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Activity,
  BarChart3, Sparkles, Target, Clock
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Line, Legend
} from 'recharts';
import { getLancamentos, getFluxoCaixaMensal, Lancamento } from '../services/lancamentoService';

const COLORS = ['#22C55E', '#EF4444', '#6366F1', '#F59E0B', '#06B6D4', '#EC4899', '#8B5CF6', '#FB923C'];

const Dashboard: React.FC = () => {
  const { darkMode, setCurrentPage, toggleAIPanel } = useApp();
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [fluxoMensal, setFluxoMensal] = useState<ReturnType<typeof getFluxoCaixaMensal>>([]);

  const carregar = () => {
    setLancamentos(getLancamentos());
    setFluxoMensal(getFluxoCaixaMensal());
  };
  useEffect(() => { carregar(); }, []);

  const receitas = lancamentos.filter(l => l.tipo === 'receita');
  const despesas = lancamentos.filter(l => l.tipo === 'despesa');
  const receitasRecebidas = receitas.filter(l => l.status === 'recebido');
  const despesasPagas = despesas.filter(l => l.status === 'pago');

  const totalReceitas = receitas.reduce((s, l) => s + l.valor, 0);
  const totalDespesas = despesas.reduce((s, l) => s + l.valor, 0);
  const totalRecebido = receitasRecebidas.reduce((s, l) => s + l.valor, 0);
  const totalPago = despesasPagas.reduce((s, l) => s + l.valor, 0);
  const lucroLiquido = totalReceitas - totalDespesas;
  const margemLucro = totalReceitas > 0 ? ((lucroLiquido / totalReceitas) * 100).toFixed(1) : '0.0';
  const contasPagar = despesas.filter(l => l.status === 'pendente').length;
  const contasReceber = receitas.filter(l => l.status === 'pendente').length;
  const aPagarValor = despesas.filter(l => l.status === 'pendente').reduce((s, l) => s + l.valor, 0);
  const aReceberValor = receitas.filter(l => l.status === 'pendente').reduce((s, l) => s + l.valor, 0);

  const catMap = new Map<string, number>();
  despesas.forEach(l => {
    catMap.set(l.categoria, (catMap.get(l.categoria) || 0) + l.valor);
  });
  const totalDespesasCalc = Array.from(catMap.values()).reduce((s, v) => s + v, 0);
  const pieData = Array.from(catMap.entries()).map(([name, value], i) => ({
    name, value, cor: COLORS[i % COLORS.length],
    pct: totalDespesasCalc > 0 ? ((value / totalDespesasCalc) * 100) : 0,
  }));

  const recentTransactions = [...receitasRecebidas, ...despesasPagas]
    .sort((a, b) => (b.vencimento || '').localeCompare(a.vencimento || ''))
    .slice(0, 8)
    .map(l => ({ tipo: l.tipo, descricao: l.descricao, valor: l.valor, origem: l.contraparte, data: l.vencimento }));

  const totalAlertas = lancamentos.filter(l => l.status === 'atrasado').length;

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const tooltipFmt = (value: unknown) => typeof value === 'number' ? fmt(value) : String(value);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard Executivo</h1>
            <Sparkles size={18} className="text-athos-400" />
          </div>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Visão geral da empresa • {lancamentos.length} lançamentos
          </p>
        </div>
        <button onClick={toggleAIPanel} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-athos text-white text-sm font-medium shadow-glow hover:shadow-lg transition-all">
          <Sparkles size={14} /> Assistente IA
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
        <StatCard title="Receita Total" value={fmt(totalReceitas)} change={`${receitasRecebidas.length} recebidas de ${receitas.length}`} changeType="up" icon={DollarSign} color="green" darkMode={darkMode} subtitle={totalReceitas > 0 ? `Média: ${fmt(totalReceitas / receitas.length)}` : 'Nenhuma receita'} />
        <StatCard title="Despesas Totais" value={fmt(totalDespesas)} change={`${despesasPagas.length} pagas de ${despesas.length}`} changeType="down" icon={CreditCard} color="red" darkMode={darkMode} subtitle={totalDespesas > 0 ? `Média: ${fmt(totalDespesas / despesas.length)}` : 'Nenhuma despesa'} />
        <StatCard title="Lucro Líquido" value={fmt(lucroLiquido)} change={`Margem: ${margemLucro}%`} changeType={lucroLiquido >= 0 ? 'up' : 'down'} icon={TrendingUp} color="purple" darkMode={darkMode} subtitle="Receitas - Despesas" />
        <StatCard title="Fluxo de Caixa" value={fmt(totalRecebido - totalPago)} change={`${contasReceber} a receber • ${contasPagar} a pagar`} changeType="neutral" icon={Wallet} color="blue" darkMode={darkMode} subtitle="Saldo disponível" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'A Receber', value: fmt(aReceberValor), icon: ArrowUpRight, color: 'green' },
          { label: 'A Pagar', value: fmt(aPagarValor), icon: ArrowDownRight, color: 'red' },
          { label: 'Clientes/Fornec.', value: new Set(lancamentos.map(l => l.contraparte)).size.toString(), icon: Users, color: 'blue' },
          { label: 'Categorias', value: new Set(lancamentos.map(l => l.categoria)).size.toString(), icon: Target, color: 'purple' },
          { label: 'Alertas (atraso)', value: totalAlertas.toString(), icon: AlertTriangle, color: 'amber' },
          { label: 'Total Lançamentos', value: lancamentos.length.toString(), icon: Activity, color: 'cyan' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Fluxo de Caixa Mensal</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={fluxoMensal.length > 0 ? fluxoMensal : [{ mes: 'Sem dados', receitas: 0, despesas: 0, saldo: 0 }]}>
              <defs>
                <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} /><stop offset="95%" stopColor="#22C55E" stopOpacity={0} /></linearGradient>
                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#EF4444" stopOpacity={0} /></linearGradient>
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
            <BarChart3 size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Despesas por Categoria</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie data={pieData.length > 0 ? pieData : [{ name: 'Sem dados', value: 1, cor: '#374151' }]} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
              </Pie>
              <RTooltip formatter={tooltipFmt} contentStyle={{ background: darkMode ? '#111827' : '#fff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px', fontSize: '12px' }} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieData.map((item, i) => {
              const pctNegativo = lucroLiquido < 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.cor }} />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${pctNegativo ? 'text-red-400' : 'text-emerald-400'}`}>
                        {item.pct.toFixed(1)}%
                      </span>
                      <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(item.value)}</span>
                    </div>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(item.pct, 100)}%`, backgroundColor: item.cor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-6">
            <Activity size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Comparativo Mensal - Receitas vs Despesas</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={fluxoMensal.length > 0 ? fluxoMensal : [{ mes: 'Sem dados', receitas: 0, despesas: 0, saldo: 0 }]}>
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
            <span className="text-xs text-athos-400 font-medium">{totalAlertas} atrasados</span>
          </div>
          <div className="space-y-3">
            {lancamentos.filter(l => l.status === 'atrasado').slice(0, 5).map(l => (
              <div key={l.id} className={`p-3 rounded-xl border transition-all ${darkMode ? 'border-white/5 hover:border-white/10' : 'border-gray-100 hover:border-gray-200'}`}>
                <div className="flex items-start gap-2.5">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-red-400" />
                  <div>
                    <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{l.descricao}</p>
                    <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{l.tipo === 'despesa' ? 'Conta atrasada' : 'Receita atrasada'} — R$ {l.valor.toLocaleString()} • {l.contraparte}</p>
                  </div>
                </div>
              </div>
            ))}
            {lancamentos.filter(l => l.status === 'atrasado').length === 0 && (
              <p className={`text-xs text-center py-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhum lançamento atrasado</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-athos-400" />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Resumo Financeiro</h3>
            </div>
          </div>
          <div className="space-y-3">
            <div className={`p-3 rounded-xl border ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total de Receitas</p>
              <p className="text-lg font-bold text-emerald-400">{fmt(totalReceitas)}</p>
            </div>
            <div className={`p-3 rounded-xl border ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total de Despesas</p>
              <p className="text-lg font-bold text-red-400">{fmt(totalDespesas)}</p>
            </div>
            <div className={`p-3 rounded-xl border ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Lucro Líquido</p>
              <p className={`text-lg font-bold ${lucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{fmt(lucroLiquido)}</p>
            </div>
            <div className={`p-3 rounded-xl border ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Margem</p>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{margemLucro}%</p>
            </div>
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
            {recentTransactions.length === 0 && (
              <p className={`text-xs text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma transação ainda. Vá em Contas a Pagar ou Contas a Receber para começar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

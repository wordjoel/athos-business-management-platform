import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import {
  DollarSign, TrendingUp, Wallet, Users, CreditCard,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Activity,
  BarChart3, Sparkles, Target, Clock, Building2, Briefcase,
  UserCheck, FileText, HeadphonesIcon, Kanban, Radar, BrainCircuit
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend,
  RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as ReRadar
} from 'recharts';
import { getLancamentos, getFluxoCaixaMensal, getDREValores, Lancamento } from '../services/lancamentoService';
import { alertas as mockAlertas, insightsIA, contratos, setores } from '../data/mockData';

const COLORS = ['#22C55E', '#EF4444', '#6366F1', '#F59E0B', '#06B6D4', '#EC4899', '#8B5CF6', '#FB923C'];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const Dashboard: React.FC = () => {
  const { darkMode, toggleAIPanel } = useApp();
  const navigate = useNavigate();
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
  const aReceberValor = receitas.filter(l => l.status === 'pendente').reduce((s, l) => s + l.valor, 0);
  const aPagarValor = despesas.filter(l => l.status === 'pendente').reduce((s, l) => s + l.valor, 0);

  const contratosAtivos = contratos.filter(c => c.status === 'ativo').length;
  const contasPagarCount = despesas.filter(l => l.status === 'pendente').length;
  const contasReceberCount = receitas.filter(l => l.status === 'pendente').length;
  const totalAlertas = lancamentos.filter(l => l.status === 'atrasado').length + mockAlertas.filter(a => !a.lido).length;

  const catDespesas = new Map<string, number>();
  despesas.forEach(l => catDespesas.set(l.categoria, (catDespesas.get(l.categoria) || 0) + l.valor));
  const totalDespCalc = Array.from(catDespesas.values()).reduce((s, v) => s + v, 0);
  const pieDespesas = Array.from(catDespesas.entries()).map(([name, value], i) => ({
    name, value, cor: COLORS[i % COLORS.length],
    pct: totalDespCalc > 0 ? ((value / totalDespCalc) * 100) : 0,
  }));

  const catReceitas = new Map<string, number>();
  receitas.forEach(l => catReceitas.set(l.categoria, (catReceitas.get(l.categoria) || 0) + l.valor));
  const pieReceitas = Array.from(catReceitas.entries()).map(([name, value], i) => ({
    name, value, cor: COLORS[(i + 3) % COLORS.length],
  }));

  const radarData = setores.map(s => ({
    setor: s.nome,
    Eficiência: s.kpis?.eficiencia || Math.round(60 + Math.random() * 30),
    Produtividade: s.kpis?.produtividade || Math.round(60 + Math.random() * 30),
    Satisfação: s.kpis?.satisfacao || Math.round(60 + Math.random() * 30),
  }));

  const setorData = setores.map(s => ({
    nome: s.nome,
    orcamento: s.orcamento,
    gastos: s.gastos,
    status: s.status,
  }));

  const recentTransactions = [...receitasRecebidas, ...despesasPagas]
    .sort((a, b) => (b.vencimento || '').localeCompare(a.vencimento || ''))
    .slice(0, 6)
    .map(l => ({ tipo: l.tipo, descricao: l.descricao, valor: l.valor, origem: l.contraparte, data: l.vencimento }));

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const tooltipFmt = (value: unknown) => typeof value === 'number' ? fmt(value) : String(value);

  const miniCards = [
    { label: 'A Receber', value: fmt(aReceberValor), icon: ArrowUpRight, color: 'text-emerald-400', route: '/contas-receber' },
    { label: 'A Pagar', value: fmt(aPagarValor), icon: ArrowDownRight, color: 'text-red-400', route: '/contas-pagar' },
    { label: 'Contratos Ativos', value: contratosAtivos.toString(), icon: FileText, color: 'text-violet-400', route: '/sign' },
    { label: 'Contas a Pagar', value: contasPagarCount.toString(), icon: CreditCard, color: 'text-amber-400', route: '/contas-pagar' },
    { label: 'Contas a Receber', value: contasReceberCount.toString(), icon: DollarSign, color: 'text-blue-400', route: '/contas-receber' },
    { label: 'Alertas', value: totalAlertas.toString(), icon: AlertTriangle, color: 'text-red-400', route: '/dashboard' },
  ];

  return (
    <motion.div className="p-6 space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" variants={itemVariants}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dashboard Executivo</h1>
            <Sparkles size={18} className="text-athos-400" />
          </div>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Visão geral da empresa • {lancamentos.length} lançamentos • {setores.length} setores
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/ai')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 text-sm font-medium border border-amber-500/20 hover:bg-amber-500/20 transition-all">
            <BrainCircuit size={14} /> IA Insights
          </button>
          <button onClick={toggleAIPanel} className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-athos text-white text-sm font-medium shadow-glow hover:shadow-lg transition-all">
            <Sparkles size={14} /> Assistente IA
          </button>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={itemVariants}>
        <StatCard title="Receita Total" value={fmt(totalReceitas)} change={`${receitasRecebidas.length} recebidas de ${receitas.length}`} changeType="up" icon={DollarSign} color="green" darkMode={darkMode} subtitle={totalReceitas > 0 ? `Média: ${fmt(totalReceitas / receitas.length)}` : 'Nenhuma receita'} index={0} />
        <StatCard title="Despesas Totais" value={fmt(totalDespesas)} change={`${despesasPagas.length} pagas de ${despesas.length}`} changeType="down" icon={CreditCard} color="red" darkMode={darkMode} subtitle={totalDespesas > 0 ? `Média: ${fmt(totalDespesas / despesas.length)}` : 'Nenhuma despesa'} index={1} />
        <StatCard title="Lucro Líquido" value={fmt(lucroLiquido)} change={`Margem: ${margemLucro}%`} changeType={lucroLiquido >= 0 ? 'up' : 'down'} icon={TrendingUp} color="purple" darkMode={darkMode} subtitle="Receitas - Despesas" index={2} />
        <StatCard title="Fluxo de Caixa" value={fmt(totalRecebido - totalPago)} change={`${contasReceberCount} a receber • ${contasPagarCount} a pagar`} changeType="neutral" icon={Wallet} color="blue" darkMode={darkMode} subtitle="Saldo disponível" index={3} />
      </motion.div>

      <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" variants={itemVariants}>
        {miniCards.map((item, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.03, y: -1 }}
            onClick={() => navigate(item.route)}
            className={`p-4 rounded-xl border text-center transition-all ${darkMode ? 'bg-gray-900/60 border-white/5 hover:border-cyan-500/30' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}
          >
            <item.icon size={18} className={`mx-auto mb-2 ${item.color}`} />
            <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
            <p className={`text-[10px] font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</p>
          </motion.button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className={`lg:col-span-2 rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
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
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Despesas por Categoria</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie data={pieDespesas.length > 0 ? pieDespesas : [{ name: 'Sem dados', value: 1, cor: '#374151' }]} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {pieDespesas.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
              </Pie>
              <RTooltip formatter={tooltipFmt} contentStyle={{ background: darkMode ? '#111827' : '#fff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px', fontSize: '12px' }} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieDespesas.slice(0, 5).map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.cor }} />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold text-emerald-400`}>{item.pct.toFixed(1)}%</span>
                    <span className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(item.value)}</span>
                  </div>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(item.pct, 100)}%`, backgroundColor: item.cor }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-6">
            <Radar size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>KPIs por Setor</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ReRadarChart data={radarData}>
              <PolarGrid stroke={darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} />
              <PolarAngleAxis dataKey="setor" tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 10 }} />
              <ReRadar name="Eficiência" dataKey="Eficiência" stroke="#22C55E" fill="#22C55E" fillOpacity={0.1} />
              <ReRadar name="Produtividade" dataKey="Produtividade" stroke="#6366F1" fill="#6366F1" fillOpacity={0.1} />
              <ReRadar name="Satisfação" dataKey="Satisfação" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.1} />
              <Legend />
            </ReRadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div variants={itemVariants} className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-6">
            <Building2 size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Orçamento vs Gastos por Setor</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={setorData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <XAxis type="number" tick={{ fill: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="nome" type="category" tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 11 }} width={100} />
              <RTooltip formatter={tooltipFmt} contentStyle={{ background: darkMode ? '#111827' : '#fff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px', fontSize: '12px' }} />
              <Legend />
              <Bar dataKey="orcamento" name="Orçamento" fill="#6366F1" radius={[0, 4, 4, 0]} />
              <Bar dataKey="gastos" name="Gastos" fill="#EF4444" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BrainCircuit size={18} className="text-amber-400" />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>IA Insights</h3>
            </div>
            <span className="text-[10px] text-athos-400 font-medium">{insightsIA.length} insights</span>
          </div>
          <div className="space-y-3">
            {insightsIA.slice(0, 4).map(insight => (
              <div key={insight.id} className={`p-3 rounded-xl border transition-all ${darkMode ? 'border-white/5 hover:border-white/10' : 'border-gray-100 hover:border-gray-200'}`}>
                <div className="flex items-start gap-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${insight.impacto === 'alto' ? 'bg-red-400' : insight.impacto === 'medio' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <div>
                    <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{insight.titulo}</p>
                    <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{insight.descricao}</p>
                    <p className={`text-[10px] mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{insight.data}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Alertas</h3>
            </div>
            <span className="text-[10px] text-athos-400 font-medium">{mockAlertas.filter(a => !a.lido).length} não lidos</span>
          </div>
          <div className="space-y-3">
            {mockAlertas.filter(a => !a.lido).slice(0, 5).map(alerta => (
              <div key={alerta.id} className={`p-3 rounded-xl border transition-all ${darkMode ? 'border-white/5 hover:border-white/10' : 'border-gray-100 hover:border-gray-200'}`}>
                <div className="flex items-start gap-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${alerta.gravidade === 'alta' ? 'bg-red-400' : alerta.gravidade === 'media' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <div>
                    <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{alerta.titulo}</p>
                    <p className={`text-[11px] mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{alerta.descricao}</p>
                    <p className={`text-[10px] mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{alerta.data}</p>
                  </div>
                </div>
              </div>
            ))}
            {mockAlertas.filter(a => !a.lido).length === 0 && (
              <p className={`text-xs text-center py-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhum alerta pendente</p>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contratos</h3>
          </div>
          <div className="space-y-2">
            {contratos.slice(0, 5).map(ct => (
              <div key={ct.id} className={`flex items-center justify-between p-3 rounded-xl transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{ct.titulo}</p>
                  <p className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{ct.fornecedor} • {fmt(ct.valor)}/mês</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  ct.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-400' :
                  ct.status === 'encerrado' ? 'bg-gray-500/10 text-gray-400' :
                  'bg-amber-500/10 text-amber-400'
                }`}>{ct.status}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Comparativo Mensal - Receitas vs Despesas</h3>
          </div>
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
      </motion.div>

      <motion.div variants={itemVariants} className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Transações Recentes</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
            <p className={`text-xs text-center py-8 col-span-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma transação ainda.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;

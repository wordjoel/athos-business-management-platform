import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import {
  DollarSign, TrendingUp, Wallet, CreditCard,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Activity,
  BarChart3, Sparkles, Clock, Building2, FileText, Radar, BrainCircuit
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Legend,
  RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as ReRadar
} from 'recharts';
import { getLancamentos, getFluxoCaixaMensal, refreshLancamentos, Lancamento } from '../services/lancamentoService';
import { alertas as mockAlertas, insightsIA, contratos, setores } from '../data/mockData';
import Pane from '../components/TerminalPane';

const COLORS = ['#C9A961', '#5B7FA8', '#2F9E7C', '#A6484A', '#8E6E9F', '#B8785A', '#B06E85', '#8B93A6'];
const TOOLTIP_STYLE = { background: '#131722', border: '1px solid #232837', borderRadius: 10, fontSize: '12px', color: '#E9E4D8', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' };
const AXIS_TICK = { fill: '#8B93A6', fontSize: 11 };
const GRID_STROKE = 'rgba(201,169,97,0.08)';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const Dashboard: React.FC = () => {
  const { toggleAIPanel } = useApp();
  const navigate = useNavigate();
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [fluxoMensal, setFluxoMensal] = useState<ReturnType<typeof getFluxoCaixaMensal>>([]);

  const carregar = async () => {
    try {
      await refreshLancamentos();
    } catch (err) {
      console.error('Falha ao buscar lançamentos no Supabase:', err);
    }
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
    { label: 'A Receber', value: fmt(aReceberValor), icon: ArrowUpRight, route: '/contas-receber' },
    { label: 'A Pagar', value: fmt(aPagarValor), icon: ArrowDownRight, route: '/contas-pagar' },
    { label: 'Contratos Ativos', value: contratosAtivos.toString(), icon: FileText, route: '/sign' },
    { label: 'Contas a Pagar', value: contasPagarCount.toString(), icon: CreditCard, route: '/contas-pagar' },
    { label: 'Contas a Receber', value: contasReceberCount.toString(), icon: DollarSign, route: '/contas-receber' },
    { label: 'Alertas', value: totalAlertas.toString(), icon: AlertTriangle, route: '/dashboard' },
  ];

  return (
    <motion.div className="p-6 space-y-6" variants={containerVariants} initial="hidden" animate="visible">
      <motion.div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" variants={itemVariants}>
        <div>
          <p className="module-eyebrow mb-1">Visão Executiva</p>
          <h1 className="font-display text-3xl text-[#F0E6CC]">Painel Geral</h1>
          <p className="text-sm mt-1.5 text-[#8B93A6]">
            {lancamentos.length} lançamentos · {setores.length} setores acompanhados
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/ai')} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[#5B7FA8] text-sm font-medium border border-[#5B7FA8]/50 hover:bg-[#5B7FA8] hover:text-[#0B0E14] transition-all">
            <BrainCircuit size={14} /> Insights de IA
          </button>
          <button onClick={toggleAIPanel} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all" style={{ background: 'linear-gradient(135deg, #E0C583 0%, #C9A961 55%, #A98A47 100%)', color: '#12151E' }}>
            <Sparkles size={14} /> Assistente IA
          </button>
        </div>
      </motion.div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" variants={itemVariants}>
        <StatCard title="Receita Total" value={fmt(totalReceitas)} change={`${receitasRecebidas.length} recebidas de ${receitas.length}`} changeType="up" icon={DollarSign} color="green" darkMode subtitle={totalReceitas > 0 ? `Média: ${fmt(totalReceitas / receitas.length)}` : 'Nenhuma receita'} index={0} />
        <StatCard title="Despesas Totais" value={fmt(totalDespesas)} change={`${despesasPagas.length} pagas de ${despesas.length}`} changeType="down" icon={CreditCard} color="red" darkMode subtitle={totalDespesas > 0 ? `Média: ${fmt(totalDespesas / despesas.length)}` : 'Nenhuma despesa'} index={1} />
        <StatCard title="Lucro Líquido" value={fmt(lucroLiquido)} change={`Margem: ${margemLucro}%`} changeType={lucroLiquido >= 0 ? 'up' : 'down'} icon={TrendingUp} color="green" darkMode subtitle="Receitas - Despesas" index={2} />
        <StatCard title="Fluxo de Caixa" value={fmt(totalRecebido - totalPago)} change={`${contasReceberCount} a receber • ${contasPagarCount} a pagar`} changeType="neutral" icon={Wallet} color="green" darkMode subtitle="Saldo disponível" index={3} />
      </motion.div>

      <motion.div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" variants={itemVariants}>
        {miniCards.map((item, i) => (
          <motion.button
            key={i}
            whileHover={{ y: -1 }}
            onClick={() => navigate(item.route)}
            className="p-4 rounded-xl border border-[#2A2F3D] text-center transition-all hover:border-[#C9A961]"
          >
            <item.icon size={18} className="mx-auto mb-2 text-[#C9A961]" />
            <p className="text-lg font-bold text-[#C9A961]">{item.value}</p>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#8B93A6]">{item.label}</p>
          </motion.button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Pane title="Fluxo de Caixa Mensal" icon={<BarChart3 size={16} className="text-[#C9A961]" />} className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={fluxoMensal.length > 0 ? fluxoMensal : [{ mes: 'Sem dados', receita: 0, despesa: 0, saldo: 0 }]}>
              <defs>
                <linearGradient id="colorReceitas" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#C9A961" stopOpacity={0.25} /><stop offset="95%" stopColor="#C9A961" stopOpacity={0} /></linearGradient>
                <linearGradient id="colorDespesas" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#A6484A" stopOpacity={0.25} /><stop offset="95%" stopColor="#A6484A" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis dataKey="mes" tick={AXIS_TICK} />
              <YAxis tick={AXIS_TICK} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <RTooltip contentStyle={TOOLTIP_STYLE} formatter={tooltipFmt} />
              <Legend />
              <Area type="monotone" dataKey="receita" name="Receitas" stroke="#C9A961" fillOpacity={1} fill="url(#colorReceitas)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="despesa" name="Despesas" stroke="#A6484A" fillOpacity={1} fill="url(#colorDespesas)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Pane>

        <Pane title="Despesas por Categoria" icon={<BarChart3 size={16} className="text-[#C9A961]" />}>
          <ResponsiveContainer width="100%" height={200}>
            <RePieChart>
              <Pie data={pieDespesas.length > 0 ? pieDespesas : [{ name: 'Sem dados', value: 1, cor: '#2A2F3D' }]} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2} dataKey="value" stroke="#0B0E14">
                {pieDespesas.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
              </Pie>
              <RTooltip formatter={tooltipFmt} contentStyle={TOOLTIP_STYLE} />
            </RePieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieDespesas.slice(0, 5).map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5" style={{ backgroundColor: item.cor }} />
                    <span className="text-xs text-[#8B93A6]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#C9A961]">{item.pct.toFixed(1)}%</span>
                    <span className="text-xs font-semibold text-[#C9A961]">{fmt(item.value)}</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full border border-[#2A2F3D] overflow-hidden">
                  <div className="h-full transition-all duration-500" style={{ width: `${Math.min(item.pct, 100)}%`, backgroundColor: item.cor }} />
                </div>
              </div>
            ))}
          </div>
        </Pane>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Pane title="Indicadores por Setor" icon={<Radar size={16} className="text-[#C9A961]" />}>
          <ResponsiveContainer width="100%" height={300}>
            <ReRadarChart data={radarData}>
              <PolarGrid stroke="rgba(201,169,97,0.15)" />
              <PolarAngleAxis dataKey="setor" tick={AXIS_TICK} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#2A2F3D', fontSize: 10 }} />
              <ReRadar name="Eficiência" dataKey="Eficiência" stroke="#C9A961" fill="#C9A961" fillOpacity={0.1} />
              <ReRadar name="Produtividade" dataKey="Produtividade" stroke="#5B7FA8" fill="#5B7FA8" fillOpacity={0.1} />
              <ReRadar name="Satisfação" dataKey="Satisfação" stroke="#5ecf7f" fill="#5ecf7f" fillOpacity={0.1} />
              <Legend />
            </ReRadarChart>
          </ResponsiveContainer>
        </Pane>

        <Pane title="Orçamento vs. Gastos" icon={<Building2 size={16} className="text-[#C9A961]" />}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={setorData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
              <XAxis type="number" tick={AXIS_TICK} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="nome" type="category" tick={AXIS_TICK} width={100} />
              <RTooltip formatter={tooltipFmt} contentStyle={TOOLTIP_STYLE} />
              <Legend />
              <Bar dataKey="orcamento" name="Orçamento" fill="#5ecf7f" />
              <Bar dataKey="gastos" name="Gastos" fill="#A6484A" />
            </BarChart>
          </ResponsiveContainer>
        </Pane>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Pane title="Insights de IA" icon={<BrainCircuit size={16} className="text-[#5B7FA8]" />} right={<span className="text-[10px] text-[#C9A961] font-medium">{insightsIA.length}</span>}>
          <div className="space-y-3">
            {insightsIA.slice(0, 4).map(insight => (
              <div key={insight.id} className="p-3 rounded-xl border border-[#2A2F3D] hover:border-[#C9A961] transition-all">
                <div className="flex items-start gap-2.5">
                  <div className={`w-2 h-2 mt-1.5 flex-shrink-0 ${insight.impacto === 'alto' ? 'bg-[#A6484A]' : insight.impacto === 'medio' ? 'bg-[#5B7FA8]' : 'bg-[#C9A961]'}`} />
                  <div>
                    <p className="text-xs font-semibold text-[#C9A961]">{insight.titulo}</p>
                    <p className="text-[11px] mt-0.5 text-[#8B93A6]">{insight.descricao}</p>
                    <p className="text-[10px] mt-1 text-[#2A2F3D]">{insight.data}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Pane>

        <Pane title="Alertas" icon={<AlertTriangle size={16} className="text-[#5B7FA8]" />} right={<span className="text-[10px] text-[#C9A961] font-medium">{mockAlertas.filter(a => !a.lido).length}</span>}>
          <div className="space-y-3">
            {mockAlertas.filter(a => !a.lido).slice(0, 5).map(alerta => (
              <div key={alerta.id} className="p-3 rounded-xl border border-[#2A2F3D] hover:border-[#C9A961] transition-all">
                <div className="flex items-start gap-2.5">
                  <div className={`w-2 h-2 mt-1.5 flex-shrink-0 ${alerta.gravidade === 'alta' ? 'bg-[#A6484A]' : alerta.gravidade === 'media' ? 'bg-[#5B7FA8]' : 'bg-[#C9A961]'}`} />
                  <div>
                    <p className="text-xs font-semibold text-[#C9A961]">{alerta.titulo}</p>
                    <p className="text-[11px] mt-0.5 text-[#8B93A6]">{alerta.descricao}</p>
                    <p className="text-[10px] mt-1 text-[#2A2F3D]">{alerta.data}</p>
                  </div>
                </div>
              </div>
            ))}
            {mockAlertas.filter(a => !a.lido).length === 0 && (
              <p className="text-xs text-center py-6 text-[#2A2F3D]">nenhum alerta pendente</p>
            )}
          </div>
        </Pane>

        <Pane title="Contratos" icon={<FileText size={16} className="text-[#C9A961]" />}>
          <div className="space-y-2">
            {contratos.slice(0, 5).map(ct => (
              <div key={ct.id} className="flex items-center justify-between p-3 transition-all hover:bg-[#12151E]">
                <div>
                  <p className="text-sm font-medium text-[#C9A961]">{ct.titulo}</p>
                  <p className="text-[11px] text-[#8B93A6]">{ct.fornecedor} • {fmt(ct.valor)}/mês</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 border ${
                  ct.status === 'ativo' ? 'border-[#C9A961] text-[#C9A961]' :
                  ct.status === 'encerrado' ? 'border-[#2A2F3D] text-[#2A2F3D]' :
                  'border-[#5B7FA8] text-[#5B7FA8]'
                }`}>{ct.status}</span>
              </div>
            ))}
          </div>
        </Pane>
      </div>

      <Pane title="Comparativo Mensal" icon={<Activity size={16} className="text-[#C9A961]" />}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={fluxoMensal.length > 0 ? fluxoMensal : [{ mes: 'Sem dados', receita: 0, despesa: 0, saldo: 0 }]}>
            <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
            <XAxis dataKey="mes" tick={AXIS_TICK} />
            <YAxis tick={AXIS_TICK} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <RTooltip formatter={tooltipFmt} contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="receita" name="Receitas" fill="#C9A961" />
            <Bar dataKey="despesa" name="Despesas" fill="#A6484A" />
          </BarChart>
        </ResponsiveContainer>
      </Pane>

      <Pane title="Transações Recentes" icon={<Clock size={16} className="text-[#C9A961]" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {recentTransactions.map((tx, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg transition-all hover:bg-[#12151E] border border-[#2A2F3D]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 flex items-center justify-center border ${tx.tipo === 'receita' ? 'border-[#C9A961] text-[#C9A961]' : 'border-[#A6484A] text-[#A6484A]'}`}>
                  {tx.tipo === 'receita' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#C9A961]">{tx.descricao}</p>
                  <p className="text-[11px] text-[#8B93A6]">{tx.origem}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.tipo === 'receita' ? 'text-[#C9A961]' : 'text-[#A6484A]'}`}>{tx.tipo === 'receita' ? '+' : '-'}{fmt(tx.valor)}</p>
                <p className="text-[11px] text-[#8B93A6]">{tx.data}</p>
              </div>
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <p className="text-xs text-center py-8 col-span-2 text-[#2A2F3D]">nenhuma transação ainda</p>
          )}
        </div>
      </Pane>
    </motion.div>
  );
};

export default Dashboard;

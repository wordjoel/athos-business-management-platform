import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Users, DollarSign, Target, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { setores, despesas } from '../data/mockData';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend } from 'recharts';

const SetoresPage: React.FC = () => {
  const { darkMode } = useApp();
  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const tooltipFmt = (value: unknown) => typeof value === 'number' ? fmt(value) : String(value);

  const radarData = setores.map(s => ({
    name: s.nome,
    eficiencia: s.kpis.eficiencia,
    produtividade: s.kpis.produtividade,
    satisfacao: s.kpis.satisfação,
  }));

  const budgetData = setores.map(s => ({
    name: s.nome,
    orcamento: s.orcamento,
    gastos: s.gastos,
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Building2 size={24} className="text-athos-400" /> Gestão por Setores
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Desempenho e métricas de cada departamento</p>
        </div>
      </div>

      {/* Sector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {setores.map(setor => {
          const pctOrc = ((setor.gastos / setor.orcamento) * 100).toFixed(0);
          const over = setor.gastos > setor.orcamento;
          return (
            <div key={setor.id} className={`rounded-2xl border overflow-hidden transition-all hover:scale-[1.01] ${darkMode ? 'bg-gray-900/80 border-white/5 hover:border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
              {/* Header with color */}
              <div className="h-1.5" style={{ backgroundColor: setor.cor }} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{setor.nome}</h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                    setor.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-400' :
                    setor.status === 'alerta' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>{setor.status.toUpperCase()}</span>
                </div>
                <p className={`text-xs mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Responsável: {setor.responsavel}</p>

                {/* KPIs */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <p className="text-lg font-bold" style={{ color: setor.cor }}>{setor.kpis.eficiencia}%</p>
                    <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Eficiência</p>
                  </div>
                  <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <p className="text-lg font-bold" style={{ color: setor.cor }}>{setor.kpis.produtividade}%</p>
                    <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Produtividade</p>
                  </div>
                  <div className={`text-center p-2 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <p className="text-lg font-bold" style={{ color: setor.cor }}>{setor.kpis.satisfação}%</p>
                    <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Satisfação</p>
                  </div>
                </div>

                {/* Budget */}
                <div className={`p-3 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Orçamento</span>
                    <span className={`text-xs font-bold ${over ? 'text-red-400' : darkMode ? 'text-white' : 'text-gray-900'}`}>{pctOrc}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${Math.min(parseFloat(pctOrc), 100)}%`, backgroundColor: over ? '#ff3333' : setor.cor }} />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{fmt(setor.gastos)} gasto</span>
                    <span className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{fmt(setor.orcamento)} budget</span>
                  </div>
                </div>

                {/* Info */}
                <div className={`flex items-center justify-between mt-4 pt-3 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-1.5">
                    <Users size={12} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{setor.funcionarios} funcionários</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {over ? <AlertTriangle size={12} className="text-red-400" /> : <CheckCircle size={12} className="text-emerald-400" />}
                    <span className={`text-xs ${over ? 'text-red-400' : 'text-emerald-400'}`}>{over ? 'Acima do orçamento' : 'Dentro do orçamento'}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar */}
        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Radar de Performance por Setor</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <PolarAngleAxis dataKey="name" tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 10 }} />
              <Radar name="Eficiência" dataKey="eficiencia" stroke="#33ff00" fill="#33ff00" fillOpacity={0.2} />
              <Radar name="Produtividade" dataKey="produtividade" stroke="#ffb000" fill="#ffb000" fillOpacity={0.2} />
              <Radar name="Satisfação" dataKey="satisfacao" stroke="#5ecf7f" fill="#5ecf7f" fillOpacity={0.2} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Budget Comparison */}
        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Orçamento vs Gastos por Setor</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <XAxis dataKey="name" tick={{ fill: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 11 }} />
              <YAxis tick={{ fill: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <RTooltip formatter={tooltipFmt} contentStyle={{ background: darkMode ? '#111827' : '#fff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="orcamento" name="Orçamento" fill="#5ecf7f" opacity={0.4} />
              <Bar dataKey="gastos" name="Gastos" fill="#33ff00" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expenses by Sector Table */}
      <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-athos-400" />
          <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Despesas por Setor - Detalhamento</h3>
        </div>
        <div className="space-y-3">
          {setores.map(s => {
            const sectorDespesas = despesas.filter(d => d.setor === s.nome);
            const totalSector = sectorDespesas.reduce((sum, d) => sum + d.valor, 0);
            const pagas = sectorDespesas.filter(d => d.pago).length;
            return (
              <div key={s.id} className={`p-4 rounded-xl border flex items-center justify-between ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: s.cor }}>{s.nome.charAt(0)}</div>
                  <div>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{s.nome}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{sectorDespesas.length} despesas • {pagas} pagas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(totalSector)}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{((totalSector / s.orcamento) * 100).toFixed(0)}% do orçamento</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SetoresPage;

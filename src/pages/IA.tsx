import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BrainCircuit, Sparkles, TrendingUp, AlertTriangle, Lightbulb, DollarSign } from 'lucide-react';
import { insightsIA, fluxoCaixa, despesas } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer } from 'recharts';

const IAPage: React.FC = () => {
  const { darkMode } = useApp();
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const tooltipFmt = (value: unknown) => typeof value === 'number' ? fmt(value) : String(value);

  const alerts = insightsIA.filter(i => i.tipo === 'alerta').length;
  const oportunidades = insightsIA.filter(i => i.tipo === 'oportunidade').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <BrainCircuit size={24} className="text-athos-400" /> IA Assistente
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Inteligência artificial para gestão empresarial</p>
        </div>
      </div>

      {/* AI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Insights Ativos', value: insightsIA.length.toString(), icon: Sparkles, color: 'text-athos-400', bg: 'bg-athos-500/10' },
          { label: 'Economia Potencial/mês', value: 'R$ 6.026', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Alertas de Risco', value: alerts.toString(), icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Oportunidades', value: oportunidades.toString(), icon: Lightbulb, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        ].map((item, i) => (
          <div key={i} className={`rounded-2xl p-5 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.label}</span>
              <div className={`p-2 rounded-lg ${item.bg}`}><item.icon size={16} className={item.color} /></div>
            </div>
            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* AI Insights Cards */}
      <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles size={18} className="text-athos-400" />
          <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Insights Gerados pela IA</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insightsIA.map(insight => (
            <button
              key={insight.id}
              onClick={() => setSelectedInsight(selectedInsight === insight.id ? null : insight.id)}
              className={`text-left p-5 rounded-xl border transition-all ${
                darkMode ? 'border-white/5 hover:border-white/10' : 'border-gray-200 hover:border-gray-300'
              } ${selectedInsight === insight.id ? (darkMode ? 'bg-athos-500/5 border-athos-500/20' : 'bg-athos-50 border-athos-200') : ''}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  insight.tipo === 'economia' ? 'bg-emerald-500/10 text-emerald-400' :
                  insight.tipo === 'alerta' ? 'bg-red-500/10 text-red-400' :
                  insight.tipo === 'oportunidade' ? 'bg-blue-500/10 text-blue-400' :
                  'bg-athos-500/10 text-athos-400'
                }`}>{insight.tipo.toUpperCase()}</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  insight.impacto === 'alto' ? 'bg-red-500/10 text-red-400' :
                  insight.impacto === 'medio' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-emerald-500/10 text-emerald-400'
                }`}>IMPACTO {insight.impacto.toUpperCase()}</span>
              </div>
              <h4 className={`text-sm font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{insight.titulo}</h4>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{insight.descricao}</p>
              {selectedInsight === insight.id && (
                <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                  <p className={`text-xs ${darkMode ? 'text-athos-300' : 'text-athos-600'}`}>
                    💡 <strong>Ação recomendada:</strong> Clique em "Gerar Relatório" na aba de Relatórios para um documento detalhado sobre esta análise.
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Projection Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Projeção de Fluxo de Caixa</h3>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={fluxoCaixa}>
              <defs>
                <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <XAxis dataKey="mes" tick={{ fill: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 12 }} />
              <YAxis tick={{ fill: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <RTooltip formatter={tooltipFmt} contentStyle={{ background: darkMode ? '#111827' : '#fff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '12px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="saldo" name="Saldo" stroke="#6366F1" fillOpacity={1} fill="url(#colorSaldo)" strokeWidth={2} dot={{ fill: '#6366F1', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Análise de Gastos Anormais</h3>
          </div>
          <div className="space-y-3">
            {despesas.filter(d => d.anormal).map(d => (
              <div key={d.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-red-500/5 border-red-500/10' : 'bg-red-50 border-red-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={14} className="text-red-400" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{d.descricao}</span>
                  </div>
                  <span className={`text-sm font-bold text-red-400`}>{fmt(d.valor)}</span>
                </div>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Setor: {d.setor} • Categoria: {d.categoria}</p>
                <p className={`text-xs mt-1 text-athos-400`}>💡 {d.categoria === 'Capacitação' ? '40% acima da média histórica de treinamentos' : '25% acima do budget aprovado para viagens'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IAPage;

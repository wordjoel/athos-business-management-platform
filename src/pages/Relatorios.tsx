import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FileText, Download, Eye, FileBarChart, FilePieChart, FileSpreadsheet, Bot, CheckCircle, Clock } from 'lucide-react';
import { relatorios } from '../data/mockData';
import { getLancamentos, refreshLancamentos } from '../services/lancamentoService';

const Relatorios: React.FC = () => {
  const { darkMode, toggleAIPanel } = useApp();
  const [generating, setGenerating] = useState<string | null>(null);
  const [lancamentos, setLancamentos] = useState<ReturnType<typeof getLancamentos>>([]);
  useEffect(() => { refreshLancamentos().catch(err => console.error('Falha ao buscar lançamentos no Supabase:', err)).finally(() => setLancamentos(getLancamentos())); }, []);

  const receitas = lancamentos.filter(l => l.tipo === 'receita');
  const despesas = lancamentos.filter(l => l.tipo === 'despesa');
  const totalReceitas = receitas.reduce((s, l) => s + l.valor, 0);
  const totalDespesas = despesas.reduce((s, l) => s + l.valor, 0);
  const lucroLiquido = totalReceitas - totalDespesas;
  const margem = totalReceitas > 0 ? ((lucroLiquido / totalReceitas) * 100).toFixed(1) : '0.0';

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const reportTypes = [
    { id: 'financeiro', label: 'Financeiro', icon: FileBarChart, desc: 'Receitas, despesas, fluxo de caixa e lucratividade' },
    { id: 'setorial', label: 'Setorial', icon: FilePieChart, desc: 'Análise por departamento com KPIs e orçamentos' },
    { id: 'executivo', label: 'Executivo', icon: FileSpreadsheet, desc: 'Resumo completo para tomada de decisão' },
    { id: 'operacional', label: 'Operacional', icon: FileText, desc: 'Métricas operacionais e eficiência' },
    { id: 'performance', label: 'Performance', icon: FileText, desc: 'Indicadores de desempenho e metas' },
  ];

  const handleGenerate = (type: string) => {
    setGenerating(type);
    setTimeout(() => setGenerating(null), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <FileText size={24} className="text-athos-400" /> Relatórios
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Geração e visualização de relatórios inteligentes</p>
        </div>
        <button onClick={toggleAIPanel} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-athos-500/10 text-athos-400 text-sm font-medium border border-athos-500/20 hover:border-athos-500/40 transition-all">
          <Bot size={14} /> Gerar com IA
        </button>
      </div>

      {/* Quick Generate */}
      <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Gerar Novo Relatório</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {reportTypes.map(type => (
            <button
              key={type.id}
              onClick={() => handleGenerate(type.id)}
              disabled={generating !== null}
              className={`p-4 rounded-xl border text-left transition-all hover:scale-[1.02] ${
                darkMode ? 'border-white/5 hover:border-athos-500/30 hover:bg-athos-500/5' : 'border-gray-200 hover:border-athos-400 hover:bg-athos-50'
              } ${generating === type.id ? 'opacity-50' : ''}`}
            >
              <type.icon size={20} className="text-athos-400 mb-2" />
              <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{type.label}</p>
              <p className={`text-[11px] mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{type.desc}</p>
              {generating === type.id && <p className="text-xs text-athos-400 mt-2 flex items-center gap-1"><Clock size={12} className="animate-spin" /> Gerando...</p>}
            </button>
          ))}
        </div>
      </div>

      {/* Existing Reports */}
      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className={`p-5 border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Relatórios Gerados</h3>
        </div>
        <div className="divide-y divide-white/5">
          {relatorios.map(rel => (
            <div key={rel.id} className={`flex items-center justify-between p-5 transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  rel.tipo === 'financeiro' ? 'bg-emerald-500/10 text-emerald-400' :
                  rel.tipo === 'executivo' ? 'bg-athos-500/10 text-athos-400' :
                  rel.tipo === 'setorial' ? 'bg-blue-500/10 text-blue-400' :
                  rel.tipo === 'operacional' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-pink-500/10 text-pink-400'
                }`}>
                  <FileText size={18} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rel.titulo}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{rel.data} • {rel.geradoPor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {rel.status === 'gerado' ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle size={12} /> Gerado</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-amber-400"><Clock size={12} /> Pendente</span>
                )}
                <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><Eye size={14} /></button>
                <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><Download size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights Summary */}
      <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-2 mb-4">
          <Bot size={18} className="text-athos-400" />
          <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Resumo Executivo Automático</h3>
        </div>
        <div className={`p-5 rounded-xl border ${darkMode ? 'bg-athos-500/5 border-athos-500/10' : 'bg-athos-50 border-athos-100'}`}>
          <h4 className={`text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>📊 Resumo Financeiro</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div><p className={`text-lg font-bold text-emerald-400`}>{fmt(totalReceitas)}</p><p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Receita Total</p></div>
            <div><p className={`text-lg font-bold text-red-400`}>{fmt(totalDespesas)}</p><p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Despesas</p></div>
            <div><p className={`text-lg font-bold ${lucroLiquido >= 0 ? 'text-athos-400' : 'text-red-400'}`}>{fmt(Math.abs(lucroLiquido))}</p><p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Lucro Líquido</p></div>
            <div><p className={`text-lg font-bold text-amber-400`}>{margem}%</p><p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Margem</p></div>
          </div>
          <div className="space-y-2">
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>📊 <strong>Total de lançamentos:</strong> {lancamentos.length} ({receitas.length} receitas, {despesas.length} despesas)</p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>✅ <strong>Receitas recebidas:</strong> {receitas.filter(l => l.status === 'recebido').length} de {receitas.length}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>⚠️ <strong>Despesas pendentes:</strong> {despesas.filter(l => l.status === 'pendente').length} ({fmt(despesas.filter(l => l.status === 'pendente').reduce((s, l) => s + l.valor, 0))})</p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>🔮 <strong>Margem atual:</strong> {margem}% {parseFloat(margem) >= 0 ? '(positiva)' : '(negativa)'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;

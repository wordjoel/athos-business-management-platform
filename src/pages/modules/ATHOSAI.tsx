import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BrainCircuit, MessageSquare, FileText, TrendingUp, Shield, Zap, Sparkles, Bot, Mic, BarChart3, AlertTriangle, Plus, Trash2, X, Save, Send } from 'lucide-react';

interface Insight {
  id: string;
  tipo: 'financeiro' | 'vendas' | 'operacional' | 'rh';
  titulo: string;
  descricao: string;
  impacto: 'alto' | 'medio' | 'baixo';
  data: string;
  lido: boolean;
}

const ATHOSAI: React.FC = () => {
  const { darkMode } = useApp();

  const [insights, setInsights] = useState<Insight[]>(() => {
    const saved = localStorage.getItem('athos_insights');
    return saved ? JSON.parse(saved) : [
      { id: '1', tipo: 'financeiro', titulo: 'Aumento de 15% em receitas', descricao: 'Meta fiscal atingida com folga', impacto: 'alto', data: '13/05', lido: true },
      { id: '2', tipo: 'vendas', titulo: '3 novos leads qualificados', descricao: 'Pipeline crescendo', impacto: 'medio', data: '12/05', lido: false },
      { id: '3', tipo: 'operacional', titulo: 'Contrato vencendo em 30 dias', descricao: 'Renegociar contrato Tech Solutions', impacto: 'alto', data: '11/05', lido: false },
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ titulo: '', descricao: '', tipo: 'operacional', impacto: 'medio' });

  useEffect(() => { localStorage.setItem('athos_insights', JSON.stringify(insights)); }, [insights]);

  const salvarInsight = () => {
    if (!formData.titulo) return;
    const novo: Insight = {
      id: Date.now().toString(),
      ...formData,
      data: new Date().toLocaleDateString('pt-BR'),
      lido: false,
    };
    setInsights([novo, ...insights]);
    setFormData({ titulo: '', descricao: '', tipo: 'operacional', impacto: 'medio' });
    setShowForm(false);
  };

  const excluirInsight = (id: string) => {
    setInsights(insights.filter(i => i.id !== id));
  };

  const marcarLido = (id: string) => {
    setInsights(insights.map(i => i.id === id ? { ...i, lido: true } : i));
  };

  const stats = [
    { title: 'Insights IA', value: insights.length.toString(), icon: BrainCircuit, color: 'amber' },
    { title: 'Novos', value: insights.filter(i => !i.lido).length.toString(), icon: AlertTriangle, color: 'red' },
    { title: 'Alto Impacto', value: insights.filter(i => i.impacto === 'alto').length.toString(), icon: TrendingUp, color: 'emerald' },
    { title: 'Ações Sugeridas', value: '12', icon: Sparkles, color: 'violet' },
  ];

  const funcoesIA = [
    { nome: 'Análise Financeira', descricao: 'Predições e alertas financeiros', icon: TrendingUp, status: 'Ativo' },
    { nome: 'Chatbot Empresarial', descricao: 'Atendimento automático 24/7', icon: Bot, status: 'Ativo' },
    { nome: 'Geração de Relatórios', descricao: 'Relatórios automáticos', icon: FileText, status: 'Ativo' },
    { nome: 'Análise de Riscos', descricao: 'Detecção de anomalias', icon: Shield, status: 'Ativo' },
    { nome: 'Predição de Vendas', descricao: 'Forecast de receitas', icon: BarChart3, status: 'Beta' },
    { nome: 'Atendimento IA', descricao: 'Classificação de tickets', icon: MessageSquare, status: 'Ativo' },
  ];

  const impactoCores: Record<string, string> = { alto: 'red', medio: 'amber', baixo: 'gray' };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS AI</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Inteligência Artificial - Dir. Tecnologia: Kleber Duarte</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-lg">
          <Sparkles size={16} className="text-amber-400" />
          <span className="text-sm font-medium text-amber-400">6 Funções Ativas</span>
        </div>
      </div>

      <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 flex items-center gap-2">
        <Plus size={16} /> Novo Insight
      </button>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={20} className={`text-${stat.color}-400`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.title}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl w-full max-w-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Novo Insight</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Título</label>
                <input type="text" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Título do insight" />
              </div>
              <div>
                <label className="text-sm">Descrição</label>
                <textarea value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" rows={3} placeholder="Descrição" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Tipo</label>
                  <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value as any })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                    <option value="financeiro">Financeiro</option>
                    <option value="vendas">Vendas</option>
                    <option value="operacional">Operacional</option>
                    <option value="rh">RH</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm">Impacto</label>
                  <select value={formData.impacto} onChange={e => setFormData({ ...formData, impacto: e.target.value as any })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                    <option value="alto">Alto</option>
                    <option value="medio">Médio</option>
                    <option value="baixo">Baixo</option>
                  </select>
                </div>
              </div>
              <button onClick={salvarInsight} className="w-full py-2 bg-amber-500 rounded-lg font-medium hover:bg-amber-600 flex items-center justify-center gap-2">
                <Save size={16} /> Salvar Insight
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <h2 className="font-semibold mb-4">Insights e Alertas</h2>
        <div className="space-y-3">
          {insights.map(insight => (
            <div key={insight.id} onClick={() => marcarLido(insight.id)} className={`flex items-center justify-between p-4 rounded-xl cursor-pointer ${darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'} ${!insight.lido ? 'border-l-4 border-amber-500' : ''}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${impactoCores[insight.impacto]}-500/20`}>
                  <BrainCircuit size={18} className={`text-${impactoCores[insight.impacto]}-400`} />
                </div>
                <div>
                  <p className="font-medium">{insight.titulo}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{insight.descricao}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{insight.data}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${impactoCores[insight.impacto]}-500/20 text-${impactoCores[insight.impacto]}-400`}>
                  {insight.impacto}
                </span>
                <button onClick={(e) => { e.stopPropagation(); excluirInsight(insight.id); }} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <h2 className="font-semibold mb-4">Funções de IA Ativas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {funcoesIA.map((fn, i) => (
            <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3 mb-2">
                <fn.icon size={20} className="text-amber-400" />
                <h3 className="font-medium">{fn.nome}</h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{fn.descricao}</p>
              <span className="text-xs font-medium text-emerald-400 mt-2 inline-block">{fn.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ATHOSAI;
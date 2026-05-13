import React from 'react';
import { useApp } from '../../context/AppContext';
import { BrainCircuit, MessageSquare, FileText, TrendingUp, Shield, Zap, Sparkles, Bot, Mic, BarChart3, AlertTriangle } from 'lucide-react';

const ATHOSAI: React.FC = () => {
  const { darkMode } = useApp();

  const funcoesIA = [
    { nome: 'Chatbot Empresarial', descricao: 'Atendimento automático 24/7', icon: Bot, status: 'Ativo', tag: 'Popular' },
    { nome: 'Assistente Operacional', descricao: 'Automações e sugestões inteligente', icon: Sparkles, status: 'Ativo', tag: 'Novo' },
    { nome: 'Resumo de Reuniões', descricao: 'Transcreve e gera actionable items', icon: Mic, status: 'Em Treinamento', tag: '' },
    { nome: 'Geração de Relatórios', descricao: 'Relatórios automáticos e insights', icon: FileText, status: 'Ativo', tag: '' },
    { nome: 'Análise Financeira', descricao: 'Predições e alertas financeiros', icon: TrendingUp, status: 'Ativo', tag: 'Destaque' },
    { nome: 'Análise de Risco', descricao: 'Detecção de anomalias e riscos', icon: Shield, status: 'Ativo', tag: '' },
    { nome: 'Atendimento Automático', descricao: 'Classificação e Priorização de tickets', icon: MessageSquare, status: 'Ativo', tag: '' },
    { nome: 'IA Treinada na Empresa', descricao: 'Modelo personalizado com seus dados', icon: BrainCircuit, status: 'Beta', tag: 'Premium' },
  ];

  const insightsRecentes = [
    { tipo: 'financeiro', titulo: 'Detectado aumento de 15% em despesas operacionais', impacto: 'Alto', acao: 'Revisar contratos' },
    { tipo: 'vendas', titulo: '3 leads sem contato há mais de 5 dias', impacto: 'Médio', acao: 'Verificar leads' },
    { tipo: 'contrato', titulo: 'Contrato com Tech Solutions vence em 30 dias', impacto: 'Alto', acao: 'Iniciar renovação' },
    { tipo: 'rh', titulo: 'Ponto irregular detectado - Setor comercial', impacto: 'Baixo', acao: 'Verificar registro' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS AI</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Inteligência Artificial Integrada</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-lg">
          <Sparkles size={16} className="text-amber-400" />
          <span className="text-sm font-medium text-amber-400">6 Funções Ativas</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} border border-amber-500/20`}>
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit size={18} className="text-amber-400" />
            <span className="font-semibold">Modelos Ativos</span>
          </div>
          <p className="text-2xl font-bold">3</p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>GPT-4, Claude, Modelo Próprio</p>
        </div>
        <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={18} className="text-cyan-400" />
            <span className="font-semibold">Conversas IA</span>
          </div>
          <p className="text-2xl font-bold">847</p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Este mês</p>
        </div>
        <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={18} className="text-violet-400" />
            <span className="font-semibold">Automações</span>
          </div>
          <p className="text-2xl font-bold">12</span></p>
          <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Fluxos ativos</p>
        </div>
      </div>

      <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <h2 className="font-semibold mb-4">Funções de IA Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {funcoesIA.map((fn, i) => (
            <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'} cursor-pointer transition-colors`}>
              <div className="flex items-center justify-between mb-2">
                <fn.icon size={20} className="text-amber-400" />
                {fn.tag && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  fn.tag === 'Premium' ? 'bg-violet-500/20 text-violet-400' :
                  fn.tag === 'Destaque' ? 'bg-amber-500/20 text-amber-400' :
                  fn.tag === 'Novo' ? 'bg-cyan-500/20 text-cyan-400' :
                  'bg-pink-500/20 text-pink-400'
                }`}>{fn.tag}</span>}
              </div>
              <h3 className="font-medium text-sm mb-1">{fn.nome}</h3>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{fn.descricao}</p>
              <div className={`mt-2 text-xs ${fn.status === 'Ativo' ? 'text-emerald-400' : fn.status === 'Beta' ? 'text-amber-400' : 'text-gray-400'}`}>
                {fn.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-amber-400" />
          <h2 className="font-semibold">Insights e Sugestões da IA</h2>
        </div>
        <div className="space-y-3">
          {insightsRecentes.map((insight, i) => (
            <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  insight.impacto === 'Alto' ? 'bg-red-500/20 text-red-400' :
                  insight.impacto === 'Médio' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  <BrainCircuit size={14} />
                </div>
                <div>
                  <p className="text-sm font-medium">{insight.titulo}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Impacto: {insight.impacto}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30">
                {insight.acao}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ATHOSAI;
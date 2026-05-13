import React from 'react';
import { useApp } from '../../context/AppContext';
import { BrainCircuit, TrendingUp, Users, MessageSquare, Zap, Target, ArrowRight, Clock, Star } from 'lucide-react';
import StatCard from '../../components/StatCard';

const ATHOSFlow: React.FC = () => {
  const { darkMode } = useApp();

  const stats = [
    { title: 'Leads Ativos', value: '147', change: '+12%', icon: Users, color: 'pink' },
    { title: 'Oportunidades', value: '23', change: '+5%', icon: Target, color: 'violet' },
    { title: 'Conversão', value: '28%', change: '+3%', icon: TrendingUp, color: 'emerald' },
    { title: 'Ticket Médio', value: 'R$ 4.250', change: '+8%', icon: Star, color: 'amber' },
  ];

  const proximasAcoes = [
    { tipo: 'followup', titulo: 'Ligação para João Silva', hora: '14:30', prioridade: 'alta' },
    { tipo: 'proposta', titulo: 'Enviar proposta - Tech Solutions', hora: '16:00', prioridade: 'media' },
    { tipo: 'whatsapp', titulo: 'Mensagem automática - Maria Santos', hora: '17:00', prioridade: 'baixa' },
  ];

  const leadsQuentes = [
    { nome: 'Tech Solutions', valor: 'R$ 15.000', probabilidade: 85, etapa: 'Proposta' },
    { nome: 'Clínica Viva', valor: 'R$ 8.500', probabilidade: 70, etapa: 'Negociação' },
    { nome: 'Restaurante Sabor', valor: 'R$ 5.200', probabilidade: 60, etapa: 'Qualificado' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS Flow</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>CRM Inteligente com Automação</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-500/10 rounded-lg">
          <BrainCircuit size={16} className="text-pink-400" />
          <span className="text-sm font-medium text-pink-400">IA Ativa</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} darkMode={darkMode} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Próximas Ações (IA Sugere)</h2>
            <Zap size={16} className="text-amber-400" />
          </div>
          <div className="space-y-3">
            {proximasAcoes.map((acao, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    acao.prioridade === 'alta' ? 'bg-red-500/20 text-red-400' :
                    acao.prioridade === 'media' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    <Clock size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{acao.titulo}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{acao.hora}</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg bg-pink-500/20 text-pink-400 hover:bg-pink-500/30">
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-pink-400 hover:text-pink-300">
            Ver todas as ações →
          </button>
        </div>

        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Leads Quentes</h2>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <div className="space-y-3">
            {leadsQuentes.map((lead, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div>
                  <p className="text-sm font-medium">{lead.nome}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{lead.etapa}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-400">{lead.valor}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{lead.probabilidade}%</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-pink-400 hover:text-pink-300">
            Acessar funil →
          </button>
        </div>
      </div>

      <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={16} className="text-pink-400" />
          <h2 className="font-semibold">Integração WhatsApp</h2>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <span className="text-emerald-400 text-lg">✓</span>
            </div>
            <div>
              <p className="font-medium">WhatsApp Business Conectado</p>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>3 conversas ativas</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600">
            Abrir Conversas
          </button>
        </div>
      </div>
    </div>
  );
};

export default ATHOSFlow;
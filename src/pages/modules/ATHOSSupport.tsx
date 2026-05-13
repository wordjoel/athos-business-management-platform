import React from 'react';
import { useApp } from '../../context/AppContext';
import { Headphones, Ticket, Clock, CheckCircle, AlertTriangle, Users, Monitor, MessageSquare, Wifi } from 'lucide-react';

const ATHOSSupport: React.FC = () => {
  const { darkMode } = useApp();

  const stats = [
    { title: 'Chamados Abertos', value: '12', icon: Ticket, color: 'cyan' },
    { title: 'Em Andamento', value: '8', icon: Clock, color: 'amber' },
    { title: 'Resolvidos (30d)', value: '47', icon: CheckCircle, color: 'emerald' },
    { title: 'SLA Atingido', value: '94%', icon: AlertTriangle, color: 'violet' },
  ];

  const chamadosRecentes = [
    { titulo: 'Sistema não inicia após atualização', prioridade: 'critica', status: 'em_andamento', solicitante: 'Maria Santos', tempo: '2h' },
    { titulo: 'Erro na emissão de NF-e', prioridade: 'alta', status: 'aberto', solicitante: 'João Silva', tempo: '4h' },
    { titulo: 'Dúvida sobre módulo financeiro', prioridade: 'media', status: 'resolvido', solicitante: 'Pedro Costa', tempo: '1d' },
    { titulo: 'Solicitação de acesso novo usuário', prioridade: 'baixa', status: 'pendente', solicitante: 'Ana Oliveira', tempo: '2d' },
  ];

  const tecnicos = [
    { nome: 'Carlos M.', chamados: 8, eficiencia: 95 },
    { nome: 'Juliana S.', chamados: 6, eficiencia: 88 },
    { nome: 'Roberto L.', chamados: 4, eficiencia: 92 },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS Support</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Service Desk e Help Desk</p>
        </div>
        <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600 flex items-center gap-2">
          <Ticket size={16} />
          Novo Chamado
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={20} className={`text-${stat.color}-400`} />
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${stat.color}-500/20 text-${stat.color}-400`}>{stat.change || ''}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} lg:col-span-2`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Chamados Recentes</h2>
            <button className="text-sm text-cyan-400 hover:text-cyan-300">Ver todos →</button>
          </div>
          <div className="space-y-3">
            {chamadosRecentes.map((ch, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    ch.prioridade === 'critica' ? 'bg-red-500/20 text-red-400' :
                    ch.prioridade === 'alta' ? 'bg-amber-500/20 text-amber-400' :
                    ch.prioridade === 'media' ? 'bg-cyan-500/20 text-cyan-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    <Ticket size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ch.titulo}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{ch.solicitante} • {ch.tempo}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                  ch.status === 'aberto' ? 'bg-red-500/20 text-red-400' :
                  ch.status === 'em_andamento' ? 'bg-amber-500/20 text-amber-400' :
                  ch.status === 'resolvido' ? 'bg-emerald-500/20 text-emerald-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {ch.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-cyan-400" />
            <h2 className="font-semibold">Equipe de Suporte</h2>
          </div>
          <div className="space-y-4">
            {tecnicos.map((tec, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-sm font-medium">
                    {tec.nome.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tec.nome}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{tec.chamados} chamados</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-emerald-400">{tec.eficiencia}%</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 border border-cyan-500/20 rounded-lg">
            Gerenciar Equipe
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Monitor size={18} className="text-cyan-400" />
          </div>
          <div>
            <p className="font-medium">Inventário de Equipamentos</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>127 itens cadastrados</p>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Wifi size={18} className="text-violet-400" />
          </div>
          <div>
            <p className="font-medium">Acesso Remoto</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>12 sessões ativas</p>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <MessageSquare size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="font-medium">Suporte via WhatsApp</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>5 conversas em aberto</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATHOSSupport;
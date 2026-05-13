import React from 'react';
import { useApp } from '../../context/AppContext';
import { Kanban, GanttChart, Users, CheckSquare, Clock, TrendingUp, Play, Pause, CheckCircle, AlertCircle } from 'lucide-react';

const ATHOSProjects: React.FC = () => {
  const { darkMode } = useApp();

  const stats = [
    { title: 'Projetos Ativos', value: '5', icon: Play, color: 'blue' },
    { title: 'Tarefas Concluídas', value: '87', icon: CheckCircle, color: 'emerald' },
    { title: 'Em Andamento', value: '23', icon: Clock, color: 'amber' },
    { title: 'Atrasadas', value: '3', icon: AlertCircle, color: 'red' },
  ];

  const projetos = [
    { nome: 'Implementação CRM', progresso: 75, sprints: 3, tarefas: { total: 20, concluidas: 15 }, status: 'em_andamento' },
    { nome: 'Migração Financeiro', progresso: 45, sprints: 2, tarefas: { total: 30, concluidas: 13 }, status: 'em_andamento' },
    { nome: 'Novo Website', progresso: 90, sprints: 4, tarefas: { total: 25, concluidas: 22 }, status: 'concluido' },
    { nome: 'App Mobile', progresso: 20, sprints: 1, tarefas: { total: 40, concluidas: 8 }, status: 'em_andamento' },
  ];

  const tarefasUrgentes = [
    { titulo: 'Revisar layout dashboard', projeto: 'App Mobile', prioridade: 'alta', responsavel: 'Ana', prazo: 'Hoje' },
    { titulo: 'Testar integração API', projeto: 'Migração', prioridade: 'critica', responsavel: 'Carlos', prazo: 'Amanhã' },
    { titulo: 'Atualizar документаção', projeto: 'Website', prioridade: 'media', responsavel: 'Juliana', prazo: '15/05' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS Projects</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gestão de Projetos Ágeis</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 text-sm font-medium bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 flex items-center gap-2">
            <Kanban size={16} />
            Kanban
          </button>
          <button className="px-3 py-2 text-sm font-medium bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 flex items-center gap-2">
            <GanttChart size={16} />
            Gantt
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600">
            + Novo Projeto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={20} className={`text-${stat.color}-400`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Projetos</h2>
            <TrendingUp size={16} className="text-blue-400" />
          </div>
          <div className="space-y-4">
            {projetos.map((proj, i) => (
              <div key={i} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{proj.nome}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    proj.status === 'em_andamento' ? 'bg-blue-500/20 text-blue-400' :
                    proj.status === 'concluido' ? 'bg-emerald-500/20 text-emerald-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>{proj.status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{proj.tarefas.concluidas}/{proj.tarefas.total} tarefas</span>
                  <span className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{proj.sprints} sprints</span>
                </div>
                <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className={`h-2 rounded-full ${proj.progresso === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                    style={{ width: `${proj.progresso}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{proj.progresso}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Tarefas Urgentes</h2>
            <Clock size={16} className="text-amber-400" />
          </div>
          <div className="space-y-3">
            {tarefasUrgentes.map((t, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    t.prioridade === 'critica' ? 'bg-red-500/20 text-red-400' :
                    t.prioridade === 'alta' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    <CheckSquare size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.titulo}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t.projeto} • {t.responsavel}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                  t.prioridade === 'critica' ? 'bg-red-500/20 text-red-400' :
                  t.prioridade === 'alta' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>{t.prazo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <h2 className="font-semibold mb-4">Sprints Ativas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} border-l-4 border-blue-500`}>
            <h3 className="font-medium mb-2">Sprint 14 - CRM</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>15 tarefas • 8 concluídas</p>
            <div className={`mt-2 h-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '53%' }} />
            </div>
          </div>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} border-l-4 border-violet-500`}>
            <h3 className="font-medium mb-2">Sprint 8 - App</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>12 tarefas • 5 concluídas</p>
            <div className={`mt-2 h-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-1.5 rounded-full bg-violet-500" style={{ width: '42%' }} />
            </div>
          </div>
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} border-l-4 border-emerald-500`}>
            <h3 className="font-medium mb-2">Sprint 5 - Website</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>8 tarefas • 8 concluídas</p>
            <div className={`mt-2 h-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATHOSProjects;
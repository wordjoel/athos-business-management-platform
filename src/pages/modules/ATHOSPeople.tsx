import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Users, Clock, FileText, GraduationCap, TrendingUp, Calendar, CheckCircle, AlertCircle, Baby } from 'lucide-react';

const ATHOSPeople: React.FC = () => {
  const { darkMode } = useApp();

  const stats = [
    { title: 'Funcionários Ativos', value: '24', icon: UserCheck, color: 'orange' },
    { title: 'Ponto Hoje', value: '22/24', icon: Clock, color: 'emerald' },
    { title: 'Em Onboarding', value: '2', icon: Baby, color: 'cyan' },
    { title: 'Horas Extras', value: '18h', icon: TrendingUp, color: 'amber' },
  ];

  const funcionarios = [
    { nome: 'Carlos Mendes', cargo: 'Desenvolvedor', departamento: 'TI', entrada: '10:05', status: 'presente', ponto: 'ok' },
    { nome: 'Juliana Silva', cargo: 'Designer', departamento: 'Marketing', entrada: '09:00', status: 'presente', ponto: 'ok' },
    { nome: 'Roberto Lima', cargo: 'Vendas', departamento: 'Comercial', entrada: '08:45', status: 'atrasado', ponto: 'ok' },
    { nome: 'Ana Oliveira', cargo: 'Contadora', departamento: 'Financeiro', entrada: '-', status: 'falta', ponto: 'falta' },
  ];

  const onboarding = [
    { nome: 'Pedro Santos', cargo: 'Analista', departamento: 'Comercial', dia: 3, total: 10, etapa: 'Documentos' },
    { nome: 'Mariana Costa', cargo: 'Desenvolvedora', departamento: 'TI', dia: 7, total: 10, etapa: 'Treinamento' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS People</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>RH Inteligente e Gestão de Pessoas</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-500/30 flex items-center gap-2">
            <UserCheck size={16} />
            Registrar Ponto
          </button>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
            + Novo Funcionário
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
            <h2 className="font-semibold">Ponto Digital - Hoje</h2>
            <Calendar size={16} className="text-orange-400" />
          </div>
          <div className="space-y-3">
            {funcionarios.map((func, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    func.status === 'presente' ? 'bg-emerald-500/20 text-emerald-400' :
                    func.status === 'atrasado' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    <Users size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{func.nome}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{func.cargo} • {func.departamento}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{func.entrada}</p>
                  <p className={`text-xs ${func.ponto === 'ok' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {func.ponto === 'ok' ? 'Registrado' : 'Pendente'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Onboarding Ativo</h2>
            <Baby size={16} className="text-cyan-400" />
          </div>
          <div className="space-y-4">
            {onboarding.map((onb, i) => (
              <div key={i} className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{onb.nome}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{onb.cargo} • {onb.departamento}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-lg bg-cyan-500/20 text-cyan-400">{onb.etapa}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Dia {onb.dia}/{onb.total}</span>
                  <div className={`flex-1 h-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div className="h-1.5 rounded-full bg-cyan-500" style={{ width: `${(onb.dia / onb.total) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <FileText size={18} className="text-orange-400" />
          </div>
          <div>
            <p className="font-medium">Documentos</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>48 documentos pendentes</p>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <GraduationCap size={18} className="text-violet-400" />
          </div>
          <div>
            <p className="font-medium">Avaliações</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>4 avaliações pendentes</p>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <TrendingUp size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="font-medium">Produtividade</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Média da equipe: 87%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATHOSPeople;
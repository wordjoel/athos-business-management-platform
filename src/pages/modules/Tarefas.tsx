import React from 'react';
import { CheckSquare, Plus } from 'lucide-react';

const Tarefas: React.FC = () => {
  const darkMode = true;
  const tarefas = [
    { titulo: 'Revisar layout dashboard', projeto: 'App Mobile', prioridade: 'alta', status: 'pendente' },
    { titulo: 'Testar integração API', projeto: 'Migração', prioridade: 'critica', status: 'em_andamento' },
    { titulo: 'Atualizar documentação', projeto: 'Website', prioridade: 'media', status: 'concluida' },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Tarefas</h1>
          <p className="text-gray-400">ATHOS Projects - Lista de Tarefas</p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Nova Tarefa
        </button>
      </div>
      <div className="space-y-3">
        {tarefas.map((t, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
            <div className="flex items-center gap-3">
              <CheckSquare size={18} className="text-blue-400" />
              <div>
                <p className="font-medium">{t.titulo}</p>
                <p className="text-xs text-gray-400">{t.projeto}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                t.prioridade === 'critica' ? 'bg-red-500/20 text-red-400' :
                t.prioridade === 'alta' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'
              }`}>{t.prioridade}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                t.status === 'concluida' ? 'bg-emerald-500/20 text-emerald-400' :
                t.status === 'em_andamento' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'
              }`}>{t.status.replace('_', ' ')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Tarefas;
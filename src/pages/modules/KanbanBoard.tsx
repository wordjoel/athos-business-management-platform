import React from 'react';
import { Kanban, Plus } from 'lucide-react';

const KanbanBoard: React.FC = () => {
  const darkMode = true;
  const colunas = [
    { nome: 'A Fazer', cor: 'gray', tarefas: ['Revisar layout', 'Criar componentes'] },
    { nome: 'Em Andamento', cor: 'blue', tarefas: ['Testar API', 'Bug login'] },
    { nome: 'Revisão', cor: 'amber', tarefas: ['Documentação'] },
    { nome: 'Concluído', cor: 'emerald', tarefas: ['Setup projeto', 'Configuração Auth'] },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Kanban</h1>
          <p className="text-gray-400">ATHOS Projects - Quadro Visual</p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Nova Tarefa
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {colunas.map((col, i) => (
          <div key={i} className="p-4 rounded-xl bg-gray-900/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">{col.nome}</h3>
              <span className="text-xs text-gray-400">{col.tarefas.length}</span>
            </div>
            <div className="space-y-2">
              {col.tarefas.map((t, j) => (
                <div key={j} className="p-3 rounded-lg bg-gray-800 cursor-pointer hover:bg-gray-700">
                  <p className="text-sm">{t}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default KanbanBoard;
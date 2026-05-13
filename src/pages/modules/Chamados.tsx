import React from 'react';
import { Ticket, Plus, Filter } from 'lucide-react';

const Chamados: React.FC = () => {
  const darkMode = true;
  const chamados = [
    { titulo: 'Erro ao emitir NF-e', prioridade: 'alta', status: 'aberto', solicitante: 'Maria Santos' },
    { titulo: 'Novo usuário precisa de acesso', prioridade: 'baixa', status: 'em_andamento', solicitante: 'João Silva' },
    { titulo: 'Sistema lento', prioridade: 'media', status: 'resolvido', solicitante: 'Pedro Costa' },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Chamados</h1>
          <p className="text-gray-400">ATHOS Support - Lista de Tickets</p>
        </div>
        <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Novo Chamado
        </button>
      </div>
      <div className="space-y-3">
        {chamados.map((c, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                c.prioridade === 'alta' ? 'bg-red-500/20' : c.prioridade === 'media' ? 'bg-amber-500/20' : 'bg-gray-500/20'
              }`}>
                <Ticket size={18} className={c.prioridade === 'alta' ? 'text-red-400' : c.prioridade === 'media' ? 'text-amber-400' : 'text-gray-400'} />
              </div>
              <div>
                <p className="font-medium">{c.titulo}</p>
                <p className="text-xs text-gray-400">{c.solicitante}</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${c.status === 'aberto' ? 'bg-red-500/20 text-red-400' : c.status === 'em_andamento' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
              {c.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Chamados;
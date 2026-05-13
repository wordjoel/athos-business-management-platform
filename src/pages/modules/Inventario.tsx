import React from 'react';
import { Monitor, Plus } from 'lucide-react';

const Inventario: React.FC = () => {
  const darkMode = true;
  const itens = [
    { nome: 'Dell OptiPlex 7090', tipo: 'Desktop', local: 'Escritório TI', status: 'ativo' },
    { nome: 'MacBook Pro M2', tipo: 'Notebook', local: 'Design', status: 'ativo' },
    { nome: 'Monitor LG 27"', tipo: 'Monitor', local: 'Recepção', status: 'manutencao' },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Inventário</h1>
          <p className="text-gray-400">ATHOS Support - Equipamentos</p>
        </div>
        <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Novo Item
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Total Cadastrado</p>
          <p className="text-2xl font-bold">127</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Em Uso</p>
          <p className="text-2xl font-bold">98</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Em Manutenção</p>
          <p className="text-2xl font-bold">5</p>
        </div>
      </div>
      <div className="space-y-3">
        {itens.map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
            <div className="flex items-center gap-3">
              <Monitor size={18} className="text-cyan-400" />
              <div>
                <p className="font-medium">{item.nome}</p>
                <p className="text-xs text-gray-400">{item.tipo} • {item.local}</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${item.status === 'ativo' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Inventario;
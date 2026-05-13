import React from 'react';
import { Building2, Plus } from 'lucide-react';

const Ativos: React.FC = () => {
  const darkMode = true;
  const ativos = [
    { nome: 'Dell OptiPlex 7090', tipo: 'Equipamento', local: 'TI', status: 'disponivel' },
    { nome: 'Honda Civic', tipo: 'Veículo', local: 'Frota', status: 'em_uso' },
    { nome: 'Escritório Centro', tipo: 'Imóvel', local: 'Patrimônio', status: 'disponivel' },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Patrimônio</h1>
          <p className="text-gray-400">ATHOS Shield - Gestão de Ativos</p>
        </div>
        <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Novo Ativo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Total Cadastrado</p>
          <p className="text-2xl font-bold">127</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Em Uso</p>
          <p className="text-2xl font-bold">89</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Disponível</p>
          <p className="text-2xl font-bold text-emerald-400">38</p>
        </div>
      </div>
      <div className="space-y-3">
        {ativos.map((a, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
            <div className="flex items-center gap-3">
              <Building2 size={18} className="text-red-400" />
              <div>
                <p className="font-medium">{a.nome}</p>
                <p className="text-xs text-gray-400">{a.tipo} • {a.local}</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${a.status === 'disponivel' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{a.status.replace('_', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Ativos;
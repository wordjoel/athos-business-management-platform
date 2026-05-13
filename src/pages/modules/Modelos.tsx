import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Plus } from 'lucide-react';

const Modelos: React.FC = () => {
  const { darkMode } = useApp();
  const modelos = [
    { nome: 'Prestação de Serviços', tipo: 'Serviço', versao: '3.0', uso: 12 },
    { nome: 'Licença de Software', tipo: 'Software', versao: '2.5', uso: 8 },
    { nome: 'Contrato de Parceria', tipo: 'Parceria', versao: '1.0', uso: 3 },
    { nome: 'Fornecimento', tipo: 'Produto', versao: '2.0', uso: 5 },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Modelos de Contratos</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ATHOS Sign - Biblioteca</p>
        </div>
        <button className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Novo Modelo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modelos.map((m, i) => (
          <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <FileText size={18} className="text-violet-400" />
              </div>
              <div>
                <p className="font-medium">{m.nome}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{m.tipo} • v{m.versao}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.uso} usos</span>
              <button className="text-sm text-violet-400">Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Modelos;
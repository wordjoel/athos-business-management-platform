import React from 'react';
import { Users, Plus } from 'lucide-react';

const Funcionarios: React.FC = () => {
  const darkMode = true;
  const func = [
    { nome: 'Kleber Duarte', cargo: 'Administrador', dept: 'Administrativo', status: 'ativo' },
    { nome: 'Luiz Victor', cargo: 'Gerente Financeiro', dept: 'Financeiro', status: 'ativo' },
    { nome: 'Joel Oliveira', cargo: 'Vendas', dept: 'Comercial', status: 'ativo' },
    { nome: 'Oscar Carvalho', cargo: 'Desenvolvedor', dept: 'TI', status: 'ativo' },
    { nome: 'Maurício Baro', cargo: 'Gerente Operacional', dept: 'Operacional', status: 'ativo' },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Funcionários</h1>
          <p className="text-gray-400">ATHOS People - Cadastro</p>
        </div>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Novo Funcionário
        </button>
      </div>
      <div className="space-y-3">
        {func.map((f, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                {f.nome.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{f.nome}</p>
                <p className="text-xs text-gray-400">{f.cargo} • {f.dept}</p>
              </div>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400">{f.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Funcionarios;
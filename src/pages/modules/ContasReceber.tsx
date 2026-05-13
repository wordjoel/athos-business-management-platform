import React from 'react';
import { useApp } from '../../context/AppContext';
import { Wallet, Plus, Search, Filter, ArrowDownRight } from 'lucide-react';

const ContasReceber: React.FC = () => {
  const { darkMode } = useApp();

  const contas = [
    { descricao: 'Tech Solutions - Janeiro', cliente: 'Tech Solutions LTDA', valor: 15000, vencimento: '10/05', status: 'recebido' },
    { descricao: 'Clínica Viva', cliente: 'Clínica Viva Saúde', valor: 8500, vencimento: '15/05', status: 'pendente' },
    { descricao: 'Restaurante Sabor', cliente: 'Sabor Restaurant', valor: 2200, vencimento: '20/05', status: 'pendente' },
    { descricao: 'Farmácia Popular', cliente: 'Farmácia Popular', valor: 3500, vencimento: '25/05', status: 'atrasado' },
    { descricao: 'Escola Futuro', cliente: 'Colégio Futuro', valor: 4800, vencimento: '30/05', status: 'pendente' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Contas a Receber</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ATHOS Finance - Gestão de Receitas</p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 flex items-center gap-2">
          <Plus size={16} />
          Nova Receita
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Pendente</p>
          <p className="text-xl font-bold text-amber-400">R$ 29.000</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Vencendo Esta Semana</p>
          <p className="text-xl font-bold">4</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Atrasadas</p>
          <p className="text-xl font-bold text-red-500">1</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recebido no Mês</p>
          <p className="text-xl font-bold text-emerald-400">R$ 15.000</p>
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Buscar receitas..." className={`w-full pl-10 pr-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`} />
        </div>
        <button className="px-4 py-2 bg-gray-800 rounded-lg flex items-center gap-2">
          <Filter size={16} />
          Filtrar
        </button>
      </div>

      <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th className="text-left p-4 text-sm font-medium">Descrição</th>
              <th className="text-left p-4 text-sm font-medium">Cliente</th>
              <th className="text-left p-4 text-sm font-medium">Valor</th>
              <th className="text-left p-4 text-sm font-medium">Vencimento</th>
              <th className="text-left p-4 text-sm font-medium">Status</th>
              <th className="text-left p-4 text-sm font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {contas.map((conta, i) => (
              <tr key={i} className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <td className="p-4 text-sm">{conta.descricao}</td>
                <td className="p-4 text-sm text-gray-400">{conta.cliente}</td>
                <td className="p-4 text-sm font-medium">R$ {conta.valor.toLocaleString()}</td>
                <td className="p-4 text-sm">{conta.vencimento}</td>
                <td className="p-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                    conta.status === 'recebido' ? 'bg-emerald-500/20 text-emerald-400' :
                    conta.status === 'pendente' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>{conta.status}</span>
                </td>
                <td className="p-4">
                  <button className="p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30">
                    <ArrowDownRight size={14} className="text-emerald-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContasReceber;
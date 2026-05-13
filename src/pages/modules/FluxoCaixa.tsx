import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

const FluxoCaixa: React.FC = () => {
  const { darkMode } = useApp();

  const meses = [
    { mes: 'Jan', receita: 95000, despesa: 72000, saldo: 23000 },
    { mes: 'Fev', receita: 88000, despesa: 68000, saldo: 20000 },
    { mes: 'Mar', receita: 102000, despesa: 75000, saldo: 27000 },
    { mes: 'Abr', receita: 115000, despesa: 82000, saldo: 33000 },
    { mes: 'Mai', receita: 125000, despesa: 87500, saldo: 37500 },
    { mes: 'Jun', receita: 130000, despesa: 90000, saldo: 40000, projetado: true },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Fluxo de Caixa</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ATHOS Finance - Visão Geral</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 text-sm bg-emerald-500/20 text-emerald-400 rounded-lg">Receitas</button>
          <button className="px-3 py-2 text-sm bg-red-500/20 text-red-400 rounded-lg">Despesas</button>
          <button className="px-3 py-2 text-sm bg-gray-800 rounded-lg">Ambos</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight size={16} className="text-emerald-400" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receitas (Acumulado)</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">R$ 655.000</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight size={16} className="text-red-400" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Despesas (Acumulado)</span>
          </div>
          <p className="text-2xl font-bold text-red-400">R$ 474.500</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-amber-400" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Saldo Total</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">R$ 180.500</p>
        </div>
      </div>

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <h2 className="font-semibold mb-4">Evolução Mensal</h2>
        <div className="h-64 flex items-end gap-4">
          {meses.map((m, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full flex gap-1 justify-center h-56">
                <div className="w-6 bg-emerald-500 rounded-t-lg" style={{ height: `${(m.receita / 150000) * 200}px` }} />
                <div className="w-6 bg-red-500 rounded-t-lg" style={{ height: `${(m.despesa / 150000) * 200}px` }} />
              </div>
              <span className={`text-xs mt-2 ${m.projetado ? 'text-amber-400' : ''}`}>{m.mes}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded" />
            <span className="text-sm">Receitas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded" />
            <span className="text-sm">Despesas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded opacity-50" />
            <span className="text-sm">Projetado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluxoCaixa;
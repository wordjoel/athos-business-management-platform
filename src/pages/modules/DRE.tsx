import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3 } from 'lucide-react';

const DRE: React.FC = () => {
  const { darkMode } = useApp();

  const itens = [
    { descricao: 'Receita Bruta de Vendas', valor: 125000 },
    { descricao: '(-) Deduções de Vendas', valor: -2500 },
    { descricao: 'Receita Líquida', valor: 122500, soma: true },
    { descricao: '(-) Custo de Mercadorias', valor: -45000 },
    { descricao: 'Lucro Bruto', valor: 77500, soma: true },
    { descricao: '(-) Despesas Operacionais', valor: -40000 },
    { descricao: 'Lucro Operacional (EBIT)', valor: 37500, soma: true },
    { descricao: '(-) Despesas Financeiras', valor: -2500 },
    { descricao: 'Lucro Antes do IR', valor: 35000, soma: true },
    { descricao: '(-) IR e Contribuição Social', valor: -8750 },
    { descricao: 'Lucro Líquido', valor: 26250, soma: true, destaque: true },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">DRE</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Demonstrativo de Resultados</p>
        </div>
        <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium">
          Exportar PDF
        </button>
      </div>

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Resultado do Período</h2>
          <span className="text-sm text-gray-400">Maio/2026</span>
        </div>
        <div className="space-y-2">
          {itens.map((item, i) => (
            <div key={i} className={`flex justify-between p-3 rounded-lg ${item.soma ? 'bg-gray-800/30' : ''} ${item.destaque ? 'border border-emerald-500/50 bg-emerald-500/10' : ''}`}>
              <span className={`${item.soma ? 'font-semibold' : ''} ${item.destaque ? 'text-emerald-400' : ''}`}>{item.descricao}</span>
              <span className={`font-medium ${item.destaque ? 'text-emerald-400' : item.valor < 0 ? 'text-red-400' : ''}`}>
                R$ {Math.abs(item.valor).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DRE;
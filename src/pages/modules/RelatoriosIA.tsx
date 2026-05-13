import React from 'react';
import { FileText, Download } from 'lucide-react';

const RelatoriosIA: React.FC = () => {
  const darkMode = true;
  const relatorios = [
    { titulo: 'Análise Financeira Mensal', data: '13/05/2026', tipo: 'Financeiro' },
    { titulo: 'Relatório de Vendas', data: '10/05/2026', tipo: 'Vendas' },
    { titulo: 'Resumo de Reuniões', data: '08/05/2026', tipo: 'Reuniões' },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Relatórios IA</h1>
          <p className="text-gray-400">ATHOS AI - Relatórios Automáticos</p>
        </div>
      </div>
      <div className="space-y-3">
        {relatorios.map((r, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <FileText size={18} className="text-amber-400" />
              </div>
              <div>
                <p className="font-medium">{r.titulo}</p>
                <p className="text-xs text-gray-400">{r.data} • {r.tipo}</p>
              </div>
            </div>
            <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700">
              <Download size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RelatoriosIA;
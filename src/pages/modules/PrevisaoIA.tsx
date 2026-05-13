import React from 'react';
import { useApp } from '../../context/AppContext';
import { Brain, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';

const PrevisãoIA: React.FC = () => {
  const { darkMode } = useApp();

  const previsoes = [
    { indicador: 'Receita Junho', atual: 'R$ 130.000', projetado: 'R$ 142.000', variacao: '+9%' },
    { indicador: 'Receita Julho', atual: '-', projetado: 'R$ 155.000', variacao: '+19%' },
    { indicador: 'Despesas Junho', atual: 'R$ 90.000', projetado: 'R$ 92.000', variacao: '+2%' },
  ];

  const alertas = [
    { tipo: 'receita', mensagem: 'Sazonalidade positiva detectada para os próximos meses', impacto: 'alto' },
    { tipo: 'despesa', mensagem: 'Aumento esperado em custos de pessoal (reajuste coletivo)', impacto: 'medio' },
    { tipo: 'fluxo', mensagem: 'Saldo negativo previsto para terceira semana de Junho', impacto: 'baixo' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Previsão com IA</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ATHOS Finance - Análise Preditiva</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-lg">
          <Brain size={16} className="text-amber-400" />
          <span className="text-sm font-medium text-amber-400">IA Ativa</span>
        </div>
      </div>

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-amber-400" />
          <h2 className="font-semibold">Projeções baseadas em Machine Learning</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {previsoes.map((p, i) => (
            <div key={i} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{p.indicador}</p>
              <p className="text-lg font-bold">{p.atual}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-sm ${p.variacao.includes('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  → {p.projetado} ({p.variacao})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-amber-400" />
          <h2 className="font-semibold">Alertas e Insights</h2>
        </div>
        <div className="space-y-3">
          {alertas.map((a, i) => (
            <div key={i} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <p className="text-sm">{a.mensagem}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  a.impacto === 'alto' ? 'bg-red-500/20 text-red-400' :
                  a.impacto === 'medio' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>{a.impacto}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrevisãoIA;
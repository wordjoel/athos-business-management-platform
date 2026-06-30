import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, X, Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { getDREValores, getLancamentos, Lancamento } from '../../services/lancamentoService';

const DRE: React.FC = () => {
  const { darkMode } = useApp();
  const [valores, setValores] = useState(getDREValores());
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [exibirDetalhes, setExibirDetalhes] = useState(false);

  const carregar = () => {
    setValores(getDREValores());
    setLancamentos(getLancamentos());
  };
  useEffect(() => { carregar(); }, []);

  const DreLinha: React.FC<{ label: string; valor: number; isAuto?: boolean; isTotal?: boolean; isDestaque?: boolean; negative?: boolean }> = ({ label, valor, isAuto, isTotal, isDestaque, negative }) => (
    <div className={`flex justify-between p-3 rounded-lg items-center ${isTotal ? (darkMode ? 'bg-gray-800/30' : 'bg-gray-100') : ''} ${isDestaque ? 'border border-emerald-500/50 bg-emerald-500/10' : ''}`}>
      <span className={`text-sm ${isTotal ? 'font-semibold' : ''} ${isDestaque ? 'text-emerald-400 font-bold' : ''}`}>
        {label} {isAuto && <span className="text-[10px] text-gray-400">(auto)</span>}
      </span>
      <span className={`font-mono text-sm font-medium ${isDestaque ? 'text-emerald-400' : (negative || valor < 0) ? 'text-red-400' : darkMode ? 'text-white' : 'text-gray-900'}`}>
        {negative || valor < 0 ? '- ' : '  '}R$ {Math.abs(valor).toLocaleString()}
      </span>
    </div>
  );

  const receitas = lancamentos.filter(l => l.tipo === 'receita' && (l.status === 'recebido' || l.status === 'pendente'));
  const despesas = lancamentos.filter(l => l.tipo === 'despesa' && (l.status === 'pago' || l.status === 'pendente'));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gradient">DRE</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Demonstrativo de Resultados — <span className="text-emerald-400">{receitas.length} receitas</span> · <span className="text-red-400">{despesas.length} despesas</span>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setExibirDetalhes(!exibirDetalhes)} className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${exibirDetalhes ? 'bg-athos-500/20 text-athos-400' : 'bg-gray-800 text-gray-400'}`}>
            <Calculator size={14} /> Detalhes
          </button>
        </div>
      </div>

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Demonstrativo de Resultados</h2>
          <span className="text-xs text-gray-400">Valores calculados automaticamente dos lançamentos</span>
        </div>
        <div className="space-y-1">
          <DreLinha label="Receita Bruta de Vendas" valor={valores.receitaBruta} />
          <DreLinha label="(-) Deduções de Vendas" valor={valores.deducoes} negative />
          <DreLinha label="= Receita Líquida" valor={valores.receitaLiquida} isAuto isTotal />
          <div className={`border-t my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
          <DreLinha label="(-) Custo de Mercadorias (CPV)" valor={valores.cpv} negative />
          <DreLinha label="= Lucro Bruto" valor={valores.lucroBruto} isAuto isTotal />
          <div className={`border-t my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
          <DreLinha label="(-) Despesas Operacionais" valor={valores.despesasOperacionais} negative />
          <DreLinha label="(-) Despesas Financeiras" valor={valores.despesasFinanceiras} negative />
          <DreLinha label="= Lucro Operacional (EBIT)" valor={valores.ebit} isAuto isTotal />
          <div className={`border-t my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
          <DreLinha label="(-) IR e Contribuição Social" valor={valores.irContribuicoes} negative />
          <DreLinha label="= Lucro Líquido" valor={valores.lucroLiquido} isAuto isTotal isDestaque={valores.lucroLiquido > 0} />
        </div>
      </div>

      {exibirDetalhes && (
        <>
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={16} className="text-emerald-400" />
              <h3 className="font-semibold">Receitas Lançadas ({receitas.length})</h3>
            </div>
            {receitas.length === 0 ? (
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma receita lançada. Vá em Contas a Receber para adicionar.</p>
            ) : (
              <div className="space-y-2">
                {receitas.map(r => (
                  <div key={r.id} className={`flex justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                    <span className="text-sm">{r.descricao} <span className="text-gray-400">- {r.categoria}</span></span>
                    <span className="text-sm font-medium text-emerald-400">+ R$ {r.valor.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown size={16} className="text-red-400" />
              <h3 className="font-semibold">Despesas Lançadas ({despesas.length})</h3>
            </div>
            {despesas.length === 0 ? (
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma despesa lançada. Vá em Contas a Pagar para adicionar.</p>
            ) : (
              <div className="space-y-2">
                {despesas.map(d => (
                  <div key={d.id} className={`flex justify-between p-2 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                    <span className="text-sm">{d.descricao} <span className="text-gray-400">- {d.categoria}</span></span>
                    <span className="text-sm font-medium text-red-400">- R$ {d.valor.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/30' : 'bg-gray-50'}`}>
        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Este demonstrativo é calculado <strong>automaticamente</strong> com base nos lançamentos de Contas a Pagar e Contas a Receber.
          A categoria de cada despesa determina em qual linha do DRE ela aparece (CPV, Operacional, Financeiro, etc.).
        </p>
      </div>
    </div>
  );
};

export default DRE;

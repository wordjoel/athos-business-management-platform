import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, Receipt, BarChart3, X } from 'lucide-react';
import { getLancamentos, criarLancamento, excluirLancamento, getFluxoCaixaMensal, getDREValores, refreshLancamentos, Lancamento } from '../../services/lancamentoService';
import { useToast } from '../../components/Toast';

const ATHOSFinance: React.FC = () => {
  const { darkMode } = useApp();
  const { addToast } = useToast();
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [fluxo, setFluxo] = useState<ReturnType<typeof getFluxoCaixaMensal>>([]);
  const [dre, setDre] = useState(getDREValores());
  const [aba, setAba] = useState<'resumo' | 'contas-pagar' | 'contas-receber' | 'fluxo' | 'dre'>('resumo');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ descricao: '', contraparte: '', valor: '', tipo: 'receita' as 'receita' | 'despesa', categoria: 'Serviços' });

  const carregarLocal = () => {
    const todos = getLancamentos();
    setLancamentos(todos);
    setFluxo(getFluxoCaixaMensal());
    setDre(getDREValores());
  };

  const carregar = async () => {
    try {
      await refreshLancamentos();
    } catch (err) {
      console.error('Falha ao buscar lançamentos no Supabase:', err);
      addToast({ type: 'error', title: 'Sem conexão com o servidor', message: 'Mostrando os últimos dados salvos localmente.' });
    }
    carregarLocal();
  };
  useEffect(() => { carregar(); }, []);

  const receitasTotal = lancamentos.filter(l => l.tipo === 'receita' && l.status === 'recebido').reduce((s, l) => s + l.valor, 0);
  const despesasTotal = lancamentos.filter(l => l.tipo === 'despesa' && l.status === 'pago').reduce((s, l) => s + l.valor, 0);
  const saldo = receitasTotal - despesasTotal;
  const contasPagar = lancamentos.filter(l => l.tipo === 'despesa' && l.status === 'pendente');
  const contasReceber = lancamentos.filter(l => l.tipo === 'receita' && l.status === 'pendente');

  const salvarTransacao = async () => {
    if (!formData.descricao || !formData.valor) return;
    try {
      await criarLancamento({
        tipo: formData.tipo,
        descricao: formData.descricao,
        contraparte: formData.contraparte,
        valor: parseFloat(formData.valor),
        vencimento: new Date().toLocaleDateString('pt-BR'),
        data: new Date().toLocaleDateString('pt-BR'),
        status: 'pendente',
        categoria: formData.categoria,
      });
      await carregar();
      addToast({ type: 'success', title: 'Lançamento criado' });
      setFormData({ descricao: '', contraparte: '', valor: '', tipo: 'receita', categoria: 'Serviços' });
      setShowForm(false);
    } catch (err) {
      console.error('Falha ao criar lançamento:', err);
      addToast({ type: 'error', title: 'Não foi possível salvar o lançamento' });
    }
  };

  const excluir = async (id: string) => {
    if (!confirm('Excluir este lançamento?')) return;
    try {
      await excluirLancamento(id);
      await carregar();
      addToast({ type: 'success', title: 'Lançamento excluído' });
    } catch (err) {
      console.error('Falha ao excluir lançamento:', err);
      addToast({ type: 'error', title: 'Não foi possível excluir o lançamento' });
    }
  };

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const maxFluxo = Math.max(...fluxo.map(m => Math.max(m.receita, m.despesa, 1)), 1000);

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS Finance</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gestão Financeira</p>
        </div>
      </div>

      <div className={`flex gap-1 p-1 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
        {(['resumo', 'contas-pagar', 'contas-receber', 'fluxo', 'dre'] as const).map(a => (
          <button key={a} onClick={() => setAba(a)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${aba === a ? (darkMode ? 'bg-cyan-600 text-white' : 'bg-cyan-500 text-white') : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}`}>
            {a === 'resumo' ? 'Resumo' : a === 'contas-pagar' ? 'Pagar' : a === 'contas-receber' ? 'Receber' : a === 'fluxo' ? 'Fluxo' : 'DRE'}
          </button>
        ))}
      </div>

      {aba === 'resumo' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-1 mb-1"><ArrowUpRight size={14} className="text-emerald-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Receitas</span></div>
              <p className="text-lg font-bold text-emerald-400">R$ {receitasTotal.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-1 mb-1"><ArrowDownRight size={14} className="text-red-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Despesas</span></div>
              <p className="text-lg font-bold text-red-400">R$ {despesasTotal.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-1 mb-1"><Wallet size={14} className="text-cyan-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Saldo</span></div>
              <p className={`text-lg font-bold ${saldo >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>R$ {saldo.toLocaleString()}</p>
            </div>
            <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-1 mb-1"><Receipt size={14} className="text-amber-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Lançamentos</span></div>
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{lancamentos.length}</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Lançamentos Recentes</h3>
              <button onClick={() => setShowForm(true)} className="px-3 py-1.5 bg-cyan-600 rounded text-xs text-white hover:bg-cyan-500">+ Novo</button>
            </div>
            <div className="space-y-2">
              {lancamentos.slice(0, 5).map(l => (
                <div key={l.id} className={`flex items-center justify-between p-2 rounded ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{l.descricao}</p>
                    <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{l.vencimento} • {l.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${l.tipo === 'receita' ? 'text-emerald-400' : 'text-red-400'}`}>{l.tipo === 'receita' ? '+' : '-'} R$ {l.valor.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {lancamentos.length === 0 && <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhum lançamento ainda.</p>}
            </div>
          </div>
        </>
      )}

      {aba === 'contas-pagar' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contas a Pagar <span className="text-red-400">({contasPagar.length})</span></h3>
            <button onClick={() => { setFormData({ ...formData, tipo: 'despesa' }); setShowForm(true); }} className="px-3 py-1.5 bg-cyan-600 rounded text-xs text-white">+ Nova Despesa</button>
          </div>
          {contasPagar.length === 0 ? (
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma conta pendente.</p>
          ) : (
            <div className="space-y-2">
              {contasPagar.map(l => (
                <div key={l.id} className={`flex items-center justify-between p-2 rounded ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{l.descricao}</p>
                    <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{l.contraparte} • {l.categoria}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-red-400">R$ {l.valor.toLocaleString()}</span>
                    <button onClick={() => excluir(l.id)} className="p-1 text-gray-600 hover:text-red-400"><X size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {aba === 'contas-receber' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contas a Receber <span className="text-emerald-400">({contasReceber.length})</span></h3>
            <button onClick={() => { setFormData({ ...formData, tipo: 'receita' }); setShowForm(true); }} className="px-3 py-1.5 bg-cyan-600 rounded text-xs text-white">+ Nova Receita</button>
          </div>
          {contasReceber.length === 0 ? (
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma conta a receber.</p>
          ) : (
            <div className="space-y-2">
              {contasReceber.map(l => (
                <div key={l.id} className={`flex items-center justify-between p-2 rounded ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{l.descricao}</p>
                    <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{l.contraparte} • {l.categoria}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-emerald-400">R$ {l.valor.toLocaleString()}</span>
                    <button onClick={() => excluir(l.id)} className="p-1 text-gray-600 hover:text-red-400"><X size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {aba === 'fluxo' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-sm font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Fluxo de Caixa Mensal</h3>
          <div className="h-40 flex items-end gap-3 overflow-x-auto">
            {fluxo.map(m => (
              <div key={m.mes} className="flex-1 flex flex-col items-center min-w-[40px]">
                <div className="w-full flex gap-0.5 justify-center">
                  <div className="w-4 bg-emerald-500 rounded-t" style={{ height: `${Math.min((m.receita / maxFluxo) * 120, 120)}px` }} />
                  <div className="w-4 bg-red-500 rounded-t" style={{ height: `${Math.min((m.despesa / maxFluxo) * 120, 120)}px` }} />
                </div>
                <span className="text-[10px] text-gray-500 mt-1">{m.mes}</span>
              </div>
            ))}
            {fluxo.length === 0 && <p className={`text-sm w-full text-center py-10 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhum dado. Lance receitas e despesas.</p>}
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-500 rounded" /><span className="text-xs text-gray-400">Receitas</span></div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded" /><span className="text-xs text-gray-400">Despesas</span></div>
          </div>
        </div>
      )}

      {aba === 'dre' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>DRE - Demonstrativo de Resultados</h3>
          <div className="space-y-1">
            {[
              { label: 'Receita Bruta', valor: dre.receitaBruta, color: 'text-emerald-400' },
              { label: '(-) Deduções', valor: -dre.deducoes, color: 'text-red-400' },
              { label: '= Receita Líquida', valor: dre.receitaLiquida, color: 'text-emerald-400', bold: true },
              { label: '(-) CPV', valor: -dre.cpv, color: 'text-red-400' },
              { label: '= Lucro Bruto', valor: dre.lucroBruto, color: 'text-emerald-400', bold: true },
              { label: '(-) Desp. Operacionais', valor: -dre.despesasOperacionais, color: 'text-red-400' },
              { label: '(-) Desp. Financeiras', valor: -dre.despesasFinanceiras, color: 'text-red-400' },
              { label: '= EBIT', valor: dre.ebit, color: 'text-emerald-400', bold: true },
              { label: '(-) IR', valor: -dre.irContribuicoes, color: 'text-red-400' },
              { label: '= Lucro Líquido', valor: dre.lucroLiquido, color: dre.lucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-400', bold: true },
            ].map((r, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className={`${r.bold ? 'font-semibold' : ''} ${darkMode ? '' : 'text-gray-900'}`}>{r.label}</span>
                <span className={`font-mono font-medium ${r.valor >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>R$ {Math.abs(r.valor).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-5 rounded-xl w-full max-w-md border ${darkMode ? 'bg-gray-800 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{formData.tipo === 'receita' ? 'Nova Receita' : 'Nova Despesa'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button onClick={() => setFormData({ ...formData, tipo: 'receita' })} className={`flex-1 py-2 rounded-lg text-sm ${formData.tipo === 'receita' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-400'}`}>Receita</button>
                <button onClick={() => setFormData({ ...formData, tipo: 'despesa' })} className={`flex-1 py-2 rounded-lg text-sm ${formData.tipo === 'despesa' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'}`}>Despesa</button>
              </div>
              <input type="text" value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} placeholder="Descrição" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input value={formData.contraparte} onChange={e => setFormData({ ...formData, contraparte: e.target.value })} placeholder="Cliente / Fornecedor" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="number" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} placeholder="Valor" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none">
                <option>Serviços</option><option>Aluguel</option><option>Marketing</option><option>Impostos</option><option>Salários</option><option>Operacional</option><option>Financeiro</option><option>Outros</option>
              </select>
              <button onClick={salvarTransacao} className="w-full py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATHOSFinance;

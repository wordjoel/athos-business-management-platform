import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Calendar, Plus, Trash2, X, Table2 } from 'lucide-react';
import { getFluxoCaixaMensal, getLancamentos, criarLancamento, excluirLancamento, Lancamento } from '../../services/lancamentoService';

const FluxoCaixa: React.FC = () => {
  const { darkMode } = useApp();
  const [meses, setMeses] = useState<ReturnType<typeof getFluxoCaixaMensal>>([]);
  const [todasTransacoes, setTodasTransacoes] = useState<Lancamento[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'receitas' | 'despesas'>('todos');
  const [exibirTabela, setExibirTabela] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ descricao: '', valor: '', tipo: 'despesa' as 'receita' | 'despesa', contraparte: '' });

  const carregar = () => {
    setMeses(getFluxoCaixaMensal());
    setTodasTransacoes(getLancamentos());
  };
  useEffect(() => { carregar(); }, []);

  const sorted = [...meses].sort((a, b) => {
    const ordem = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return ordem.indexOf(a.mes) - ordem.indexOf(b.mes);
  });

  const filtered = sorted.filter(m => {
    if (filtro === 'receitas') return m.receita > m.despesa;
    if (filtro === 'despesas') return m.despesa > m.receita;
    return true;
  });

  const totalReceita = sorted.reduce((s, m) => s + m.receita, 0);
  const totalDespesa = sorted.reduce((s, m) => s + m.despesa, 0);
  const totalSaldo = sorted.reduce((s, m) => s + m.saldo, 0);
  const maxValor = Math.max(...filtered.map(m => Math.max(m.receita, m.despesa, 1)), 150000);

  const quickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor) return;
    const mes = new Date().getMonth() + 1;
    criarLancamento({
      tipo: formData.tipo,
      descricao: formData.descricao,
      contraparte: formData.contraparte,
      valor: parseFloat(formData.valor),
      vencimento: `${mes.toString().padStart(2, '0')}/${new Date().getFullYear()}`,
      data: `${mes.toString().padStart(2, '0')}/${new Date().getFullYear()}`,
      status: formData.tipo === 'receita' ? 'recebido' : 'pago',
      categoria: 'Geral',
    });
    carregar();
    setFormData({ descricao: '', valor: '', tipo: 'despesa', contraparte: '' });
    setShowForm(false);
  };

  const excluirTransacao = (id: string) => {
    if (!confirm('Excluir este lançamento?')) return;
    excluirLancamento(id);
    carregar();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Fluxo de Caixa</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ATHOS Finance - Visão Geral</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFiltro('receitas')} className={`px-3 py-2 text-sm rounded-lg ${filtro === 'receitas' ? 'bg-emerald-500/30 text-emerald-300' : 'bg-emerald-500/20 text-emerald-400'} hover:bg-emerald-500/30`}>Receitas</button>
          <button onClick={() => setFiltro('despesas')} className={`px-3 py-2 text-sm rounded-lg ${filtro === 'despesas' ? 'bg-red-500/30 text-red-300' : 'bg-red-500/20 text-red-400'} hover:bg-red-500/30`}>Despesas</button>
          <button onClick={() => setFiltro('todos')} className={`px-3 py-2 text-sm rounded-lg ${filtro === 'todos' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-400'} hover:bg-gray-700`}>Ambos</button>
          <button onClick={() => setExibirTabela(!exibirTabela)} className={`px-3 py-2 text-sm rounded-lg flex items-center gap-1 ${exibirTabela ? 'bg-athos-500/20 text-athos-400' : 'bg-gray-800 text-gray-400'}`}><Table2 size={14} />Tabela</button>
          <button onClick={() => setShowForm(true)} className="px-3 py-2 text-sm bg-emerald-500 text-white rounded-lg flex items-center gap-1 hover:bg-emerald-600"><Plus size={14} />Novo</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight size={16} className="text-emerald-400" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receitas (Acumulado)</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">R$ {totalReceita.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight size={16} className="text-red-400" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Despesas (Acumulado)</span>
          </div>
          <p className="text-2xl font-bold text-red-400">R$ {totalDespesa.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-amber-400" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Saldo Total</span>
          </div>
          <p className={`text-2xl font-bold ${totalSaldo >= 0 ? 'text-amber-400' : 'text-red-400'}`}>R$ {totalSaldo.toLocaleString()}</p>
        </div>
      </div>

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Evolução Mensal <span className="text-xs text-gray-400">(calculado automaticamente dos lançamentos)</span></h2>
          <Calendar size={16} className="text-gray-400" />
        </div>
        <div className="h-64 flex items-end gap-4 overflow-x-auto pb-2">
          {filtered.length === 0 ? (
            <div className={`w-full text-center py-16 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Nenhum lançamento encontrado. Adicione despesas e receitas nos módulos correspondentes.
            </div>
          ) : filtered.map(m => (
            <div key={m.mes} className="flex-1 flex flex-col items-center group relative min-w-[60px]">
              <div className="w-full flex gap-1 justify-center h-56 items-end">
                <div className="w-6 bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-400" style={{ height: `${Math.min((m.receita / maxValor) * 200, 200)}px` }} title={`R$ ${m.receita.toLocaleString()}`} />
                <div className="w-6 bg-red-500 rounded-t-lg transition-all hover:bg-red-400" style={{ height: `${Math.min((m.despesa / maxValor) * 200, 200)}px` }} title={`R$ ${m.despesa.toLocaleString()}`} />
              </div>
              <span className={`text-xs mt-2 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{m.mes}</span>
              <span className={`text-[10px] ${m.saldo >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>R$ {m.saldo.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded" /><span className="text-sm">Receitas</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500 rounded" /><span className="text-sm">Despesas</span></div>
        </div>
      </div>

      {exibirTabela && (
        <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className={`p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <h3 className="font-semibold">Todos os Lançamentos</h3>
          </div>
          <table className="w-full">
            <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <tr>
                <th className="text-left p-3 text-sm font-medium">Data</th>
                <th className="text-left p-3 text-sm font-medium">Descrição</th>
                <th className="text-left p-3 text-sm font-medium">Tipo</th>
                <th className="text-right p-3 text-sm font-medium">Valor</th>
                <th className="text-center p-3 text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {todasTransacoes.map(t => (
                <tr key={t.id} className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                  <td className="p-3 text-sm">{t.vencimento}</td>
                  <td className="p-3 text-sm">{t.descricao}</td>
                  <td className="p-3 text-sm">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.tipo === 'receita' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {t.tipo === 'receita' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className={`p-3 text-sm text-right font-mono font-medium ${t.tipo === 'receita' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {t.tipo === 'receita' ? '+' : '-'} R$ {t.valor.toLocaleString()}
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => excluirTransacao(t.id)} className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/40"><Trash2 size={12} /></button>
                  </td>
                </tr>
              ))}
              {todasTransacoes.length === 0 && (
                <tr><td colSpan={5} className={`p-8 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhum lançamento encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-xl ${darkMode ? 'bg-gray-900 border border-white/10' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Novo Lançamento</h3>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <form onSubmit={quickAdd} className="space-y-3">
              <div className="flex gap-2">
                <button type="button" onClick={() => setFormData({ ...formData, tipo: 'receita' })} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.tipo === 'receita' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50' : 'bg-gray-700 text-gray-400'}`}>Receita</button>
                <button type="button" onClick={() => setFormData({ ...formData, tipo: 'despesa' })} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.tipo === 'despesa' ? 'bg-red-500/30 text-red-300 border border-red-500/50' : 'bg-gray-700 text-gray-400'}`}>Despesa</button>
              </div>
              <input value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} placeholder="Descrição" className="w-full px-3 py-2.5 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" required />
              <input value={formData.contraparte} onChange={e => setFormData({ ...formData, contraparte: e.target.value })} placeholder="Cliente / Fornecedor" className="w-full px-3 py-2.5 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} type="number" step="0.01" placeholder="Valor" className="w-full px-3 py-2.5 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" required />
              <button type="submit" className="w-full py-2.5 bg-emerald-600 rounded-lg text-white text-sm font-medium hover:bg-emerald-500 transition-all">Adicionar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FluxoCaixa;

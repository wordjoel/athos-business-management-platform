import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowDownLeft, ArrowUpRight, Check, X, Plus, Search, Filter, Building2, RefreshCw } from 'lucide-react';
import { getExtratos, criarExtrato, conciliarExtrato, excluirExtrato, getExtratosNaoConciliados, getContas, seedContasPadrao, ExtratoBancario } from '../../services/conciliacaoService';
import { getLancamentos, Lancamento } from '../../services/lancamentoService';

const ConciliacaoBancaria: React.FC = () => {
  const { darkMode } = useApp();
  const [extratos, setExtratos] = useState<ExtratoBancario[]>([]);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [contas, setContas] = useState<any[]>([]);
  const [aba, setAba] = useState<'extrato' | 'conciliar' | 'contas'>('extrato');
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'conciliado' | 'pendente'>('todos');
  const [formData, setFormData] = useState({
    descricao: '', valor: '', tipo: 'credito' as 'credito' | 'debito',
    categoria: 'Geral', banco: '001', agencia: '1234-5', conta: '67890-1', data: new Date().toISOString().slice(0, 10),
  });

  const carregar = () => {
    seedContasPadrao();
    setExtratos(getExtratos());
    setLancamentos(getLancamentos());
    setContas(getContas());
  };

  useEffect(() => { carregar(); }, []);

  const extratosFiltrados = extratos.filter(e => {
    const matchSearch = e.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'todos' || (filterStatus === 'conciliado' ? e.conciliado : !e.conciliado);
    return matchSearch && matchStatus;
  });

  const naoConciliados = getExtratosNaoConciliados();
  const totalCredito = extratos.filter(e => e.tipo === 'credito').reduce((s, e) => s + e.valor, 0);
  const totalDebito = extratos.filter(e => e.tipo === 'debito').reduce((s, e) => s + e.valor, 0);

  const salvarExtrato = () => {
    if (!formData.descricao || !formData.valor) return;
    criarExtrato({
      data: formData.data,
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      tipo: formData.tipo,
      categoria: formData.categoria,
      banco: formData.banco,
      agencia: formData.agencia,
      conta: formData.conta,
    });
    carregar();
    setFormData({ descricao: '', valor: '', tipo: 'credito', categoria: 'Geral', banco: '001', agencia: '1234-5', conta: '67890-1', data: new Date().toISOString().slice(0, 10) });
    setShowForm(false);
  };

  const conciliar = (extratoId: string, lancamentoId: string) => {
    conciliarExtrato(extratoId, lancamentoId);
    carregar();
  };

  const excluir = (id: string) => {
    if (confirm('Excluir este registro do extrato?')) {
      excluirExtrato(id);
      carregar();
    }
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Conciliação Bancária</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Extratos bancários vs Lançamentos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={carregar} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${darkMode ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <RefreshCw size={14} /> Atualizar
          </button>
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus size={16} /> Novo Extrato
          </button>
        </div>
      </div>

      <div className={`flex gap-1 p-1 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
        {(['extrato', 'conciliar', 'contas'] as const).map(a => (
          <button key={a} onClick={() => setAba(a)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${aba === a ? (darkMode ? 'bg-cyan-600 text-white' : 'bg-cyan-500 text-white') : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}`}>
            {a === 'extrato' ? 'Extrato' : a === 'conciliar' ? 'Conciliar' : 'Contas'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><ArrowUpRight size={14} className="text-emerald-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Créditos</span></div>
          <p className="text-lg font-bold text-emerald-400">R$ {totalCredito.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><ArrowDownLeft size={14} className="text-red-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Débitos</span></div>
          <p className="text-lg font-bold text-red-400">R$ {totalDebito.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><Filter size={14} className="text-amber-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Pendentes</span></div>
          <p className="text-lg font-bold text-amber-400">{naoConciliados.length}</p>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><Check size={14} className="text-cyan-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Conciliados</span></div>
          <p className="text-lg font-bold text-cyan-400">{extratos.filter(e => e.conciliado).length}</p>
        </div>
      </div>

      {aba === 'extrato' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex gap-3 mb-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10">
              <Search size={14} className="text-gray-500" />
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar extrato..." className="bg-transparent text-sm outline-none text-white placeholder-gray-600 w-full" />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-sm text-white">
              <option value="todos">Todos</option>
              <option value="pendente">Pendentes</option>
              <option value="conciliado">Conciliados</option>
            </select>
          </div>
          <div className="space-y-2">
            {extratosFiltrados.map(e => (
              <div key={e.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'} ${e.conciliado ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${e.tipo === 'credito' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                    {e.tipo === 'credito' ? <ArrowUpRight size={14} className="text-emerald-400" /> : <ArrowDownLeft size={14} className="text-red-400" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{e.descricao}</p>
                    <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{e.data} • {e.banco}/{e.agencia}/{e.conta}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${e.tipo === 'credito' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {e.tipo === 'credito' ? '+' : '-'} R$ {e.valor.toLocaleString()}
                  </span>
                  {e.conciliado ? (
                    <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full">Conciliado</span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">Pendente</span>
                  )}
                  <button onClick={() => excluir(e.id)} className="p-1 text-gray-600 hover:text-red-400"><X size={12} /></button>
                </div>
              </div>
            ))}
            {extratosFiltrados.length === 0 && <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhum registro encontrado.</p>}
          </div>
        </div>
      )}

      {aba === 'conciliar' && (
        <div className="space-y-3">
          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Registros Pendentes de Conciliação ({naoConciliados.length})</h3>
            {naoConciliados.length === 0 ? (
              <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Todos os registros já foram conciliados!</p>
            ) : (
              <div className="space-y-3">
                {naoConciliados.map(e => (
                  <div key={e.id} className={`p-3 rounded-lg border ${darkMode ? 'bg-gray-800/30 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{e.descricao}</p>
                        <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{e.data} • R$ {e.valor.toLocaleString()}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded ${e.tipo === 'credito' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                        {e.tipo === 'credito' ? 'Crédito' : 'Débito'}
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className={`text-xs mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Vincular a lançamento:</p>
                      <div className="flex flex-wrap gap-1">
                        {lancamentos.filter(l => l.status === 'pendente' && (
                          (e.tipo === 'credito' && l.tipo === 'receita') ||
                          (e.tipo === 'debito' && l.tipo === 'despesa')
                        )).slice(0, 3).map(l => (
                          <button key={l.id} onClick={() => conciliar(e.id, l.id)} className="px-2 py-1 bg-cyan-600/20 text-cyan-400 rounded text-[10px] hover:bg-cyan-600/30">
                            {l.descricao} - R$ {l.valor.toLocaleString()}
                          </button>
                        ))}
                        {lancamentos.filter(l => l.status === 'pendente').length === 0 && (
                          <span className={`text-[10px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>Nenhum lançamento pendente disponível</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {aba === 'contas' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Contas Bancárias</h3>
          <div className="space-y-2">
            {contas.map(c => (
              <div key={c.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Building2 size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{c.nome}</p>
                    <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{c.banco}/{c.agencia}/{c.conta}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>R$ {c.saldoAtual.toLocaleString()}</p>
                  <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{c.tipo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-5 rounded-xl w-full max-w-md border ${darkMode ? 'bg-gray-800 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Novo Extrato</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input type="date" value={formData.data} onChange={e => setFormData({ ...formData, data: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="text" value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} placeholder="Descrição" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="number" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} placeholder="Valor" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <div className="flex gap-2">
                <button onClick={() => setFormData({ ...formData, tipo: 'credito' })} className={`flex-1 py-2 rounded-lg text-sm ${formData.tipo === 'credito' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-400'}`}>Crédito</button>
                <button onClick={() => setFormData({ ...formData, tipo: 'debito' })} className={`flex-1 py-2 rounded-lg text-sm ${formData.tipo === 'debito' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'}`}>Débito</button>
              </div>
              <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none">
                <option>Geral</option><option>Salário</option><option>Aluguel</option><option>Impostos</option><option>Marketing</option><option>Operacional</option><option>Financeiro</option>
              </select>
              <select value={formData.banco} onChange={e => setFormData({ ...formData, banco: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none">
                {contas.map(c => <option key={c.id} value={c.banco}>{c.nome} ({c.banco})</option>)}
              </select>
              <button onClick={salvarExtrato} className="w-full py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConciliacaoBancaria;

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Target, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Receipt, BarChart3, Brain, Plus, Trash2, X, Save, Edit2, Eye, Calendar, User, History } from 'lucide-react';

interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  data: string;
  status: 'pendente' | 'recebido' | 'pago';
  modificadoPor: string;
  ultimaModificacao: string;
  observacoes?: string;
}

interface RegistroDRE {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  modificadoPor: string;
  ultimaModificacao: string;
}

const ATHOSFinance: React.FC = () => {
  const { darkMode, usuarioLogado } = useApp();

  const [transacoes, setTransacoes] = useState<Transacao[]>(() => {
    const saved = localStorage.getItem('athos_transacoes');
    return saved ? JSON.parse(saved) : [
      { id: '1', descricao: 'Tech Solutions - Janeiro', valor: 15000, tipo: 'receita', categoria: 'Serviços', data: '13/05/2026', status: 'recebido', modificadoPor: 'Luiz Victor', ultimaModificacao: '13/05/2026' },
      { id: '2', descricao: 'Aluguel - Maio', valor: -8500, tipo: 'despesa', categoria: 'Aluguel', data: '12/05/2026', status: 'pago', modificadoPor: 'Joel Oliveira', ultimaModificacao: '12/05/2026' },
      { id: '3', descricao: 'Clínica Viva', valor: 8500, tipo: 'receita', categoria: 'Serviços', data: '11/05/2026', status: 'recebido', modificadoPor: 'Luiz Victor', ultimaModificacao: '11/05/2026' },
      { id: '4', descricao: 'Contabilidade', valor: -2500, tipo: 'despesa', categoria: 'Serviços', data: '10/05/2026', status: 'pago', modificadoPor: 'Joel Oliveira', ultimaModificacao: '10/05/2026' },
    ];
  });

  const [dreRegistros, setDreRegistros] = useState<RegistroDRE[]>(() => {
    const saved = localStorage.getItem('athos_dre');
    return saved ? JSON.parse(saved) : [
      { id: '1', descricao: 'Receita Bruta de Vendas', valor: 125000, tipo: 'receita', modificadoPor: 'Joel Oliveira', ultimaModificacao: '13/05/2026' },
      { id: '2', descricao: '(-) Deduções de Vendas', valor: -2500, tipo: 'despesa', modificadoPor: 'Joel Oliveira', ultimaModificacao: '13/05/2026' },
      { id: '3', descricao: 'Receita Líquida', valor: 122500, tipo: 'receita', modificadoPor: 'Joel Oliveira', ultimaModificacao: '13/05/2026' },
      { id: '4', descricao: '(-) Custo de Mercadorias', valor: -45000, tipo: 'despesa', modificadoPor: 'Joel Oliveira', ultimaModificacao: '13/05/2026' },
      { id: '5', descricao: 'Lucro Bruto', valor: 77500, tipo: 'receita', modificadoPor: 'Joel Oliveira', ultimaModificacao: '13/05/2026' },
      { id: '6', descricao: '(-) Despesas Operacionais', valor: -40000, tipo: 'despesa', modificadoPor: 'Joel Oliveira', ultimaModificacao: '13/05/2026' },
      { id: '7', descricao: 'Lucro Operacional (EBIT)', valor: 37500, tipo: 'receita', modificadoPor: 'Joel Oliveira', ultimaModificacao: '13/05/2026' },
      { id: '8', descricao: 'Lucro Líquido', valor: 26250, tipo: 'receita', modificadoPor: 'Joel Oliveira', ultimaModificacao: '13/05/2026' },
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [showDreEdit, setShowDreEdit] = useState(false);
  const [tipoForm, setTipoForm] = useState<'receita' | 'despesa'>('receita');
  const [formData, setFormData] = useState({ descricao: '', valor: '', categoria: 'Serviços', data: '' });
  const [aba, setAba] = useState<'resumo' | 'contas-pagar' | 'contas-receber' | 'fluxo' | 'dre'>('resumo');
  const [editandoDre, setEditandoDre] = useState<RegistroDRE | null>(null);

  useEffect(() => { localStorage.setItem('athos_transacoes', JSON.stringify(transacoes)); }, [transacoes]);
  useEffect(() => { localStorage.setItem('athos_dre', JSON.stringify(dreRegistros)); }, [dreRegistros]);

  const usuarioAtual = usuarioLogado?.nome || 'Usuário';

  const salvarTransacao = () => {
    if (!formData.descricao || !formData.valor) return;
    const nova: Transacao = {
      id: Date.now().toString(),
      descricao: formData.descricao,
      valor: tipoForm === 'despesa' ? -Math.abs(parseFloat(formData.valor)) : parseFloat(formData.valor),
      tipo: tipoForm,
      categoria: formData.categoria,
      data: formData.data || new Date().toLocaleDateString('pt-BR'),
      status: tipoForm === 'receita' ? 'pendente' : 'pendente',
      modificadoPor: usuarioAtual,
      ultimaModificacao: new Date().toLocaleDateString('pt-BR'),
    };
    setTransacoes([nova, ...transacoes]);
    setFormData({ descricao: '', valor: '', categoria: 'Serviços', data: '' });
    setShowForm(false);
  };

  const excluirTransacao = (id: string) => {
    if (confirm('Excluir esta transação?')) setTransacoes(transacoes.filter(t => t.id !== id));
  };

  const salvarDre = () => {
    if (!editandoDre) return;
    setDreRegistros(dreRegistros.map(r => r.id === editandoDre.id ? { ...r, ...editandoDre, modificadoPor: usuarioAtual, ultimaModificacao: new Date().toLocaleDateString('pt-BR') } : r));
    setEditandoDre(null);
  };

  const receitasTotal = transacoes.filter(t => t.tipo === 'receita' && t.status === 'recebido').reduce((sum, t) => sum + t.valor, 0);
  const despesasTotal = transacoes.filter(t => t.tipo === 'despesa' && t.status === 'pago').reduce((sum, t) => sum + Math.abs(t.valor), 0);
  const saldo = receitasTotal - despesasTotal;

  const contasPagar = transacoes.filter(t => t.tipo === 'despesa' && t.status === 'pendente');
  const contasReceber = transacoes.filter(t => t.tipo === 'receita' && t.status === 'pendente');

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ATHOS Finance</h1>
          <p className="text-sm text-gray-500">Gestão Financeira</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <User size={12} />
          <span>Logado: {usuarioAtual}</span>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg">
        {['resumo', 'contas-pagar', 'contas-receber', 'fluxo', 'dre'].map(a => (
          <button key={a} onClick={() => setAba(a as any)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${aba === a ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            {a === 'resumo' ? 'Resumo' : a === 'contas-pagar' ? 'Pagar' : a === 'contas-receber' ? 'Receber' : a === 'fluxo' ? 'Fluxo' : 'DRE'}
          </button>
        ))}
      </div>

      {aba === 'resumo' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-800/40 p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-1 mb-1"><ArrowUpRight size={14} className="text-emerald-400" /><span className="text-xs text-gray-500">Receitas</span></div>
              <p className="text-lg font-bold text-emerald-400">R$ {receitasTotal.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/40 p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-1 mb-1"><ArrowDownRight size={14} className="text-red-400" /><span className="text-xs text-gray-500">Despesas</span></div>
              <p className="text-lg font-bold text-red-400">R$ {despesasTotal.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/40 p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-1 mb-1"><Wallet size={14} className="text-cyan-400" /><span className="text-xs text-gray-500">Saldo</span></div>
              <p className="text-lg font-bold text-cyan-400">R$ {saldo.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/40 p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-1 mb-1"><Receipt size={14} className="text-amber-400" /><span className="text-xs text-gray-500">Transações</span></div>
              <p className="text-lg font-bold text-white">{transacoes.length}</p>
            </div>
          </div>

          <div className="bg-gray-800/40 p-4 rounded-xl border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white">Transações Recentes</h3>
              <button onClick={() => setShowForm(true)} className="px-3 py-1.5 bg-cyan-600 rounded text-xs text-white hover:bg-cyan-500">+ Nova</button>
            </div>
            <div className="space-y-2">
              {transacoes.slice(0, 5).map(t => (
                <div key={t.id} className="flex items-center justify-between p-2 bg-gray-800/30 rounded">
                  <div>
                    <p className="text-sm text-white">{t.descricao}</p>
                    <p className="text-[10px] text-gray-500">{t.data} • {t.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${t.valor > 0 ? 'text-emerald-400' : 'text-red-400'}`}>{t.valor > 0 ? '+' : ''}R$ {Math.abs(t.valor).toLocaleString()}</p>
                    <p className="text-[9px] text-gray-600">{t.modificadoPor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {aba === 'contas-pagar' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-white">Contas a Pagar</h3>
            <button onClick={() => { setTipoForm('despesa'); setShowForm(true); }} className="px-3 py-1.5 bg-cyan-600 rounded text-xs text-white">+ Nova Despesa</button>
          </div>
          <div className="bg-gray-800/40 rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left p-2 text-gray-500">Descrição</th>
                  <th className="text-left p-2 text-gray-500">Categoria</th>
                  <th className="text-left p-2 text-gray-500">Vencimento</th>
                  <th className="text-right p-2 text-gray-500">Valor</th>
                  <th className="text-right p-2 text-gray-500">Última Edição</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {contasPagar.map(t => (
                  <tr key={t.id} className="border-t border-white/5">
                    <td className="p-2 text-white">{t.descricao}</td>
                    <td className="p-2 text-gray-400">{t.categoria}</td>
                    <td className="p-2 text-gray-400">{t.data}</td>
                    <td className="p-2 text-right text-red-400">R$ {Math.abs(t.valor).toLocaleString()}</td>
                    <td className="p-2 text-right text-gray-600 text-[10px]">{t.modificadoPor} • {t.ultimaModificacao}</td>
                    <td className="p-2"><button onClick={() => excluirTransacao(t.id)} className="p-1 text-gray-600 hover:text-red-400"><Trash2 size={12} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {aba === 'contas-receber' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-white">Contas a Receber</h3>
            <button onClick={() => { setTipoForm('receita'); setShowForm(true); }} className="px-3 py-1.5 bg-cyan-600 rounded text-xs text-white">+ Nova Receita</button>
          </div>
          <div className="bg-gray-800/40 rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left p-2 text-gray-500">Descrição</th>
                  <th className="text-left p-2 text-gray-500">Categoria</th>
                  <th className="text-left p-2 text-gray-500">Vencimento</th>
                  <th className="text-right p-2 text-gray-500">Valor</th>
                  <th className="text-right p-2 text-gray-500">Última Edição</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {contasReceber.map(t => (
                  <tr key={t.id} className="border-t border-white/5">
                    <td className="p-2 text-white">{t.descricao}</td>
                    <td className="p-2 text-gray-400">{t.categoria}</td>
                    <td className="p-2 text-gray-400">{t.data}</td>
                    <td className="p-2 text-right text-emerald-400">R$ {t.valor.toLocaleString()}</td>
                    <td className="p-2 text-right text-gray-600 text-[10px]">{t.modificadoPor} • {t.ultimaModificacao}</td>
                    <td className="p-2"><button onClick={() => excluirTransacao(t.id)} className="p-1 text-gray-600 hover:text-red-400"><Trash2 size={12} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {aba === 'fluxo' && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white">Fluxo de Caixa</h3>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-1 h-40">
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`flex-1 w-full rounded-t ${Math.random() > 0.5 ? 'bg-emerald-500/60' : 'bg-red-500/60'}`} style={{ height: `${Math.random() * 100}%` }} />
                <span className="text-[10px] text-gray-600">{i}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {aba === 'dre' && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-white">DRE - Demonstrativo de Resultados</h3>
            <button onClick={() => setShowDreEdit(true)} className="px-3 py-1.5 bg-cyan-600 rounded text-xs text-white">+ Adicionar Linha</button>
          </div>
          <div className="bg-gray-800/40 rounded-xl border border-white/5 overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left p-2 text-gray-500">Descrição</th>
                  <th className="text-right p-2 text-gray-500">Valor</th>
                  <th className="text-right p-2 text-gray-500">Última Edição</th>
                  <th className="p-2"></th>
                </tr>
              </thead>
              <tbody>
                {dreRegistros.map(r => (
                  <tr key={r.id} className={`border-t border-white/5 ${r.descricao.includes('Lucro') ? 'bg-cyan-500/10' : ''}`}>
                    <td className="p-2 text-white">{r.descricao}</td>
                    <td className="p-2 text-right font-medium text-white">R$ {Math.abs(r.valor).toLocaleString()}</td>
                    <td className="p-2 text-right text-gray-600 text-[10px]">{r.modificadoPor} • {r.ultimaModificacao}</td>
                    <td className="p-2">
                      <button onClick={() => setEditandoDre(r)} className="p-1 text-gray-600 hover:text-cyan-400"><Edit2 size={12} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-5 rounded-xl w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{tipoForm === 'receita' ? 'Nova Receita' : 'Nova Despesa'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button onClick={() => setTipoForm('receita')} className={`flex-1 py-2 rounded-lg text-sm ${tipoForm === 'receita' ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-400'}`}>Receita</button>
                <button onClick={() => setTipoForm('despesa')} className={`flex-1 py-2 rounded-lg text-sm ${tipoForm === 'despesa' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-400'}`}>Despesa</button>
              </div>
              <input type="text" value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} placeholder="Descrição" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <input type="number" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} placeholder="Valor" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm">
                <option>Serviços</option><option>Aluguel</option><option>Marketing</option><option>Impostos</option><option>Salários</option><option>Outros</option>
              </select>
              <input type="date" value={formData.data} onChange={e => setFormData({ ...formData, data: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <button onClick={salvarTransacao} className="w-full py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">Salvar</button>
            </div>
          </div>
        </div>
      )}

      {showDreEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-5 rounded-xl w-full max-w-md border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Adicionar Linha DRE</h2>
            <input type="text" value={editandoDre?.descricao || ''} onChange={e => setEditandoDre({ ...editandoDre!, descricao: e.target.value, id: editandoDre?.id || Date.now().toString(), valor: 0, tipo: 'receita', modificadoPor: usuarioAtual, ultimaModificacao: '' })} placeholder="Descrição" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm mb-3" />
            <input type="number" value={editandoDre?.valor || 0} onChange={e => setEditandoDre({ ...editandoDre!, valor: parseFloat(e.target.value) })} placeholder="Valor" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm mb-3" />
            <div className="flex gap-2">
              <button onClick={() => { setDreRegistros([...dreRegistros, { ...editandoDre!, id: Date.now().toString(), modificadoPor: usuarioAtual, ultimaModificacao: new Date().toLocaleDateString('pt-BR') }]); setShowDreEdit(false); setEditandoDre(null); }} className="flex-1 py-2 bg-cyan-600 rounded-lg text-white text-sm">Salvar</button>
              <button onClick={() => { setShowDreEdit(false); setEditandoDre(null); }} className="flex-1 py-2 bg-gray-700 rounded-lg text-gray-300 text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATHOSFinance;
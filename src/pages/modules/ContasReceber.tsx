import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, X, Trash2, Pencil } from 'lucide-react';
import { getLancamentos, criarLancamento, atualizarLancamento, excluirLancamento, Lancamento } from '../../services/lancamentoService';

const CATEGORIAS_RECEITA = ['Geral', 'Serviços', 'Produtos', 'Consultoria', 'Assinatura', 'Licença', 'Comissão', 'Outros'];

const ContasReceber: React.FC = () => {
  const { darkMode } = useApp();
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ descricao: '', contraparte: '', valor: '', vencimento: '', categoria: 'Geral' });

  const carregar = () => setLancamentos(getLancamentos().filter(l => l.tipo === 'receita'));
  useEffect(() => { carregar(); }, []);

  const filtered = lancamentos.filter(l => l.descricao.toLowerCase().includes(search.toLowerCase()) || l.contraparte.toLowerCase().includes(search.toLowerCase()));

  const abrirNovo = () => {
    setEditingId(null);
    setFormData({ descricao: '', contraparte: '', valor: '', vencimento: '', categoria: 'Geral' });
    setShowForm(true);
  };

  const abrirEditar = (l: Lancamento) => {
    setEditingId(l.id);
    setFormData({ descricao: l.descricao, contraparte: l.contraparte, valor: l.valor.toString(), vencimento: l.vencimento, categoria: l.categoria });
    setShowForm(true);
  };

  const salvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.descricao || !formData.valor || !formData.vencimento) return;

    if (editingId) {
      atualizarLancamento(editingId, {
        descricao: formData.descricao,
        contraparte: formData.contraparte,
        valor: parseFloat(formData.valor),
        vencimento: formData.vencimento,
        categoria: formData.categoria,
      });
    } else {
      criarLancamento({
        tipo: 'receita',
        descricao: formData.descricao,
        contraparte: formData.contraparte,
        valor: parseFloat(formData.valor),
        vencimento: formData.vencimento,
        data: formData.vencimento,
        status: 'pendente',
        categoria: formData.categoria,
      });
    }
    carregar();
    setShowForm(false);
    setEditingId(null);
  };

  const excluir = (id: string) => {
    excluirLancamento(id);
    carregar();
  };

  const toggleStatus = (id: string) => {
    const l = lancamentos.find(x => x.id === id);
    if (!l) return;
    const novoStatus = l.status === 'pendente' ? 'recebido' : l.status === 'recebido' ? 'pendente' : 'pendente';
    atualizarLancamento(id, { status: novoStatus as Lancamento['status'] });
    carregar();
  };

  const totalPendente = lancamentos.filter(l => l.status !== 'recebido').reduce((s, l) => s + l.valor, 0);
  const totalRecebido = lancamentos.filter(l => l.status === 'recebido').reduce((s, l) => s + l.valor, 0);
  const atrasadas = lancamentos.filter(l => l.status === 'atrasado').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Contas a Receber</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ATHOS Finance - Gestão de Receitas</p>
        </div>
        <button onClick={abrirNovo} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 flex items-center gap-2">
          <Plus size={16} /> Nova Receita
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Pendente</p>
          <p className="text-xl font-bold text-amber-400">R$ {totalPendente.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Atrasadas</p>
          <p className="text-xl font-bold text-red-500">{atrasadas}</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recebido no Mês</p>
          <p className="text-xl font-bold text-emerald-400">R$ {totalRecebido.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} type="text" placeholder="Buscar receitas..." className={`w-full pl-10 pr-4 py-2 rounded-lg outline-none border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`} />
        </div>
      </div>

      <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <table className="w-full">
          <thead className={`${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <tr>
              <th className="text-left p-4 text-sm font-medium">Descrição</th>
              <th className="text-left p-4 text-sm font-medium">Cliente</th>
              <th className="text-left p-4 text-sm font-medium">Categoria</th>
              <th className="text-left p-4 text-sm font-medium">Valor</th>
              <th className="text-left p-4 text-sm font-medium">Vencimento</th>
              <th className="text-left p-4 text-sm font-medium">Status</th>
              <th className="text-left p-4 text-sm font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <td className="p-4 text-sm">{l.descricao}</td>
                <td className="p-4 text-sm text-gray-400">{l.contraparte}</td>
                <td className="p-4 text-sm text-gray-400">{l.categoria}</td>
                <td className="p-4 text-sm font-medium">R$ {l.valor.toLocaleString()}</td>
                <td className="p-4 text-sm">{l.vencimento}</td>
                <td className="p-4">
                  <button onClick={() => toggleStatus(l.id)} className={`text-xs font-medium px-2 py-1 rounded-lg transition-all ${
                    l.status === 'recebido' ? 'bg-emerald-500/20 text-emerald-400' :
                    l.status === 'atrasado' ? 'bg-red-500/20 text-red-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>{l.status}</button>
                </td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button onClick={() => abrirEditar(l)} className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"><Pencil size={14} /></button>
                    <button onClick={() => excluir(l.id)} className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30"><Trash2 size={14} className="text-red-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className={`p-8 text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma receita encontrada</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-xl w-full max-w-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingId ? 'Editar Receita' : 'Nova Receita'}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }}><X size={18} className="text-gray-400" /></button>
            </div>
            <form onSubmit={salvar} className="space-y-3">
              <input value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} placeholder="Descrição" className="w-full px-3 py-2.5 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" required />
              <input value={formData.contraparte} onChange={e => setFormData({ ...formData, contraparte: e.target.value })} placeholder="Cliente" className="w-full px-3 py-2.5 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} className="w-full px-3 py-2.5 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none">
                {CATEGORIAS_RECEITA.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} type="number" step="0.01" placeholder="Valor" className="w-full px-3 py-2.5 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" required />
              <input value={formData.vencimento} onChange={e => setFormData({ ...formData, vencimento: e.target.value })} placeholder="Vencimento (DD/MM)" className="w-full px-3 py-2.5 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" required />
              <button type="submit" className="w-full py-2.5 bg-emerald-600 rounded-lg text-white text-sm font-medium hover:bg-emerald-500 transition-all">{editingId ? 'Salvar Alterações' : 'Adicionar Receita'}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContasReceber;

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Upload, X, Image, FileText, DollarSign, Tag, Trash2, Edit2, Eye, Save, Camera, MessageCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface Comprovante {
  id: string;
  nome: string;
  url: string;
  tipo: string;
  dataUpload: string;
}

interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  fornecedor: string;
  observacoes: string;
  comprovantes: Comprovante[];
  status: 'pendente' | 'aprovada' | 'rejeitada';
}

const categorias = [
  { id: 'alimentacao', label: 'Alimentação', emoji: '🍔', cor: '#f59e0b' },
  { id: 'transporte', label: 'Transporte', emoji: '🚗', cor: '#3b82f6' },
  { id: 'material', label: 'Material', emoji: '📦', cor: '#8b5cf6' },
  { id: 'servico', label: 'Serviço', emoji: '🔧', cor: '#ec4899' },
  { id: 'energia', label: 'Energia', emoji: '⚡', cor: '#eab308' },
  { id: 'agua', label: 'Água', emoji: '💧', cor: '#06b6d4' },
  { id: 'internet', label: 'Internet', emoji: '📶', cor: '#6366f1' },
  { id: 'marketing', label: 'Marketing', emoji: '📢', cor: '#f97316' },
  { id: 'outros', label: 'Outros', emoji: '📝', cor: '#64748b' },
];

const DespesasPage: React.FC = () => {
  const { darkMode } = useApp();
  const [despesas, setDespesas] = useState<Despesa[]>(() => {
    const saved = localStorage.getItem('athos_despesas');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingDespesa, setEditingDespesa] = useState<Despesa | null>(null);
  const [selectedDespesa, setSelectedDespesa] = useState<Despesa | null>(null);
  const [showSextaFeira, setShowSextaFeira] = useState(false);
  const [filter, setFilter] = useState<'todas' | 'pendente' | 'aprovada' | 'rejeitada'>('todas');
  const [msgSucesso, setMsgSucesso] = useState('');

  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    categoria: 'outros',
    data: new Date().toISOString().split('T')[0],
    fornecedor: '',
    observacoes: '',
  });

  useEffect(() => { localStorage.setItem('athos_despesas', JSON.stringify(despesas)); }, [despesas]);

  const showMensagem = (msg: string) => {
    setMsgSucesso(msg);
    setTimeout(() => setMsgSucesso(''), 3000);
  };

  const openForm = (despesa?: Despesa) => {
    if (despesa) {
      setEditingDespesa(despesa);
      setForm({
        descricao: despesa.descricao,
        valor: despesa.valor.toString(),
        categoria: despesa.categoria,
        data: despesa.data,
        fornecedor: despesa.fornecedor,
        observacoes: despesa.observacoes,
      });
    } else {
      setEditingDespesa(null);
      setForm({ descricao: '', valor: '', categoria: 'outros', data: new Date().toISOString().split('T')[0], fornecedor: '', observacoes: '' });
    }
    setShowForm(true);
  };

  const saveDespesa = () => {
    if (!form.descricao || !form.valor) {
      alert('Preencha a descrição e o valor!');
      return;
    }
    const valorNum = parseFloat(form.valor.replace(',', '.'));
    
    if (editingDespesa) {
      setDespesas(prev => prev.map(d => d.id === editingDespesa.id ? { 
        ...d, 
        descricao: form.descricao,
        valor: valorNum,
        categoria: form.categoria,
        data: form.data,
        fornecedor: form.fornecedor,
        observacoes: form.observacoes,
      } : d));
      showMensagem('Despesa atualizada com sucesso!');
    } else {
      const nova: Despesa = {
        id: Date.now().toString(),
        descricao: form.descricao,
        valor: valorNum,
        categoria: form.categoria,
        data: form.data,
        fornecedor: form.fornecedor,
        observacoes: form.observacoes,
        comprovantes: [],
        status: 'pendente',
      };
      setDespesas(prev => [nova, ...prev]);
      showMensagem('Despesa criada com sucesso!');
    }
    setShowForm(false);
    setEditingDespesa(null);
  };

  const deleteDespesa = (id: string) => {
    if (confirm('Excluir esta despesa?')) {
      setDespesas(prev => prev.filter(d => d.id !== id));
      showMensagem('Despesa excluída!');
    }
  };

  const handleUploadComprovante = (despesaId: string, arquivos: FileList) => {
    setDespesas(prev => prev.map(d => {
      if (d.id === despesaId) {
        const novosComprovantes: Comprovante[] = Array.from(arquivos).map(arq => ({
          id: Date.now().toString() + Math.random(),
          nome: arq.name,
          url: URL.createObjectURL(arq),
          tipo: arq.type,
          dataUpload: new Date().toISOString(),
        }));
        return { ...d, comprovantes: [...d.comprovantes, ...novosComprovantes] };
      }
      return d;
    }));
  };

  const removeComprovante = (despesaId: string, comprovanteId: string) => {
    setDespesas(prev => prev.map(d => d.id === despesaId ? { ...d, comprovantes: d.comprovantes.filter(c => c.id !== comprovanteId) } : d));
  };

  const changeStatus = (id: string, status: 'pendente' | 'aprovada' | 'rejeitada') => {
    setDespesas(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const filteredDespesas = despesas.filter(d => filter === 'todas' || d.status === filter);
  const totalGastos = filteredDespesas.reduce((acc, d) => acc + d.valor, 0);
  
  const totalPorCategoria = categorias.reduce((acc, cat) => {
    const total = filteredDespesas.filter(d => d.categoria === cat.id).reduce((sum, d) => sum + d.valor, 0);
    return { ...acc, [cat.id]: total };
  }, {} as Record<string, number>);

  const getStatusColor = (status: string) => ({ pendente: 'bg-amber-500/20 text-amber-400', aprovada: 'bg-emerald-500/20 text-emerald-400', rejeitada: 'bg-red-500/20 text-red-400' }[status] || 'bg-gray-500/20 text-gray-400');
  const getCategoriaInfo = (catId: string) => categorias.find(c => c.id === catId) || categorias[8];

  return (
    <div className="p-6 space-y-6">
      {msgSucesso && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">
          ✅ {msgSucesso}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="text-athos-400">Controle de Despesas</span>
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Cadastre, edite e controle todas as despesas com comprovantes
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowSextaFeira(true)} className="flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium">
            <MessageCircle size={18} /> Sexta-feira
          </button>
          <button onClick={() => openForm()} className="flex items-center gap-2 px-4 py-2.5 bg-athos-500 hover:bg-athos-600 text-white rounded-xl font-medium">
            <Plus size={18} /> Nova Despesa
          </button>
        </div>
      </div>

      {showSextaFeira && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <SextaFeiraPanel darkMode={darkMode} onClose={() => setShowSextaFeira(false)} despesas={despesas} />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/10' : 'bg-gradient-to-br from-amber-50 to-amber-100'} border ${darkMode ? 'border-amber-500/30' : 'border-amber-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center"><DollarSign className="text-amber-400" size={20} /></div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Gasto</p>
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"><Tag className="text-blue-400" size={20} /></div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Despesas</p>
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{despesas.length}</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center"><CheckCircle className="text-emerald-400" size={20} /></div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aprovadas</p>
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{despesas.filter(d => d.status === 'aprovada').length}</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center"><Image className="text-purple-400" size={20} /></div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comprovantes</p>
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{despesas.reduce((acc, d) => acc + d.comprovantes.length, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categorias.map(cat => (
          <div key={cat.id} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{cat.emoji}</span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{cat.label}</span>
            </div>
            <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>R$ {totalPorCategoria[cat.id]?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(['todas', 'pendente', 'aprovada', 'rejeitada'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-athos-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'todas' ? despesas.length : despesas.filter(d => d.status === f).length})
          </button>
        ))}
      </div>

      <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
        {filteredDespesas.length === 0 ? (
          <div className="p-12 text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
              <DollarSign className={darkMode ? 'text-gray-500' : 'text-gray-400'} size={32} />
            </div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nenhuma despesa encontrada</p>
            <button onClick={() => openForm()} className="mt-4 px-4 py-2 bg-athos-500 text-white rounded-lg">+ Adicionar primeira despesa</button>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <th className={`text-left p-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Descrição</th>
                <th className={`text-left p-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Categoria</th>
                <th className={`text-left p-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fornecedor</th>
                <th className={`text-left p-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Data</th>
                <th className={`text-left p-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Valor</th>
                <th className={`text-left p-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comp.</th>
                <th className={`text-left p-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                <th className={`text-left p-4 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredDespesas.map(despesa => {
                const cat = getCategoriaInfo(despesa.categoria);
                return (
                  <tr key={despesa.id} className={`border-b ${darkMode ? 'border-white/5' : 'border-gray-100'} hover:bg-athos-500/5`}>
                    <td className="p-4">
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{despesa.descricao}</p>
                      {despesa.observacoes && <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{despesa.observacoes}</p>}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: `${cat.cor}20`, color: cat.cor }}>
                        <span>{cat.emoji}</span> {cat.label}
                      </span>
                    </td>
                    <td className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{despesa.fornecedor || '-'}</td>
                    <td className={`p-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{despesa.data ? new Date(despesa.data).toLocaleDateString('pt-BR') : '-'}</td>
                    <td className="p-4">
                      <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>R$ {despesa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{despesa.comprovantes.length}</span>
                        {despesa.comprovantes.length > 0 && (
                          <button onClick={() => setSelectedDespesa(despesa)} className="p-1 rounded hover:bg-athos-500/20 text-athos-400">
                            <Eye size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <select 
                        value={despesa.status} 
                        onChange={(e) => changeStatus(despesa.id, e.target.value as any)}
                        className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${getStatusColor(despesa.status)}`}
                      >
                        <option value="pendente">Pendente</option>
                        <option value="aprovada">Aprovada</option>
                        <option value="rejeitada">Rejeitada</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openForm(despesa)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`} title="Editar">
                          <Edit2 size={16} className="text-athos-400" />
                        </button>
                        <label className={`p-2 rounded-lg cursor-pointer ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`} title="Adicionar comprovante">
                          <Upload size={16} className="text-blue-400" />
                          <input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={(e) => e.target.files && handleUploadComprovante(despesa.id, e.target.files)} />
                        </label>
                        <button onClick={() => deleteDespesa(despesa.id)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`} title="Excluir">
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className={`border-t-2 ${darkMode ? 'border-white/20 bg-gray-700/50' : 'border-gray-300 bg-gray-50'}`}>
                <td colSpan={4} className="p-4 text-right font-bold">TOTAL:</td>
                <td className="p-4 font-bold text-xl text-athos-400">R$ {totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-lg rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl`}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {editingDespesa ? '✏️ Editar Despesa' : '➕ Nova Despesa'}
              </h2>
              <button onClick={() => setShowForm(false)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Descrição *</label>
                <input type="text" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200'} focus:border-athos-500 outline-none`} placeholder="Ex: Material de escritório" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Valor (R$) *</label>
                  <input type="text" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200'} focus:border-athos-500 outline-none`} placeholder="0,00" />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Data</label>
                  <input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200'} focus:border-athos-500 outline-none`} />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Categoria</label>
                <div className="grid grid-cols-3 gap-2">{categorias.map(cat => (<button key={cat.id} type="button" onClick={() => setForm({ ...form, categoria: cat.id })} className={`p-3 rounded-xl border text-center transition-all ${form.categoria === cat.id ? 'border-athos-500 bg-athos-500/10' : darkMode ? 'border-white/10' : 'border-gray-200'}`}><span className="text-xl">{cat.emoji}</span><p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{cat.label}</p></button>))}</div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Fornecedor</label>
                <input type="text" value={form.fornecedor} onChange={e => setForm({ ...form, fornecedor: e.target.value })} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200'} focus:border-athos-500 outline-none`} placeholder="Nome do fornecedor" />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Observações</label>
                <textarea value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })} rows={2} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200'} focus:border-athos-500 outline-none resize-none`} placeholder="Observações adicionais..." />
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className={`px-4 py-2 rounded-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cancelar</button>
              <button onClick={saveDespesa} className="px-6 py-2.5 bg-athos-500 hover:bg-athos-600 text-white rounded-lg font-medium flex items-center gap-2">
                <Save size={16} /> {editingDespesa ? 'Atualizar' : 'Cadastrar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedDespesa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-2xl rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl`}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div><h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Comprovantes</h2><p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{selectedDespesa.descricao}</p></div>
              <button onClick={() => setSelectedDespesa(null)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><X size={20} /></button>
            </div>
            <div className="p-6">
              {selectedDespesa.comprovantes.length === 0 ? (
                <div className="text-center py-8"><Camera size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} /><p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nenhum comprovante</p><label className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-athos-500 text-white rounded-lg cursor-pointer hover:bg-athos-600"><Upload size={16} /> Fazer Upload<input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={e => { e.target.files && handleUploadComprovante(selectedDespesa.id, e.target.files); }} /></label></div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedDespesa.comprovantes.map(comp => (<div key={comp.id} className="relative group">{comp.tipo.startsWith('image/') ? <img src={comp.url} alt={comp.nome} className="w-full h-32 object-cover rounded-lg" /> : <div className={`w-full h-32 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}><FileText size={32} className={darkMode ? 'text-gray-500' : 'text-gray-400'} /></div>}<p className={`text-xs mt-2 truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{comp.nome}</p><button onClick={() => removeComprovante(selectedDespesa.id, comp.id)} className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} className="text-white" /></button></div>))}
                  <label className={`w-full h-32 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer ${darkMode ? 'border-white/20' : 'border-gray-300'}`}><div className="text-center"><Upload size={24} className={`mx-auto mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} /><p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Adicionar</p></div><input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={e => { e.target.files && handleUploadComprovante(selectedDespesa.id, e.target.files); }} /></label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SextaFeiraPanel: React.FC<{ darkMode: boolean; onClose: () => void; despesas: Despesa[] }> = ({ darkMode, onClose, despesas }) => {
  const [mensagens, setMensagens] = useState<{ id: string; tipo: 'usuario' | 'sextafeira'; texto: string; timestamp: string }[]>([{ id: '1', tipo: 'sextafeira', texto: 'Olá! Sou a Sexta-feira, sua assistente de WhatsApp! 📸💰 Posso ajudar a criar despesas, enviar comprovantes e organizar tudo.', timestamp: '' }]);
  const [input, setInput] = useState('');
  const [enviando, setEnviando] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMensagens(prev => [...prev, { id: Date.now().toString(), tipo: 'usuario', texto: input, timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
    setEnviando(true);
    setTimeout(() => {
      const total = despesas.reduce((acc, d) => acc + d.valor, 0);
      const palavras = input.toLowerCase();
      let resposta = '';
      if (palavras.includes('total') || palavras.includes('quanto')) resposta = `Seu total de despesas é R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. 📊`;
      else if (palavras.includes('criar') || palavras.includes('nova')) resposta = 'Para criar uma nova despesa, clique no botão "Nova Despesa" no topo da página!';
      else resposta = `Entendi! Seu total atual é R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Posso ajudar com despesas! 💰`;
      setMensagens(prev => [...prev, { id: (Date.now() + 1).toString(), tipo: 'sextafeira', texto: resposta, timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }]);
      setEnviando(false);
    }, 1500);
  };

  return (
    <div className="w-96 h-full flex flex-col bg-gray-900 border-l border-white/10">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center"><MessageCircle className="text-white" size={20} /></div>
          <div><h3 className="font-semibold text-white">Sexta-feira</h3><p className="text-xs text-gray-400">Assistente WhatsApp</p></div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10"><X size={18} className="text-gray-400" /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagens.map(msg => (<div key={msg.id} className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] ${msg.tipo === 'usuario' ? 'order-2' : 'order-1'}`}><div className={`p-3 rounded-2xl ${msg.tipo === 'usuario' ? 'bg-green-500 text-white rounded-br-md' : 'bg-gray-800 text-gray-100 rounded-bl-md'}`}><p className="text-sm">{msg.texto}</p></div></div></div>))}
        {enviando && <div className="flex justify-start"><div className="p-3 rounded-2xl bg-gray-800"><div className="w-4 h-4 border-2 border-athos-500 border-t-transparent rounded-full animate-spin" /></div></div>}
      </div>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <label className="p-2 rounded-lg cursor-pointer hover:bg-white/10"><Camera size={18} className="text-gray-400" /><input type="file" multiple accept="image/*,.pdf" className="hidden" /></label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()} placeholder="Digite uma mensagem..." className="flex-1 px-4 py-2 rounded-full bg-gray-800 border border-white/10 text-white text-sm focus:outline-none focus:border-green-500" />
          <button onClick={sendMessage} disabled={!input.trim()} className="p-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white disabled:opacity-50"><Plus size={18} className="rotate-90" /></button>
        </div>
      </div>
    </div>
  );
};

export default DespesasPage;
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import { Plus, Upload, X, Image, FileText, DollarSign, Tag, Trash2, Edit2, Eye, Save, Camera, MessageCircle, CheckCircle } from 'lucide-react';
import { getLancamentos, criarLancamento, atualizarLancamento, excluirLancamento, refreshLancamentos, Lancamento } from '../services/lancamentoService';

interface Comprovante {
  id: string;
  nome: string;
  url: string;
  tipo: string;
  dataUpload: string;
}

/**
 * Observações e comprovantes não têm coluna no Supabase (tabela `lancamentos`
 * só tem descricao/valor/vencimento/data/status/categoria/contraparte) — ficam
 * só neste navegador, amarradas ao id real do lançamento. O valor, a categoria
 * e o status é que precisam estar sempre sincronizados com o Supabase.
 */
interface DespesaExtra {
  observacoes: string;
  comprovantes: Comprovante[];
}

const EXTRA_KEY = 'athos_despesas_extra';

function getExtras(): Record<string, DespesaExtra> {
  try { return JSON.parse(localStorage.getItem(EXTRA_KEY) || '{}'); } catch { return {}; }
}
function setExtra(id: string, extra: Partial<DespesaExtra>) {
  const all = getExtras();
  const atual: DespesaExtra = all[id] || { observacoes: '', comprovantes: [] };
  all[id] = { ...atual, ...extra };
  localStorage.setItem(EXTRA_KEY, JSON.stringify(all));
}
function removeExtra(id: string) {
  const all = getExtras();
  delete all[id];
  localStorage.setItem(EXTRA_KEY, JSON.stringify(all));
}

const LEGACY_KEY = 'athos_despesas';
const LEGACY_MIGRATED_KEY = 'athos_despesas_migrado_v1';
const LEGACY_CATEGORIA_LABEL: Record<string, string> = {
  alimentacao: 'Alimentação', transporte: 'Transporte', material: 'Material', servico: 'Serviço',
  energia: 'Energia', agua: 'Água', internet: 'Internet', marketing: 'Marketing', outros: 'Outros',
};

/**
 * Essa página gravava despesas só em localStorage (`athos_despesas`), nunca no
 * Supabase — elas nunca apareceram no Financeiro/Dashboard/Relatórios. Migra
 * esse histórico órfão pros lançamentos reais na primeira carga após o conserto,
 * uma única vez, e limpa a chave antiga.
 */
async function migrarDespesasOrfas(): Promise<number> {
  if (localStorage.getItem(LEGACY_MIGRATED_KEY)) return 0;
  const raw = localStorage.getItem(LEGACY_KEY);
  if (!raw) {
    localStorage.setItem(LEGACY_MIGRATED_KEY, '1');
    return 0;
  }
  let migradas = 0;
  try {
    const antigas: any[] = JSON.parse(raw);
    for (const d of antigas) {
      if (!d?.descricao || !d?.valor) continue;
      const dataStr: string = d.data || new Date().toISOString().split('T')[0];
      const [ano, mes] = dataStr.split('-');
      const criado = await criarLancamento({
        tipo: 'despesa',
        descricao: d.descricao,
        valor: Number(d.valor),
        categoria: LEGACY_CATEGORIA_LABEL[d.categoria] || 'Outros',
        data: dataStr,
        vencimento: mes && ano ? `${mes}/${ano}` : dataStr,
        contraparte: d.fornecedor || '',
        status: d.status === 'aprovada' ? 'pago' : 'pendente',
      });
      if (d.observacoes) setExtra(criado.id, { observacoes: d.observacoes });
      migradas++;
    }
    // Só marca como migrado (e limpa a chave antiga) se o lote inteiro passou —
    // uma falha no meio (ex: sem rede) deixa o resto pra tentar de novo na próxima carga.
    localStorage.setItem(LEGACY_MIGRATED_KEY, '1');
    localStorage.removeItem(LEGACY_KEY);
  } catch (err) {
    console.error('Falha ao migrar despesas antigas de localStorage:', err);
  }
  return migradas;
}

const categorias = [
  { label: 'Alimentação', emoji: '🍔', cor: '#f59e0b' },
  { label: 'Transporte', emoji: '🚗', cor: '#3b82f6' },
  { label: 'Material', emoji: '📦', cor: '#8b5cf6' },
  { label: 'Serviço', emoji: '🔧', cor: '#ec4899' },
  { label: 'Energia', emoji: '⚡', cor: '#eab308' },
  { label: 'Água', emoji: '💧', cor: '#06b6d4' },
  { label: 'Internet', emoji: '📶', cor: '#6366f1' },
  { label: 'Marketing', emoji: '📢', cor: '#f97316' },
  { label: 'Outros', emoji: '📝', cor: '#64748b' },
];

const DespesasPage: React.FC = () => {
  const { darkMode } = useApp();
  const { addToast } = useToast();
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [extras, setExtras] = useState<Record<string, DespesaExtra>>(() => getExtras());
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSextaFeira, setShowSextaFeira] = useState(false);
  const [filter, setFilter] = useState<'todas' | 'pendente' | 'pago' | 'atrasado'>('todas');

  const [form, setForm] = useState({
    descricao: '',
    valor: '',
    categoria: 'Outros',
    data: new Date().toISOString().split('T')[0],
    fornecedor: '',
    observacoes: '',
  });

  const carregarLocal = () => setLancamentos(getLancamentos().filter(l => l.tipo === 'despesa'));

  const carregar = async () => {
    try {
      const migradas = await migrarDespesasOrfas();
      if (migradas > 0) {
        addToast({ type: 'success', title: `${migradas} despesa(s) recuperada(s)`, message: 'Estavam salvas só neste navegador e agora foram sincronizadas.' });
      }
      await refreshLancamentos();
    } catch (err) {
      console.error('Falha ao buscar despesas no Supabase:', err);
      addToast({ type: 'error', title: 'Sem conexão com o servidor', message: 'Mostrando os últimos dados salvos localmente.' });
    }
    carregarLocal();
    setExtras(getExtras());
    setCarregando(false);
  };
  useEffect(() => { carregar(); }, []);

  const openForm = (l?: Lancamento) => {
    if (l) {
      setEditingId(l.id);
      setForm({
        descricao: l.descricao,
        valor: l.valor.toString(),
        categoria: l.categoria,
        data: l.data,
        fornecedor: l.contraparte,
        observacoes: extras[l.id]?.observacoes || '',
      });
    } else {
      setEditingId(null);
      setForm({ descricao: '', valor: '', categoria: 'Outros', data: new Date().toISOString().split('T')[0], fornecedor: '', observacoes: '' });
    }
    setShowForm(true);
  };

  const saveDespesa = async () => {
    if (!form.descricao || !form.valor) {
      addToast({ type: 'warning', title: 'Preencha a descrição e o valor' });
      return;
    }
    const valorNum = parseFloat(form.valor.replace(',', '.'));
    if (Number.isNaN(valorNum)) {
      addToast({ type: 'warning', title: 'Valor inválido' });
      return;
    }
    const [ano, mes] = form.data.split('-');
    const vencimento = mes && ano ? `${mes}/${ano}` : form.data;

    setSalvando(true);
    try {
      let id = editingId;
      if (editingId) {
        await atualizarLancamento(editingId, {
          descricao: form.descricao,
          valor: valorNum,
          categoria: form.categoria,
          data: form.data,
          vencimento,
          contraparte: form.fornecedor,
        });
      } else {
        const criado = await criarLancamento({
          tipo: 'despesa',
          descricao: form.descricao,
          valor: valorNum,
          categoria: form.categoria,
          data: form.data,
          vencimento,
          contraparte: form.fornecedor,
          status: 'pendente',
        });
        id = criado.id;
      }
      if (id) setExtra(id, { observacoes: form.observacoes });
      setExtras(getExtras());
      await carregar();
      addToast({ type: 'success', title: editingId ? 'Despesa atualizada' : 'Despesa criada' });
      setShowForm(false);
      setEditingId(null);
    } catch (err) {
      console.error('Falha ao salvar despesa:', err);
      addToast({ type: 'error', title: 'Não foi possível salvar a despesa', message: 'Tente novamente em instantes.' });
    } finally {
      setSalvando(false);
    }
  };

  const deleteDespesa = async (id: string) => {
    if (!confirm('Excluir esta despesa?')) return;
    try {
      await excluirLancamento(id);
      removeExtra(id);
      setExtras(getExtras());
      await carregar();
      addToast({ type: 'success', title: 'Despesa excluída' });
    } catch (err) {
      console.error('Falha ao excluir despesa:', err);
      addToast({ type: 'error', title: 'Não foi possível excluir a despesa' });
    }
  };

  const handleUploadComprovante = (id: string, arquivos: FileList) => {
    const novos: Comprovante[] = Array.from(arquivos).map(arq => ({
      id: Date.now().toString() + Math.random(),
      nome: arq.name,
      url: URL.createObjectURL(arq),
      tipo: arq.type,
      dataUpload: new Date().toISOString(),
    }));
    const atuais = extras[id]?.comprovantes || [];
    setExtra(id, { comprovantes: [...atuais, ...novos] });
    setExtras(getExtras());
  };

  const removeComprovante = (id: string, comprovanteId: string) => {
    const atuais = extras[id]?.comprovantes || [];
    setExtra(id, { comprovantes: atuais.filter(c => c.id !== comprovanteId) });
    setExtras(getExtras());
  };

  const toggleStatus = async (id: string) => {
    const l = lancamentos.find(x => x.id === id);
    if (!l) return;
    const novoStatus = l.status === 'pendente' ? 'pago' : 'pendente';
    try {
      await atualizarLancamento(id, { status: novoStatus });
      await carregar();
    } catch (err) {
      console.error('Falha ao atualizar status da despesa:', err);
      addToast({ type: 'error', title: 'Não foi possível atualizar o status' });
    }
  };

  const filteredDespesas = lancamentos.filter(l => filter === 'todas' || l.status === filter);
  const totalGastos = filteredDespesas.reduce((acc, d) => acc + d.valor, 0);

  const totalPorCategoria = categorias.reduce((acc, cat) => {
    const total = filteredDespesas.filter(d => d.categoria === cat.label).reduce((sum, d) => sum + d.valor, 0);
    return { ...acc, [cat.label]: total };
  }, {} as Record<string, number>);

  const getStatusColor = (status: string) => ({ pendente: 'bg-amber-500/20 text-amber-400', pago: 'bg-emerald-500/20 text-emerald-400', atrasado: 'bg-red-500/20 text-red-400' }[status] || 'bg-gray-500/20 text-gray-400');
  const getCategoriaInfo = (label: string) => categorias.find(c => c.label === label) || categorias[categorias.length - 1];
  const selectedDespesa = lancamentos.find(l => l.id === selectedId) || null;

  return (
    <div className="p-6 space-y-6">
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
          <SextaFeiraPanel onClose={() => setShowSextaFeira(false)} totalGastos={totalGastos} />
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
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{lancamentos.length}</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center"><CheckCircle className="text-emerald-400" size={20} /></div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pagas</p>
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{lancamentos.filter(d => d.status === 'pago').length}</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center"><Image className="text-purple-400" size={20} /></div>
            <div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comprovantes</p>
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{Object.values(extras).reduce((acc, e) => acc + e.comprovantes.length, 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categorias.map(cat => (
          <div key={cat.label} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{cat.emoji}</span>
              <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{cat.label}</span>
            </div>
            <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>R$ {totalPorCategoria[cat.label]?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        {(['todas', 'pendente', 'pago', 'atrasado'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === f ? 'bg-athos-500 text-white' : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-600 border border-gray-200'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'todas' ? lancamentos.length : lancamentos.filter(d => d.status === f).length})
          </button>
        ))}
      </div>

      <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
        {carregando ? (
          <div className="p-12 text-center"><p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Carregando despesas...</p></div>
        ) : filteredDespesas.length === 0 ? (
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
                const extra = extras[despesa.id];
                return (
                  <tr key={despesa.id} className={`border-b ${darkMode ? 'border-white/5' : 'border-gray-100'} hover:bg-athos-500/5`}>
                    <td className="p-4">
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{despesa.descricao}</p>
                      {extra?.observacoes && <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{extra.observacoes}</p>}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: `${cat.cor}20`, color: cat.cor }}>
                        <span>{cat.emoji}</span> {despesa.categoria}
                      </span>
                    </td>
                    <td className={`p-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{despesa.contraparte || '-'}</td>
                    <td className={`p-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{despesa.data ? new Date(despesa.data).toLocaleDateString('pt-BR') : '-'}</td>
                    <td className="p-4">
                      <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>R$ {despesa.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{extra?.comprovantes.length || 0}</span>
                        {extra && extra.comprovantes.length > 0 && (
                          <button onClick={() => setSelectedId(despesa.id)} className="p-1 rounded hover:bg-athos-500/20 text-athos-400">
                            <Eye size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <button onClick={() => toggleStatus(despesa.id)} className={`text-xs px-2 py-1 rounded-full border-0 cursor-pointer ${getStatusColor(despesa.status)}`}>
                        {despesa.status}
                      </button>
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
                {editingId ? '✏️ Editar Despesa' : '➕ Nova Despesa'}
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
                <div className="grid grid-cols-3 gap-2">{categorias.map(cat => (<button key={cat.label} type="button" onClick={() => setForm({ ...form, categoria: cat.label })} className={`p-3 rounded-xl border text-center transition-all ${form.categoria === cat.label ? 'border-athos-500 bg-athos-500/10' : darkMode ? 'border-white/10' : 'border-gray-200'}`}><span className="text-xl">{cat.emoji}</span><p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{cat.label}</p></button>))}</div>
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
            <div className="p-6 border-t border-white/10 flex justify-between items-center bg-inherit">
              <button onClick={() => setShowForm(false)} className={`px-6 py-3 rounded-xl font-medium transition-colors ${darkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}>
                ✕ Cancelar
              </button>
              <button
                onClick={saveDespesa}
                disabled={salvando}
                className="px-8 py-3 bg-gradient-to-r from-athos-500 to-athos-600 hover:from-athos-600 hover:to-athos-700 text-white rounded-xl font-bold text-base flex items-center gap-3 shadow-lg shadow-athos-500/30 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Save size={20} />
                {salvando ? 'Salvando...' : editingId ? '💾 ATUALIZAR DESPESA' : '💾 CADASTRAR DESPESA'}
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
              <button onClick={() => setSelectedId(null)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><X size={20} /></button>
            </div>
            <div className="p-6">
              {(extras[selectedDespesa.id]?.comprovantes.length || 0) === 0 ? (
                <div className="text-center py-8"><Camera size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} /><p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nenhum comprovante</p><label className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-athos-500 text-white rounded-lg cursor-pointer hover:bg-athos-600"><Upload size={16} /> Fazer Upload<input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={e => { e.target.files && handleUploadComprovante(selectedDespesa.id, e.target.files); }} /></label></div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {extras[selectedDespesa.id]!.comprovantes.map(comp => (<div key={comp.id} className="relative group">{comp.tipo.startsWith('image/') ? <img src={comp.url} alt={comp.nome} className="w-full h-32 object-cover rounded-lg" /> : <div className={`w-full h-32 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}><FileText size={32} className={darkMode ? 'text-gray-500' : 'text-gray-400'} /></div>}<p className={`text-xs mt-2 truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{comp.nome}</p><button onClick={() => removeComprovante(selectedDespesa.id, comp.id)} className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12} className="text-white" /></button></div>))}
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

const SextaFeiraPanel: React.FC<{ onClose: () => void; totalGastos: number }> = ({ onClose, totalGastos }) => {
  const [mensagens, setMensagens] = useState<{ id: string; tipo: 'usuario' | 'sextafeira'; texto: string; timestamp: string }[]>([{ id: '1', tipo: 'sextafeira', texto: 'Olá! Sou a Sexta-feira, sua assistente de WhatsApp! 📸💰 Posso ajudar a criar despesas, enviar comprovantes e organizar tudo.', timestamp: '' }]);
  const [input, setInput] = useState('');
  const [enviando, setEnviando] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMensagens(prev => [...prev, { id: Date.now().toString(), tipo: 'usuario', texto: input, timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
    setEnviando(true);
    setTimeout(() => {
      const palavras = input.toLowerCase();
      let resposta = '';
      if (palavras.includes('total') || palavras.includes('quanto')) resposta = `Seu total de despesas é R$ ${totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. 📊`;
      else if (palavras.includes('criar') || palavras.includes('nova')) resposta = 'Para criar uma nova despesa, clique no botão "Nova Despesa" no topo da página!';
      else resposta = `Entendi! Seu total atual é R$ ${totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Posso ajudar com despesas! 💰`;
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

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Monitor, Package, Plus, Edit2, Trash2, X } from 'lucide-react';
import { inventarioService, InventarioItem } from '../../services/seedData';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);

const emptyForm = (): InventarioItem => ({
  id: '',
  nome: '',
  categoria: '',
  quantidade: 1,
  localizacao: '',
  status: 'disponivel',
});

const Inventario: React.FC = () => {
  const { darkMode } = useApp();
  const [itens, setItens] = useState<InventarioItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<InventarioItem>(emptyForm());

  const loadData = () => setItens(inventarioService.getAll());

  useEffect(() => { loadData(); }, []);

  const openNew = () => {
    setForm(emptyForm());
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: InventarioItem) => {
    setForm({ ...item });
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      inventarioService.update(editingId, form);
    } else {
      inventarioService.create({ ...form, id: generateId() });
    }
    loadData();
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este item?')) {
      inventarioService.delete(id);
      loadData();
    }
  };

  const statusBadge = (status: string) => {
    const classes: Record<string, string> = {
      disponivel: 'bg-emerald-500/20 text-emerald-400',
      em_uso: 'bg-blue-500/20 text-blue-400',
      manutencao: 'bg-amber-500/20 text-amber-400',
    };
    return classes[status] || 'bg-gray-500/20 text-gray-400';
  };

  const totalCadastrado = itens.length;
  const emUso = itens.filter(i => i.status === 'em_uso').length;
  const emManutencao = itens.filter(i => i.status === 'manutencao').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Inventário</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ATHOS Support - Equipamentos</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Novo Item
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Cadastrado</p>
          <p className="text-2xl font-bold">{totalCadastrado}</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Em Uso</p>
          <p className="text-2xl font-bold text-blue-400">{emUso}</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Em Manutenção</p>
          <p className="text-2xl font-bold text-amber-400">{emManutencao}</p>
        </div>
      </div>
      <div className="space-y-3">
        {itens.map(item => (
          <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Package size={18} className="text-cyan-400" />
              </div>
              <div>
                <p className="font-medium">{item.nome}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.categoria} • {item.localizacao}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-lg ${statusBadge(item.status)}`}>{item.status.replace('_', ' ')}</span>
              <button onClick={() => openEdit(item)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><Edit2 size={14} className="text-violet-400" /></button>
              <button onClick={() => handleDelete(item.id)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><Trash2 size={14} className="text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className={`p-6 rounded-xl w-full max-w-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editingId ? 'Editar Item' : 'Novo Item'}</h2>
              <button onClick={closeModal} className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nome</label>
                <input type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Categoria</label>
                <input type="text" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Quantidade</label>
                <input type="number" value={form.quantidade} onChange={e => setForm({...form, quantidade: Number(e.target.value)})} min={1} required className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Localização</label>
                <input type="text" value={form.localizacao} onChange={e => setForm({...form, localizacao: e.target.value})} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value as InventarioItem['status']})} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`}>
                  <option value="disponivel">Disponível</option>
                  <option value="em_uso">Em Uso</option>
                  <option value="manutencao">Manutenção</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Observação</label>
                <textarea value={form.observacao || ''} onChange={e => setForm({...form, observacao: e.target.value})} rows={2} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm">{editingId ? 'Salvar' : 'Criar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventario;

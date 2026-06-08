import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Plus, Edit2, Trash2, X } from 'lucide-react';
import { modelosService, Modelo } from '../../services/seedData';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);

const emptyForm = (): Modelo => ({
  id: '',
  nome: '',
  descricao: '',
  categoria: '',
  clausulas: 0,
  updatedAt: new Date().toLocaleDateString('pt-BR'),
});

const Modelos: React.FC = () => {
  const { darkMode } = useApp();
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Modelo>(emptyForm());

  const loadData = () => setModelos(modelosService.getAll());

  useEffect(() => { loadData(); }, []);

  const openNew = () => {
    setForm(emptyForm());
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (m: Modelo) => {
    setForm({ ...m });
    setEditingId(m.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      modelosService.update(editingId, form);
    } else {
      modelosService.create({ ...form, id: generateId() });
    }
    loadData();
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este modelo?')) {
      modelosService.delete(id);
      loadData();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Modelos de Contratos</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ATHOS Sign - Biblioteca</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Novo Modelo
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modelos.map(m => (
          <div key={m.id} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                <FileText size={18} className="text-violet-400" />
              </div>
              <div>
                <p className="font-medium">{m.nome}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{m.categoria} • {m.clausulas} cláusulas</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{m.updatedAt}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(m)} className="text-sm text-violet-400 flex items-center gap-1"><Edit2 size={14} /> Editar</button>
                <button onClick={() => handleDelete(m.id)} className="text-sm text-red-400 flex items-center gap-1"><Trash2 size={14} /> Excluir</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className={`p-6 rounded-xl w-full max-w-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editingId ? 'Editar Modelo' : 'Novo Modelo'}</h2>
              <button onClick={closeModal} className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nome</label>
                <input type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} required className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Descrição</label>
                <textarea value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} rows={3} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Categoria</label>
                <input type="text" value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} required className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cláusulas</label>
                <input type="number" value={form.clausulas} onChange={e => setForm({...form, clausulas: Number(e.target.value)})} min={0} required className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm">{editingId ? 'Salvar' : 'Criar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modelos;

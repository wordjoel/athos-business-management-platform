import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FileSignature, Plus, Edit2, Trash2, X } from 'lucide-react';
import { assinaturasService, Assinatura } from '../../services/seedData';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);

const emptyForm = (): Assinatura => ({
  id: '',
  documento: '',
  signatario: '',
  email: '',
  status: 'pendente',
  dataEnvio: new Date().toLocaleDateString('pt-BR'),
});

const Assinaturas: React.FC = () => {
  const { darkMode } = useApp();
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Assinatura>(emptyForm());

  const loadData = () => setAssinaturas(assinaturasService.getAll());

  useEffect(() => { loadData(); }, []);

  const openNew = () => {
    setForm(emptyForm());
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (a: Assinatura) => {
    setForm({ ...a });
    setEditingId(a.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      assinaturasService.update(editingId, form);
    } else {
      assinaturasService.create({ ...form, id: generateId() });
    }
    loadData();
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir esta assinatura?')) {
      assinaturasService.delete(id);
      loadData();
    }
  };

  const statusBadge = (status: string) => {
    const classes: Record<string, string> = {
      assinado: 'bg-emerald-500/20 text-emerald-400',
      pendente: 'bg-amber-500/20 text-amber-400',
      expirado: 'bg-gray-500/20 text-gray-400',
    };
    return classes[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Assinaturas</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ATHOS Sign - Gestão de Assinaturas</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Nova Assinatura
        </button>
      </div>
      <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <table className="w-full">
          <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th className="text-left p-4 text-sm font-medium">Documento</th>
              <th className="text-left p-4 text-sm font-medium">Signatário</th>
              <th className="text-left p-4 text-sm font-medium">Data</th>
              <th className="text-left p-4 text-sm font-medium">Status</th>
              <th className="text-left p-4 text-sm font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {assinaturas.map(a => (
              <tr key={a.id} className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <td className="p-4 text-sm flex items-center gap-2">
                  <FileSignature size={14} className="text-violet-400" />
                  {a.documento}
                </td>
                <td className="p-4 text-sm text-gray-400">{a.signatario}</td>
                <td className="p-4 text-sm">{a.dataEnvio}</td>
                <td className="p-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg ${statusBadge(a.status)}`}>{a.status}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(a)} className="text-sm text-violet-400 flex items-center gap-1"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(a.id)} className="text-sm text-red-400 flex items-center gap-1"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className={`p-6 rounded-xl w-full max-w-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editingId ? 'Editar Assinatura' : 'Nova Assinatura'}</h2>
              <button onClick={closeModal} className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Documento</label>
                <input type="text" value={form.documento} onChange={e => setForm({...form, documento: e.target.value})} required className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Signatário</label>
                <input type="text" value={form.signatario} onChange={e => setForm({...form, signatario: e.target.value})} required className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>E-mail</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value as Assinatura['status']})} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`}>
                  <option value="pendente">Pendente</option>
                  <option value="assinado">Assinado</option>
                  <option value="expirado">Expirado</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Data de Envio</label>
                <input type="text" value={form.dataEnvio} onChange={e => setForm({...form, dataEnvio: e.target.value})} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
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

export default Assinaturas;

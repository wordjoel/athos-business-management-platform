import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Ticket, Plus, Edit2, Trash2, X } from 'lucide-react';
import { chamadosService, Chamado } from '../../services/seedData';

const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 9);

const emptyForm = (): Chamado => ({
  id: '',
  titulo: '',
  descricao: '',
  solicitante: '',
  setor: '',
  prioridade: 'media',
  status: 'aberto',
  dataAbertura: new Date().toLocaleDateString('pt-BR'),
});

const Chamados: React.FC = () => {
  const { darkMode } = useApp();
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Chamado>(emptyForm());

  const loadData = () => setChamados(chamadosService.getAll());

  useEffect(() => { loadData(); }, []);

  const openNew = () => {
    setForm(emptyForm());
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (c: Chamado) => {
    setForm({ ...c });
    setEditingId(c.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      chamadosService.update(editingId, form);
    } else {
      chamadosService.create({ ...form, id: generateId() });
    }
    loadData();
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Excluir este chamado?')) {
      chamadosService.delete(id);
      loadData();
    }
  };

  const ticketColor = (prioridade: string) => {
    if (prioridade === 'critica' || prioridade === 'alta') return 'bg-red-500/20 text-red-400';
    if (prioridade === 'media') return 'bg-amber-500/20 text-amber-400';
    return 'bg-gray-500/20 text-gray-400';
  };

  const prioridadeBadge = (prioridade: string) => {
    const classes: Record<string, string> = {
      critica: 'bg-red-500/20 text-red-400',
      alta: 'bg-orange-500/20 text-orange-400',
      media: 'bg-blue-500/20 text-blue-400',
      baixa: 'bg-gray-500/20 text-gray-400',
    };
    return classes[prioridade] || 'bg-gray-500/20 text-gray-400';
  };

  const statusBadge = (status: string) => {
    const classes: Record<string, string> = {
      aberto: 'bg-blue-500/20 text-blue-400',
      em_andamento: 'bg-amber-500/20 text-amber-400',
      resolvido: 'bg-emerald-500/20 text-emerald-400',
      fechado: 'bg-gray-500/20 text-gray-400',
    };
    return classes[status] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Chamados</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ATHOS Support - Lista de Tickets</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Novo Chamado
        </button>
      </div>
      <div className="space-y-3">
        {chamados.map(c => (
          <div key={c.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ticketColor(c.prioridade)}`}>
                <Ticket size={18} className={ticketColor(c.prioridade).split(' ')[1]} />
              </div>
              <div>
                <p className="font-medium">{c.titulo}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{c.solicitante} • {c.setor}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-lg ${prioridadeBadge(c.prioridade)}`}>{c.prioridade.replace('_', ' ')}</span>
              <span className={`text-xs font-medium px-2 py-1 rounded-lg ${statusBadge(c.status)}`}>{c.status.replace('_', ' ')}</span>
              <button onClick={() => openEdit(c)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><Edit2 size={14} className="text-violet-400" /></button>
              <button onClick={() => handleDelete(c.id)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><Trash2 size={14} className="text-red-400" /></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className={`p-6 rounded-xl w-full max-w-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editingId ? 'Editar Chamado' : 'Novo Chamado'}</h2>
              <button onClick={closeModal} className={`p-1 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Título</label>
                <input type="text" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} required className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Descrição</label>
                <textarea value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} rows={3} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Solicitante</label>
                <input type="text" value={form.solicitante} onChange={e => setForm({...form, solicitante: e.target.value})} required className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Setor</label>
                <input type="text" value={form.setor} onChange={e => setForm({...form, setor: e.target.value})} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`} />
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prioridade</label>
                <select value={form.prioridade} onChange={e => setForm({...form, prioridade: e.target.value as Chamado['prioridade']})} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`}>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>
              <div>
                <label className={`block text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value as Chamado['status']})} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-200'} border`}>
                  <option value="aberto">Aberto</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="resolvido">Resolvido</option>
                  <option value="fechado">Fechado</option>
                </select>
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

export default Chamados;

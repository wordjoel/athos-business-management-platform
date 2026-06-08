import React, { useState, useEffect } from 'react';
import { Kanban, Plus, Pencil, Trash2, X } from 'lucide-react';
import { tarefasService, colunasKanbanService, Tarefa, ColunaKanban } from '../../services/seedData';
import { useApp } from '../../context/AppContext';

const statusParaColuna: Record<string, string> = {
  pendente: 'A Fazer',
  em_andamento: 'Em Andamento',
  concluida: 'Concluído',
};

const corDaColuna: Record<string, string> = {
  'A Fazer': 'gray',
  'Em Andamento': 'blue',
  'Revisão': 'amber',
  'Concluído': 'emerald',
};

interface TarefaForm {
  titulo: string;
  responsavel: string;
  prioridade: Tarefa['prioridade'];
  status: Tarefa['status'];
}

const emptyForm: TarefaForm = { titulo: '', responsavel: '', prioridade: 'media', status: 'pendente' };

const KanbanBoard: React.FC = () => {
  const { darkMode } = useApp();
  const [colunas, setColunas] = useState<ColunaKanban[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TarefaForm>(emptyForm);

  const load = () => {
    setColunas(colunasKanbanService.getAll());
    setTarefas(tarefasService.getAll());
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (t: Tarefa) => {
    setEditingId(t.id);
    setForm({ titulo: t.titulo, responsavel: t.responsavel, prioridade: t.prioridade, status: t.status });
    setModalOpen(true);
  };

  const save = () => {
    if (!form.titulo.trim()) return;
    const now = new Date().toLocaleDateString('pt-BR');
    if (editingId) {
      tarefasService.update(editingId, {
        ...form,
        dataConclusao: form.status === 'concluida' ? now : undefined,
      });
    } else {
      tarefasService.create({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
        ...form,
        descricao: '',
        dataCriacao: now,
      });
    }
    load();
    setModalOpen(false);
  };

  const remove = (id: string) => {
    tarefasService.delete(id);
    load();
  };

  const colunasRender = colunas.length > 0 ? colunas : [
    { nome: 'A Fazer', cor: 'gray' },
    { nome: 'Em Andamento', cor: 'blue' },
    { nome: 'Revisão', cor: 'amber' },
    { nome: 'Concluído', cor: 'emerald' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Kanban</h1>
          <p className="text-gray-400">ATHOS Projects - Quadro Visual</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Nova Tarefa
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {colunas.map((col) => {
          const colunaTitulo = col.titulo;
          const statusTarefa = Object.entries(statusParaColuna).find(([, v]) => v === colunaTitulo)?.[0];
          const tarefasDaColuna = statusTarefa
            ? tarefas.filter(t => t.status === statusTarefa)
            : tarefas.filter(t => col.tarefas.includes(t.titulo));
          const cor = corDaColuna[colunaTitulo] || 'gray';

          return (
            <div key={col.id} className="p-4 rounded-xl bg-gray-900/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{colunaTitulo}</h3>
                <span className="text-xs text-gray-400">{tarefasDaColuna.length}</span>
              </div>
              <div className="space-y-2">
                {tarefasDaColuna.map((t) => (
                  <div key={t.id} className="p-3 rounded-lg bg-gray-800 cursor-pointer hover:bg-gray-700 group">
                    <div className="flex items-center justify-between">
                      <p className="text-sm">{t.titulo}</p>
                      <div className="hidden group-hover:flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); openEdit(t); }} className="p-1 text-gray-400 hover:text-blue-400"><Pencil size={12} /></button>
                        <button onClick={(e) => { e.stopPropagation(); remove(t.id); }} className="p-1 text-gray-400 hover:text-red-400"><Trash2 size={12} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editingId ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
              <button onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Título" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Responsável" value={form.responsavel} onChange={e => setForm({...form, responsavel: e.target.value})} />
            <select className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" value={form.prioridade} onChange={e => setForm({...form, prioridade: e.target.value as Tarefa['prioridade']})}>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
            <select className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" value={form.status} onChange={e => setForm({...form, status: e.target.value as Tarefa['status']})}>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
            </select>
            <button onClick={save} className="w-full py-2 bg-blue-500 text-white rounded-lg font-medium">Salvar</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default KanbanBoard;

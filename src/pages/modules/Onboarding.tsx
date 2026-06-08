import React, { useState, useEffect } from 'react';
import { Baby, GraduationCap, FileText, Plus, Pencil, Trash2, X } from 'lucide-react';
import { onboardingService, OnboardingItem } from '../../services/seedData';
import { useApp } from '../../context/AppContext';

interface OnboardingForm {
  funcionario: string;
  cargo: string;
  tutor: string;
  etapas: number;
  etapasConcluidas: number;
  status: OnboardingItem['status'];
}

const emptyForm: OnboardingForm = { funcionario: '', cargo: '', tutor: '', etapas: 8, etapasConcluidas: 0, status: 'em_andamento' };

const Onboarding: React.FC = () => {
  const { darkMode } = useApp();
  const [itens, setItens] = useState<OnboardingItem[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<OnboardingForm>(emptyForm);

  const load = () => setItens(onboardingService.getAll());

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (o: OnboardingItem) => {
    setEditingId(o.id);
    setForm({ funcionario: o.funcionario, cargo: o.cargo, tutor: o.tutor, etapas: o.etapas, etapasConcluidas: o.etapasConcluidas, status: o.status });
    setModalOpen(true);
  };

  const save = () => {
    if (!form.funcionario.trim()) return;
    const now = new Date().toLocaleDateString('pt-BR');
    if (editingId) {
      onboardingService.update(editingId, form);
    } else {
      onboardingService.create({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
        ...form,
        dataInicio: now,
      });
    }
    load();
    setModalOpen(false);
  };

  const remove = (id: string) => {
    onboardingService.delete(id);
    load();
  };

  const emAndamento = itens.filter(i => i.status === 'em_andamento').length;
  const concluidos = itens.filter(i => i.status === 'concluido').length;
  const pendencias = itens.filter(i => i.etapasConcluidas < i.etapas && i.status === 'em_andamento').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Onboarding</h1>
          <p className="text-gray-400">ATHOS People - Integração de Novos Funcionários</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Novo Onboarding
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-900/50">
          <Baby size={20} className="text-cyan-400 mb-2" />
          <p className="text-sm text-gray-400">Em Andamento</p>
          <p className="text-2xl font-bold">{emAndamento}</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <GraduationCap size={20} className="text-violet-400 mb-2" />
          <p className="text-sm text-gray-400">Concluídos (Mês)</p>
          <p className="text-2xl font-bold">{concluidos}</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <FileText size={20} className="text-amber-400 mb-2" />
          <p className="text-sm text-gray-400">Pendências</p>
          <p className="text-2xl font-bold">{pendencias}</p>
        </div>
      </div>
      <div className="space-y-3">
        {itens.map((o) => (
          <div key={o.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
            <div>
              <p className="font-medium">{o.funcionario}</p>
              <p className="text-xs text-gray-400">{o.cargo}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className={`text-sm ${o.status === 'concluido' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {o.status === 'concluido' ? 'Concluído' : 'Em Andamento'}
                </p>
                <p className="text-xs text-gray-400">{o.etapasConcluidas}/{o.etapas} etapas</p>
              </div>
              <button onClick={() => openEdit(o)} className="p-1 text-gray-400 hover:text-blue-400"><Pencil size={14} /></button>
              <button onClick={() => remove(o.id)} className="p-1 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editingId ? 'Editar Onboarding' : 'Novo Onboarding'}</h2>
              <button onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Funcionário" value={form.funcionario} onChange={e => setForm({...form, funcionario: e.target.value})} />
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Cargo" value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})} />
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Tutor" value={form.tutor} onChange={e => setForm({...form, tutor: e.target.value})} />
            <div className="flex gap-2">
              <input className="w-1/2 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Etapas" type="number" value={form.etapas} onChange={e => setForm({...form, etapas: parseInt(e.target.value) || 0})} />
              <input className="w-1/2 px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Concluídas" type="number" value={form.etapasConcluidas} onChange={e => setForm({...form, etapasConcluidas: parseInt(e.target.value) || 0})} />
            </div>
            <select className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" value={form.status} onChange={e => setForm({...form, status: e.target.value as OnboardingItem['status']})}>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
            </select>
            <button onClick={save} className="w-full py-2 bg-orange-500 text-white rounded-lg font-medium">Salvar</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Onboarding;

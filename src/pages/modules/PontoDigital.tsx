import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Plus, Pencil, Trash2, X } from 'lucide-react';
import { pontoService, RegistroPonto } from '../../services/seedData';
import { useApp } from '../../context/AppContext';

interface RegistroForm {
  funcionario: string;
  data: string;
  entrada: string;
  saida: string;
  horas: number;
  status: RegistroPonto['status'];
}

const emptyForm: RegistroForm = { funcionario: '', data: '', entrada: '', saida: '', horas: 0, status: 'normal' };

const PontoDigital: React.FC = () => {
  const { darkMode } = useApp();
  const [registros, setRegistros] = useState<RegistroPonto[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RegistroForm>(emptyForm);

  const load = () => setRegistros(pontoService.getAll());

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (r: RegistroPonto) => {
    setEditingId(r.id);
    setForm({ funcionario: r.funcionario, data: r.data, entrada: r.entrada, saida: r.saida, horas: r.horas, status: r.status });
    setModalOpen(true);
  };

  const save = () => {
    if (!form.funcionario.trim()) return;
    if (editingId) {
      pontoService.update(editingId, form);
    } else {
      pontoService.create({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
        ...form,
      });
    }
    load();
    setModalOpen(false);
  };

  const remove = (id: string) => {
    pontoService.delete(id);
    load();
  };

  const statusLabel: Record<string, string> = {
    normal: 'Registrado',
    atraso: 'Atraso',
    hora_extra: 'Hora Extra',
  };

  const statusBadge: Record<string, string> = {
    normal: 'bg-emerald-500/20 text-emerald-400',
    atraso: 'bg-amber-500/20 text-amber-400',
    hora_extra: 'bg-blue-500/20 text-blue-400',
  };

  const presentes = registros.filter(r => r.entrada && !r.saida).length;
  const atrasos = registros.filter(r => r.status === 'atraso').length;
  const faltas = registros.filter(r => !r.entrada).length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Ponto Digital</h1>
          <p className="text-gray-400">ATHOS People - Registro de Ponto</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Registrar Ponto
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Presentes Hoje</p>
          <p className="text-2xl font-bold">{presentes}/{registros.length || 24}</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Atrasos</p>
          <p className="text-2xl font-bold text-amber-400">{atrasos}</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Faltas</p>
          <p className="text-2xl font-bold text-red-400">{faltas}</p>
        </div>
      </div>
      <div className="space-y-3">
        {registros.map((r) => (
          <div key={r.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
            <div>
              <p className="font-medium">{r.funcionario}</p>
              <p className="text-xs text-gray-400">Entrada: {r.entrada} • Saída: {r.saida || '-'}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-lg ${statusBadge[r.status] || 'bg-gray-500/20 text-gray-400'}`}>{statusLabel[r.status] || r.status}</span>
              <button onClick={() => openEdit(r)} className="p-1 text-gray-400 hover:text-blue-400"><Pencil size={14} /></button>
              <button onClick={() => remove(r.id)} className="p-1 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editingId ? 'Editar Registro' : 'Novo Registro'}</h2>
              <button onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Funcionário" value={form.funcionario} onChange={e => setForm({...form, funcionario: e.target.value})} />
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Data" value={form.data} onChange={e => setForm({...form, data: e.target.value})} />
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Entrada" value={form.entrada} onChange={e => setForm({...form, entrada: e.target.value})} />
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Saída" value={form.saida} onChange={e => setForm({...form, saida: e.target.value})} />
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Horas" type="number" step="0.25" value={form.horas} onChange={e => setForm({...form, horas: parseFloat(e.target.value) || 0})} />
            <select className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" value={form.status} onChange={e => setForm({...form, status: e.target.value as RegistroPonto['status']})}>
              <option value="normal">Normal</option>
              <option value="atraso">Atraso</option>
              <option value="hora_extra">Hora Extra</option>
            </select>
            <button onClick={save} className="w-full py-2 bg-orange-500 text-white rounded-lg font-medium">Salvar</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default PontoDigital;

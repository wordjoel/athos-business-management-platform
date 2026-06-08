import React, { useState, useEffect } from 'react';
import { Users, Plus, Pencil, Trash2, X } from 'lucide-react';
import { funcionariosService, Funcionario } from '../../services/seedData';
import { useApp } from '../../context/AppContext';

interface FuncionarioForm {
  nome: string;
  cargo: string;
  departamento: string;
  email: string;
  telefone: string;
  status: Funcionario['status'];
}

const emptyForm: FuncionarioForm = { nome: '', cargo: '', departamento: '', email: '', telefone: '', status: 'ativo' };

const Funcionarios: React.FC = () => {
  const { darkMode } = useApp();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FuncionarioForm>(emptyForm);

  const load = () => setFuncionarios(funcionariosService.getAll());

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (f: Funcionario) => {
    setEditingId(f.id);
    setForm({ nome: f.nome, cargo: f.cargo, departamento: f.departamento, email: f.email, telefone: f.telefone, status: f.status });
    setModalOpen(true);
  };

  const save = () => {
    if (!form.nome.trim()) return;
    const now = new Date().toLocaleDateString('pt-BR');
    if (editingId) {
      funcionariosService.update(editingId, form);
    } else {
      funcionariosService.create({
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 9),
        ...form,
        dataAdmissao: now,
        salario: 0,
      });
    }
    load();
    setModalOpen(false);
  };

  const remove = (id: string) => {
    funcionariosService.delete(id);
    load();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Funcionários</h1>
          <p className="text-gray-400">ATHOS People - Cadastro</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Novo Funcionário
        </button>
      </div>
      <div className="space-y-3">
        {funcionarios.map((f) => (
          <div key={f.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                {f.nome.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{f.nome}</p>
                <p className="text-xs text-gray-400">{f.cargo} • {f.departamento}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                f.status === 'ativo' ? 'bg-emerald-500/20 text-emerald-400' :
                f.status === 'ferias' ? 'bg-blue-500/20 text-blue-400' :
                'bg-red-500/20 text-red-400'
              }`}>{f.status}</span>
              <button onClick={() => openEdit(f)} className="p-1 text-gray-400 hover:text-blue-400"><Pencil size={14} /></button>
              <button onClick={() => remove(f.id)} className="p-1 text-gray-400 hover:text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editingId ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
              <button onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Cargo" value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value})} />
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Departamento" value={form.departamento} onChange={e => setForm({...form, departamento: e.target.value})} />
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <input className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Telefone" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} />
            <select className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white border border-gray-700" value={form.status} onChange={e => setForm({...form, status: e.target.value as Funcionario['status']})}>
              <option value="ativo">Ativo</option>
              <option value="ferias">Férias</option>
              <option value="afastado">Afastado</option>
            </select>
            <button onClick={save} className="w-full py-2 bg-orange-500 text-white rounded-lg font-medium">Salvar</button>
          </div>
        </div>
      )}
    </div>
  );
};
export default Funcionarios;

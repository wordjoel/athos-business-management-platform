import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Search, UserPlus, MoreVertical, Trash2, Edit2, X, Save, Shield } from 'lucide-react';

interface Usuario {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'viewer';
  sector: string;
  avatar: string;
  active: boolean;
  lastLogin: string;
}

const UsuariosPage: React.FC = () => {
  const { darkMode } = useApp();
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const saved = localStorage.getItem('athos_usuarios');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ name: '', email: '', role: 'user' as const, sector: '' });

  useEffect(() => { localStorage.setItem('athos_usuarios', JSON.stringify(usuarios)); }, [usuarios]);

  const resetForm = () => { setForm({ name: '', email: '', role: 'user', sector: '' }); setEditingId(null); setShowForm(false); };

  const saveUsuario = () => {
    if (!form.name || !form.email) return;
    const initials = form.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    if (editingId) {
      setUsuarios(prev => prev.map(u => u.id === editingId ? { ...u, ...form } : u));
    } else {
      const novo: Usuario = { id: Date.now().toString(), ...form, avatar: initials, active: true, lastLogin: 'Nunca' };
      setUsuarios(prev => [novo, ...prev]);
    }
    resetForm();
  };

  const deleteUsuario = (id: string) => {
    if (confirm('Excluir este usuário?')) setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  const toggleAtivo = (id: string) => {
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const filteredUsuarios = usuarios.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

  const roleLabels: Record<string, string> = { admin: 'Administrador', manager: 'Gerente', user: 'Usuário', viewer: 'Visualizador' };
  const roleColors: Record<string, string> = { admin: 'bg-red-500/20 text-red-400', manager: 'bg-athos-500/20 text-athos-400', user: 'bg-emerald-500/20 text-emerald-400', viewer: 'bg-gray-500/20 text-gray-400' };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Users size={24} className="text-athos-400" /> Usuários
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gestão de usuários, permissões e níveis de acesso</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-athos-500 hover:bg-athos-600 text-white text-sm font-medium">
          <UserPlus size={14} /> Novo Usuário
        </button>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200'}`}>
        <div className={`p-4 border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full max-w-sm ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <Search size={14} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar usuário..." className={`bg-transparent text-sm outline-none flex-1 ${darkMode ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`} />
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {filteredUsuarios.map(user => (
            <div key={user.id} className={`flex items-center justify-between p-5 transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold ${user.active ? 'gradient-athos' : 'bg-gray-500'}`}>{user.avatar}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                    {!user.active && <span className="text-[10px] bg-gray-500/10 text-gray-400 px-1.5 py-0.5 rounded">Inativo</span>}
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{user.email} • {user.sector}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${roleColors[user.role]}`}>{roleLabels[user.role]}</span>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{user.lastLogin}</span>
                <button onClick={() => { setEditingId(user.id); setForm({ name: user.name, email: user.email, role: user.role, sector: user.sector }); setShowForm(true); }} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><Edit2 size={14} className="text-athos-400" /></button>
                <button onClick={() => toggleAtivo(user.id)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><Shield size={14} className={user.active ? 'text-emerald-400' : 'text-gray-400'} /></button>
                <button onClick={() => deleteUsuario(user.id)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><Trash2 size={14} className="text-red-400" /></button>
              </div>
            </div>
          ))}
        </div>
        {filteredUsuarios.length === 0 && <div className="p-8 text-center"><p className={`${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhum usuário encontrado</p></div>}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} shadow-2xl`}>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{editingId ? 'Editar Usuário' : 'Novo Usuário'}</h2>
              <button onClick={resetForm} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nome *</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200'} focus:border-athos-500 outline-none`} placeholder="Nome completo" /></div>
              <div><label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email *</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200'} focus:border-athos-500 outline-none`} placeholder="email@exemplo.com" /></div>
              <div><label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Setor</label><input type="text" value={form.sector} onChange={e => setForm({ ...form, sector: e.target.value })} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200'} focus:border-athos-500 outline-none`} placeholder="Ex: Financeiro" /></div>
              <div><label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Nível de Acesso</label><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as any })} className={`w-full px-4 py-3 rounded-xl border ${darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200'} focus:border-athos-500 outline-none`}><option value="viewer">Visualizador</option><option value="user">Usuário</option><option value="manager">Gerente</option><option value="admin">Administrador</option></select></div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end gap-3">
              <button onClick={resetForm} className={`px-4 py-2 rounded-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cancelar</button>
              <button onClick={saveUsuario} disabled={!form.name || !form.email} className="px-6 py-2.5 bg-athos-500 hover:bg-athos-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"><Save size={16} /> Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosPage;
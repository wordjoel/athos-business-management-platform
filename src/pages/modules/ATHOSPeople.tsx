import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Users, Clock, FileText, GraduationCap, TrendingUp, Calendar, CheckCircle, AlertCircle, Baby, Plus, Trash2, X, Save, Mail, Phone } from 'lucide-react';

interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  email: string;
  telefone: string;
  entrada: string;
  status: 'presente' | 'ausente' | 'folga' | 'afastado';
}

const ATHOSPeople: React.FC = () => {
  const { darkMode } = useApp();

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(() => {
    const saved = localStorage.getItem('athos_funcionarios');
    return saved ? JSON.parse(saved) : [
      { id: '1', nome: 'Kleber Duarte', cargo: 'CEO', departamento: 'Administrativo', email: 'kleber@athos.com', telefone: '(11) 99999-0001', entrada: '09:00', status: 'presente' },
      { id: '2', nome: 'Luiz Victor', cargo: 'Diretor Comercial', departamento: 'Comercial', email: 'luiz@athos.com', telefone: '(11) 99999-0002', entrada: '09:00', status: 'presente' },
      { id: '3', nome: 'Joel Oliveira', cargo: 'Diretor Adm/Financeiro', departamento: 'Financeiro', email: 'joel@athos.com', telefone: '(11) 99999-0003', entrada: '09:00', status: 'presente' },
      { id: '4', nome: 'Oscar Carvalho', cargo: 'Diretor de Qualidade', departamento: 'Qualidade', email: 'oscar@athos.com', telefone: '(11) 99999-0004', entrada: '09:00', status: 'presente' },
      { id: '5', nome: 'Mauricio Baro', cargo: 'Diretor de Produtos', departamento: 'Produtos', email: 'mauricio@athos.com', telefone: '(11) 99999-0005', entrada: '09:00', status: 'presente' },
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nome: '', cargo: '', departamento: '', email: '', telefone: '' });

  useEffect(() => { localStorage.setItem('athos_funcionarios', JSON.stringify(funcionarios)); }, [funcionarios]);

  const salvarFuncionario = () => {
    if (!formData.nome || !formData.cargo) return;
    const novo: Funcionario = {
      id: Date.now().toString(),
      ...formData,
      entrada: '09:00',
      status: 'presente',
    };
    setFuncionarios([novo, ...funcionarios]);
    setFormData({ nome: '', cargo: '', departamento: '', email: '', telefone: '' });
    setShowForm(false);
  };

  const excluirFuncionario = (id: string) => {
    if (confirm('Excluir este funcionário?')) setFuncionarios(funcionarios.filter(f => f.id !== id));
  };

  const stats = [
    { title: 'Equipe', value: funcionarios.length.toString(), icon: Users, color: 'orange' },
    { title: 'Presentes', value: funcionarios.filter(f => f.status === 'presente').length.toString(), icon: CheckCircle, color: 'emerald' },
    { title: 'Ausentes', value: funcionarios.filter(f => f.status !== 'presente').length.toString(), icon: AlertCircle, color: 'red' },
    { title: 'Departamentos', value: [...new Set(funcionarios.map(f => f.departamento))].length.toString(), icon: Building2, color: 'violet' },
  ];

  const statusCores: Record<string, string> = { presente: 'emerald', ausente: 'red', folga: 'amber', afastado: 'gray' };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS People</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>RH Inteligente - Dir. Adm: Joel Oliveira</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-2">
          <Plus size={16} /> Novo Membro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={20} className={`text-${stat.color}-400`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.title}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl w-full max-w-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Novo Membro</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Nome</label>
                <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Nome completo" />
              </div>
              <div>
                <label className="text-sm">Cargo</label>
                <input type="text" value={formData.cargo} onChange={e => setFormData({ ...formData, cargo: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Cargo/Função" />
              </div>
              <div>
                <label className="text-sm">Departamento</label>
                <select value={formData.departamento} onChange={e => setFormData({ ...formData, departamento: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                  <option value="Administrativo">Administrativo</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="TI">TI</option>
                  <option value="Qualidade">Qualidade</option>
                  <option value="Produtos">Produtos</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="email@athos.com" />
              </div>
              <div>
                <label className="text-sm">Telefone</label>
                <input type="tel" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="(00) 00000-0000" />
              </div>
              <button onClick={salvarFuncionario} className="w-full py-2 bg-orange-500 rounded-lg font-medium hover:bg-orange-600 flex items-center justify-center gap-2">
                <Save size={16} /> Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <h2 className="font-semibold mb-4">Equipe ATHOS</h2>
        <div className="space-y-3">
          {funcionarios.map(func => (
            <div key={func.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                  {func.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <p className="font-medium">{func.nome}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{func.cargo} • {func.departamento}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium">{func.entrada}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{func.email}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${statusCores[func.status]}-500/20 text-${statusCores[func.status]}-400`}>
                  {func.status}
                </span>
                <button onClick={() => excluirFuncionario(func.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ATHOSPeople;
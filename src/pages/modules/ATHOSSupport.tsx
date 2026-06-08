import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Headphones, Ticket, Clock, CheckCircle, AlertTriangle, Users, Monitor, MessageSquare, Wifi, Plus, Trash2, X, Save, User } from 'lucide-react';

interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: 'critica' | 'alta' | 'media' | 'baixa';
  status: 'aberto' | 'em_andamento' | 'pendente' | 'resolvido' | 'fechado';
  solicitante: string;
  responsavel: string;
  data: string;
}

const ATHOSSupport: React.FC = () => {
  const { darkMode } = useApp();

  const [chamados, setChamados] = useState<Chamado[]>(() => {
    const saved = localStorage.getItem('athos_chamados');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ titulo: '', descricao: '', prioridade: 'media', solicitante: 'Kleber Duarte' });

  useEffect(() => { localStorage.setItem('athos_chamados', JSON.stringify(chamados)); }, [chamados]);

  const salvarChamado = () => {
    if (!formData.titulo) return;
    const novo: Chamado = {
      id: Date.now().toString(),
      ...formData,
      status: 'aberto',
      responsavel: 'Oscar Carvalho',
      data: new Date().toLocaleDateString('pt-BR'),
    };
    setChamados([novo, ...chamados]);
    setFormData({ titulo: '', descricao: '', prioridade: 'media', solicitante: 'Kleber Duarte' });
    setShowForm(false);
  };

  const excluirChamado = (id: string) => {
    if (confirm('Excluir este chamado?')) setChamados(chamados.filter(c => c.id !== id));
  };

  const stats = [
    { title: 'Abertos', value: chamados.filter(c => c.status === 'aberto').length.toString(), icon: Ticket, color: 'red' },
    { title: 'Em Andamento', value: chamados.filter(c => c.status === 'em_andamento').length.toString(), icon: Clock, color: 'amber' },
    { title: 'Resolvidos', value: chamados.filter(c => c.status === 'resolvido' || c.status === 'fechado').length.toString(), icon: CheckCircle, color: 'cyan' },
    { title: 'Total', value: chamados.length.toString(), icon: Users, color: 'violet' },
  ];

  const prioridadeCores: Record<string, string> = { critica: 'red', alta: 'amber', media: 'blue', baixa: 'gray' };
  const statusCores: Record<string, string> = { aberto: 'red', em_andamento: 'amber', pendente: 'violet', resolvido: 'emerald', fechado: 'gray' };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS Support</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Service Desk - Dir. Qualidade: Oscar Carvalho</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm font-medium hover:bg-cyan-600 flex items-center gap-2">
          <Plus size={16} /> Novo Chamado
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
              <h2 className="text-xl font-bold">Novo Chamado</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Título</label>
                <input type="text" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Título do chamado" />
              </div>
              <div>
                <label className="text-sm">Descrição</label>
                <textarea value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" rows={3} placeholder="Descrição do problema" />
              </div>
              <div>
                <label className="text-sm">Prioridade</label>
                <select value={formData.prioridade} onChange={e => setFormData({ ...formData, prioridade: e.target.value as any })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                  <option value="critica">Crítica</option>
                  <option value="alta">Alta</option>
                  <option value="media">Média</option>
                  <option value="baixa">Baixa</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Solicitante</label>
                <select value={formData.solicitante} onChange={e => setFormData({ ...formData, solicitante: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                  <option value="Kleber Duarte">Kleber Duarte - CEO</option>
                  <option value="Luiz Victor">Luiz Victor - Comercial</option>
                  <option value="Joel Oliveira">Joel Oliveira - Adm/Financeiro</option>
                  <option value="Oscar Carvalho">Oscar Carvalho - Qualidade</option>
                  <option value="Mauricio Baro">Mauricio Baro - Produtos</option>
                </select>
              </div>
              <button onClick={salvarChamado} className="w-full py-2 bg-cyan-500 rounded-lg font-medium hover:bg-cyan-600 flex items-center justify-center gap-2">
                <Save size={16} /> Abrir Chamado
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <h2 className="font-semibold mb-4">Chamados Recentes</h2>
        <div className="space-y-3">
          {chamados.map(ch => (
            <div key={ch.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${prioridadeCores[ch.prioridade]}-500/20`}>
                  <Ticket size={18} className={`text-${prioridadeCores[ch.prioridade]}-400`} />
                </div>
                <div>
                  <p className="font-medium">{ch.titulo}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ch.solicitante} • {ch.data}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${prioridadeCores[ch.prioridade]}-500/20 text-${prioridadeCores[ch.prioridade]}-400`}>
                  {ch.prioridade}
                </span>
                <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${statusCores[ch.status]}-500/20 text-${statusCores[ch.status]}-400`}>
                  {ch.status.replace('_', ' ')}
                </span>
                <button onClick={() => excluirChamado(ch.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400">
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

export default ATHOSSupport;
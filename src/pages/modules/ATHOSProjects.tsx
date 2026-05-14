import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Kanban, GanttChart, Users, CheckSquare, Clock, TrendingUp, Play, Pause, CheckCircle, AlertCircle, Plus, Trash2, X, Save } from 'lucide-react';

interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  status: 'planejamento' | 'em_andamento' | 'pausado' | 'concluido';
  responsavel: string;
  progresso: number;
  dataInicio: string;
  dataFim: string;
}

const ATHOSProjects: React.FC = () => {
  const { darkMode } = useApp();

  const [projetos, setProjetos] = useState<Projeto[]>(() => {
    const saved = localStorage.getItem('athos_projetos');
    return saved ? JSON.parse(saved) : [
      { id: '1', nome: 'ATHOS Platform v2.0', descricao: 'Nova versão da plataforma', status: 'em_andamento', responsavel: 'Kleber Duarte', progresso: 65, dataInicio: '01/04', dataFim: '30/06' },
      { id: '2', nome: 'App Mobile ATHOS', descricao: 'Aplicativo mobile', status: 'em_andamento', responsavel: 'Mauricio Baro', progresso: 40, dataInicio: '15/04', dataFim: '15/08' },
      { id: '3', nome: 'Integração WhatsApp API', descricao: 'Conexão com WhatsApp Business', status: 'concluido', responsavel: 'Oscar Carvalho', progresso: 100, dataInicio: '01/03', dataFim: '01/05' },
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nome: '', descricao: '', responsavel: 'Kleber Duarte', dataInicio: '', dataFim: '' });

  useEffect(() => { localStorage.setItem('athos_projetos', JSON.stringify(projetos)); }, [projetos]);

  const salvarProjeto = () => {
    if (!formData.nome) return;
    const novo: Projeto = {
      id: Date.now().toString(),
      ...formData,
      status: 'planejamento',
      progresso: 0,
    };
    setProjetos([novo, ...projetos]);
    setFormData({ nome: '', descricao: '', responsavel: 'Kleber Duarte', dataInicio: '', dataFim: '' });
    setShowForm(false);
  };

  const excluirProjeto = (id: string) => {
    if (confirm('Excluir este projeto?')) setProjetos(projetos.filter(p => p.id !== id));
  };

  const stats = [
    { title: 'Em Andamento', value: projetos.filter(p => p.status === 'em_andamento').length.toString(), icon: Play, color: 'blue' },
    { title: 'Concluídos', value: projetos.filter(p => p.status === 'concluido').length.toString(), icon: CheckCircle, color: 'emerald' },
    { title: 'Planejamento', value: projetos.filter(p => p.status === 'planejamento').length.toString(), icon: Clock, color: 'amber' },
    { title: 'Média Progresso', value: `${Math.round(projetos.reduce((s, p) => s + p.progresso, 0) / projetos.length)}%`, icon: TrendingUp, color: 'violet' },
  ];

  const statusCores: Record<string, string> = { planejamento: 'gray', em_andamento: 'blue', pausado: 'amber', concluido: 'emerald' };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS Projects</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gestão de Projetos - Dir. Produtos: Mauricio Baro</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center gap-2">
          <Plus size={16} /> Novo Projeto
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
              <h2 className="text-xl font-bold">Novo Projeto</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Nome do Projeto</label>
                <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Nome do projeto" />
              </div>
              <div>
                <label className="text-sm">Descrição</label>
                <textarea value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" rows={2} placeholder="Descrição" />
              </div>
              <div>
                <label className="text-sm">Responsável</label>
                <select value={formData.responsavel} onChange={e => setFormData({ ...formData, responsavel: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                  <option value="Kleber Duarte">Kleber Duarte - CEO</option>
                  <option value="Mauricio Baro">Mauricio Baro - Produtos</option>
                  <option value="Oscar Carvalho">Oscar Carvalho - Qualidade</option>
                  <option value="Luiz Victor">Luiz Victor - Comercial</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Início</label>
                  <input type="date" value={formData.dataInicio} onChange={e => setFormData({ ...formData, dataInicio: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" />
                </div>
                <div>
                  <label className="text-sm">Previsão Fim</label>
                  <input type="date" value={formData.dataFim} onChange={e => setFormData({ ...formData, dataFim: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" />
                </div>
              </div>
              <button onClick={salvarProjeto} className="w-full py-2 bg-blue-500 rounded-lg font-medium hover:bg-blue-600 flex items-center justify-center gap-2">
                <Save size={16} /> Criar Projeto
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <h2 className="font-semibold mb-4">Projetos</h2>
        <div className="space-y-4">
          {projetos.map(proj => (
            <div key={proj.id} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{proj.nome}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{proj.descricao}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${statusCores[proj.status]}-500/20 text-${statusCores[proj.status]}-400`}>
                    {proj.status.replace('_', ' ')}
                  </span>
                  <button onClick={() => excluirProjeto(proj.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Responsável: {proj.responsavel}</span>
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{proj.dataInicio} - {proj.dataFim}</span>
              </div>
              <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className={`h-2 rounded-full ${proj.progresso === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${proj.progresso}%` }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Progresso</span>
                <span className={`text-xs font-medium ${proj.progresso === 100 ? 'text-emerald-400' : 'text-blue-400'}`}>{proj.progresso}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ATHOSProjects;
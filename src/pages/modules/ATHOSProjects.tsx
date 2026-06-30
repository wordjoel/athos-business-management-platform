import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Kanban, GanttChart, Users, CheckSquare, Clock, TrendingUp, Play, Pause, CheckCircle, AlertTriangle, Plus, Trash2, X, Save, Edit2, Eye, Calendar, Target, Lightbulb } from 'lucide-react';

interface Tarefa {
  id: string;
  titulo: string;
  responsavel: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'bloqueada';
  prioridade: 'critica' | 'alta' | 'media' | 'baixa';
  prazo: string;
  tipo?: 'epic' | 'story' | 'bug' | 'task';
  pontos?: number;
  epicId?: string;
  sprint?: string;
}

interface Sprint {
  id: string;
  nome: string;
  dataInicio: string;
  dataFim: string;
  status: 'planejamento' | 'em_andamento' | 'concluido';
}

interface Projeto {
  id: string;
  nome: string;
  descricao: string;
  status: 'planejamento' | 'em_andamento' | 'problemas' | 'aguardando' | 'concluido' | 'arquivado';
  responsavel: string;
  progresso: number;
  dataInicio: string;
  dataFim: string;
  tarefas: Tarefa[];
  equipe: string[];
  sprints?: Sprint[];
  roadmap?: string;
}

const ATHOSProjects: React.FC = () => {
  const { darkMode, usuarioLogado } = useApp();

  const [projetos, setProjetos] = useState<Projeto[]>(() => {
    const saved = localStorage.getItem('athos_projetos');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState<Projeto | null>(null);
  const [formData, setFormData] = useState({ nome: '', descricao: '', responsavel: usuarioLogado?.nome || 'Kleber Duarte', dataInicio: '', dataFim: '', equipe: '' });
  const [filtroStatus, setFiltroStatus] = useState('todos');

  useEffect(() => { localStorage.setItem('athos_projetos', JSON.stringify(projetos)); }, [projetos]);

  const salvarProjeto = () => {
    if (!formData.nome) return;
    const novo: Projeto = {
      id: Date.now().toString(),
      nome: formData.nome,
      descricao: formData.descricao,
      status: 'planejamento',
      responsavel: formData.responsavel,
      progresso: 0,
      dataInicio: formData.dataInicio || new Date().toLocaleDateString('pt-BR'),
      dataFim: formData.dataFim || '',
      equipe: formData.equipe.split(',').map(e => e.trim()).filter(e => e),
      tarefas: [],
    };
    setProjetos([novo, ...projetos]);
    setFormData({ nome: '', descricao: '', responsavel: usuarioLogado?.nome || 'Kleber Duarte', dataInicio: '', dataFim: '', equipe: '' });
    setShowForm(false);
  };

  const atualizarProjeto = (id: string, campo: string, valor: any) => {
    setProjetos(projetos.map(p => p.id === id ? { ...p, [campo]: valor } : p));
  };

  const excluirProjeto = (id: string) => {
    if (confirm('Excluir este projeto?')) setProjetos(projetos.filter(p => p.id !== id));
  };

  const adicionarTarefa = (projetoId: string, tipo: 'task' | 'epic' | 'story' | 'bug' = 'task') => {
    const projeto = projetos.find(p => p.id === projetoId);
    if (!projeto) return;
    const novaTarefa: Tarefa = {
      id: Date.now().toString(),
      titulo: tipo === 'epic' ? 'Novo Epic' : tipo === 'story' ? 'Nova Story' : tipo === 'bug' ? 'Novo Bug' : 'Nova tarefa',
      responsavel: usuarioLogado?.nome || '',
      status: 'pendente',
      prioridade: tipo === 'bug' ? 'alta' : 'media',
      prazo: '',
      tipo,
      pontos: tipo === 'story' ? 3 : undefined,
    };
    atualizarProjeto(projetoId, 'tarefas', [...projeto.tarefas, novaTarefa]);
  };

  const statusLabels: Record<string, { label: string; cor: string }> = {
    planejamento: { label: 'Planejamento', cor: 'gray' },
    em_andamento: { label: 'Em Andamento', cor: 'blue' },
    problemas: { label: 'Problemas', cor: 'red' },
    aguardando: { label: 'Aguardando', cor: 'amber' },
    concluido: { label: 'Concluído', cor: 'emerald' },
    arquivado: { label: 'Arquivado', cor: 'gray' },
  };

  const projetosFiltrados = filtroStatus === 'todos' ? projetos : projetos.filter(p => p.status === filtroStatus);

  const totalTarefas = projetos.reduce((s, p) => s + p.tarefas.length, 0);
  const epics = projetos.flatMap(p => p.tarefas.filter(t => t.tipo === 'epic'));
  const stories = projetos.flatMap(p => p.tarefas.filter(t => t.tipo === 'story'));
  const bugs = projetos.flatMap(p => p.tarefas.filter(t => t.tipo === 'bug'));
  const pontosTotal = projetos.flatMap(p => p.tarefas).reduce((s, t) => s + (t.pontos || 0), 0);

  const stats = [
    { title: 'Projetos', value: projetos.length, icon: Kanban, color: 'cyan' },
    { title: 'Epics', value: epics.length, icon: Target, color: 'violet' },
    { title: 'Stories', value: stories.length, icon: CheckSquare, color: 'blue' },
    { title: 'Bugs', value: bugs.length, icon: AlertTriangle, color: 'red' },
    { title: 'Story Points', value: pontosTotal, icon: TrendingUp, color: 'amber' },
    { title: 'Concluídos', value: projetos.filter(p => p.status === 'concluido').length, icon: CheckCircle, color: 'emerald' },
  ];

  const sugestoes = [
    { tipo: 'alerta', texto: 'App Mobile está com problema - verificar tarefa bloqueada', impacto: 'alto' },
    { tipo: 'sugestao', texto: 'ATHOS Platform v2.0 pode receber módulo de IA adicional', impacto: 'medio' },
    { tipo: 'insight', texto: '3 projetos próximos do prazo - revisar entregas', impacto: 'alto' },
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ATHOS Projects</h1>
          <p className="text-sm text-gray-500">Gestão de Projetos Ágeis</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Novo Projeto
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {Object.entries(statusLabels).map(([key, val]) => (
          <button key={key} onClick={() => setFiltroStatus(key)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filtroStatus === key ? `bg-${val.cor}-500 text-white` : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {val.label}
          </button>
        ))}
        <button onClick={() => setFiltroStatus('todos')} className={`px-3 py-1 rounded-full text-xs font-medium ${filtroStatus === 'todos' ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-gray-400'}`}>Todos</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-800/40 p-3 rounded-xl border border-white/5">
            <stat.icon size={16} className={`text-${stat.color}-400 mb-1`} />
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-5 rounded-xl w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Novo Projeto</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} placeholder="Nome do projeto" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <textarea value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} placeholder="Descrição" rows={2} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={formData.dataInicio} onChange={e => setFormData({ ...formData, dataInicio: e.target.value })} className="px-2 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-xs" />
                <input type="date" value={formData.dataFim} onChange={e => setFormData({ ...formData, dataFim: e.target.value })} className="px-2 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-xs" />
              </div>
              <input type="text" value={formData.equipe} onChange={e => setFormData({ ...formData, equipe: e.target.value })} placeholder="Equipe (separar por vírgula)" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <button onClick={salvarProjeto} className="w-full py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">Criar Projeto</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-800/30 p-4 rounded-xl border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={16} className="text-amber-400" />
          <h3 className="text-sm font-medium text-white">Sugestões da IA</h3>
        </div>
        <div className="space-y-2">
          {sugestoes.map((s, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-gray-400">{s.texto}</span>
              <span className={`px-2 py-0.5 rounded ${s.impacto === 'alto' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{s.impacto}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {projetosFiltrados.map(proj => (
          <div key={proj.id} className="bg-gray-800/40 rounded-xl border border-white/5 overflow-hidden">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{proj.nome}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium bg-${statusLabels[proj.status].cor}-500/20 text-${statusLabels[proj.status].cor}-400`}>
                      {statusLabels[proj.status].label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{proj.descricao}</p>
                </div>
                <button onClick={() => excluirProjeto(proj.id)} className="p-1.5 text-gray-600 hover:text-red-400"><Trash2 size={14} /></button>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Calendar size={12} /> {proj.dataInicio} - {proj.dataFim}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {proj.equipe.length} membros</span>
                <span className="flex items-center gap-1"><Target size={12} /> {proj.progresso}%</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${proj.progresso === 100 ? 'bg-emerald-500' : proj.status === 'problemas' ? 'bg-red-500' : 'bg-cyan-500'}`} style={{ width: `${proj.progresso}%` }} />
                </div>
                <button onClick={() => { setProjetoSelecionado(proj); setShowEdit(true); }} className="p-1 text-gray-500 hover:text-white"><Edit2 size={12} /></button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {proj.equipe.map((m, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-700/50 rounded text-[10px] text-gray-400">{m.split(' ')[0]}</span>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Tarefas ({proj.tarefas.length})</span>
                  <button onClick={() => adicionarTarefa(proj.id)} className="text-xs text-cyan-400 hover:text-cyan-300">+ Adicionar</button>
                </div>
                <div className="space-y-1">
                  {proj.tarefas.map(t => (
                    <div key={t.id} className="flex items-center justify-between text-xs p-2 bg-gray-700/30 rounded">
                      <div className="flex items-center gap-2">
                        <CheckSquare size={12} className={t.status === 'concluida' ? 'text-emerald-400' : t.status === 'bloqueada' ? 'text-red-400' : 'text-gray-500'} />
                        <span className={t.status === 'concluida' ? 'text-gray-500 line-through' : 'text-gray-300'}>{t.titulo}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{t.responsavel.split(' ')[0]}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${
                          t.prioridade === 'critica' ? 'bg-red-500/20 text-red-400' :
                          t.prioridade === 'alta' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-gray-600 text-gray-400'
                        }`}>{t.prioridade}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ATHOSProjects;
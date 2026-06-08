import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { 
  Package, Plus, Search, Filter, Star, Trophy, 
  Target, Clock, CheckCircle, XCircle, Upload, 
  Link2, GitBranch, Code, Briefcase, GraduationCap,
  Megaphone, PenTool, Lightbulb, Zap, Award, TrendingUp
} from 'lucide-react';

interface Project {
  id: string;
  titulo: string;
  descricao: string;
  categoria: string;
  tipo: 'web' | 'mobile' | 'desktop' | 'api' | 'outro';
  status: 'rascunho' | 'submetido' | 'avaliacao' | 'aprovado' | 'rejeitado';
  pontos: number;
  tags: string[];
  url?: string;
  repositorio?: string;
  submittedAt: string;
  evaluatedAt?: string;
  avaliador?: string;
  feedback?: string;
 submitter: {
    nome: string;
    email: string;
    avatar: string;
  };
}

interface Category {
  id: string;
  nome: string;
  icone: React.ReactNode;
  descricao: string;
  pontuacaoMin: number;
  pontuacaoMax: number;
  cor: string;
}

const categories: Category[] = [
  { id: 'web', nome: 'Desenvolvimento Web', icone: <Code size={20} />, descricao: 'Sites, portais, dashboards', pontuacaoMin: 10, pontuacaoMax: 100, cor: 'bg-blue-500' },
  { id: 'mobile', nome: 'Aplicativo Mobile', icone: <Package size={20} />, descricao: 'Apps iOS e Android', pontuacaoMin: 20, pontuacaoMax: 150, cor: 'bg-purple-500' },
  { id: 'api', nome: 'API & Backend', icone: <Link2 size={20} />, descricao: 'Serviços, microsserviços', pontuacaoMin: 15, pontuacaoMax: 80, cor: 'bg-green-500' },
  { id: 'automation', nome: 'Automação', icone: <Zap size={20} />, descricao: 'RPA, scripts, workflows', pontuacaoMin: 10, pontuacaoMax: 60, cor: 'bg-yellow-500' },
  { id: 'ai', nome: 'Inteligência Artificial', icone: <Lightbulb size={20} />, descricao: 'ML, IA, chatbots', pontuacaoMin: 30, pontuacaoMax: 200, cor: 'bg-pink-500' },
  { id: 'design', nome: 'UI/UX Design', icone: <PenTool size={20} />, descricao: 'Interfaces, protótipos', pontuacaoMin: 10, pontuacaoMax: 70, cor: 'bg-indigo-500' },
  { id: 'infra', nome: 'Infraestrutura', icone: <GitBranch size={20} />, descricao: 'DevOps, cloud, containers', pontuacaoMin: 20, pontuacaoMax: 100, cor: 'bg-orange-500' },
  { id: 'business', nome: 'Gestão Empresarial', icone: <Briefcase size={20} />, descricao: 'ERP, CRM, gestão', pontuacaoMin: 15, pontuacaoMax: 120, cor: 'bg-teal-500' },
];

const mockProjects: Project[] = [];

const CambomSharePoints: React.FC = () => {
  const { darkMode } = useApp();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'submit' | 'projects' | 'ranking'>('submit');
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    tipo: 'web' as const,
    url: '',
    repositorio: '',
    tags: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject: Project = {
      id: Date.now().toString(),
      titulo: formData.titulo,
      descricao: formData.descricao,
      categoria: formData.categoria,
      tipo: formData.tipo,
      status: 'submetido',
      pontos: 0,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      url: formData.url || undefined,
      repositorio: formData.repositorio || undefined,
      submittedAt: new Date().toISOString(),
      submitter: {
        nome: user?.nome || 'Usuário',
        email: user?.email || '',
        avatar: user?.avatar || 'US',
      },
    };

    setProjects([newProject, ...projects]);
    setShowModal(false);
    setFormData({ titulo: '', descricao: '', categoria: '', tipo: 'web', url: '', repositorio: '', tags: '' });
    
    addToast({
      type: 'success',
      title: 'Projeto Submetido!',
      message: 'Seu projeto foi enviado para avaliação',
    });
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.descricao.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || p.categoria === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const ranking = [...projects]
    .filter(p => p.status === 'aprovado')
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 10);

  const stats = {
    total: projects.length,
    approved: projects.filter(p => p.status === 'aprovado').length,
    pending: projects.filter(p => p.status === 'submetido' || p.status === 'avaliacao').length,
    totalPoints: projects.reduce((acc, p) => acc + p.pontos, 0),
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'rejeitado': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'avaliacao': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'submetido': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aprovado': return 'Aprovado';
      case 'rejeitado': return 'Rejeitado';
      case 'avaliacao': return 'Em Avaliação';
      case 'submetido': return 'Submetido';
      case 'rascunho': return 'Rascunho';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Cambom Share Points
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Submeta e avalie projetos da comunidade
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
        >
          <Plus size={18} />
          Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Package className="text-cyan-400" size={20} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.total}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Projetos</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="text-emerald-400" size={20} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.approved}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Aprovados</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Clock className="text-amber-400" size={20} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.pending}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pendentes</p>
            </div>
          </div>
        </div>
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
              <Star className="text-violet-400" size={20} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalPoints}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pontos Total</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-1 rounded-xl inline-flex ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <button
          onClick={() => setActiveTab('submit')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'submit' 
              ? 'bg-cyan-600 text-white' 
              : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Upload size={16} className="inline mr-2" />
          Submeter
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'projects' 
              ? 'bg-cyan-600 text-white' 
              : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package size={16} className="inline mr-2" />
          Projetos
        </button>
        <button
          onClick={() => setActiveTab('ranking')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'ranking' 
              ? 'bg-cyan-600 text-white' 
              : darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Trophy size={16} className="inline mr-2" />
          Ranking
        </button>
      </div>

      {activeTab === 'submit' && (
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Como Funciona
          </h2>
          <div className="grid grid-cols-4 gap-4">
            {categories.slice(0, 4).map(cat => (
              <div key={cat.id} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                <div className={`w-10 h-10 rounded-lg ${cat.cor} flex items-center justify-center text-white mb-2`}>
                  {cat.icone}
                </div>
                <h3 className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cat.nome}</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{cat.descricao}</p>
                <p className={`text-xs mt-2 text-cyan-400`}>{cat.pontuacaoMin}-{cat.pontuacaoMax} pts</p>
              </div>
            ))}
          </div>
          <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-cyan-900/20 border border-cyan-500/20' : 'bg-cyan-50 border border-cyan-200'}`}>
            <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Pontuação por Categoria</h3>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${cat.cor}`} />
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{cat.nome}</span>
                  <span className={`text-xs font-medium ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{cat.pontuacaoMin}-{cat.pontuacaoMax}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                } focus:outline-none focus:border-cyan-500`}
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`px-4 py-2.5 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
              } focus:outline-none focus:border-cyan-500`}
            >
              <option value="all">Todas Categorias</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className={`p-5 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.titulo}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                      {project.pontos > 0 && (
                        <span className="flex items-center gap-1 text-sm font-bold text-amber-400">
                          <Star size={14} fill="currentColor" />
                          {project.pontos}
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.descricao}</p>
                    <div className="flex items-center gap-2 mt-3">
                      {project.tags.map(tag => (
                        <span key={tag} className={`px-2 py-0.5 rounded text-xs ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 flex items-center justify-center text-gray-900 text-xs font-bold">
                      {project.submitter.avatar}
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.submitter.nome}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(project.submittedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
                {project.feedback && (
                  <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-emerald-900/20' : 'bg-emerald-50'}`}>
                    <p className={`text-xs ${darkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      <span className="font-medium">Feedback:</span> {project.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ranking' && (
        <div className={`p-6 rounded-xl border ${darkMode ? 'bg-gray-800/50 border-white/10' : 'bg-white border-gray-200'}`}>
          <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Trophy size={20} className="inline mr-2 text-amber-400" />
            Top Projetos Avaliados
          </h2>
          <div className="space-y-3">
            {ranking.map((project, index) => (
              <div
                key={project.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index < 3 ? (darkMode ? 'bg-amber-900/20' : 'bg-amber-50') : (darkMode ? 'bg-gray-900/30' : 'bg-gray-50')
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-amber-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-600 text-white' :
                    darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{project.titulo}</h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{project.submitter.nome}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-amber-400" size={18} fill="currentColor" />
                  <span className="text-xl font-bold text-amber-400">{project.pontos}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className={`relative w-full max-w-lg p-6 rounded-2xl ${
            darkMode ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-200'
          }`}>
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Novo Projeto
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Título do Projeto
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:border-cyan-500`}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Descrição
                </label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:border-cyan-500`}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Categoria
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                    } focus:outline-none focus:border-cyan-500`}
                    required
                  >
                    <option value="">Selecione</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.nome}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tipo
                  </label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                    } focus:outline-none focus:border-cyan-500`}
                  >
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="desktop">Desktop</option>
                    <option value="api">API</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  URL do Projeto (opcional)
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:border-cyan-500`}
                  placeholder="https://"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Repositório (opcional)
                </label>
                <input
                  type="url"
                  value={formData.repositorio}
                  onChange={(e) => setFormData({ ...formData, repositorio: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:border-cyan-500`}
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tags (separadas por vírgula)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-lg border ${
                    darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:border-cyan-500`}
                  placeholder="React, Node.js, PostgreSQL"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`flex-1 py-2.5 rounded-lg border ${
                    darkMode ? 'border-white/10 text-gray-400 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  } transition-colors`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition-colors"
                >
                  Submeter Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CambomSharePoints;
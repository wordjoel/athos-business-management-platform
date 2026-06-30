import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Bell, Calendar, DollarSign, Wallet,
  CheckSquare, Clock, FileText,
  Plus, BrainCircuit, Users, RefreshCw, ChevronRight, Camera,
  Briefcase, CheckCircle2, X, Play
} from 'lucide-react';
import { getLancamentos } from '../../services/lancamentoService';
import { tarefasService } from '../../services/seedData';

const MobileHome: React.FC = () => {
  const { user } = useAuth();
  const { darkMode, toggleAIPanel } = useApp();
  const navigate = useNavigate();

  const isMobileDomain = 
    window.location.hostname.startsWith('m.') || 
    window.location.hostname.startsWith('app.') ||
    window.location.hostname.includes('mobile') ||
    window.location.search.includes('pwa=true') ||
    window.location.search.includes('mobile=true');

  const getMobilePath = (path: string) => {
    if (isMobileDomain) {
      return path.replace(/^\/m/, '') || '/';
    }
    return path;
  };

  // States
  const [tasks, setTasks] = useState<any[]>([]);
  const [cashFlow, setCashFlow] = useState({ receita: 0, despesa: 0, saldo: 0 });
  const [projects, setProjects] = useState<any[]>([]);
  const [showFABMenu, setShowFABMenu] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState<'receita' | 'despesa' | 'lead' | 'projeto' | 'ocr' | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);
  const [ocrData, setOcrData] = useState<any>(null);

  // Form states
  const [financeForm, setFinanceForm] = useState({ descricao: '', valor: '', categoria: 'Serviços', contraparte: '' });
  const [leadForm, setLeadForm] = useState({ nome: '', empresa: '', valor: '' });
  const [projectForm, setProjectForm] = useState({ nome: '', descricao: '', equipe: '' });

  // Load data
  const loadData = () => {
    // Tasks
    setTasks(tarefasService.getAll().slice(0, 3));

    // Cash flow values
    const lancs = getLancamentos();
    const rec = lancs.filter(l => l.tipo === 'receita').reduce((s, l) => s + l.valor, 0);
    const desp = lancs.filter(l => l.tipo === 'despesa').reduce((s, l) => s + l.valor, 0);
    setCashFlow({ receita: rec, despesa: desp, saldo: rec - desp });

    // Projects (load from local storage)
    const savedProj = localStorage.getItem('athos_projetos');
    const projList = savedProj ? JSON.parse(savedProj) : [
      { id: '1', nome: 'Plataforma PWA', progresso: 45, responsavel: 'Kleber Duarte' },
      { id: '2', nome: 'Integração Supabase', progresso: 80, responsavel: 'Joel Oliveira' },
      { id: '3', nome: 'Controle de Qualidade', progresso: 15, responsavel: 'Oscar Carvalho' }
    ];
    setProjects(projList.slice(0, 3));
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleTask = (id: string) => {
    const all = tarefasService.getAll();
    const task = all.find(t => t.id === id);
    if (task) {
      tarefasService.update(id, { status: task.status === 'concluida' ? 'pendente' : 'concluida' });
      loadData();
    }
  };

  const handleSaveFinance = (tipo: 'receita' | 'despesa') => {
    if (!financeForm.descricao || !financeForm.valor) return;
    const value = parseFloat(financeForm.valor);
    const lancs = getLancamentos();
    const newLanc = {
      id: Date.now().toString(),
      tipo,
      descricao: financeForm.descricao,
      valor: value,
      contraparte: financeForm.contraparte || 'Geral',
      vencimento: new Date().toISOString().slice(0, 10),
      data: new Date().toISOString().slice(0, 10),
      status: tipo === 'receita' ? 'recebido' : 'pago',
      categoria: financeForm.categoria,
      criadaEm: new Date().toISOString()
    };
    localStorage.setItem('athos_lancamentos', JSON.stringify([newLanc, ...lancs]));
    loadData();
    setFinanceForm({ descricao: '', valor: '', categoria: 'Serviços', contraparte: '' });
    setShowQuickForm(null);
  };

  const handleSaveLead = () => {
    if (!leadForm.nome || !leadForm.empresa) return;
    const value = parseFloat(leadForm.valor) || 0;
    const saved = localStorage.getItem('athos_leads');
    const list = saved ? JSON.parse(saved) : [];
    const novo = {
      id: Date.now().toString(),
      nome: leadForm.nome,
      empresa: leadForm.empresa,
      valor: value,
      etapa: 'novo',
      responsavel: user?.nome || 'Kleber Duarte',
      ultimoContato: new Date().toLocaleDateString('pt-BR'),
      email: '',
      telefone: ''
    };
    localStorage.setItem('athos_leads', JSON.stringify([novo, ...list]));
    setLeadForm({ nome: '', empresa: '', valor: '' });
    setShowQuickForm(null);
  };

  const handleSaveProject = () => {
    if (!projectForm.nome) return;
    const saved = localStorage.getItem('athos_projetos');
    const list = saved ? JSON.parse(saved) : [];
    const novo = {
      id: Date.now().toString(),
      nome: projectForm.nome,
      descricao: projectForm.descricao,
      status: 'planejamento',
      responsavel: user?.nome || 'Kleber Duarte',
      progresso: 0,
      dataInicio: new Date().toLocaleDateString('pt-BR'),
      dataFim: '',
      equipe: projectForm.equipe.split(',').map(e => e.trim()).filter(e => e),
      tarefas: []
    };
    localStorage.setItem('athos_projetos', JSON.stringify([novo, ...list]));
    loadData();
    setProjectForm({ nome: '', descricao: '', equipe: '' });
    setShowQuickForm(null);
  };

  const handleStartOCR = () => {
    setOcrLoading(true);
    setOcrSuccess(false);
    setTimeout(() => {
      setOcrLoading(false);
      setOcrSuccess(true);
      setOcrData({
        tipo: 'Nota Fiscal',
        descricao: 'AWS Cloud Services - Junho 2026',
        valor: '1.248,50',
        categoria: 'Tecnologia',
        contraparte: 'Amazon Web Services'
      });
      setFinanceForm({
        descricao: 'AWS Cloud Services - Junho 2026',
        valor: '1248.50',
        categoria: 'Tecnologia',
        contraparte: 'Amazon Web Services'
      });
    }, 2000);
  };

  const handleSaveOCRToFinance = () => {
    handleSaveFinance('despesa');
    setOcrSuccess(false);
    setOcrData(null);
  };

  // Static meetings
  const meetings = [
    { time: '14:00', title: 'Alinhamento de Desenvolvimento', room: 'Virtual Meet', color: 'border-cyan-500' },
    { time: '16:30', title: 'Apresentação de Indicadores', room: 'Sala Conselheiros', color: 'border-amber-500' }
  ];

  // Static documents
  const docs = [
    { title: 'NDA - Projeto Athena.pdf', size: '1.4 MB', date: 'Hoje' },
    { title: 'Contrato Prestação de Serviços.pdf', size: '4.2 MB', date: 'Ontem' }
  ];

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Executivo */}
      <div className={`p-5 rounded-3xl ${darkMode ? 'bg-gradient-to-r from-gray-900 via-gray-900 to-athos-950/40 border border-white/5 shadow-lg' : 'bg-gradient-to-r from-white to-gray-50 border border-gray-200 shadow-sm'} relative overflow-hidden`}>
        {/* Orbs de fundo */}
        <div className="absolute top-[-50px] right-[-50px] w-32 h-32 rounded-full bg-cyan-500/10 filter blur-xl pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[-50px] w-32 h-32 rounded-full bg-violet-500/10 filter blur-xl pointer-events-none" />

        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Escritório Virtual</span>
            <h2 className="text-2xl font-bold tracking-tight">Bom dia, {user?.nome?.split(' ')[0] || 'Sócio'}</h2>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {user?.nome === 'Kleber Duarte' || user?.nome === 'Joel Oliveira' || user?.nome === 'Oscar Carvalho' ? 'Sócio • ' : ''} 
              ATHOS Solution
            </p>
          </div>
          <button className={`p-2.5 rounded-full ${darkMode ? 'bg-gray-800/80 border border-white/5 text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-all relative`}>
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
        </div>
      </div>

      {/* Alertas de IA */}
      <div className={`p-4 rounded-2xl bg-gradient-to-r from-violet-600/10 to-indigo-600/10 border border-violet-500/20 backdrop-blur-xl relative`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
            <BrainCircuit size={18} className="animate-pulse" />
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="text-xs font-bold text-violet-300 flex items-center gap-1.5">
              ATHOS AI <Sparkles size={12} className="text-amber-400" />
            </h4>
            <p className={`text-xs leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Previsão positiva de faturamento de <strong>+9%</strong> para Junho. Recomendo analisar 3 contratos com vencimento próximo.
            </p>
          </div>
          <button onClick={() => navigate(getMobilePath('/m/ai'))} className="text-xs text-violet-400 font-semibold flex items-center gap-0.5 hover:underline whitespace-nowrap self-center">
            Ver <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Fluxo de Caixa Widget */}
      <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-gray-900/40 border-white/5' : 'bg-white border-gray-200 shadow-sm'} space-y-4`}>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Wallet size={16} className="text-cyan-400" /> Fluxo de Caixa
          </h3>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cashFlow.saldo >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {cashFlow.saldo >= 0 ? 'Saldo Positivo' : 'Saldo Negativo'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-[10px] text-gray-500 font-medium">Receitas</p>
            <p className="text-xs font-bold text-emerald-400 mt-1">{formatCurrency(cashFlow.receita)}</p>
          </div>
          <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
            <p className="text-[10px] text-gray-500 font-medium">Despesas</p>
            <p className="text-xs font-bold text-red-400 mt-1">{formatCurrency(cashFlow.despesa)}</p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
            <p className="text-[10px] text-gray-500 font-medium">Líquido</p>
            <p className={`text-xs font-bold mt-1 ${cashFlow.saldo >= 0 ? 'text-cyan-400' : 'text-rose-500'}`}>
              {formatCurrency(cashFlow.saldo)}
            </p>
          </div>
        </div>
      </div>

      {/* Agenda & Reuniões */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Calendar size={16} className="text-purple-400" /> Agenda de Hoje
          </h3>
          <span className="text-xs text-gray-500 font-medium">2 reuniões</span>
        </div>
        <div className="space-y-2.5">
          {meetings.map((meet, i) => (
            <div key={i} className={`p-4 rounded-xl border-l-4 ${meet.color} ${darkMode ? 'bg-gray-900/40 border-y border-r border-white/5' : 'bg-white border-y border-r border-gray-200 shadow-sm'} flex justify-between items-center`}>
              <div className="space-y-1">
                <p className="text-xs font-bold">{meet.title}</p>
                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  <Clock size={10} /> {meet.time} • {meet.room}
                </p>
              </div>
              <button className="p-2 rounded-full bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20">
                <Play size={10} fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Pendências / Tarefas */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <CheckSquare size={16} className="text-orange-400" /> Tarefas Pendentes
          </h3>
          <span onClick={() => navigate(getMobilePath('/m/tarefas'))} className="text-xs text-cyan-400 font-medium cursor-pointer hover:underline">Ver tudo</span>
        </div>
        <div className="space-y-2">
          {tasks.map(t => (
            <div key={t.id} className={`flex items-center gap-3 p-3.5 rounded-xl border ${darkMode ? 'bg-gray-900/40 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
              <button onClick={() => toggleTask(t.id)} className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                t.status === 'concluida' ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-500/50 text-transparent'
              }`}>
                <CheckCircle2 size={12} fill="currentColor" />
              </button>
              <div className="flex-1">
                <p className={`text-xs font-medium ${t.status === 'concluida' ? 'line-through text-gray-500' : ''}`}>{t.titulo}</p>
                <p className="text-[9px] text-gray-500 mt-0.5">Responsável: {t.responsavel.split(' ')[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projetos em Andamento */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Briefcase size={16} className="text-indigo-400" /> Projetos Recentes
          </h3>
          <span onClick={() => navigate(getMobilePath('/m/projects'))} className="text-xs text-cyan-400 font-medium cursor-pointer hover:underline">Ver todos</span>
        </div>
        <div className="space-y-2.5">
          {projects.map(proj => (
            <div key={proj.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-900/40 border-white/5' : 'bg-white border-gray-200 shadow-sm'} space-y-2.5`}>
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold">{proj.nome}</p>
                <span className="text-[10px] font-bold text-cyan-400">{proj.progresso}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-gray-800/80 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500" style={{ width: `${proj.progresso}%` }} />
              </div>
              <p className="text-[9px] text-gray-500">Líder do Projeto: {proj.responsavel}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Últimos Documentos */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <FileText size={16} className="text-pink-400" /> Últimos Documentos
          </h3>
          <span onClick={() => navigate(getMobilePath('/m/drive'))} className="text-xs text-cyan-400 font-medium cursor-pointer hover:underline">Drive</span>
        </div>
        <div className="space-y-2">
          {docs.map((doc, idx) => (
            <div key={idx} className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-900/40 border-white/5' : 'bg-white border-gray-200 shadow-sm'} flex justify-between items-center`}>
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 flex-shrink-0">
                  <FileText size={16} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold truncate">{doc.title}</p>
                  <p className="text-[9px] text-gray-500">{doc.size} • {doc.date}</p>
                </div>
              </div>
              <button className="text-[10px] text-cyan-400 font-bold hover:underline">Abrir</button>
            </div>
          ))}
        </div>
      </div>

      {/* Botão Assistente Flutuante (FAB) */}
      <div className="fixed bottom-20 right-6 z-40">
        <button
          onClick={() => setShowFABMenu(!showFABMenu)}
          className="w-14 h-14 rounded-full gradient-athos text-white flex items-center justify-center shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
        >
          {showFABMenu ? <X size={24} /> : <Plus size={24} />}
        </button>

        {/* Menu do FAB */}
        <AnimatePresence>
          {showFABMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className={`absolute bottom-16 right-0 w-56 rounded-2xl border p-3 ${darkMode ? 'bg-gray-900/95 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} shadow-2xl space-y-1.5 backdrop-blur-xl`}
            >
              <p className="text-[10px] font-bold text-gray-500 uppercase px-2 py-1">Ações Rápidas</p>
              <button onClick={() => { setShowQuickForm('receita'); setShowFABMenu(false); }} className="w-full p-2 text-left text-xs font-medium rounded-lg hover:bg-cyan-500/10 transition-all flex items-center gap-2">
                <DollarSign size={14} className="text-emerald-400" /> Nova Receita
              </button>
              <button onClick={() => { setShowQuickForm('despesa'); setShowFABMenu(false); }} className="w-full p-2 text-left text-xs font-medium rounded-lg hover:bg-cyan-500/10 transition-all flex items-center gap-2">
                <DollarSign size={14} className="text-red-400" /> Nova Despesa
              </button>
              <button onClick={() => { setShowQuickForm('lead'); setShowFABMenu(false); }} className="w-full p-2 text-left text-xs font-medium rounded-lg hover:bg-cyan-500/10 transition-all flex items-center gap-2">
                <Users size={14} className="text-pink-400" /> Novo Lead
              </button>
              <button onClick={() => { setShowQuickForm('projeto'); setShowFABMenu(false); }} className="w-full p-2 text-left text-xs font-medium rounded-lg hover:bg-cyan-500/10 transition-all flex items-center gap-2">
                <Briefcase size={14} className="text-indigo-400" /> Novo Projeto
              </button>
              <button onClick={() => { setShowQuickForm('ocr'); setShowFABMenu(false); }} className="w-full p-2 text-left text-xs font-medium rounded-lg hover:bg-cyan-500/10 transition-all flex items-center gap-2 border-t border-white/5 pt-2">
                <Camera size={14} className="text-purple-400" /> Escanear Documento
              </button>
              <button onClick={() => { toggleAIPanel(); setShowFABMenu(false); }} className="w-full p-2 text-left text-xs font-medium rounded-lg hover:bg-cyan-500/10 transition-all flex items-center gap-2">
                <Sparkles size={14} className="text-amber-400" /> Perguntar para IA
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Formulários Flutuantes */}
      <AnimatePresence>
        {showQuickForm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-4">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className={`w-full max-w-md p-6 rounded-t-3xl border-t border-x ${darkMode ? 'bg-gray-900 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'} space-y-4`}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm">
                  {showQuickForm === 'receita' && 'Lançar Receita'}
                  {showQuickForm === 'despesa' && 'Lançar Despesa'}
                  {showQuickForm === 'lead' && 'Cadastrar Novo Lead'}
                  {showQuickForm === 'projeto' && 'Criar Novo Projeto'}
                  {showQuickForm === 'ocr' && 'Scanner de Documento Inteligente (OCR)'}
                </h3>
                <button onClick={() => { setShowQuickForm(null); setOcrSuccess(false); setOcrData(null); }} className="p-1"><X size={18} /></button>
              </div>

              {/* Form de Finanças */}
              {(showQuickForm === 'receita' || showQuickForm === 'despesa') && (
                <div className="space-y-3">
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm"
                    placeholder="Descrição"
                    value={financeForm.descricao}
                    onChange={e => setFinanceForm({ ...financeForm, descricao: e.target.value })}
                  />
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm"
                    placeholder="Valor (R$)"
                    type="number"
                    value={financeForm.valor}
                    onChange={e => setFinanceForm({ ...financeForm, valor: e.target.value })}
                  />
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm"
                    placeholder="Contraparte / Cliente ou Fornecedor"
                    value={financeForm.contraparte}
                    onChange={e => setFinanceForm({ ...financeForm, contraparte: e.target.value })}
                  />
                  <select
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm"
                    value={financeForm.categoria}
                    onChange={e => setFinanceForm({ ...financeForm, categoria: e.target.value })}
                  >
                    <option>Serviços</option>
                    <option>Tecnologia</option>
                    <option>Infraestrutura</option>
                    <option>Pessoal</option>
                    <option>Impostos</option>
                  </select>
                  <button
                    onClick={() => handleSaveFinance(showQuickForm)}
                    className="w-full py-2.5 rounded-lg font-bold text-xs bg-cyan-500 hover:bg-cyan-600 text-white"
                  >
                    Confirmar Lançamento
                  </button>
                </div>
              )}

              {/* Form de Lead */}
              {showQuickForm === 'lead' && (
                <div className="space-y-3">
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm"
                    placeholder="Nome do Lead"
                    value={leadForm.nome}
                    onChange={e => setLeadForm({ ...leadForm, nome: e.target.value })}
                  />
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm"
                    placeholder="Empresa"
                    value={leadForm.empresa}
                    onChange={e => setLeadForm({ ...leadForm, empresa: e.target.value })}
                  />
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm"
                    placeholder="Valor do Negócio (R$)"
                    type="number"
                    value={leadForm.valor}
                    onChange={e => setLeadForm({ ...leadForm, valor: e.target.value })}
                  />
                  <button
                    onClick={handleSaveLead}
                    className="w-full py-2.5 rounded-lg font-bold text-xs bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Salvar Lead no CRM
                  </button>
                </div>
              )}

              {/* Form de Projeto */}
              {showQuickForm === 'projeto' && (
                <div className="space-y-3">
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm"
                    placeholder="Nome do Projeto"
                    value={projectForm.nome}
                    onChange={e => setProjectForm({ ...projectForm, nome: e.target.value })}
                  />
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm"
                    placeholder="Descrição"
                    value={projectForm.descricao}
                    onChange={e => setProjectForm({ ...projectForm, descricao: e.target.value })}
                  />
                  <input
                    className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm"
                    placeholder="Equipe (ex: Kleber, Joel, Oscar)"
                    value={projectForm.equipe}
                    onChange={e => setProjectForm({ ...projectForm, equipe: e.target.value })}
                  />
                  <button
                    onClick={handleSaveProject}
                    className="w-full py-2.5 rounded-lg font-bold text-xs bg-indigo-500 hover:bg-indigo-600 text-white"
                  >
                    Criar Projeto
                  </button>
                </div>
              )}

              {/* OCR Inteligente */}
              {showQuickForm === 'ocr' && (
                <div className="space-y-4">
                  <p className="text-xs text-gray-400">
                    Aponte a câmera para uma nota fiscal, boleto ou contrato. A IA fará a leitura e preencherá os campos automaticamente.
                  </p>

                  <div className="w-full h-44 rounded-2xl bg-gray-950 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 relative overflow-hidden">
                    {ocrLoading && (
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw size={24} className="text-cyan-400 animate-spin" />
                        <span className="text-xs text-cyan-400 font-semibold animate-pulse">Lendo dados com IA...</span>
                      </div>
                    )}
                    {!ocrLoading && !ocrSuccess && (
                      <button onClick={handleStartOCR} className="flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors">
                        <Camera size={32} />
                        <span className="text-xs font-semibold">Simular Foto do Documento</span>
                      </button>
                    )}
                    {ocrSuccess && (
                      <div className="absolute inset-0 bg-emerald-500/10 flex flex-col items-center justify-center p-4 text-center">
                        <CheckCircle2 size={32} className="text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-400 mt-2">Documento Lido com Sucesso!</span>
                      </div>
                    )}
                  </div>

                  {ocrSuccess && ocrData && (
                    <div className="p-4 rounded-xl bg-gray-950 border border-white/5 space-y-2.5 text-xs">
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-500">Documento</span><span className="font-semibold">{ocrData.tipo}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-500">Descrição</span><span className="font-semibold">{ocrData.descricao}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-500">Valor</span><span className="font-bold text-red-400">R$ {ocrData.valor}</span></div>
                      <div className="flex justify-between border-b border-white/5 pb-1"><span className="text-gray-500">Fornecedor</span><span className="font-semibold">{ocrData.contraparte}</span></div>
                      <div className="flex justify-between pb-1"><span className="text-gray-500">Categoria</span><span className="font-semibold">{ocrData.categoria}</span></div>

                      <button
                        onClick={handleSaveOCRToFinance}
                        className="w-full py-2.5 rounded-lg font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-white mt-2"
                      >
                        Aprovar e Lançar em Despesas
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileHome;

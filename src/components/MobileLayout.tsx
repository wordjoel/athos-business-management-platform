import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BarChart3, Users, DollarSign, Sparkles, Grid, X, Bell,
  FolderKanban, CheckSquare, Clock, HardDrive, MessageCircle,
  LifeBuoy, LogOut, ChevronLeft, CreditCard, FileText, Zap, ChevronRight, Menu, Sun, Moon
} from 'lucide-react';
import AIAssistant from './AIAssistant';

const MAIS_ITEMS = [
  { path: '/m/projects', icon: FolderKanban, label: 'Projetos', desc: 'Gestão de cronogramas e sprints' },
  { path: '/m/tarefas', icon: CheckSquare, label: 'Tarefas', desc: 'Checklist e acompanhamento' },
  { path: '/m/ponto', icon: Clock, label: 'Ponto Digital', desc: 'Registro de entrada e saída' },
  { path: '/m/drive', icon: HardDrive, label: 'Drive', desc: 'Gerenciamento de arquivos e OCR' },
  { path: '/m/whatsapp', icon: MessageCircle, label: 'WhatsApp', desc: 'Integração de mensagens' },
  { path: '/m/support', icon: LifeBuoy, label: 'Suporte', desc: 'Chamados e Inventário' },
  { path: '/m/pix', icon: Zap, label: 'Pix', desc: 'Chaves e cobranças Pix' },
  { path: '/m/boletos', icon: FileText, label: 'Boletos', desc: 'Emissão e faturamento' },
  { path: '/m/cartoes', icon: CreditCard, label: 'Cartões', desc: 'Despesas de cartões corporativos' }
];

const MobileLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { darkMode, aiPanelOpen, toggleAIPanel, toggleDarkMode } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [maisOpen, setMaisOpen] = useState(false);

  const isPWA = window.matchMedia('(display-mode: standalone)').matches;

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

  const headerTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/m') return 'Escritório Virtual';
    if (path === '/dashboard' || path === '/m/dashboard') return 'Dashboard Executivo';
    if (path === '/flow' || path === '/m/flow') return 'CRM (ATHOS Flow)';
    if (path === '/finance' || path === '/m/finance') return 'Financeiro (ATHOS Finance)';
    
    // Check extra items
    const match = MAIS_ITEMS.find(i => getMobilePath(i.path) === path || i.path === path);
    return match ? match.label : 'ATHOS';
  };

  const isHomeActive = location.pathname === '/' || location.pathname === '/m';
  const isDashboardActive = location.pathname === '/dashboard' || location.pathname === '/m/dashboard';
  const isCRMActive = location.pathname === '/flow' || location.pathname === '/m/flow';
  const isFinanceActive = location.pathname === '/finance' || location.pathname === '/m/finance';

  return (
    <div className={`min-h-screen flex flex-col relative ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900 light'}`}>
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
        <img src="/logo.png" alt="" className="w-[600px] h-[600px] object-contain" />
      </div>
      
      {/* Top Header */}
      <header className={`sticky top-0 z-40 flex items-center justify-between px-4 py-3.5 ${
        darkMode ? 'bg-gray-950/80 backdrop-blur-xl border-b border-white/5' : 'bg-white/80 backdrop-blur-xl border-b border-gray-200'
      }`}>
        <div className="flex items-center gap-3">
          {isHomeActive ? (
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="ATHOS Logo" className="w-6 h-6 object-contain" />
              <h1 className="font-bold text-sm tracking-tight text-gradient">
                ATHOS Mobile
              </h1>
            </div>
          ) : (
            <>
              <button onClick={() => navigate(-1)} className={`p-1.5 rounded-full ${darkMode ? 'bg-gray-900/60' : 'bg-gray-100'}`}>
                <ChevronLeft size={18} />
              </button>
              <h1 className="font-bold text-sm tracking-tight text-gradient">
                {headerTitle()}
              </h1>
            </>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Botão de Tema (Sempre Visível) */}
          <button
            onClick={() => toggleDarkMode()}
            className={`p-2 rounded-full transition-all active:scale-90 ${
              darkMode ? 'bg-gray-900/60 text-amber-400 hover:text-amber-300' : 'bg-gray-100 text-indigo-600 hover:bg-gray-200'
            }`}
            title="Alternar Tema"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Botão do Perfil (Avatar do Usuário em vez de Hamburger Menu) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-md transition-all active:scale-95 border border-white/10"
          >
            {menuOpen ? <X size={16} /> : (user?.avatar || 'U')}
          </button>
        </div>
      </header>

      {/* Menu do Perfil Deslizante */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-14 left-0 right-0 z-50 p-5 ${
              darkMode ? 'bg-gray-900/95 border-b border-white/10 text-white' : 'bg-white border-b border-gray-200 text-gray-900'
            } shadow-2xl backdrop-blur-2xl`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-cyan-500/20">
                {user?.avatar || 'U'}
              </div>
              <div>
                <p className="font-bold text-sm">{user?.nome}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
                <p className="text-[10px] font-bold text-cyan-400 mt-0.5">Sócio • Admin</p>
              </div>
            </div>
            <div className="border-t border-white/5 pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Tema do Sistema</span>
                <button
                  onClick={() => { toggleDarkMode(); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    darkMode ? 'bg-gray-800 text-amber-400 border border-white/5' : 'bg-gray-100 text-indigo-600 border border-gray-200'
                  }`}
                >
                  {darkMode ? <Sun size={14} /> : <Moon size={14} />}
                  {darkMode ? 'Modo Claro' : 'Modo Escuro'}
                </button>
              </div>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all"
              >
                <LogOut size={14} /> Sair do Escritório
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet />
      </main>

      {/* Menu "Mais" (Overlay Grid de todos os módulos) */}
      <AnimatePresence>
        {maisOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end justify-center p-4">
            <motion.div
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 150, opacity: 0 }}
              className={`w-full max-w-lg rounded-3xl p-6 border ${
                darkMode ? 'bg-gray-900/95 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
              } shadow-2xl space-y-4`}
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div>
                  <h3 className="font-bold text-base">Escritório Completo</h3>
                  <p className="text-[10px] text-gray-400">Selecione o módulo que deseja acessar</p>
                </div>
                <button onClick={() => setMaisOpen(false)} className={`p-2 rounded-full ${darkMode ? 'bg-gray-800/80' : 'bg-gray-100'}`}>
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {MAIS_ITEMS.map((item, idx) => {
                  const Icon = item.icon;
                  const targetPath = getMobilePath(item.path);
                  const isActive = location.pathname === targetPath || location.pathname === item.path;
                  return (
                    <button
                      key={idx}
                      onClick={() => { navigate(targetPath); setMaisOpen(false); }}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all aspect-square ${
                        isActive
                          ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400'
                          : darkMode
                            ? 'bg-gray-900/40 border-white/5 hover:bg-gray-800/60 text-gray-300'
                            : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm'
                      }`}
                    >
                      <Icon size={22} className={isActive ? 'text-indigo-400' : 'text-indigo-500'} />
                      <span className="text-[10px] font-bold tracking-tight mt-2">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating AI Panel */}
      {aiPanelOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full h-full max-w-md">
            <AIAssistant darkMode={darkMode} onClose={toggleAIPanel} />
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className={`sticky bottom-0 z-40 flex items-center justify-around py-2.5 px-3 border-t ${
        darkMode ? 'bg-gray-950/90 backdrop-blur-2xl border-white/5' : 'bg-white/90 backdrop-blur-2xl border-gray-200'
      }`}>
        
        {/* Home */}
        <button
          onClick={() => { navigate(getMobilePath('/m')); setMaisOpen(false); }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            isHomeActive ? 'text-cyan-400 font-semibold' : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          <Home size={18} />
          <span className="text-[9px]">Home</span>
        </button>

        {/* Dashboard */}
        <button
          onClick={() => { navigate(getMobilePath('/m/dashboard')); setMaisOpen(false); }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            isDashboardActive ? 'text-cyan-400 font-semibold' : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          <BarChart3 size={18} />
          <span className="text-[9px]">Dashboard</span>
        </button>

        {/* Central ATHOS AI */}
        <button
          onClick={() => { toggleAIPanel(); setMaisOpen(false); }}
          className="flex flex-col items-center justify-center -mt-6 w-12 h-12 rounded-full gradient-athos text-white shadow-lg shadow-cyan-500/20 active:scale-95 transition-all border-2 border-gray-950"
        >
          <Sparkles size={18} className="animate-pulse" />
        </button>

        {/* CRM */}
        <button
          onClick={() => { navigate(getMobilePath('/m/flow')); setMaisOpen(false); }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            isCRMActive ? 'text-cyan-400 font-semibold' : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          <Users size={18} />
          <span className="text-[9px]">CRM</span>
        </button>

        {/* Financeiro */}
        <button
          onClick={() => { navigate(getMobilePath('/m/finance')); setMaisOpen(false); }}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            isFinanceActive ? 'text-cyan-400 font-semibold' : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          <DollarSign size={18} />
          <span className="text-[9px]">Financeiro</span>
        </button>

        {/* Mais */}
        <button
          onClick={() => setMaisOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all ${
            maisOpen ? 'text-cyan-400 font-semibold' : 'text-gray-500 hover:text-gray-400'
          }`}
        >
          <Grid size={18} />
          <span className="text-[9px]">Mais</span>
        </button>
      </nav>

    </div>
  );
};

export default MobileLayout;

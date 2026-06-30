import React, { useState, useMemo, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, DollarSign, BrainCircuit, FileText, Database,
  ChevronLeft, ChevronRight, Users, Settings, LogOut,
  HandHelping, Kanban, UserCheck, FileSignature, Building2,
  Briefcase, Eye, AlertTriangle, HardDrive, Trophy, Share2,
  Search, Star, Smartphone
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  section: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', section: 'Principal' },
  { id: 'socios', label: 'Sócios & Diretores', section: 'Principal' },
  { id: 'drive', label: 'ATHOS Drive', section: 'Principal', badge: 'Novo' },

  { id: 'flow', label: 'ATHOS Flow', section: 'CRM', badge: 'Novo' },
  { id: 'leads', label: 'Leads', section: 'CRM' },
  { id: 'funil', label: 'Funil Comercial', section: 'CRM' },
  { id: 'whatsapp', label: 'WhatsApp', section: 'CRM' },

  { id: 'finance', label: 'ATHOS Finance', section: 'Financeiro' },
  { id: 'contas-pagar', label: 'Contas a Pagar', section: 'Financeiro' },
  { id: 'contas-receber', label: 'Contas a Receber', section: 'Financeiro' },
  { id: 'fluxo-caixa', label: 'Fluxo de Caixa', section: 'Financeiro' },
  { id: 'dre', label: 'DRE', section: 'Financeiro' },
  { id: 'centro-custos', label: 'Centro de Custos', section: 'Financeiro', badge: 'Novo' },
  { id: 'dfc', label: 'DFC', section: 'Financeiro', badge: 'Novo' },
  { id: 'balanco', label: 'Balanço Patrimonial', section: 'Financeiro', badge: 'Novo' },
  { id: 'conciliacao', label: 'Conciliação Bancária', section: 'Financeiro', badge: 'Novo' },
  { id: 'pix', label: 'PIX', section: 'Financeiro', badge: 'Novo' },
  { id: 'boletos', label: 'Boletos', section: 'Financeiro', badge: 'Novo' },
  { id: 'cartoes', label: 'Cartões', section: 'Financeiro', badge: 'Novo' },
  { id: 'previsao', label: 'Previsão IA', section: 'Financeiro', badge: 'IA' },

  { id: 'sign', label: 'ATHOS Sign', section: 'Contratos' },
  { id: 'modelos', label: 'Modelos', section: 'Contratos' },
  { id: 'assinaturas', label: 'Assinaturas', section: 'Contratos' },

  { id: 'ai', label: 'ATHOS AI', section: 'Inteligência', badge: 'Novo' },
  { id: 'chatbot', label: 'Chatbot', section: 'Inteligência' },
  { id: 'relatorios-ia', label: 'Relatórios IA', section: 'Inteligência' },

  { id: 'support', label: 'ATHOS Support', section: 'Suporte' },
  { id: 'chamados', label: 'Chamados', section: 'Suporte' },
  { id: 'inventario', label: 'Inventário', section: 'Suporte' },

  { id: 'projects', label: 'ATHOS Projects', section: 'Projetos' },
  { id: 'tarefas', label: 'Tarefas', section: 'Projetos' },
  { id: 'kanban', label: 'Kanban', section: 'Projetos' },

  { id: 'people', label: 'ATHOS People', section: 'RH' },
  { id: 'funcionarios', label: 'Funcionários', section: 'RH' },
  { id: 'ponto', label: 'Ponto Digital', section: 'RH' },
  { id: 'onboarding', label: 'Onboarding', section: 'RH' },

  { id: 'sharepoints', label: 'Cambom Points', section: 'Comunidade', badge: 'Novo' },

  { id: 'relatorios', label: 'Relatórios', section: 'Sistema' },
  { id: 'banco-dados', label: 'Banco de Dados', section: 'Sistema' },
  { id: 'usuarios', label: 'Usuários', section: 'Sistema' },
  { id: 'configuracoes', label: 'Configurações', section: 'Sistema' },
];

const sectionIcons: Record<string, React.FC<{ size?: number; className?: string }>> = {
  'Principal': LayoutDashboard,
  'Drive': HardDrive,
  'CRM': HandHelping,
  'Financeiro': DollarSign,
  'Contratos': FileSignature,
  'Inteligência': BrainCircuit,
  'Suporte': Users,
  'Projetos': Kanban,
  'RH': UserCheck,
  'Sistema': Settings,
  'Comunidade': Trophy,
};

const sectionColors: Record<string, string> = {
  'Principal': 'bg-athos-500',
  'Drive': 'bg-cyan-500',
  'CRM': 'bg-pink-500',
  'Financeiro': 'bg-emerald-500',
  'Contratos': 'bg-violet-500',
  'Inteligência': 'bg-amber-500',
  'Suporte': 'bg-cyan-500',
  'Projetos': 'bg-blue-500',
  'RH': 'bg-orange-500',
  'Sistema': 'bg-gray-500',
  'Comunidade': 'bg-violet-500',
};

const FAVORITES_KEY = 'athos_sidebar_favorites';

const adminOnlyIds = new Set(['relatorios', 'banco-dados', 'usuarios', 'configuracoes']);

const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar, darkMode } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const toggleFavorite = useCallback((id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const visibleItems = useMemo(() => {
    let items = navItems.filter(item => isAdmin || !adminOnlyIds.has(item.id));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.label.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q)
      );
    }
    return items;
  }, [isAdmin, searchQuery]);

  const groupedItems = useMemo(() => {
    const acc: Record<string, typeof navItems> = {};

    const favoriteItems = visibleItems.filter(item => favorites.includes(item.id));
    if (favoriteItems.length > 0 && !searchQuery) {
      acc['Favoritos'] = favoriteItems;
    }

    visibleItems.forEach(item => {
      if (!searchQuery && favorites.includes(item.id)) return;
      if (!acc[item.section]) acc[item.section] = [];
      acc[item.section].push(item);
    });
    return acc;
  }, [visibleItems, favorites, searchQuery]);

  return (
    <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 flex flex-col relative ${
      darkMode
        ? 'bg-gray-950/60 backdrop-blur-xl border-r border-white/5'
        : 'bg-white/90 backdrop-blur-xl border-r border-gray-200'
    }`}>
      <div className={`p-6 flex items-center justify-center ${sidebarCollapsed ? 'px-2' : ''}`}>
        <div className="relative">
          <div className={`${sidebarCollapsed ? 'w-10 h-10' : 'w-20 h-20'} flex items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-cyan-500/20`}>
            <img src="/logo.png" alt="ATHOS Logo" className="w-full h-full object-contain" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full border-2 border-gray-900" />
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className={`absolute -right-3 top-8 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all ${
          darkMode ? 'bg-gray-800 border border-gray-700 text-gray-400' : 'bg-white border border-gray-300 text-gray-500 shadow-sm'
        } hover:text-cyan-400`}
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {!sidebarCollapsed && (
        <div className={`px-3 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
            darkMode ? 'bg-gray-800/30 border border-white/5' : 'bg-gray-50 border border-gray-200'
          }`}>
            <Search size={14} className="text-gray-500" />
            <input
              type="text"
              placeholder="Buscar módulos..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs outline-none w-full placeholder-gray-500"
            />
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {Object.entries(groupedItems).map(([section, items]) => {
          const IconComponent = section === 'Favoritos' ? Star : sectionIcons[section];
          const bgColor = section === 'Favoritos' ? 'bg-amber-500' : (sectionColors[section] || 'bg-gray-500');

          return (
            <div key={section}>
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2 px-3 mb-2">
                  {IconComponent && (
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center ${bgColor}`}>
                      <IconComponent size={10} className="text-white" />
                    </div>
                  )}
                  <p className={`text-[10px] font-semibold tracking-[0.2em] uppercase ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    {section}
                  </p>
                </div>
              )}
              <div className="space-y-0.5">
                {items.map(item => {
                  const isModuleHeader = item.label.startsWith('ATHOS');
                  const isFavorite = favorites.includes(item.id);

                  return (
                    <div key={item.id} className="flex items-center group">
                      <NavLink
                        to={`/${item.id}`}
                        className={({ isActive }) => `flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 relative ${
                          sidebarCollapsed ? 'justify-center px-2' : ''
                        } ${
                          isModuleHeader
                            ? darkMode
                              ? 'font-bold text-white bg-gradient-to-r from-cyan-500/20 to-transparent border-l-2 border-cyan-500'
                              : 'font-bold text-gray-900 bg-gradient-to-r from-cyan-50 to-transparent border-l-2 border-cyan-500'
                            : isActive
                              ? darkMode
                                ? 'bg-cyan-500/10 text-cyan-400'
                                : 'bg-cyan-50 text-cyan-600'
                              : darkMode
                                ? 'text-gray-400 hover:text-white hover:bg-white/5'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-cyan-500" />
                            )}
                            {!sidebarCollapsed && (
                              <>
                                <span className={`text-sm ${isModuleHeader ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                                {item.badge && (
                                  <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    item.badge === 'IA'
                                      ? 'bg-amber-500/20 text-amber-400'
                                      : 'bg-athos-500/20 text-athos-400'
                                  }`}>
                                    {item.badge}
                                  </span>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </NavLink>
                      {!sidebarCollapsed && (
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ml-1 ${
                            isFavorite
                              ? 'text-amber-400 opacity-100'
                              : darkMode ? 'text-gray-600 hover:text-amber-400' : 'text-gray-300 hover:text-amber-400'
                          }`}
                        >
                          <Star size={12} className={isFavorite ? 'fill-amber-400' : ''} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* PWA Mobile Link - Web Mode Only */}
      <div className={`mx-3 mb-3 p-4 rounded-xl border transition-all duration-200 ${
        darkMode ? 'bg-indigo-500/5 border-indigo-500/15 hover:border-indigo-500/30' : 'bg-indigo-50 border-indigo-150 hover:bg-indigo-100/70'
      }`}>
        {!sidebarCollapsed ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Smartphone size={18} className="text-indigo-400" />
              <p className="text-xs font-bold text-indigo-400">ATHOS Mobile PWA</p>
            </div>
            <p className={`text-[9px] leading-relaxed ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              Leve o escritório inteligente para o seu smartphone.
            </p>
            <a
              href="/?pwa=true"
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold text-center transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
            >
              Acessar Versão Mobile
            </a>
          </div>
        ) : (
          <a
            href="/?pwa=true"
            target="_blank"
            rel="noreferrer"
            title="Acessar ATHOS Mobile PWA"
            className="flex items-center justify-center p-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20 active:scale-[0.98]"
          >
            <Smartphone size={18} />
          </a>
        )}
      </div>

      <div className={`p-4 border-t ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 flex items-center justify-center text-gray-900 text-sm font-bold flex-shrink-0">
            {user?.avatar || user?.nome?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US'}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.nome || 'Usuário'}</p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{user?.email || 'usuario@athos.com'}</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button onClick={handleLogout} className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}>
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

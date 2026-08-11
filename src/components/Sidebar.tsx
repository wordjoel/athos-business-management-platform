import React, { useState, useMemo, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, DollarSign, BrainCircuit, FileText, Database,
  ChevronLeft, ChevronRight, Users, Settings, LogOut,
  HandHelping, Kanban, UserCheck, FileSignature, Building2,
  Briefcase, Eye, AlertTriangle, HardDrive, Trophy, Share2,
  Star, Smartphone
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

const FAVORITES_KEY = 'athos_sidebar_favorites';

const adminOnlyIds = new Set(['relatorios', 'banco-dados', 'usuarios', 'configuracoes']);
const financeiroOnlyIds = new Set(['contas-pagar', 'contas-receber', 'dre', 'centro-custos', 'dfc', 'balanco', 'conciliacao', 'pix', 'boletos', 'cartoes', 'financeiro']);
const crmOnlyIds = new Set(['flow', 'leads', 'funil']);
const rhOnlyIds = new Set(['people', 'funcionarios', 'onboarding']);
const juridicoOnlyIds = new Set(['modelos', 'assinaturas']);

const Sidebar: React.FC = () => {
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userRole = user?.role;
  const isAdminOrMaster = userRole === 'admin' || userRole === 'master';
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

  const canSeeItem = useCallback((id: string): boolean => {
    if (isAdminOrMaster) return true;
    if (adminOnlyIds.has(id)) return false;
    if (financeiroOnlyIds.has(id)) return userRole === 'financeiro' || userRole === 'gerente';
    if (crmOnlyIds.has(id)) return userRole === 'comercial' || userRole === 'gerente';
    if (rhOnlyIds.has(id)) return userRole === 'rh';
    if (juridicoOnlyIds.has(id)) return userRole === 'juridico';
    return true;
  }, [isAdminOrMaster, userRole]);

  const visibleItems = useMemo(() => {
    let items = navItems.filter(item => canSeeItem(item.id));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      items = items.filter(item =>
        item.label.toLowerCase().includes(q) ||
        item.section.toLowerCase().includes(q)
      );
    }
    return items;
  }, [canSeeItem, searchQuery]);

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
    <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 flex flex-col relative bg-[#0a0a0a] border-r border-[#1f521f]`}>
      <div className={`p-6 flex items-center justify-center border-b border-[#1f521f] ${sidebarCollapsed ? 'px-2' : ''}`}>
        <div className="relative">
          <div className={`${sidebarCollapsed ? 'w-10 h-10' : 'w-20 h-20'} flex items-center justify-center overflow-hidden border border-[#1f521f]`}>
            <img src="/logo.png" alt="ATHOS Logo" className="w-full h-full object-contain" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#33ff00] border-2 border-[#0a0a0a]" />
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 w-6 h-6 flex items-center justify-center z-10 transition-all bg-[#0a0a0a] border border-[#1f521f] text-[#1f521f] hover:text-[#33ff00]"
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {!sidebarCollapsed && (
        <div className="px-3 mb-2 mt-3 text-[#3f9e5c]">
          <div className="flex items-center gap-2 px-3 py-2 border border-[#1f521f]">
            <span className="text-[#33ff00]">$</span>
            <input
              type="text"
              placeholder="grep modulo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs outline-none w-full placeholder-[#1f521f] text-[#33ff00]"
            />
          </div>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {Object.entries(groupedItems).map(([section, items]) => {
          const IconComponent = section === 'Favoritos' ? Star : sectionIcons[section];

          return (
            <div key={section}>
              {!sidebarCollapsed && (
                <div className="flex items-center gap-2 px-3 mb-2">
                  {IconComponent && (
                    <IconComponent size={11} className="text-[#33ff00]" />
                  )}
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#3f9e5c]">
                    // {section}
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
                        className={({ isActive }) => `flex-1 flex items-center gap-3 px-3 py-2 transition-all duration-150 relative border-l-2 ${
                          sidebarCollapsed ? 'justify-center px-2' : ''
                        } ${
                          isModuleHeader
                            ? 'font-bold text-[#33ff00] border-[#33ff00] bg-[#0f2610]'
                            : isActive
                              ? 'bg-[#0f2610] text-[#33ff00] border-[#33ff00]'
                              : 'text-[#3f9e5c] hover:text-[#33ff00] hover:bg-[#0d1a0d] border-transparent'
                        }`}
                      >
                        {!sidebarCollapsed && (
                          <>
                            <span className={`text-sm ${isModuleHeader ? 'font-bold' : 'font-medium'}`}>
                              {isModuleHeader ? '> ' : ''}{item.label}
                            </span>
                            {item.badge && (
                              <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 border ${
                                item.badge === 'IA'
                                  ? 'border-[#ffb000] text-[#ffb000]'
                                  : 'border-[#33ff00] text-[#33ff00]'
                              }`}>
                                [{item.badge}]
                              </span>
                            )}
                          </>
                        )}
                      </NavLink>
                      {!sidebarCollapsed && (
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className={`p-1.5 opacity-0 group-hover:opacity-100 transition-all ml-1 ${
                            isFavorite
                              ? 'text-[#ffb000] opacity-100'
                              : 'text-[#1f521f] hover:text-[#ffb000]'
                          }`}
                        >
                          <Star size={12} className={isFavorite ? 'fill-[#ffb000]' : ''} />
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
      <div className="mx-3 mb-3 p-4 border border-[#1f521f] hover:border-[#33ff00] transition-all duration-150">
        {!sidebarCollapsed ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Smartphone size={18} className="text-[#33ff00]" />
              <p className="text-xs font-bold text-[#33ff00]">./athos-mobile</p>
            </div>
            <p className="text-[9px] leading-relaxed text-[#3f9e5c]">
              # escritorio inteligente no smartphone
            </p>
            <a
              href="/?pwa=true"
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2 border border-[#33ff00] text-[#33ff00] text-xs font-bold text-center transition-all hover:bg-[#33ff00] hover:text-[#0a0a0a] active:scale-[0.98]"
            >
              [ ACESSAR ]
            </a>
          </div>
        ) : (
          <a
            href="/?pwa=true"
            target="_blank"
            rel="noreferrer"
            title="Acessar ATHOS Mobile PWA"
            className="flex items-center justify-center p-3 border border-[#33ff00] text-[#33ff00] hover:bg-[#33ff00] hover:text-[#0a0a0a] transition-all active:scale-[0.98]"
          >
            <Smartphone size={18} />
          </a>
        )}
      </div>

      <div className="p-4 border-t border-[#1f521f]">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 border border-[#33ff00] flex items-center justify-center text-[#33ff00] text-sm font-bold flex-shrink-0">
            {user?.avatar || user?.nome?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US'}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-[#33ff00]">{user?.nome || 'Usuário'}</p>
              <p className="text-xs text-[#3f9e5c]">{user?.email || 'usuario@athos.com'}</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button onClick={handleLogout} className="p-1.5 transition-colors text-[#3f9e5c] hover:text-[#ff3333]">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

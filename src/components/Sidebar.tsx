import React, { useState, useMemo, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, DollarSign, BrainCircuit, FileText, Database,
  ChevronLeft, ChevronRight, Users, Settings, LogOut,
  HandHelping, Kanban, UserCheck, FileSignature, Building2,
  Briefcase, Eye, AlertTriangle, HardDrive, Trophy, Share2,
  Star, Smartphone, Search
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
    <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 flex flex-col relative bg-[#0B0E14] border-r border-[#2A2F3D]`}>
      <div className={`p-6 flex items-center justify-center border-b border-[#2A2F3D] ${sidebarCollapsed ? 'px-2' : ''}`}>
        <div className="relative">
          <div className={`${sidebarCollapsed ? 'w-10 h-10' : 'w-20 h-20'} rounded-xl flex items-center justify-center overflow-hidden border border-[#2A2F3D]`}>
            <img src="/logo.png" alt="ATHOS Logo" className="w-full h-full object-contain" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#C9A961] border-2 border-[#0B0E14]" />
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-8 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all bg-[#131722] border border-[#2A2F3D] text-[#8B93A6] hover:text-[#C9A961] hover:border-[#C9A961]"
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {!sidebarCollapsed && (
        <div className="px-3 mb-2 mt-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#2A2F3D] bg-[#131722] focus-within:border-[#C9A961]/60 transition-colors">
            <Search size={13} className="text-[#8B93A6]" />
            <input
              type="text"
              placeholder="Buscar módulo..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs outline-none w-full placeholder-[#4E5468] text-[#E9E4D8]"
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
                    <IconComponent size={11} className="text-[#C9A961]" />
                  )}
                  <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8B93A6]">
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
                        className={({ isActive }) => `flex-1 flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 relative border-l-2 ${
                          sidebarCollapsed ? 'justify-center px-2' : ''
                        } ${
                          isModuleHeader
                            ? 'font-bold text-[#C9A961] border-[#C9A961] bg-[#1E2430]'
                            : isActive
                              ? 'bg-[#1E2430] text-[#C9A961] border-[#C9A961]'
                              : 'text-[#8B93A6] hover:text-[#C9A961] hover:bg-[#12151E] border-transparent'
                        }`}
                      >
                        {!sidebarCollapsed && (
                          <>
                            <span className={`text-sm ${isModuleHeader ? 'font-bold' : 'font-medium'}`}>
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                item.badge === 'IA'
                                  ? 'border-[#5B7FA8] text-[#5B7FA8]'
                                  : 'border-[#C9A961] text-[#C9A961]'
                              }`}>
                                {item.badge}
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
                              ? 'text-[#5B7FA8] opacity-100'
                              : 'text-[#2A2F3D] hover:text-[#5B7FA8]'
                          }`}
                        >
                          <Star size={12} className={isFavorite ? 'fill-[#5B7FA8]' : ''} />
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
      <div className="mx-3 mb-3 p-4 rounded-xl border border-[#2A2F3D] bg-[#131722] hover:border-[#C9A961]/50 transition-all duration-150">
        {!sidebarCollapsed ? (
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Smartphone size={18} className="text-[#C9A961]" />
              <p className="text-xs font-bold text-[#F0E6CC]">ATHOS Mobile</p>
            </div>
            <p className="text-[9px] leading-relaxed text-[#8B93A6]">
              Seu escritório inteligente no smartphone.
            </p>
            <a
              href="/?pwa=true"
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2 rounded-lg border border-[#C9A961]/60 text-[#C9A961] text-xs font-semibold text-center transition-all hover:bg-[#C9A961] hover:text-[#0B0E14] active:scale-[0.98]"
            >
              Acessar
            </a>
          </div>
        ) : (
          <a
            href="/?pwa=true"
            target="_blank"
            rel="noreferrer"
            title="Acessar ATHOS Mobile PWA"
            className="flex items-center justify-center p-3 rounded-lg border border-[#C9A961]/60 text-[#C9A961] hover:bg-[#C9A961] hover:text-[#0B0E14] transition-all active:scale-[0.98]"
          >
            <Smartphone size={18} />
          </a>
        )}
      </div>

      <div className="p-4 border-t border-[#2A2F3D]">
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[#0B0E14] text-sm font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #E0C583 0%, #C9A961 55%, #A98A47 100%)' }}>
            {user?.avatar || user?.nome?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US'}
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-[#F0E6CC]">{user?.nome || 'Usuário'}</p>
              <p className="text-xs text-[#8B93A6]">{user?.email || 'usuario@athos.com'}</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button onClick={handleLogout} className="p-1.5 transition-colors text-[#8B93A6] hover:text-[#A6484A]">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

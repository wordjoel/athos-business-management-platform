import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, DollarSign, Building2, BrainCircuit, FileText, Database,
  Shield, ChevronLeft, ChevronRight, Users, Settings, LogOut, Zap, FileSignature, Receipt
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Principal' },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign, section: 'Gestão' },
  { id: 'setores', label: 'Setores', icon: Building2, section: 'Gestão' },
  { id: 'contratos', label: 'Contratos IA', icon: FileSignature, section: 'Gestão' },
  { id: 'despesas', label: 'Despesas', icon: Receipt, section: 'Gestão' },
  { id: 'ia', label: 'IA Assistente', icon: BrainCircuit, section: 'Inteligência' },
  { id: 'relatorios', label: 'Relatórios', icon: FileText, section: 'Inteligência' },
  { id: 'banco-dados', label: 'Banco de Dados', icon: Database, section: 'Sistema' },
  { id: 'usuarios', label: 'Usuários', icon: Users, section: 'Sistema' },
  { id: 'seguranca', label: 'Segurança', icon: Shield, section: 'Sistema' },
  { id: 'configuracoes', label: 'Configurações', icon: Settings, section: 'Sistema' },
];

const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, sidebarCollapsed, toggleSidebar, darkMode, logout, unreadAlertCount } = useApp();

  const groupedItems = navItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  return (
    <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} transition-all duration-300 flex flex-col relative ${
      darkMode 
        ? 'bg-gray-950/95 border-r border-white/5' 
        : 'bg-white border-r border-gray-200'
    }`}>
      {/* Logo */}
      <div className={`p-6 flex items-center gap-3 ${sidebarCollapsed ? 'justify-center px-2' : ''}`}>
        <div className="relative">
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl">
            <img src="/logo.png" alt="ATOS Logo" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-gray-950" />
        </div>
        {!sidebarCollapsed && (
          <div className="animate-fade-in">
            <h1 className="text-xl font-bold text-gradient tracking-tight">ATOS</h1>
            <p className={`text-[10px] font-medium tracking-[0.2em] uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Centro de Organização
            </p>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className={`absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all ${
          darkMode ? 'bg-gray-800 border border-gray-700 text-gray-400' : 'bg-white border border-gray-300 text-gray-500 shadow-sm'
        } hover:text-athos-400`}
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section}>
            {!sidebarCollapsed && (
              <p className={`text-[10px] font-semibold tracking-[0.2em] uppercase px-3 mb-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                {section}
              </p>
            )}
            <div className="space-y-1">
              {items.map(item => {
                const isActive = currentPage === item.id;
                const hasBadge = item.id === 'ia' && unreadAlertCount > 0;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                      sidebarCollapsed ? 'justify-center px-2' : ''
                    } ${
                      isActive
                        ? darkMode
                          ? 'bg-athos-500/10 text-athos-400 shadow-lg shadow-athos-500/5'
                          : 'bg-athos-50 text-athos-600 shadow-sm'
                        : darkMode
                          ? 'text-gray-400 hover:text-white hover:bg-white/5'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-athos-500" />
                    )}
                    <item.icon size={18} className={`flex-shrink-0 ${isActive ? 'text-athos-400' : ''}`} />
                    {!sidebarCollapsed && (
                      <>
                        <span className="text-sm font-medium">{item.label}</span>
                        {hasBadge && (
                          <span className="ml-auto bg-athos-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                            {unreadAlertCount}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className={`p-4 border-t ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-lg gradient-athos flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            CM
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>Carlos Mendes</p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Administrador</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button onClick={logout} className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/10' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}>
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

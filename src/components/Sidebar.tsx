import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard, DollarSign, BrainCircuit, FileText, Database,
  Shield, ChevronLeft, ChevronRight, Users, Settings, LogOut, 
  HandHelping, Kanban, UserCheck, FileSignature, Building2,
  Briefcase, Eye, AlertTriangle
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  section: string;
  badge?: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', section: 'Principal' },
  
  { id: 'flow', label: 'ATHOS Flow', section: 'CRM', badge: 'Novo' },
  { id: 'leads', label: 'Leads', section: 'CRM' },
  { id: 'funil', label: 'Funil Comercial', section: 'CRM' },
  { id: 'whatsapp', label: 'WhatsApp', section: 'CRM' },
  
  { id: 'finance', label: 'ATHOS Finance', section: 'Financeiro' },
  { id: 'contas-pagar', label: 'Contas a Pagar', section: 'Financeiro' },
  { id: 'contas-receber', label: 'Contas a Receber', section: 'Financeiro' },
  { id: 'fluxo-caixa', label: 'Fluxo de Caixa', section: 'Financeiro' },
  { id: 'dre', label: 'DRE', section: 'Financeiro' },
  { id: 'previsao', label: 'Previsão IA', section: 'Financeiro', badge: 'IA' },
  
  { id: 'sign', label: 'ATHOS Sign', section: 'Contratos' },
  { id: 'contratos', label: 'Contratos', section: 'Contratos' },
  { id: 'modelos', label: 'Modelos', section: 'Contratos' },
  { id: 'assinaturas', label: 'Assinaturas', section: 'Contratos' },
  
  { id: 'ai', label: 'ATHOS AI', section: 'Inteligência' },
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
  
  { id: 'shield', label: 'ATHOS Shield', section: 'Segurança' },
  { id: 'cameras', label: 'Câmeras', section: 'Segurança' },
  { id: 'alertas', label: 'Alertas', section: 'Seguranção' },
  { id: 'ativos', label: 'Patrimônio', section: 'Segurança' },
  
  { id: 'relatorios', label: 'Relatórios', section: 'Sistema' },
  { id: 'banco-dados', label: 'Banco de Dados', section: 'Sistema' },
  { id: 'usuarios', label: 'Usuários', section: 'Sistema' },
  { id: 'configuracoes', label: 'Configurações', section: 'Sistema' },
];

const sectionIcons: Record<string, React.FC<{ size?: number; className?: string }>> = {
  'Principal': LayoutDashboard,
  'CRM': HandHelping,
  'Financeiro': DollarSign,
  'Contratos': FileSignature,
  'Inteligência': BrainCircuit,
  'Suporte': Users,
  'Projetos': Kanban,
  'RH': UserCheck,
  'Segurança': Shield,
  'Sistema': Settings,
};

const sectionColors: Record<string, string> = {
  'Principal': 'bg-athos-500',
  'CRM': 'bg-pink-500',
  'Financeiro': 'bg-emerald-500',
  'Contratos': 'bg-violet-500',
  'Inteligência': 'bg-amber-500',
  'Suporte': 'bg-cyan-500',
  'Projetos': 'bg-blue-500',
  'RH': 'bg-orange-500',
  'Segurança': 'bg-red-500',
  'Sistema': 'bg-gray-500',
};

const Sidebar: React.FC = () => {
  const { currentPage, setCurrentPage, sidebarCollapsed, toggleSidebar, darkMode, logout, unreadAlertCount, nomeEmpresa } = useApp();

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
      <div className={`p-6 flex items-center gap-3 ${sidebarCollapsed ? 'justify-center px-2' : ''}`}>
        <div className="relative">
          <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-xl">
            <img src="/logo.png" alt="ATHOS Logo" className="w-full h-full object-contain" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-gray-950" />
        </div>
        {!sidebarCollapsed && (
          <div className="animate-fade-in">
            <h1 className="text-xl font-bold text-gradient tracking-tight">ATHOS</h1>
            <p className={`text-[10px] font-medium tracking-[0.2em] uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Business Platform
            </p>
          </div>
        )}
      </div>

      <button
        onClick={toggleSidebar}
        className={`absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all ${
          darkMode ? 'bg-gray-800 border border-gray-700 text-gray-400' : 'bg-white border border-gray-300 text-gray-500 shadow-sm'
        } hover:text-athos-400`}
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {Object.entries(groupedItems).map(([section, items]) => {
          const IconComponent = sectionIcons[section];
          const bgColor = sectionColors[section] || 'bg-gray-500';
          
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
                  const isActive = currentPage === item.id;
                  const isModuleHeader = item.label.startsWith('ATHOS');
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${
                        sidebarCollapsed ? 'justify-center px-2' : ''
                      } ${
                        isModuleHeader
                          ? darkMode
                            ? 'font-bold text-white bg-gradient-to-r from-athos-500/20 to-transparent border-l-2 border-athos-500'
                            : 'font-bold text-gray-900 bg-gradient-to-r from-athos-50 to-transparent border-l-2 border-athos-500'
                          : isActive
                            ? darkMode
                              ? 'bg-athos-500/10 text-athos-400'
                              : 'bg-athos-50 text-athos-600'
                            : darkMode
                              ? 'text-gray-400 hover:text-white hover:bg-white/5'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-athos-500" />
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
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className={`p-4 border-t ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
        <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-lg gradient-athos flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            KD
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>Kleber Duarte</p>
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
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import AIAssistant from './components/AIAssistant';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import Financeiro from './pages/Financeiro';
import SetoresPage from './pages/Setores';
import IAPage from './pages/IA';
import Relatorios from './pages/Relatorios';
import BancoDados from './pages/BancoDados';
import UsuariosPage from './pages/Usuarios';
import SegurancaPage from './pages/Seguranca';
import Configuracoes from './pages/Configuracoes';
import ContratosPage from './pages/Contratos';
import DespesasPage from './pages/Despesas';
import SociosPage from './pages/Socios';
import ATHOSDrive from './pages/modules/ATHOSDrive';

import ATHOSFlow from './pages/modules/ATHOSFlow';
import Leads from './pages/modules/Leads';
import FunilComercial from './pages/modules/FunilComercial';
import WhatsApp from './pages/modules/WhatsApp';
import ATHOSFinance from './pages/modules/ATHOSFinance';
import ContasPagar from './pages/modules/ContasPagar';
import ContasReceber from './pages/modules/ContasReceber';
import FluxoCaixa from './pages/modules/FluxoCaixa';
import DRE from './pages/modules/DRE';
import PrevisãoIA from './pages/modules/PrevisaoIA';
import ATHOSSign from './pages/modules/ATHOSSign';
import Modelos from './pages/modules/Modelos';
import Assinaturas from './pages/modules/Assinaturas';
import Chatbot from './pages/modules/Chatbot';
import RelatoriosIA from './pages/modules/RelatoriosIA';
import ATHOSSupport from './pages/modules/ATHOSSupport';
import Chamados from './pages/modules/Chamados';
import Inventario from './pages/modules/Inventario';
import ATHOSProjects from './pages/modules/ATHOSProjects';
import Tarefas from './pages/modules/Tarefas';
import KanbanBoard from './pages/modules/KanbanBoard';
import ATHOSPeople from './pages/modules/ATHOSPeople';
import Funcionarios from './pages/modules/Funcionarios';
import PontoDigital from './pages/modules/PontoDigital';
import Onboarding from './pages/modules/Onboarding';
import ATHOSShield from './pages/modules/ATHOSShield';
import Cameras from './pages/modules/Cameras';
import Alertas from './pages/modules/Alertas';
import Ativos from './pages/modules/Ativos';

const AppContent: React.FC = () => {
  const { isLoggedIn, currentPage, darkMode, aiPanelOpen, toggleAIPanel } = useApp();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const pages: Record<string, React.FC> = {
    dashboard: Dashboard,
    
    flow: ATHOSFlow,
    leads: Leads,
    funil: FunilComercial,
    whatsapp: WhatsApp,
    
    finance: ATHOSFinance,
    'contas-pagar': ContasPagar,
    'contas-receber': ContasReceber,
    'fluxo-caixa': FluxoCaixa,
    dre: DRE,
    previsao: PrevisãoIA,
    
    sign: ATHOSSign,
    contratos: ContratosPage,
    modelos: Modelos,
    assinaturas: Assinaturas,
    
    ai: IAPage,
    chatbot: Chatbot,
    'relatorios-ia': RelatoriosIA,
    
    support: ATHOSSupport,
    chamados: Chamados,
    inventario: Inventario,
    
    projects: ATHOSProjects,
    tarefas: Tarefas,
    kanban: KanbanBoard,
    
    people: ATHOSPeople,
    funcionarios: Funcionarios,
    ponto: PontoDigital,
    onboarding: Onboarding,
    
    shield: ATHOSShield,
    cameras: Cameras,
    alertas: Alertas,
    ativos: Ativos,
    
    financeiro: Financeiro,
    setores: SetoresPage,
    relatorios: Relatorios,
    'banco-dados': BancoDados,
    usuarios: UsuariosPage,
    seguranca: SegurancaPage,
    configuracoes: Configuracoes,
    despesas: DespesasPage,
    socios: SociosPage,
    drive: ATHOSDrive,
  };

  const Page = pages[currentPage] || Dashboard;

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Page />
        </main>
      </div>
      {aiPanelOpen && <AIAssistant darkMode={darkMode} onClose={toggleAIPanel} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
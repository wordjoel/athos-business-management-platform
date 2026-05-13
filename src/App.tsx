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

const AppContent: React.FC = () => {
  const { isLoggedIn, currentPage, darkMode, aiPanelOpen, toggleAIPanel } = useApp();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const pages: Record<string, React.FC> = {
    dashboard: Dashboard,
    financeiro: Financeiro,
    setores: SetoresPage,
    ia: IAPage,
    relatorios: Relatorios,
    'banco-dados': BancoDados,
    usuarios: UsuariosPage,
    seguranca: SegurancaPage,
    configuracoes: Configuracoes,
  };

  const Page = pages[currentPage] || Dashboard;

  return (
    <div className={`flex h-screen overflow-hidden transition-colors ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
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

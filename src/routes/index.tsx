import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import AppLayout from '../components/AppLayout';

const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Financeiro = lazy(() => import('../pages/Financeiro'));
const SetoresPage = lazy(() => import('../pages/Setores'));
const ATHOSAI = lazy(() => import('../pages/modules/ATHOSAI'));
const Relatorios = lazy(() => import('../pages/Relatorios'));
const BancoDados = lazy(() => import('../pages/BancoDados'));
const UsuariosPage = lazy(() => import('../pages/Usuarios'));
const Configuracoes = lazy(() => import('../pages/Configuracoes'));

const DespesasPage = lazy(() => import('../pages/Despesas'));
const SociosPage = lazy(() => import('../pages/Socios'));
const ATHOSDrive = lazy(() => import('../pages/modules/ATHOSDrive'));
const ATHOSFlow = lazy(() => import('../pages/modules/ATHOSFlow'));
const Leads = lazy(() => import('../pages/modules/Leads'));
const FunilComercial = lazy(() => import('../pages/modules/FunilComercial'));
const WhatsApp = lazy(() => import('../pages/modules/WhatsApp'));
const ATHOSFinance = lazy(() => import('../pages/modules/ATHOSFinance'));
const ContasPagar = lazy(() => import('../pages/modules/ContasPagar'));
const ContasReceber = lazy(() => import('../pages/modules/ContasReceber'));
const FluxoCaixa = lazy(() => import('../pages/modules/FluxoCaixa'));
const DRE = lazy(() => import('../pages/modules/DRE'));
const PrevisãoIA = lazy(() => import('../pages/modules/PrevisaoIA'));
const ATHOSSign = lazy(() => import('../pages/modules/ATHOSSign'));
const Modelos = lazy(() => import('../pages/modules/Modelos'));
const Assinaturas = lazy(() => import('../pages/modules/Assinaturas'));
const Chatbot = lazy(() => import('../pages/modules/Chatbot'));
const RelatoriosIA = lazy(() => import('../pages/modules/RelatoriosIA'));
const ATHOSSupport = lazy(() => import('../pages/modules/ATHOSSupport'));
const Chamados = lazy(() => import('../pages/modules/Chamados'));
const Inventario = lazy(() => import('../pages/modules/Inventario'));
const ATHOSProjects = lazy(() => import('../pages/modules/ATHOSProjects'));
const Tarefas = lazy(() => import('../pages/modules/Tarefas'));
const KanbanBoard = lazy(() => import('../pages/modules/KanbanBoard'));
const ATHOSPeople = lazy(() => import('../pages/modules/ATHOSPeople'));
const Funcionarios = lazy(() => import('../pages/modules/Funcionarios'));
const PontoDigital = lazy(() => import('../pages/modules/PontoDigital'));
const Onboarding = lazy(() => import('../pages/modules/Onboarding'));
const Perfil = lazy(() => import('../pages/Perfil'));
const CambomSharePoints = lazy(() => import('../pages/modules/CambomSharePoints'));

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      <span className="text-sm text-gray-500">Carregando...</span>
    </div>
  </div>
);

const LazyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <LazyWrapper>{children}</LazyWrapper>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LazyWrapper>{children}</LazyWrapper>;
};

const ProtectedLayout: React.FC = () => (
  <ProtectedRoute>
    <AppLayout />
  </ProtectedRoute>
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/socios" element={<SociosPage />} />
        <Route path="/drive" element={<ATHOSDrive />} />
        
        <Route path="/flow" element={<ATHOSFlow />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/funil" element={<FunilComercial />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
        
        <Route path="/finance" element={<ATHOSFinance />} />
        <Route path="/contas-pagar" element={<ContasPagar />} />
        <Route path="/contas-receber" element={<ContasReceber />} />
        <Route path="/fluxo-caixa" element={<FluxoCaixa />} />
        <Route path="/dre" element={<DRE />} />
        <Route path="/previsao" element={<PrevisãoIA />} />
        
        <Route path="/sign" element={<ATHOSSign />} />

        <Route path="/modelos" element={<Modelos />} />
        <Route path="/assinaturas" element={<Assinaturas />} />
        
        <Route path="/ai" element={<ATHOSAI />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/relatorios-ia" element={<RelatoriosIA />} />
        
        <Route path="/support" element={<ATHOSSupport />} />
        <Route path="/chamados" element={<Chamados />} />
        <Route path="/inventario" element={<Inventario />} />
        
        <Route path="/projects" element={<ATHOSProjects />} />
        <Route path="/tarefas" element={<Tarefas />} />
        <Route path="/kanban" element={<KanbanBoard />} />
        
        <Route path="/people" element={<ATHOSPeople />} />
        <Route path="/funcionarios" element={<Funcionarios />} />
        <Route path="/ponto" element={<PontoDigital />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route path="/financeiro" element={<Financeiro />} />
        <Route path="/setores" element={<SetoresPage />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/banco-dados" element={<BancoDados />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/despesas" element={<DespesasPage />} />
        
        <Route path="/sharepoints" element={<CambomSharePoints />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
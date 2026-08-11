import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../lib/auth';
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
const MobileHome = lazy(() => import('../pages/modules/MobileHome'));
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
const CentroCustos = lazy(() => import('../pages/modules/CentroCustos'));
const DFCPage = lazy(() => import('../pages/modules/DFC'));
const BalancoPatrimonial = lazy(() => import('../pages/modules/BalancoPatrimonial'));
const ATHOSProjects = lazy(() => import('../pages/modules/ATHOSProjects'));
const Tarefas = lazy(() => import('../pages/modules/Tarefas'));
const KanbanBoard = lazy(() => import('../pages/modules/KanbanBoard'));
const ATHOSPeople = lazy(() => import('../pages/modules/ATHOSPeople'));
const Funcionarios = lazy(() => import('../pages/modules/Funcionarios'));
const PontoDigital = lazy(() => import('../pages/modules/PontoDigital'));
const Onboarding = lazy(() => import('../pages/modules/Onboarding'));
const Perfil = lazy(() => import('../pages/Perfil'));
const CambomSharePoints = lazy(() => import('../pages/modules/CambomSharePoints'));
const ConciliacaoBancaria = lazy(() => import('../pages/modules/ConciliacaoBancaria'));
const Pix = lazy(() => import('../pages/modules/Pix'));
const Boletos = lazy(() => import('../pages/modules/Boletos'));
const Cartoes = lazy(() => import('../pages/modules/Cartoes'));

const MobileLayout = lazy(() => import('../components/MobileLayout'));
const MobileApp = lazy(() => import('../pages/mobile/MobileApp'));

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
  if (loading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <LazyWrapper>{children}</LazyWrapper>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <LazyWrapper>{children}</LazyWrapper>;
};

const RoleRoute: React.FC<{ roles: UserRole[]; children: React.ReactNode }> = ({ roles, children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'master' || user.role === 'admin') return <LazyWrapper>{children}</LazyWrapper>;
  if (roles.includes(user.role)) return <LazyWrapper>{children}</LazyWrapper>;
  return <Navigate to="/dashboard" replace />;
};

const ProtectedLayout: React.FC = () => (
  <ProtectedRoute>
    <AppLayout />
  </ProtectedRoute>
);

const MobileLayoutWrapper: React.FC = () => (
  <ProtectedRoute>
    <LazyWrapper>
      <MobileLayout />
    </LazyWrapper>
  </ProtectedRoute>
);

const MobileAppWrapper: React.FC = () => (
  <ProtectedRoute>
    <LazyWrapper>
      <MobileApp />
    </LazyWrapper>
  </ProtectedRoute>
);

export const AppRoutes: React.FC = () => {
  const isMobileDomain = 
    window.location.hostname.startsWith('m.') || 
    window.location.hostname.startsWith('app.') ||
    window.location.hostname.includes('mobile') ||
    window.location.search.includes('pwa=true') ||
    window.location.search.includes('mobile=true');

  if (isMobileDomain) {
    return (
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        
        {/* Mobile PWA - New App */}
        <Route element={<MobileAppWrapper />}>
          <Route path="/" element={<MobileApp />} />
          <Route path="/dashboard" element={<MobileApp />} />
          <Route path="/finance" element={<MobileApp />} />
          <Route path="/flow" element={<MobileApp />} />
          <Route path="/ai" element={<MobileApp />} />
          <Route path="/projects" element={<MobileApp />} />
          <Route path="/support" element={<MobileApp />} />
          <Route path="/tarefas" element={<MobileApp />} />
          <Route path="/ponto" element={<MobileApp />} />
          <Route path="/drive" element={<MobileApp />} />
          <Route path="/whatsapp" element={<MobileApp />} />
          <Route path="/pix" element={<MobileApp />} />
          <Route path="/boletos" element={<MobileApp />} />
          <Route path="/cartoes" element={<MobileApp />} />
          
          {/* Redirects to normalize any desktop /m/... subpaths */}
          <Route path="/m" element={<Navigate to="/" replace />} />
          <Route path="/m/dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/m/finance" element={<Navigate to="/finance" replace />} />
          <Route path="/m/flow" element={<Navigate to="/flow" replace />} />
          <Route path="/m/ai" element={<Navigate to="/ai" replace />} />
          <Route path="/m/projects" element={<Navigate to="/projects" replace />} />
          <Route path="/m/support" element={<Navigate to="/support" replace />} />
          <Route path="/m/tarefas" element={<Navigate to="/tarefas" replace />} />
          <Route path="/m/ponto" element={<Navigate to="/ponto" replace />} />
          <Route path="/m/drive" element={<Navigate to="/drive" replace />} />
          <Route path="/m/whatsapp" element={<Navigate to="/whatsapp" replace />} />
          <Route path="/m/pix" element={<Navigate to="/pix" replace />} />
          <Route path="/m/boletos" element={<Navigate to="/boletos" replace />} />
          <Route path="/m/cartoes" element={<Navigate to="/cartoes" replace />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  // Normal Desktop Web Routes
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/socios" element={<SociosPage />} />
        <Route path="/drive" element={<ATHOSDrive />} />

        <Route path="/flow" element={
          <RoleRoute roles={['comercial', 'gerente']}>
            <ATHOSFlow />
          </RoleRoute>
        } />
        <Route path="/leads" element={
          <RoleRoute roles={['comercial']}>
            <Leads />
          </RoleRoute>
        } />
        <Route path="/funil" element={
          <RoleRoute roles={['comercial']}>
            <FunilComercial />
          </RoleRoute>
        } />
        <Route path="/whatsapp" element={<WhatsApp />} />

        <Route path="/finance" element={
          <RoleRoute roles={['financeiro', 'gerente']}>
            <ATHOSFinance />
          </RoleRoute>
        } />
        <Route path="/contas-pagar" element={
          <RoleRoute roles={['financeiro']}>
            <ContasPagar />
          </RoleRoute>
        } />
        <Route path="/contas-receber" element={
          <RoleRoute roles={['financeiro']}>
            <ContasReceber />
          </RoleRoute>
        } />
        <Route path="/fluxo-caixa" element={
          <RoleRoute roles={['financeiro', 'gerente']}>
            <FluxoCaixa />
          </RoleRoute>
        } />
        <Route path="/dre" element={
          <RoleRoute roles={['financeiro', 'admin', 'master']}>
            <DRE />
          </RoleRoute>
        } />
        <Route path="/previsao" element={
          <RoleRoute roles={['financeiro', 'gerente']}>
            <PrevisãoIA />
          </RoleRoute>
        } />
        <Route path="/centro-custos" element={
          <RoleRoute roles={['financeiro', 'admin', 'master']}>
            <CentroCustos />
          </RoleRoute>
        } />
        <Route path="/dfc" element={
          <RoleRoute roles={['financeiro', 'admin', 'master']}>
            <DFCPage />
          </RoleRoute>
        } />
        <Route path="/balanco" element={
          <RoleRoute roles={['financeiro', 'admin', 'master']}>
            <BalancoPatrimonial />
          </RoleRoute>
        } />
        <Route path="/conciliacao" element={
          <RoleRoute roles={['financeiro', 'admin', 'master']}>
            <ConciliacaoBancaria />
          </RoleRoute>
        } />
        <Route path="/pix" element={
          <RoleRoute roles={['financeiro', 'admin', 'master']}>
            <Pix />
          </RoleRoute>
        } />
        <Route path="/boletos" element={
          <RoleRoute roles={['financeiro', 'admin', 'master']}>
            <Boletos />
          </RoleRoute>
        } />
        <Route path="/cartoes" element={
          <RoleRoute roles={['financeiro', 'admin', 'master']}>
            <Cartoes />
          </RoleRoute>
        } />

        <Route path="/sign" element={<ATHOSSign />} />
        <Route path="/modelos" element={
          <RoleRoute roles={['juridico']}>
            <Modelos />
          </RoleRoute>
        } />
        <Route path="/assinaturas" element={
          <RoleRoute roles={['juridico']}>
            <Assinaturas />
          </RoleRoute>
        } />

        <Route path="/ai" element={<ATHOSAI />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/relatorios-ia" element={<RelatoriosIA />} />

        <Route path="/support" element={<ATHOSSupport />} />
        <Route path="/chamados" element={<Chamados />} />
        <Route path="/inventario" element={<Inventario />} />

        <Route path="/projects" element={<ATHOSProjects />} />
        <Route path="/tarefas" element={<Tarefas />} />
        <Route path="/kanban" element={<KanbanBoard />} />

        <Route path="/people" element={
          <RoleRoute roles={['rh']}>
            <ATHOSPeople />
          </RoleRoute>
        } />
        <Route path="/funcionarios" element={
          <RoleRoute roles={['rh']}>
            <Funcionarios />
          </RoleRoute>
        } />
        <Route path="/ponto" element={<PontoDigital />} />
        <Route path="/onboarding" element={
          <RoleRoute roles={['rh']}>
            <Onboarding />
          </RoleRoute>
        } />

        <Route path="/financeiro" element={
          <RoleRoute roles={['financeiro', 'admin', 'master']}>
            <Financeiro />
          </RoleRoute>
        } />
        <Route path="/setores" element={<SetoresPage />} />
        <Route path="/relatorios" element={
          <RoleRoute roles={['admin', 'master', 'gerente']}>
            <Relatorios />
          </RoleRoute>
        } />
        <Route path="/banco-dados" element={
          <RoleRoute roles={['admin', 'master']}>
            <BancoDados />
          </RoleRoute>
        } />
        <Route path="/usuarios" element={
          <RoleRoute roles={['admin', 'master']}>
            <UsuariosPage />
          </RoleRoute>
        } />
        <Route path="/configuracoes" element={
          <RoleRoute roles={['admin', 'master']}>
            <Configuracoes />
          </RoleRoute>
        } />
        <Route path="/despesas" element={<DespesasPage />} />
        <Route path="/sharepoints" element={<CambomSharePoints />} />
      </Route>

      <Route element={<MobileLayoutWrapper />}>
        <Route path="/m" element={<MobileApp />} />
        <Route path="/m/dashboard" element={<MobileApp />} />
        <Route path="/m/finance" element={<MobileApp />} />
        <Route path="/m/flow" element={<MobileApp />} />
        <Route path="/m/ai" element={<MobileApp />} />
        <Route path="/m/projects" element={<MobileApp />} />
        <Route path="/m/support" element={<MobileApp />} />
        <Route path="/m/tarefas" element={<MobileApp />} />
        <Route path="/m/ponto" element={<MobileApp />} />
        <Route path="/m/drive" element={<MobileApp />} />
        <Route path="/m/whatsapp" element={<MobileApp />} />
        <Route path="/m/pix" element={<MobileApp />} />
        <Route path="/m/boletos" element={<MobileApp />} />
        <Route path="/m/cartoes" element={<MobileApp />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;

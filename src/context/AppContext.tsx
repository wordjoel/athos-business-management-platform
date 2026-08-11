import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Alerta } from '../types';

interface UsuarioLogado {
  email: string;
  nome: string;
  avatar: string;
  telefone?: string;
}

interface DadosEmpresa {
  razaoSocial: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  site: string;
  segmento: string;
  dataAbertura: string;
}

interface AppState {
  currentPage: string;
  darkMode: boolean;
  sidebarCollapsed: boolean;
  alertas: Alerta[];
  aiPanelOpen: boolean;
  selectedSetor: string;
  nomeEmpresa: string;
  dadosEmpresa: DadosEmpresa;
  usuarioLogado: UsuarioLogado | null;
}

interface AppContextType extends AppState {
  setCurrentPage: (page: string) => void;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
  toggleAIPanel: () => void;
  markAlertRead: (id: string) => void;
  setSelectedSetor: (setor: string) => void;
  setNomeEmpresa: (nome: string) => void;
  setDadosEmpresa: (dados: Partial<DadosEmpresa>) => void;
  unreadAlertCount: number;
  isOnline: boolean;
  setOnlineStatus: (online: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const setOnlineStatus = useCallback((online: boolean) => setIsOnline(online), []);

  const [state, setState] = useState<AppState>(() => {
    const savedNome = localStorage.getItem('athos_nome_empresa');
    const savedDados = localStorage.getItem('athos_dados_empresa');
    const savedUsuario = localStorage.getItem('athos_usuario_logado');
    const dadosEmpresa: DadosEmpresa = savedDados ? JSON.parse(savedDados) : {
      razaoSocial: 'ATHOS Solution Tecnologia LTDA',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      site: '',
      segmento: '',
      dataAbertura: '',
    };
    return {
      currentPage: 'dashboard',
      darkMode: true,
      sidebarCollapsed: false,
      alertas: [] as Alerta[],
      aiPanelOpen: false,
      selectedSetor: 'todos',
      nomeEmpresa: savedNome || 'ATHOS',
      dadosEmpresa,
      usuarioLogado: savedUsuario ? JSON.parse(savedUsuario) : null,
    };
  });

  const setCurrentPage = useCallback((page: string) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  // Terminal CLI design system is dark-only by spec — the toggle stays wired
  // (so it doesn't crash any existing caller) but no longer switches modes.
  const toggleDarkMode = useCallback(() => {}, []);

  const toggleSidebar = useCallback(() => {
    setState(prev => ({ ...prev, sidebarCollapsed: !prev.sidebarCollapsed }));
  }, []);

  const toggleAIPanel = useCallback(() => {
    setState(prev => ({ ...prev, aiPanelOpen: !prev.aiPanelOpen }));
  }, []);

  const markAlertRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      alertas: prev.alertas.map(a => a.id === id ? { ...a, lido: true } : a),
    }));
  }, []);

  const setSelectedSetor = useCallback((setor: string) => {
    setState(prev => ({ ...prev, selectedSetor: setor }));
  }, []);

  const setNomeEmpresa = useCallback((nome: string) => {
    localStorage.setItem('athos_nome_empresa', nome);
    setState(prev => ({ ...prev, nomeEmpresa: nome }));
  }, []);

  const setDadosEmpresa = useCallback((dados: Partial<DadosEmpresa>) => {
    const newDados = { ...state.dadosEmpresa, ...dados };
    localStorage.setItem('athos_dados_empresa', JSON.stringify(newDados));
    setState(prev => ({ ...prev, dadosEmpresa: newDados }));
  }, [state.dadosEmpresa]);

  const unreadAlertCount = state.alertas.filter(a => !a.lido).length;

  return (
    <AppContext.Provider value={{
      ...state,
      setCurrentPage,
      toggleDarkMode,
      toggleSidebar,
      toggleAIPanel,
      markAlertRead,
      setSelectedSetor,
      setNomeEmpresa,
      setDadosEmpresa,
      unreadAlertCount,
      isOnline,
      setOnlineStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

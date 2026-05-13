import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Alerta } from '../types';
import { alertas as mockAlertas } from '../data/mockData';

interface AppState {
  currentPage: string;
  darkMode: boolean;
  isLoggedIn: boolean;
  sidebarCollapsed: boolean;
  alertas: Alerta[];
  aiPanelOpen: boolean;
  selectedSetor: string;
}

interface AppContextType extends AppState {
  setCurrentPage: (page: string) => void;
  toggleDarkMode: () => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  toggleSidebar: () => void;
  toggleAIPanel: () => void;
  markAlertRead: (id: string) => void;
  setSelectedSetor: (setor: string) => void;
  unreadAlertCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    currentPage: 'dashboard',
    darkMode: true,
    isLoggedIn: false,
    sidebarCollapsed: false,
    alertas: mockAlertas,
    aiPanelOpen: false,
    selectedSetor: 'todos',
  });

  const setCurrentPage = useCallback((page: string) => {
    setState(prev => ({ ...prev, currentPage: page }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
  }, []);

  const login = useCallback((email: string, _password: string) => {
    if (email) {
      setState(prev => ({ ...prev, isLoggedIn: true }));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setState(prev => ({ ...prev, isLoggedIn: false, currentPage: 'dashboard' }));
  }, []);

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

  const unreadAlertCount = state.alertas.filter(a => !a.lido).length;

  return (
    <AppContext.Provider value={{
      ...state,
      setCurrentPage,
      toggleDarkMode,
      login,
      logout,
      toggleSidebar,
      toggleAIPanel,
      markAlertRead,
      setSelectedSetor,
      unreadAlertCount,
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

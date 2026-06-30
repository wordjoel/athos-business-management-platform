import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { automations } from '../services/automations';
import { lancamentoService } from '../services/lancamentoService';
import { seedAllData } from '../services/seedData';

export const SystemInit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setOnlineStatus } = useApp();

  useEffect(() => {
    seedAllData();
    automations.setupDefaultRules();
    api.useExisting('athos_lancamentos', lancamentoService);
    api.syncToSupabase();
  }, []);

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setOnlineStatus(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      automations.stopAll();
    };
  }, [setOnlineStatus]);

  return <>{children}</>;
};

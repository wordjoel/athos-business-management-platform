import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { automations } from '../services/automations';
import { seedAllData } from '../services/seedData';
import { refreshLancamentos } from '../services/lancamentoService';

export const SystemInit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setOnlineStatus } = useApp();

  useEffect(() => {
    seedAllData();
    automations.setupDefaultRules();
    refreshLancamentos().catch(err => console.error('Falha ao carregar lançamentos do Supabase:', err));
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

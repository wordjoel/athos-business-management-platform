import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);

    const duration = toast.duration || 5000;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[]; removeToast: (id: string) => void }> = ({
  toasts,
  removeToast,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle className="text-[#33ff00]" size={20} />,
    error: <XCircle className="text-[#ff3333]" size={20} />,
    warning: <AlertCircle className="text-[#ffb000]" size={20} />,
    info: <Info className="text-[#33ff00]" size={20} />,
  };

  const labels = {
    success: '[OK]',
    error: '[ERR]',
    warning: '[WARN]',
    info: '[INFO]',
  };

  const colors = {
    success: 'border-[#33ff00]',
    error: 'border-[#ff3333]',
    warning: 'border-[#ffb000]',
    info: 'border-[#33ff00]',
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 border bg-[#0a0a0a] ${colors[toast.type]} animate-slide-up`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#33ff00]">{labels[toast.type]} {toast.title}</p>
        {toast.message && (
          <p className="text-xs text-[#3f9e5c] mt-1 line-clamp-2">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="text-[#3f9e5c] hover:text-[#33ff00] transition-colors"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export default ToastProvider;
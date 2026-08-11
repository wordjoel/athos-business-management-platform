import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { alertas as mockAlertas } from '../data/mockData';

const Header: React.FC = () => {
  const { unreadAlertCount, markAlertRead } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-14 px-5 flex items-center justify-between border-b border-[#1f521f] bg-[#0a0a0a]">
      {/* Left: Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 border border-[#1f521f]">
          <span className="text-[#33ff00]">~$</span>
          <input
            type="text"
            placeholder="buscar..."
            className="bg-transparent text-xs outline-none w-40 text-[#33ff00] placeholder-[#1f521f]"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 transition-all text-[#3f9e5c] hover:text-[#33ff00] hover:bg-[#0d1a0d]"
          >
            <Bell size={16} />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#33ff00] text-[#0a0a0a] text-[9px] font-bold flex items-center justify-center">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-14 w-96 z-50 overflow-hidden animate-slide-up bg-[#0a0a0a] border border-[#1f521f]">
              <div className="p-4 border-b border-[#1f521f] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#33ff00]">// NOTIFICACOES</h3>
                <span className="text-xs text-[#ffb000] font-medium">{unreadAlertCount} não lidas</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockAlertas.slice(0, 5).map(alerta => (
                  <button
                    key={alerta.id}
                    onClick={() => markAlertRead(alerta.id)}
                    className={`w-full text-left p-4 border-b border-[#1f521f] transition-colors hover:bg-[#0d1a0d] ${!alerta.lido ? 'bg-[#0f2610]' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-1.5 flex-shrink-0 ${
                        alerta.gravidade === 'alta' ? 'bg-[#ff3333]' : alerta.gravidade === 'media' ? 'bg-[#ffb000]' : 'bg-[#33ff00]'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-[#33ff00]">{alerta.titulo}</p>
                        <p className="text-xs mt-0.5 text-[#3f9e5c]">{alerta.descricao}</p>
                        <p className="text-[10px] mt-1 text-[#1f521f]">{alerta.data}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 transition-all hover:bg-[#0d1a0d]"
          >
            <div className="w-7 h-7 border border-[#33ff00] flex items-center justify-center text-[#33ff00] text-xs font-bold">
              {user?.avatar || 'US'}
            </div>
            <span className="text-xs hidden sm:block text-[#3f9e5c]">{user?.nome?.split(' ')[0] || 'Usuário'}</span>
            <ChevronDown size={12} className="text-[#1f521f]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-48 z-50 overflow-hidden bg-[#0a0a0a] border border-[#1f521f]">
              <div className="p-3 border-b border-[#1f521f]">
                <p className="text-xs font-medium text-[#33ff00]">{user?.nome || 'Usuário'}</p>
                <p className="text-[10px] text-[#3f9e5c]">{user?.email || 'usuario@athos.com'}</p>
              </div>
              <div className="p-2">
                <button onClick={() => { navigate('/perfil'); setShowUserMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-[#3f9e5c] hover:bg-[#0d1a0d] hover:text-[#33ff00]">
                  <User size={14} /> Meu Perfil
                </button>
                {user?.role === 'admin' && (
                  <button onClick={() => { navigate('/configuracoes'); setShowUserMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-[#3f9e5c] hover:bg-[#0d1a0d] hover:text-[#33ff00]">
                    <Settings size={14} /> Configurações
                  </button>
                )}
                <hr className="my-1 border-[#1f521f]" />
                <button onClick={async () => { await logout(); navigate('/login'); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-[#ff3333] hover:bg-[#1f0000]">
                  <LogOut size={14} /> Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

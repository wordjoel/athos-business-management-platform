import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Bell, User, Settings, LogOut, ChevronDown, Search } from 'lucide-react';
import { alertas as mockAlertas } from '../data/mockData';

const Header: React.FC = () => {
  const { unreadAlertCount, markAlertRead } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-14 px-5 flex items-center justify-between border-b border-[#2A2F3D] bg-[#0B0E14]">
      {/* Left: Search */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2A2F3D] bg-[#131722] focus-within:border-[#C9A961]/60 transition-colors">
          <Search size={13} className="text-[#8B93A6]" />
          <input
            type="text"
            placeholder="Buscar..."
            className="bg-transparent text-xs outline-none w-40 text-[#E9E4D8] placeholder-[#4E5468]"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg transition-all text-[#8B93A6] hover:text-[#C9A961] hover:bg-[#12151E]"
          >
            <Bell size={16} />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#C9A961] text-[#0B0E14] text-[9px] font-bold flex items-center justify-center">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-14 w-96 z-50 overflow-hidden animate-slide-up rounded-xl bg-[#131722] border border-[#232837] shadow-2xl">
              <div className="p-4 border-b border-[#232837] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#F0E6CC]">Notificações</h3>
                <span className="text-xs text-[#5B7FA8] font-medium">{unreadAlertCount} não lidas</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockAlertas.slice(0, 5).map(alerta => (
                  <button
                    key={alerta.id}
                    onClick={() => markAlertRead(alerta.id)}
                    className={`w-full text-left p-4 border-b border-[#232837] transition-colors hover:bg-[#12151E] ${!alerta.lido ? 'bg-[#1E2430]' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        alerta.gravidade === 'alta' ? 'bg-[#A6484A]' : alerta.gravidade === 'media' ? 'bg-[#5B7FA8]' : 'bg-[#C9A961]'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-[#E9E4D8]">{alerta.titulo}</p>
                        <p className="text-xs mt-0.5 text-[#8B93A6]">{alerta.descricao}</p>
                        <p className="text-[10px] mt-1 text-[#4E5468]">{alerta.data}</p>
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
            className="flex items-center gap-2 p-1.5 rounded-lg transition-all hover:bg-[#12151E]"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#0B0E14] text-xs font-bold" style={{ background: 'linear-gradient(135deg, #E0C583 0%, #C9A961 55%, #A98A47 100%)' }}>
              {user?.avatar || 'US'}
            </div>
            <span className="text-xs hidden sm:block text-[#8B93A6]">{user?.nome?.split(' ')[0] || 'Usuário'}</span>
            <ChevronDown size={12} className="text-[#4E5468]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-48 z-50 overflow-hidden rounded-xl bg-[#131722] border border-[#232837] shadow-2xl">
              <div className="p-3 border-b border-[#232837]">
                <p className="text-xs font-medium text-[#F0E6CC]">{user?.nome || 'Usuário'}</p>
                <p className="text-[10px] text-[#8B93A6]">{user?.email || 'usuario@athos.com'}</p>
              </div>
              <div className="p-2">
                <button onClick={() => { navigate('/perfil'); setShowUserMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-[#8B93A6] hover:bg-[#12151E] hover:text-[#C9A961]">
                  <User size={14} /> Meu Perfil
                </button>
                {user?.role === 'admin' && (
                  <button onClick={() => { navigate('/configuracoes'); setShowUserMenu(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-[#8B93A6] hover:bg-[#12151E] hover:text-[#C9A961]">
                    <Settings size={14} /> Configurações
                  </button>
                )}
                <hr className="my-1 border-[#232837]" />
                <button onClick={async () => { await logout(); navigate('/login'); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-[#C06A6C] hover:bg-[#A6484A]/10">
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

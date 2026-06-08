import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { alertas as mockAlertas } from '../data/mockData';

const Header: React.FC = () => {
  const { darkMode, unreadAlertCount, markAlertRead } = useApp();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className={`h-14 px-5 flex items-center justify-between border-b ${
      darkMode ? 'bg-gray-900/50 border-white/5' : 'bg-white/50 border-gray-200'
    }`}>
      {/* Left: Search */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 rounded-lg px-3 py-1.5 ${
          darkMode ? 'bg-gray-800/30 border border-white/5' : 'bg-gray-50 border border-gray-200'
        }`}>
          <Search size={14} className={darkMode ? 'text-gray-600' : 'text-gray-400'} />
          <input
            type="text"
            placeholder="Buscar..."
            className={`bg-transparent text-xs outline-none w-40 ${darkMode ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`}
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
<button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-lg transition-all ${
              darkMode ? 'text-gray-500 hover:text-cyan-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <Bell size={16} />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-cyan-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {unreadAlertCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={`absolute right-0 top-14 w-96 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up ${
              darkMode ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-200'
            }`}>
              <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notificações</h3>
                <span className="text-xs text-athos-400 font-medium">{unreadAlertCount} não lidas</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {mockAlertas.slice(0, 5).map(alerta => (
                  <button
                    key={alerta.id}
                    onClick={() => markAlertRead(alerta.id)}
                    className={`w-full text-left p-4 border-b transition-colors ${
                      darkMode ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'
                    } ${!alerta.lido ? (darkMode ? 'bg-athos-500/5' : 'bg-athos-50/50') : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        alerta.gravidade === 'alta' ? 'bg-red-400' : alerta.gravidade === 'media' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{alerta.titulo}</p>
                        <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{alerta.descricao}</p>
                        <p className={`text-[10px] mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{alerta.data}</p>
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
            className={`flex items-center gap-2 p-1.5 rounded-lg transition-all ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center text-white text-xs font-bold">
              {user?.avatar || 'US'}
            </div>
            <span className={`text-xs hidden sm:block ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>{user?.nome?.split(' ')[0] || 'Usuário'}</span>
            <ChevronDown size={12} className={darkMode ? 'text-gray-600' : 'text-gray-400'} />
          </button>

          {showUserMenu && (
            <div className={`absolute right-0 top-12 w-48 rounded-lg shadow-lg z-50 overflow-hidden ${
              darkMode ? 'bg-gray-800 border border-white/10' : 'bg-white border border-gray-200'
            }`}>
              <div className={`p-3 border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                <p className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.nome || 'Usuário'}</p>
                <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{user?.email || 'usuario@athos.com'}</p>
              </div>
              <div className="p-2">
                <button onClick={() => { navigate('/perfil'); setShowUserMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <User size={14} /> Meu Perfil
                </button>
                <button onClick={() => { navigate('/configuracoes'); setShowUserMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Settings size={14} /> Configurações
                </button>
                <hr className={`my-1 ${darkMode ? 'border-white/5' : 'border-gray-100'}`} />
                <button onClick={async () => { await logout(); navigate('/login'); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-red-400 hover:bg-red-500/10`}>
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

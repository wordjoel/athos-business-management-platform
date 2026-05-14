import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Search, Moon, Sun, User, Settings, LogOut, ChevronDown, Calendar } from 'lucide-react';
import { alertas as mockAlertas } from '../data/mockData';

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode, unreadAlertCount, markAlertRead, logout, setCurrentPage, usuarioLogado } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className={`h-16 px-6 flex items-center justify-between border-b transition-colors ${
      darkMode ? 'bg-gray-950/80 border-white/5 backdrop-blur-xl' : 'bg-white/80 border-gray-200 backdrop-blur-xl'
    }`}>
      {/* Left: Search */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all ${
          darkMode ? 'bg-white/5 border border-white/5 focus-within:border-athos-500/50 focus-within:bg-white/8' : 'bg-gray-50 border border-gray-200 focus-within:border-athos-400'
        }`}>
          <Search size={16} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
          <input
            type="text"
            placeholder="Buscar na plataforma..."
            className={`bg-transparent text-sm outline-none w-64 ${darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
          />
          <kbd className={`text-[10px] px-1.5 py-0.5 rounded ${darkMode ? 'bg-white/10 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>⌘K</kbd>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Date */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium ${
          darkMode ? 'text-gray-400 bg-white/5' : 'text-gray-500 bg-gray-50'
        }`}>
          <Calendar size={12} />
          <span>15 Jan 2025</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className={`p-2.5 rounded-xl transition-all ${
            darkMode ? 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2.5 rounded-xl transition-all relative ${
              darkMode ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Bell size={18} />
            {unreadAlertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-slow">
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
            className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-all ${
              darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-100'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 flex items-center justify-center text-gray-900 text-xs font-bold">
              {usuarioLogado?.avatar || 'US'}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${darkMode ? 'text-white' : 'text-gray-900'}`}>{usuarioLogado?.nome?.split(' ')[0] || 'Usuário'}</span>
            <ChevronDown size={14} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
          </button>

          {showUserMenu && (
            <div className={`absolute right-0 top-14 w-56 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-up ${
              darkMode ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-200'
            }`}>
              <div className={`p-4 border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
                <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{usuarioLogado?.nome || 'Usuário'}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{usuarioLogado?.email || 'usuario@athos.com'}</p>
              </div>
              <div className="p-2">
                <button className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <User size={14} /> Meu Perfil
                </button>
                <button onClick={() => { setCurrentPage('configuracoes'); setShowUserMenu(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${darkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <Settings size={14} /> Configurações
                </button>
                <hr className={`my-1 ${darkMode ? 'border-white/5' : 'border-gray-100'}`} />
                <button onClick={logout} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors text-red-400 hover:bg-red-500/10`}>
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

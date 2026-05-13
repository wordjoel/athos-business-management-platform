import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, Search, UserPlus, MoreVertical } from 'lucide-react';
import { users } from '../data/mockData';

const UsuariosPage: React.FC = () => {
  const { darkMode } = useApp();

  const roleLabels: Record<string, string> = {
    admin: 'Administrador', manager: 'Gerente', user: 'Usuário', viewer: 'Visualizador'
  };
  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/10 text-red-400', manager: 'bg-athos-500/10 text-athos-400', user: 'bg-emerald-500/10 text-emerald-400', viewer: 'bg-gray-500/10 text-gray-400'
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Users size={24} className="text-athos-400" /> Usuários
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gestão de usuários, permissões e níveis de acesso</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-athos text-white text-sm font-medium shadow-glow">
          <UserPlus size={14} /> Novo Usuário
        </button>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className={`p-4 border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full max-w-sm ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <Search size={14} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
            <input type="text" placeholder="Buscar usuário..." className={`bg-transparent text-sm outline-none flex-1 ${darkMode ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`} />
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {users.map(user => (
            <div key={user.id} className={`flex items-center justify-between p-5 transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold gradient-athos`}>{user.avatar}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</p>
                    {!user.active && <span className="text-[10px] bg-gray-500/10 text-gray-400 px-1.5 py-0.5 rounded">Inativo</span>}
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{user.email} • {user.sector}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${roleColors[user.role]}`}>{roleLabels[user.role]}</span>
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{user.lastLogin}</span>
                <button className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}><MoreVertical size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions */}
      <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Matriz de Permissões por Nível</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'bg-white/[0.02]' : 'bg-gray-50'}>
                {['Permissão', 'Admin', 'Gerente', 'Usuário', 'Visualizador'].map(h => (
                  <th key={h} className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-left ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
              {[
                ['Dashboard', true, true, true, true],
                ['Financeiro', true, true, true, false],
                ['Relatórios', true, true, true, true],
                ['Usuários', true, true, false, false],
                ['Configurações', true, false, false, false],
                ['Banco de Dados', true, true, false, false],
                ['IA Assistente', true, true, true, true],
                ['Logs de Auditoria', true, true, false, false],
              ].map(([perm, ...levels], i) => (
                <tr key={i} className={darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}>
                  <td className={`px-4 py-3 text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{perm as string}</td>
                  {levels.map((hasAccess, j) => (
                    <td key={j} className="px-4 py-3">
                      {hasAccess ? (
                        <span className="text-emerald-400 text-sm">●</span>
                      ) : (
                        <span className="text-gray-600 text-sm">○</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsuariosPage;

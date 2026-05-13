import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Lock, Key, Download, Activity } from 'lucide-react';
import { logs } from '../data/mockData';

const SegurancaPage: React.FC = () => {
  const { darkMode } = useApp();
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Shield size={24} className="text-athos-400" /> Segurança
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Configurações de segurança e logs de auditoria</p>
        </div>
      </div>

      {/* Security Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Autenticação</h3>
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <Key size={16} className="text-athos-400" />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Alterar Senha</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Última alteração: 30 dias atrás</p>
                </div>
              </div>
              <button className="text-xs text-athos-400 font-medium hover:underline">Alterar</button>
            </div>
            <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <Lock size={16} className="text-emerald-400" />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Autenticação 2FA</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Proteção adicional na conta</p>
                </div>
              </div>
              <button onClick={() => setTwoFactor(!twoFactor)} className={`w-11 h-6 rounded-full transition-all ${twoFactor ? 'bg-emerald-500' : 'bg-gray-600'} relative`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${twoFactor ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
            <div className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <Activity size={16} className="text-blue-400" />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sessões Ativas</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>2 dispositivos conectados</p>
                </div>
              </div>
              <button className="text-xs text-red-400 font-medium hover:underline">Revogar</button>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notificações de Segurança</h3>
          <div className="space-y-4">
            {[
              { label: 'Alertas de login suspeito', desc: 'Notificar em caso de acesso não reconhecido', active: true },
              { label: 'Alterações de permissão', desc: 'Notificar quando permissões forem alteradas', active: true },
              { label: 'Exportação de dados', desc: 'Notificar quando dados forem exportados', active: false },
              { label: 'Resumo semanal de segurança', desc: 'Receber relatório semanal por e-mail', active: true },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
                </div>
                <button className={`w-11 h-6 rounded-full transition-all ${item.active ? 'bg-athos-500' : 'bg-gray-600'} relative`}>
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${item.active ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Logs */}
      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className={`p-5 border-b flex items-center justify-between ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Logs de Auditoria</h3>
          </div>
          <div className="flex items-center gap-2">
            <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${darkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              <Download size={12} /> Exportar
            </button>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {logs.map(log => (
            <div key={log.id} className={`flex items-center justify-between p-4 transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  log.acao.includes('Login') ? 'bg-emerald-500/10 text-emerald-400' :
                  log.acao.includes('Backup') ? 'bg-blue-500/10 text-blue-400' :
                  'bg-athos-500/10 text-athos-400'
                }`}>
                  <Activity size={14} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{log.acao}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{log.usuario} • {log.modulo}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{log.data}</p>
                <p className={`text-[11px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>{log.detalhes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SegurancaPage;

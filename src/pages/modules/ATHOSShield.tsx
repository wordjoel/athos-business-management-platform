import React from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Eye, AlertTriangle, Building2, MapPin, Camera, CheckCircle, Wifi, Clock, History, FileCheck, BarChart3 } from 'lucide-react';

const ATHOSShield: React.FC = () => {
  const { darkMode } = useApp();

  const stats = [
    { title: 'Câmeras Online', value: '8/10', icon: Camera, color: 'emerald' },
    { title: 'Alertas Hoje', value: '3', icon: AlertTriangle, color: 'amber' },
    { title: 'Ativos Monitorados', value: '127', icon: Building2, color: 'red' },
    { title: 'Conformidade', value: '94%', icon: FileCheck, color: 'violet' },
  ];

  const cameras = [
    { nome: 'Entrada Principal', local: 'Recepção', status: 'online', ultimoAcesso: '2 min', movimentacao: true },
    { nome: 'Estacionamento', local: 'Área Externa', status: 'online', ultimoAcesso: '5 min', movimentacao: true },
    { nome: 'Depósito', local: 'Armazém', status: 'offline', ultimoAcesso: '2h', movimentacao: false },
    { nome: 'Escritório', local: 'Sala de Reuniões', status: 'online', ultimoAcesso: '1 min', movimentacao: false },
  ];

  const alertasRecentes = [
    { tipo: 'movimento', titulo: 'Movimento detectado - Estacionamento', hora: '14:32', gravidade: 'baixa' },
    { tipo: 'acesso', titulo: 'Acesso após horário - Porta lateral', hora: '22:15', gravidade: 'alta' },
    { tipo: 'falha', titulo: 'Câmera Offline - Depósito', hora: '12:00', gravidade: 'media' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS Shield</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monitoramento e Segurança</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-lg">
          <Shield size={16} className="text-red-400" />
          <span className="text-sm font-medium text-red-400">Sistema Ativo</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={20} className={`text-${stat.color}-400`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Câmeras</h2>
            <button className="text-sm text-red-400 hover:text-red-300">Ver ao vivo →</button>
          </div>
          <div className="space-y-3">
            {cameras.map((cam, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    cam.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    <Eye size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{cam.nome}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{cam.local}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <Wifi size={12} className={cam.status === 'online' ? 'text-emerald-400' : 'text-red-400'} />
                    <span className={`text-xs ${cam.status === 'online' ? 'text-emerald-400' : 'text-red-400'}`}>{cam.status}</span>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{cam.ultimoAcesso}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Alertas Recentes</h2>
            <AlertTriangle size={16} className="text-amber-400" />
          </div>
          <div className="space-y-3">
            {alertasRecentes.map((alerta, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    alerta.gravidade === 'alta' ? 'bg-red-500/20 text-red-400' :
                    alerta.gravidade === 'media' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    <AlertTriangle size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{alerta.titulo}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{alerta.hora}</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                  alerta.gravidade === 'alta' ? 'bg-red-500/20 text-red-400' :
                  alerta.gravidade === 'media' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>{alerta.gravidade}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
            <MapPin size={18} className="text-red-400" />
          </div>
          <div>
            <p className="font-medium">Geolocalização</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>5 veículos monitorados</p>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <BarChart3 size={18} className="text-violet-400" />
          </div>
          <div>
            <p className="font-medium">Gestão de Risco</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>3 áreas críticas</p>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <History size={18} className="text-cyan-400" />
          </div>
          <div>
            <p className="font-medium">Checklist de Auditoria</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>12 verificações hoje</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATHOSShield;
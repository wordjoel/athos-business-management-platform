import React from 'react';
import { Camera, Eye, Wifi, WifiOff } from 'lucide-react';

const Cameras: React.FC = () => {
  const darkMode = true;
  const cameras = [
    { nome: 'Entrada Principal', local: 'Recepção', status: 'online' },
    { nome: 'Estacionamento', local: 'Área Externa', status: 'online' },
    { nome: 'Depósito', local: 'Armazém', status: 'offline' },
    { nome: 'Escritório', local: 'Sala de Reuniões', status: 'online' },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Câmeras</h1>
          <p className="text-gray-400">ATHOS Shield - Monitoramento</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Online</p>
          <p className="text-2xl font-bold text-emerald-400">8</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Offline</p>
          <p className="text-2xl font-bold text-red-400">2</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Total</p>
          <p className="text-2xl font-bold">10</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cameras.map((c, i) => (
          <div key={i} className="p-4 rounded-xl bg-gray-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Camera size={20} className="text-red-400" />
                <div>
                  <p className="font-medium">{c.nome}</p>
                  <p className="text-xs text-gray-400">{c.local}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {c.status === 'online' ? <Wifi size={14} className="text-emerald-400" /> : <WifiOff size={14} className="text-red-400" />}
                <span className={`text-xs font-medium px-2 py-1 rounded-lg ${c.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{c.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Cameras;
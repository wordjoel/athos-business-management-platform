import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const Alertas: React.FC = () => {
  const darkMode = true;
  const alertas = [
    { titulo: 'Movimento detectado - Estacionamento', hora: '14:32', gravidade: 'baixa' },
    { titulo: 'Acesso após horário - Porta lateral', hora: '22:15', gravidade: 'alta' },
    { titulo: 'Câmera Offline - Depósito', hora: '12:00', gravidade: 'media' },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Alertas</h1>
          <p className="text-gray-400">ATHOS Shield - Sistema de Alertas</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Total Hoje</p>
          <p className="text-2xl font-bold">12</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Não Lidos</p>
          <p className="text-2xl font-bold text-amber-400">3</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Resolvidos</p>
          <p className="text-2xl font-bold text-emerald-400">9</p>
        </div>
      </div>
      <div className="space-y-3">
        {alertas.map((a, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className={a.gravidade === 'alta' ? 'text-red-400' : a.gravidade === 'media' ? 'text-amber-400' : 'text-blue-400'} />
              <div>
                <p className="font-medium">{a.titulo}</p>
                <p className="text-xs text-gray-400">{a.hora}</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${a.gravidade === 'alta' ? 'bg-red-500/20 text-red-400' : a.gravidade === 'media' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>{a.gravidade}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Alertas;
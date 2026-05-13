import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileSignature, CheckCircle, Clock, Send } from 'lucide-react';

const Assinaturas: React.FC = () => {
  const { darkMode } = useApp();
  const assinaturas = [
    { documento: 'Tech Solutions - Contrato', parte: 'João Silva', status: 'assinado', data: '10/05' },
    { documento: 'Clínica Viva - Suporte', parte: 'Dr. Carlos', status: 'pendente', data: '12/05' },
    { documento: 'Restaurante Sabor - Sistema', parte: 'Maria Santos', status: 'enviado', data: '11/05' },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Assinaturas</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ATHOS Sign - Gestão de Assinaturas</p>
        </div>
      </div>
      <div className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <table className="w-full">
          <thead className={darkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th className="text-left p-4 text-sm font-medium">Documento</th>
              <th className="text-left p-4 text-sm font-medium">Parte</th>
              <th className="text-left p-4 text-sm font-medium">Data</th>
              <th className="text-left p-4 text-sm font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {assinaturas.map((a, i) => (
              <tr key={i} className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                <td className="p-4 text-sm">{a.documento}</td>
                <td className="p-4 text-sm text-gray-400">{a.parte}</td>
                <td className="p-4 text-sm">{a.data}</td>
                <td className="p-4">
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                    a.status === 'assinado' ? 'bg-emerald-500/20 text-emerald-400' :
                    a.status === 'pendente' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>{a.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Assinaturas;
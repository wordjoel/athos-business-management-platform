import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

const PontoDigital: React.FC = () => {
  const darkMode = true;
  const registros = [
    { nome: 'Kleber Duarte', entrada: '09:00', saida: '18:30', status: 'ok' },
    { nome: 'Luiz Victor', entrada: '09:15', saida: '-', status: 'em_andamento' },
    { nome: 'Joel Oliveira', entrada: '08:45', saida: '-', status: 'em_andamento' },
    { nome: 'Oscar Carvalho', entrada: '09:30', saida: '-', status: 'em_andamento' },
    { nome: 'Maurício Baro', entrada: '09:00', saida: '-', status: 'em_andamento' },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Ponto Digital</h1>
          <p className="text-gray-400">ATHOS People - Registro de Ponto</p>
        </div>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium">
          Registrar Ponto
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Presentes Hoje</p>
          <p className="text-2xl font-bold">22/24</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Atrasos</p>
          <p className="text-2xl font-bold text-amber-400">3</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <p className="text-sm text-gray-400">Faltas</p>
          <p className="text-2xl font-bold text-red-400">2</p>
        </div>
      </div>
      <div className="space-y-3">
        {registros.map((r, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
            <div>
              <p className="font-medium">{r.nome}</p>
              <p className="text-xs text-gray-400">Entrada: {r.entrada} • Saída: {r.saida}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${r.status === 'ok' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{r.status === 'ok' ? 'Registrado' : 'Em andamento'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default PontoDigital;
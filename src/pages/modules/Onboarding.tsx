import React from 'react';
import { Baby, GraduationCap, FileText } from 'lucide-react';

const Onboarding: React.FC = () => {
  const darkMode = true;
  const onboarding = [
    { nome: 'Pedro Santos', cargo: 'Analista', etapa: 'Documentos', dia: 3 },
    { nome: 'Mariana Costa', cargo: 'Desenvolvedora', etapa: 'Treinamento', dia: 7 },
  ];
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Onboarding</h1>
          <p className="text-gray-400">ATHOS People - Integração de Novos Funcionários</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-900/50">
          <Baby size={20} className="text-cyan-400 mb-2" />
          <p className="text-sm text-gray-400">Em Andamento</p>
          <p className="text-2xl font-bold">2</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <GraduationCap size={20} className="text-violet-400 mb-2" />
          <p className="text-sm text-gray-400">Concluídos (Mês)</p>
          <p className="text-2xl font-bold">4</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <FileText size={20} className="text-amber-400 mb-2" />
          <p className="text-sm text-gray-400">Pendências</p>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>
      <div className="space-y-3">
        {onboarding.map((o, i) => (
          <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50">
            <div>
              <p className="font-medium">{o.nome}</p>
              <p className="text-xs text-gray-400">{o.cargo}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-cyan-400">{o.etapa}</p>
              <p className="text-xs text-gray-400">Dia {o.dia}/10</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Onboarding;
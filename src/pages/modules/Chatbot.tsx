import React from 'react';
import { Bot, MessageSquare, Settings } from 'lucide-react';

const Chatbot: React.FC = () => {
  const darkMode = true;
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Chatbot</h1>
          <p className="text-gray-400">ATHOS AI - Atendimento Automático</p>
        </div>
        <button className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Bot size={16} /> Configurar
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gray-900/50">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} className="text-cyan-400" />
            <span className="text-sm text-gray-400">Mensagens Hoje</span>
          </div>
          <p className="text-2xl font-bold">47</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <div className="flex items-center gap-2 mb-2">
            <Bot size={16} className="text-emerald-400" />
            <span className="text-sm text-gray-400">Resolução Automática</span>
          </div>
          <p className="text-2xl font-bold">78%</p>
        </div>
        <div className="p-4 rounded-xl bg-gray-900/50">
          <div className="flex items-center gap-2 mb-2">
            <Settings size={16} className="text-violet-400" />
            <span className="text-sm text-gray-400">Fluxos Ativos</span>
          </div>
          <p className="text-2xl font-bold">5</p>
        </div>
      </div>
      <div className="p-8 bg-gray-900/30 rounded-xl text-center">
        <p className="text-gray-500">Pré-visualização do chatbot em breve</p>
      </div>
    </div>
  );
};
export default Chatbot;
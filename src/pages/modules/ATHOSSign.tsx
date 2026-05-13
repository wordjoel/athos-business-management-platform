import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileSignature, FileText, CheckCircle, Clock, AlertTriangle, Send, History, Scale, Sparkles, Upload, Eye } from 'lucide-react';

const ATHOSSign: React.FC = () => {
  const { darkMode } = useApp();

  const stats = [
    { title: 'Contratos Ativos', value: '34', icon: FileSignature, color: 'violet' },
    { title: 'Pendentes', value: '8', icon: Clock, color: 'amber' },
    { title: 'Assinados (Mês)', value: '12', icon: CheckCircle, color: 'emerald' },
    { title: 'Vencendo (30d)', value: '5', icon: AlertTriangle, color: 'red' },
  ];

  const contratos = [
    { titulo: 'Tech Solutions - Software', valor: 'R$ 15.000/mês', status: 'ativo', fim: '15/06/2026', tipo: 'licenca' },
    { titulo: 'Clínica Viva - Suporte', valor: 'R$ 2.500/mês', status: 'ativo', fim: '20/07/2026', tipo: 'prestacao' },
    { titulo: 'Restaurante Sabor - Sistema', valor: 'R$ 1.800/mês', status: 'pendente', fim: '-', tipo: 'licenca' },
    { titulo: 'Contabilidade Silva - Prestação', valor: 'R$ 3.000/mês', status: 'ativo', fim: '01/12/2026', tipo: 'prestacao' },
  ];

  const automateEnabled = [
    { nome: 'Renovação Automática', ativo: true },
    { nome: 'Alerta de Vencimento', ativo: true },
    { nome: 'Faturamento Automático', ativo: false },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS Sign</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Central de Contratos Inteligente</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 rounded-lg">
          <Sparkles size={16} className="text-violet-400" />
          <span className="text-sm font-medium text-violet-400">OCR Ativo</span>
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
            <h2 className="font-semibold">Contratos Recentes</h2>
            <button className="text-sm text-violet-400 hover:text-violet-300">Ver todos →</button>
          </div>
          <div className="space-y-3">
            {contratos.map((ct, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    ct.status === 'ativo' ? 'bg-emerald-500/20 text-emerald-400' :
                    ct.status === 'pendente' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    <FileText size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ct.titulo}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{ct.valor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
                    ct.status === 'ativo' ? 'bg-emerald-500/20 text-emerald-400' :
                    ct.status === 'pendente' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>{ct.status}</span>
                  {ct.fim !== '-' && <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Vence: {ct.fim}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-5 rounded-2xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-violet-400" />
            <h2 className="font-semibold">Automação de Contratos</h2>
          </div>
          <div className="space-y-3">
            {automateEnabled.map((auto, i) => (
              <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${auto.ativo ? 'bg-violet-500/20' : 'bg-gray-500/20'}`}>
                    <Send size={14} className={auto.ativo ? 'text-violet-400' : 'text-gray-400'} />
                  </div>
                  <span className="text-sm font-medium">{auto.nome}</span>
                </div>
                <button className={`w-10 h-5 rounded-full transition-colors ${auto.ativo ? 'bg-violet-500' : 'bg-gray-600'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transform transition-transform ${auto.ativo ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm font-medium text-violet-400 hover:text-violet-300 border border-violet-500/20 rounded-lg">
            Configurar Automação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
            <Upload size={18} className="text-violet-400" />
          </div>
          <div>
            <p className="font-medium">OCR de Documentos</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Digitalizar contratos</p>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <Scale size={18} className="text-cyan-400" />
          </div>
          <div>
            <p className="font-medium">Histórico Jurídico</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>148 versões salvas</p>
          </div>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'} flex items-center gap-4`}>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle size={18} className="text-emerald-400" />
          </div>
          <div>
            <p className="font-medium">Assinatura Digital</p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Hash de verificação</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ATHOSSign;
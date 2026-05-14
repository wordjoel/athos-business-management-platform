import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FileSignature, FileText, CheckCircle, Clock, AlertTriangle, Send, History, Scale, Sparkles, Upload, Eye, Plus, Trash2, X, Save, Building2 } from 'lucide-react';

interface Contrato {
  id: string;
  titulo: string;
  parte: string;
  valor: number;
  tipo: 'servico' | 'licenca' | 'parceria' | 'fornecimento';
  inicio: string;
  fim: string;
  status: 'rascunho' | 'enviado' | 'assinado' | 'ativo' | 'encerrado';
}

const ATHOSSign: React.FC = () => {
  const { darkMode } = useApp();

  const [contratos, setContratos] = useState<Contrato[]>(() => {
    const saved = localStorage.getItem('athos_contratos');
    return saved ? JSON.parse(saved) : [
      { id: '1', titulo: 'Software ATHOS Pro', parte: 'Tech Solutions LTDA', valor: 15000, tipo: 'licenca', inicio: '01/01/2026', fim: '01/01/2027', status: 'ativo' },
      { id: '2', titulo: 'Suporte Técnico', parte: 'Clínica Viva Saúde', valor: 2500, tipo: 'servico', inicio: '01/03/2026', fim: '01/03/2027', status: 'ativo' },
      { id: '3', titulo: 'Desenvolvimento App', parte: 'Restaurante Sabor', valor: 12000, tipo: 'servico', inicio: '15/04/2026', fim: '15/08/2026', status: 'enviado' },
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ titulo: '', parte: '', valor: '', tipo: 'servico', inicio: '', fim: '' });

  useEffect(() => { localStorage.setItem('athos_contratos', JSON.stringify(contratos)); }, [contratos]);

  const salvarContrato = () => {
    if (!formData.titulo || !formData.parte) return;
    const novo: Contrato = {
      id: Date.now().toString(),
      ...formData,
      valor: parseFloat(formData.valor) || 0,
      status: 'rascunho',
    };
    setContratos([novo, ...contratos]);
    setFormData({ titulo: '', parte: '', valor: '', tipo: 'servico', inicio: '', fim: '' });
    setShowForm(false);
  };

  const excluirContrato = (id: string) => {
    if (confirm('Excluir este contrato?')) setContratos(contratos.filter(c => c.id !== id));
  };

  const stats = [
    { title: 'Ativos', value: contratos.filter(c => c.status === 'ativo').length.toString(), icon: FileSignature, color: 'emerald' },
    { title: 'Pendentes', value: contratos.filter(c => c.status === 'enviado' || c.status === 'rascunho').length.toString(), icon: Clock, color: 'amber' },
    { title: 'Valor Mensal', value: `R$ ${contratos.filter(c => c.status === 'ativo').reduce((s, c) => s + c.valor, 0).toLocaleString()}`, icon: DollarSign, color: 'violet' },
    { title: 'Total Contratos', value: contratos.length.toString(), icon: FileText, color: 'cyan' },
  ];

  const statusCores: Record<string, string> = { rascunho: 'gray', enviado: 'blue', assinado: 'violet', ativo: 'emerald', encerrado: 'red' };
  const tipoLabels: Record<string, string> = { servico: 'Serviço', licenca: 'Licença', parceria: 'Parceria', fornecimento: 'Fornecimento' };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS Sign</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Central de Contratos - Dir. Adm: Joel Oliveira</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-violet-500 text-white rounded-lg text-sm font-medium hover:bg-violet-600 flex items-center gap-2">
          <Plus size={16} /> Novo Contrato
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={20} className={`text-${stat.color}-400`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.title}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl w-full max-w-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Novo Contrato</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Título</label>
                <input type="text" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Nome do contrato" />
              </div>
              <div>
                <label className="text-sm">Parte Contratante</label>
                <input type="text" value={formData.parte} onChange={e => setFormData({ ...formData, parte: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Nome da empresa/cliente" />
              </div>
              <div>
                <label className="text-sm">Valor Mensal (R$)</label>
                <input type="number" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="0,00" />
              </div>
              <div>
                <label className="text-sm">Tipo</label>
                <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value as any })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                  <option value="servico">Prestação de Serviço</option>
                  <option value="licenca">Licença de Software</option>
                  <option value="parceria">Parceria</option>
                  <option value="fornecimento">Fornecimento</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Início</label>
                  <input type="date" value={formData.inicio} onChange={e => setFormData({ ...formData, inicio: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" />
                </div>
                <div>
                  <label className="text-sm">Fim</label>
                  <input type="date" value={formData.fim} onChange={e => setFormData({ ...formData, fim: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" />
                </div>
              </div>
              <button onClick={salvarContrato} className="w-full py-2 bg-violet-500 rounded-lg font-medium hover:bg-violet-600 flex items-center justify-center gap-2">
                <Save size={16} /> Criar Contrato
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <h2 className="font-semibold mb-4">Contratos</h2>
        <div className="space-y-3">
          {contratos.map(ct => (
            <div key={ct.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <FileText size={18} className="text-violet-400" />
                </div>
                <div>
                  <p className="font-medium">{ct.titulo}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ct.parte} • {tipoLabels[ct.tipo]}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-emerald-400">R$ {ct.valor.toLocaleString()}/mês</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{ct.inicio} - {ct.fim}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${statusCores[ct.status]}-500/20 text-${statusCores[ct.status]}-400`}>
                  {ct.status}
                </span>
                <button onClick={() => excluirContrato(ct.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const DollarSign = () => <span>$</span>;

export default ATHOSSign;
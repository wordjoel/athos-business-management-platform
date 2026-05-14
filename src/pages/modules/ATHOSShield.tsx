import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Eye, AlertTriangle, Building2, MapPin, Camera, CheckCircle, Wifi, Clock, History, FileCheck, BarChart3, Plus, Trash2, X, Save } from 'lucide-react';

interface Ativo {
  id: string;
  nome: string;
  tipo: 'equipamento' | 'veiculo' | 'imovel' | 'software';
  local: string;
  responsavel: string;
  status: 'ativo' | 'manutencao' | 'inativo';
  valor: number;
}

const ATHOSShield: React.FC = () => {
  const { darkMode } = useApp();

  const [ativos, setAtivos] = useState<Ativo[]>(() => {
    const saved = localStorage.getItem('athos_ativos');
    return saved ? JSON.parse(saved) : [
      { id: '1', nome: 'Servidor Principal', tipo: 'equipamento', local: 'Data Center', responsavel: 'Kleber Duarte', status: 'ativo', valor: 25000 },
      { id: '2', nome: 'Notebook Dell XPS', tipo: 'equipamento', local: 'Escritório', responsavel: 'Oscar Carvalho', status: 'ativo', valor: 8000 },
      { id: '3', nome: 'Honda Civic - Placa ABC-1234', tipo: 'veiculo', local: 'Garagem', responsavel: 'Mauricio Baro', status: 'ativo', valor: 85000 },
      { id: '4', nome: 'Escritório Centro', tipo: 'imovel', local: 'Av. Paulista, 1000', responsavel: 'Joel Oliveira', status: 'ativo', valor: 500000 },
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nome: '', tipo: 'equipamento', local: '', responsavel: 'Kleber Duarte', valor: '' });

  useEffect(() => { localStorage.setItem('athos_ativos', JSON.stringify(ativos)); }, [ativos]);

  const salvarAtivo = () => {
    if (!formData.nome) return;
    const novo: Ativo = {
      id: Date.now().toString(),
      ...formData,
      valor: parseFloat(formData.valor) || 0,
      status: 'ativo',
    };
    setAtivos([novo, ...ativos]);
    setFormData({ nome: '', tipo: 'equipamento', local: '', responsavel: 'Kleber Duarte', valor: '' });
    setShowForm(false);
  };

  const excluirAtivo = (id: string) => {
    if (confirm('Excluir este ativo?')) setAtivos(ativos.filter(a => a.id !== id));
  };

  const stats = [
    { title: 'Total Ativos', value: ativos.length.toString(), icon: Building2, color: 'red' },
    { title: 'Ativos', value: ativos.filter(a => a.status === 'ativo').length.toString(), icon: CheckCircle, color: 'emerald' },
    { title: 'Manutenção', value: ativos.filter(a => a.status === 'manutencao').length.toString(), icon: AlertTriangle, color: 'amber' },
    { title: 'Valor Total', value: `R$ ${ativos.reduce((s, a) => s + a.valor, 0).toLocaleString()}`, icon: BarChart3, color: 'violet' },
  ];

  const tipoLabels: Record<string, string> = { equipamento: 'Equipamento', veiculo: 'Veículo', imovel: 'Imóvel', software: 'Software' };
  const statusCores: Record<string, string> = { ativo: 'emerald', manutencao: 'amber', inativo: 'gray' };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS Shield</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gestão de Ativos - Dir. Produtos: Mauricio Baro</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center gap-2">
          <Plus size={16} /> Novo Ativo
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
              <h2 className="text-xl font-bold">Novo Ativo</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Nome do Ativo</label>
                <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Nome do ativo" />
              </div>
              <div>
                <label className="text-sm">Tipo</label>
                <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value as any })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                  <option value="equipamento">Equipamento</option>
                  <option value="veiculo">Veículo</option>
                  <option value="imovel">Imóvel</option>
                  <option value="software">Software</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Localização</label>
                <input type="text" value={formData.local} onChange={e => setFormData({ ...formData, local: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Local onde está" />
              </div>
              <div>
                <label className="text-sm">Responsável</label>
                <select value={formData.responsavel} onChange={e => setFormData({ ...formData, responsavel: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                  <option value="Kleber Duarte">Kleber Duarte - CEO</option>
                  <option value="Luiz Victor">Luiz Victor - Comercial</option>
                  <option value="Joel Oliveira">Joel Oliveira - Adm/Financeiro</option>
                  <option value="Oscar Carvalho">Oscar Carvalho - Qualidade</option>
                  <option value="Mauricio Baro">Mauricio Baro - Produtos</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Valor (R$)</label>
                <input type="number" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="0,00" />
              </div>
              <button onClick={salvarAtivo} className="w-full py-2 bg-red-500 rounded-lg font-medium hover:bg-red-600 flex items-center justify-center gap-2">
                <Save size={16} /> Cadastrar Ativo
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <h2 className="font-semibold mb-4">Patrimônio</h2>
        <div className="space-y-3">
          {ativos.map(ativo => (
            <div key={ativo.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                  <Building2 size={18} className="text-red-400" />
                </div>
                <div>
                  <p className="font-medium">{ativo.nome}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{tipoLabels[ativo.tipo]} • {ativo.local}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold">R$ {ativo.valor.toLocaleString()}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Resp: {ativo.responsavel}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${statusCores[ativo.status]}-500/20 text-${statusCores[ativo.status]}-400`}>
                  {ativo.status}
                </span>
                <button onClick={() => excluirAtivo(ativo.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400">
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

export default ATHOSShield;
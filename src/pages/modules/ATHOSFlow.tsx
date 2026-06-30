import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BrainCircuit, TrendingUp, Users, MessageSquare, Zap, Target, ArrowRight, Clock, Star, Plus, Trash2, X, Save, Phone, Mail, Building2 } from 'lucide-react';

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
  valor: number;
  etapa: 'novo' | 'contatado' | 'qualificado' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';
  responsavel: string;
  ultimoContato: string;
}

const ATHOSFlow: React.FC = () => {
  const { darkMode } = useApp();

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('athos_leads');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '', empresa: '', valor: '', etapa: 'novo', responsavel: 'Kleber Duarte' });

  useEffect(() => { localStorage.setItem('athos_leads', JSON.stringify(leads)); }, [leads]);

  const salvarLead = () => {
    if (!formData.nome || !formData.empresa) return;
    const novo: Lead = {
      id: Date.now().toString(),
      ...formData,
      valor: parseFloat(formData.valor) || 0,
      ultimoContato: new Date().toLocaleDateString('pt-BR'),
    };
    setLeads([novo, ...leads]);
    setFormData({ nome: '', email: '', telefone: '', empresa: '', valor: '', etapa: 'novo', responsavel: 'Kleber Duarte' });
    setShowForm(false);
  };

  const excluirLead = (id: string) => {
    if (confirm('Excluir este lead?')) setLeads(leads.filter(l => l.id !== id));
  };

  const etapas = ['novo', 'contatado', 'qualificado', 'proposta', 'negociacao', 'fechado', 'perdido'];
  const etapaCores: Record<string, string> = { novo: 'gray', contatado: 'blue', qualificado: 'cyan', proposta: 'amber', negociacao: 'violet', fechado: 'emerald', perdido: 'red' };

  const stats = [
    { title: 'Leads Ativos', value: leads.length.toString(), change: '+12%', icon: Users, color: 'pink' },
    { title: 'Propostas', value: leads.filter(l => l.etapa === 'proposta').length.toString(), change: '+5%', icon: Target, color: 'violet' },
    { title: 'Fechados', value: leads.filter(l => l.etapa === 'fechado').length.toString(), change: '+3%', icon: TrendingUp, color: 'emerald' },
    { title: 'Valor Pipeline', value: `R$ ${leads.reduce((s, l) => s + l.valor, 0).toLocaleString()}`, icon: Star, color: 'amber' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS Flow</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>CRM Inteligente - Gestão de Vendas</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-pink-500/10 rounded-lg">
          <BrainCircuit size={16} className="text-pink-400" />
          <span className="text-sm font-medium text-pink-400">IA Ativa</span>
        </div>
      </div>

      <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 flex items-center gap-2">
        <Plus size={16} /> Novo Lead
      </button>

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
              <h2 className="text-xl font-bold">Novo Lead</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Nome</label>
                <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Nome do contato" />
              </div>
              <div>
                <label className="text-sm">Empresa</label>
                <input type="text" value={formData.empresa} onChange={e => setFormData({ ...formData, empresa: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Nome da empresa" />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="email@empresa.com" />
              </div>
              <div>
                <label className="text-sm">Telefone</label>
                <input type="tel" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="(00) 00000-0000" />
              </div>
              <div>
                <label className="text-sm">Valor Estimado (R$)</label>
                <input type="number" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="0,00" />
              </div>
              <div>
                <label className="text-sm">Responsável</label>
                <select value={formData.responsavel} onChange={e => setFormData({ ...formData, responsavel: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                  <option value="Kleber Duarte">Kleber Duarte - Sócio</option>
                  <option value="Joel Oliveira">Joel Oliveira - Sócio</option>
                  <option value="Oscar Carvalho">Oscar Carvalho - Sócio</option>
                </select>
              </div>
              <button onClick={salvarLead} className="w-full py-2 bg-pink-500 rounded-lg font-medium hover:bg-pink-600 flex items-center justify-center gap-2">
                <Save size={16} /> Salvar Lead
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <h2 className="font-semibold mb-4">Pipeline de Vendas</h2>
        <div className="space-y-3">
          {leads.map(lead => (
            <div key={lead.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400 font-bold">
                  {lead.nome.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{lead.nome}</p>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{lead.empresa}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${etapaCores[lead.etapa]}-500/20 text-${etapaCores[lead.etapa]}-400`}>
                  {lead.etapa}
                </span>
                <span className="font-semibold text-emerald-400">R$ {lead.valor.toLocaleString()}</span>
                <button onClick={() => excluirLead(lead.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400">
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

export default ATHOSFlow;
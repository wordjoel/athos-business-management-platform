import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { DollarSign, TrendingUp, TrendingDown, PieChart, Target, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Receipt, BarChart3, Brain, Plus, Trash2, Edit2, X, Save, Search, Filter } from 'lucide-react';

interface Transacao {
  id: string;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  categoria: string;
  data: string;
  status: 'pendente' | 'recebido' | 'pago';
}

const ATHOSFinance: React.FC = () => {
  const { darkMode } = useApp();

  const [transacoes, setTransacoes] = useState<Transacao[]>(() => {
    const saved = localStorage.getItem('athos_transacoes');
    return saved ? JSON.parse(saved) : [
      { id: '1', descricao: 'Tech Solutions - Janeiro', valor: 15000, tipo: 'receita', categoria: 'Serviços', data: '13/05', status: 'recebido' },
      { id: '2', descricao: 'Aluguel - Maio', valor: -8500, tipo: 'despesa', categoria: 'Aluguel', data: '12/05', status: 'pago' },
      { id: '3', descricao: 'Clínica Viva', valor: 8500, tipo: 'receita', categoria: 'Serviços', data: '11/05', status: 'recebido' },
      { id: '4', descricao: 'Contabilidade', valor: -2500, tipo: 'despesa', categoria: 'Serviços', data: '10/05', status: 'pago' },
      { id: '5', descricao: 'Restaurante Sabor', valor: 3200, tipo: 'receita', categoria: 'Serviços', data: '09/05', status: 'pendente' },
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [editingTransacao, setEditingTransacao] = useState<Transacao | null>(null);
  const [formData, setFormData] = useState({ descricao: '', valor: '', tipo: 'receita' as 'receita' | 'despesa', categoria: 'Serviços', data: '' });

  useEffect(() => { localStorage.setItem('athos_transacoes', JSON.stringify(transacoes)); }, [transacoes]);

  const receitasTotal = transacoes.filter(t => t.tipo === 'receita' && t.status === 'recebido').reduce((sum, t) => sum + t.valor, 0);
  const despesasTotal = transacoes.filter(t => t.tipo === 'despesa' && t.status === 'pago').reduce((sum, t) => sum + Math.abs(t.valor), 0);
  const saldo = receitasTotal - despesasTotal;

  const salvarTransacao = () => {
    if (!formData.descricao || !formData.valor) return;
    const nova: Transacao = {
      id: Date.now().toString(),
      descricao: formData.descricao,
      valor: formData.tipo === 'despesa' ? -Math.abs(parseFloat(formData.valor)) : parseFloat(formData.valor),
      tipo: formData.tipo,
      categoria: formData.categoria,
      data: formData.data || new Date().toLocaleDateString('pt-BR'),
      status: formData.tipo === 'receita' ? 'pendente' : 'pendente',
    };
    setTransacoes([nova, ...transacoes]);
    setFormData({ descricao: '', valor: '', tipo: 'receita', categoria: 'Serviços', data: '' });
    setShowForm(false);
  };

  const excluirTransacao = (id: string) => {
    if (confirm('Excluir esta transação?')) setTransacoes(transacoes.filter(t => t.id !== id));
  };

  const categorias = [
    { nome: 'Serviços', valor: transacoes.filter(t => t.categoria === 'Serviços').reduce((s, t) => s + Math.abs(t.valor), 0), cor: 'emerald' },
    { nome: 'Aluguel', valor: transacoes.filter(t => t.categoria === 'Aluguel').reduce((s, t) => s + Math.abs(t.valor), 0), cor: 'gray' },
    { nome: 'Marketing', valor: transacoes.filter(t => t.categoria === 'Marketing').reduce((s, t) => s + Math.abs(t.valor), 0), cor: 'amber' },
    { nome: 'Impostos', valor: transacoes.filter(t => t.categoria === 'Impostos').reduce((s, t) => s + Math.abs(t.valor), 0), cor: 'red' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS Finance</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gestão Financeira Inteligente</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 flex items-center gap-2">
          <Plus size={16} /> Nova Transação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight size={16} className="text-emerald-400" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Receitas</span>
          </div>
          <p className="text-2xl font-bold text-emerald-400">R$ {receitasTotal.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownRight size={16} className="text-red-400" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Despesas</span>
          </div>
          <p className="text-2xl font-bold text-red-400">R$ {despesasTotal.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} className="text-amber-400" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Saldo</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">R$ {saldo.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-violet-400" />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Transações</span>
          </div>
          <p className="text-2xl font-bold">{transacoes.length}</p>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl w-full max-w-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Nova Transação</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Tipo</label>
                <div className="flex gap-2 mt-1">
                  <button onClick={() => setFormData({ ...formData, tipo: 'receita' })} className={`flex-1 py-2 rounded-lg ${formData.tipo === 'receita' ? 'bg-emerald-500 text-white' : 'bg-gray-800'}`}>Receita</button>
                  <button onClick={() => setFormData({ ...formData, tipo: 'despesa' })} className={`flex-1 py-2 rounded-lg ${formData.tipo === 'despesa' ? 'bg-red-500 text-white' : 'bg-gray-800'}`}>Despesa</button>
                </div>
              </div>
              <div>
                <label className="text-sm">Descrição</label>
                <input type="text" value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Descrição da transação" />
              </div>
              <div>
                <label className="text-sm">Valor (R$)</label>
                <input type="number" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="0,00" />
              </div>
              <div>
                <label className="text-sm">Categoria</label>
                <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                  <option>Serviços</option>
                  <option>Aluguel</option>
                  <option>Marketing</option>
                  <option>Impostos</option>
                  <option>Outros</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Data</label>
                <input type="date" value={formData.data} onChange={e => setFormData({ ...formData, data: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" />
              </div>
              <button onClick={salvarTransacao} className="w-full py-2 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 flex items-center justify-center gap-2">
                <Save size={16} /> Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <h2 className="font-semibold mb-4">Transações Recentes</h2>
        <div className="space-y-2">
          {transacoes.map(t => (
            <div key={t.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.valor > 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                  {t.valor > 0 ? <ArrowUpRight size={14} className="text-emerald-400" /> : <ArrowDownRight size={14} className="text-red-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.descricao}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t.categoria} • {t.data}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`font-semibold ${t.valor > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {t.valor > 0 ? '+' : ''}R$ {Math.abs(t.valor).toLocaleString()}
                </span>
                <button onClick={() => excluirTransacao(t.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <h2 className="font-semibold mb-4">Por Categoria</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categorias.map((cat, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
              <div>
                <p className="text-sm font-medium">{cat.nome}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>R$ {cat.valor.toLocaleString()}</p>
              </div>
              <div className={`w-3 h-3 rounded-full bg-${cat.cor}-500`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ATHOSFinance;
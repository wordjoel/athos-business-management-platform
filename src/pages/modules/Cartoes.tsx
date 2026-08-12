import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, Plus, Search, X, Trash2, Lock, Unlock, AlertTriangle, CheckCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { getCartoes, criarCartao, bloquearCartao, desbloquearCartao, cancelarCartao, excluirCartao, getDespesasCartao, criarDespesaCartao, pagarDespesaCartao, excluirDespesaCartao, CartaoSocio, DespesaCartao } from '../../services/cartaoService';

const Cartoes: React.FC = () => {
  const { darkMode } = useApp();
  const { user } = useAuth();
  const [cartoes, setCartoes] = useState<CartaoSocio[]>([]);
  const [despesas, setDespesas] = useState<DespesaCartao[]>([]);
  const [showFormCartao, setShowFormCartao] = useState(false);
  const [showFormDespesa, setShowFormDespesa] = useState(false);
  const [selectedCartao, setSelectedCartao] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState<'cartoes' | 'despesas'>('cartoes');

  const [formCartao, setFormCartao] = useState({
    socioNome: '', socioEmail: '', bandeira: 'visa' as const, ultimos4digitos: '', limiteTotal: '',
  });

  const [formDespesa, setFormDespesa] = useState({
    descricao: '', valor: '', categoria: '', data: '', totalParcelas: '',
  });

  const carregar = () => {
    setCartoes(getCartoes());
    setDespesas(getDespesasCartao(selectedCartao || undefined));
  };

  useEffect(() => { carregar(); }, [selectedCartao]);

  const salvarCartao = () => {
    if (!formCartao.socioNome || !formCartao.limiteTotal) return;
    criarCartao({
      socioNome: formCartao.socioNome,
      socioEmail: formCartao.socioEmail,
      bandeira: formCartao.bandeira,
      ultimos4digitos: formCartao.ultimos4digitos || '0000',
      limiteTotal: parseFloat(formCartao.limiteTotal),
    });
    carregar();
    setFormCartao({ socioNome: '', socioEmail: '', bandeira: 'visa', ultimos4digitos: '', limiteTotal: '' });
    setShowFormCartao(false);
  };

  const salvarDespesa = () => {
    if (!selectedCartao || !formDespesa.descricao || !formDespesa.valor) return;
    const cartao = cartoes.find(c => c.id === selectedCartao);
    criarDespesaCartao({
      cartaoId: selectedCartao,
      socioNome: cartao?.socioNome || '',
      descricao: formDespesa.descricao,
      valor: parseFloat(formDespesa.valor),
      categoria: formDespesa.categoria || 'Geral',
      data: formDespesa.data || new Date().toLocaleDateString('pt-BR'),
      totalParcelas: formDespesa.totalParcelas ? parseInt(formDespesa.totalParcelas) : undefined,
    });
    carregar();
    setFormDespesa({ descricao: '', valor: '', categoria: '', data: '', totalParcelas: '' });
    setShowFormDespesa(false);
  };

  const getBandeiraColor = (b: string) => {
    switch (b) {
      case 'visa': return 'from-blue-600 to-blue-800';
      case 'mastercard': return 'from-red-500 to-orange-600';
      case 'elo': return 'from-yellow-500 to-yellow-700';
      case 'amex': return 'from-green-600 to-green-800';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getBandeiraBg = (b: string) => {
    switch (b) {
      case 'visa': return 'bg-blue-500/20 text-blue-400';
      case 'mastercard': return 'bg-red-500/20 text-red-400';
      case 'elo': return 'bg-yellow-500/20 text-yellow-400';
      case 'amex': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const despesasFiltradas = despesas.filter(d => {
    return d.descricao.toLowerCase().includes(searchTerm.toLowerCase()) || d.socioNome.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalLimite = cartoes.reduce((s, c) => s + c.limiteTotal, 0);
  const totalUsado = cartoes.reduce((s, c) => s + c.limiteUsado, 0);
  const totalDisponivel = cartoes.reduce((s, c) => s + c.limiteDisponivel, 0);
  const totalDespesasPendentes = despesas.filter(d => d.status === 'pendente').reduce((s, d) => s + d.valor, 0);

  const getStatusDespesa = (s: string) => {
    switch (s) {
      case 'paga': return 'bg-emerald-500/20 text-emerald-400';
      case 'pendente': return 'bg-amber-500/20 text-amber-400';
      case 'atrasada': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Cartões dos Sócios</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Crédito e despesas de cada sócio</p>
        </div>
        <div className="flex gap-2">
          {tab === 'cartoes' && (
            <button onClick={() => setShowFormCartao(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
              <Plus size={16} /> Novo Cartão
            </button>
          )}
          {tab === 'despesas' && selectedCartao && (
            <button onClick={() => setShowFormDespesa(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
              <Plus size={16} /> Nova Despesa
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><DollarSign size={14} className="text-cyan-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Limite Total</span></div>
          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>R$ {totalLimite.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><TrendingDown size={14} className="text-red-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Usado</span></div>
          <p className="text-lg font-bold text-red-400">R$ {totalUsado.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><TrendingUp size={14} className="text-emerald-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Disponível</span></div>
          <p className="text-lg font-bold text-emerald-400">R$ {totalDisponivel.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><AlertTriangle size={14} className="text-amber-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Pendentes</span></div>
          <p className="text-lg font-bold text-amber-400">R$ {totalDespesasPendentes.toLocaleString()}</p>
        </div>
      </div>

      <div className={`flex gap-1 p-1 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
        {(['cartoes', 'despesas'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-1.5 rounded text-xs font-medium transition-colors ${tab === t ? (darkMode ? 'bg-cyan-600 text-white' : 'bg-cyan-500 text-white') : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}`}>
            {t === 'cartoes' ? 'Cartões' : 'Despesas'}
          </button>
        ))}
      </div>

      {tab === 'cartoes' && (
        <div className="space-y-3">
          {cartoes.map(c => (
            <div key={c.id} className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r ${getBandeiraColor(c.bandeira)} text-white shadow-lg`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs opacity-80 mb-1">{c.socioNome}</p>
                  <p className="text-lg font-bold tracking-wider">•••• •••• •••• {c.ultimos4digitos}</p>
                  <p className="text-xs opacity-70 mt-1">{c.bandeira.toUpperCase()}</p>
                </div>
                <div className="flex gap-1">
                  {c.status === 'ativo' ? (
                    <button onClick={() => { bloquearCartao(c.id); carregar(); }} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><Lock size={14} /></button>
                  ) : (
                    <button onClick={() => { desbloquearCartao(c.id); carregar(); }} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><Unlock size={14} /></button>
                  )}
                  <button onClick={() => { if (confirm('Excluir cartão?')) { excluirCartao(c.id); carregar(); } }} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] opacity-70">Limite Total</p>
                  <p className="text-sm font-bold">R$ {c.limiteTotal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] opacity-70">Usado</p>
                  <p className="text-sm font-bold">R$ {c.limiteUsado.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-[10px] opacity-70">Disponível</p>
                  <p className="text-sm font-bold">R$ {c.limiteDisponivel.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: `${Math.min(100, (c.limiteUsado / c.limiteTotal) * 100)}%` }} />
                </div>
                <p className="text-[10px] opacity-70 mt-1">{Math.round((c.limiteUsado / c.limiteTotal) * 100)}% utilizado</p>
              </div>
              <button onClick={() => { setSelectedCartao(c.id); setTab('despesas'); }} className="mt-3 w-full py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors">
                Ver Despesas
              </button>
            </div>
          ))}
          {cartoes.length === 0 && <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhum cartão cadastrado.</p>}
        </div>
      )}

      {tab === 'despesas' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          {selectedCartao && (
            <div className="mb-3">
              <select value={selectedCartao || ''} onChange={e => setSelectedCartao(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none">
                <option value="">Todos os cartões</option>
                {cartoes.map(c => <option key={c.id} value={c.id}>{c.socioNome} - •••• {c.ultimos4digitos}</option>)}
              </select>
            </div>
          )}
          {!selectedCartao && (
            <div className="mb-3">
              <select value={selectedCartao || ''} onChange={e => setSelectedCartao(e.target.value)} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none">
                <option value="">Selecione um cartão</option>
                {cartoes.map(c => <option key={c.id} value={c.id}>{c.socioNome} - •••• {c.ultimos4digitos}</option>)}
              </select>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 mb-3">
            <Search size={14} className="text-gray-500" />
            <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar despesa..." className="bg-transparent text-sm outline-none text-white placeholder-gray-600 w-full" />
          </div>
          <div className="space-y-2">
            {despesasFiltradas.map(d => (
              <div key={d.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{d.descricao}</p>
                  <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{d.socioNome} • {d.data} • {d.categoria}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-cyan-400">R$ {d.valor.toLocaleString()}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusDespesa(d.status)}`}>{d.status}</span>
                  <div className="flex gap-1">
                    {d.status === 'pendente' && (
                      <button onClick={() => { pagarDespesaCartao(d.id); carregar(); }} className="p-1 text-emerald-400 hover:text-emerald-300"><CheckCircle size={14} /></button>
                    )}
                    <button onClick={() => { if (confirm('Excluir despesa?')) { excluirDespesaCartao(d.id); carregar(); } }} className="p-1 text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
            {despesasFiltradas.length === 0 && <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma despesa encontrada.</p>}
          </div>
        </div>
      )}

      {showFormCartao && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-5 rounded-xl w-full max-w-md border ${darkMode ? 'bg-gray-800 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Novo Cartão</h2>
              <button onClick={() => setShowFormCartao(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={formCartao.socioNome} onChange={e => setFormCartao({ ...formCartao, socioNome: e.target.value })} placeholder="Nome do sócio" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="email" value={formCartao.socioEmail} onChange={e => setFormCartao({ ...formCartao, socioEmail: e.target.value })} placeholder="E-mail do sócio" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <select value={formCartao.bandeira} onChange={e => setFormCartao({ ...formCartao, bandeira: e.target.value as any })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none">
                <option value="visa">Visa</option>
                <option value="mastercard">Mastercard</option>
                <option value="elo">Elo</option>
                <option value="amex">Amex</option>
                <option value="outros">Outros</option>
              </select>
              <input type="text" value={formCartao.ultimos4digitos} onChange={e => setFormCartao({ ...formCartao, ultimos4digitos: e.target.value })} placeholder="Últimos 4 dígitos" maxLength={4} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="number" value={formCartao.limiteTotal} onChange={e => setFormCartao({ ...formCartao, limiteTotal: e.target.value })} placeholder="Limite de crédito (R$)" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <button onClick={salvarCartao} className="w-full py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">Cadastrar Cartão</button>
            </div>
          </div>
        </div>
      )}

      {showFormDespesa && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-5 rounded-xl w-full max-w-md border ${darkMode ? 'bg-gray-800 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nova Despesa</h2>
              <button onClick={() => setShowFormDespesa(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={formDespesa.descricao} onChange={e => setFormDespesa({ ...formDespesa, descricao: e.target.value })} placeholder="Descrição da despesa" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="number" value={formDespesa.valor} onChange={e => setFormDespesa({ ...formDespesa, valor: e.target.value })} placeholder="Valor (R$)" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="text" value={formDespesa.categoria} onChange={e => setFormDespesa({ ...formDespesa, categoria: e.target.value })} placeholder="Categoria" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="date" value={formDespesa.data} onChange={e => setFormDespesa({ ...formDespesa, data: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="number" value={formDespesa.totalParcelas} onChange={e => setFormDespesa({ ...formDespesa, totalParcelas: e.target.value })} placeholder="Parcelas (opcional)" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <button onClick={salvarDespesa} className="w-full py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">Registrar Despesa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cartoes;

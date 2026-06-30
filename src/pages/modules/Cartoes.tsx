import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CreditCard, Plus, X, Lock, Unlock, ArrowUpRight, ArrowDownLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { getCartoes, criarCartao, bloquearCartao, desbloquearCartao, cancelarCartao, getFaturas, pagarFatura, getTransacoesCartao, criarTransacaoCartao, estornarTransacao, seedCartoesPadrao, Cartao, FaturaCartao, TransacaoCartao } from '../../services/cartaoService';

const Cartoes: React.FC = () => {
  const { darkMode } = useApp();
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [faturas, setFaturas] = useState<FaturaCartao[]>([]);
  const [transacoes, setTransacoes] = useState<TransacaoCartao[]>([]);
  const [aba, setAba] = useState<'cartoes' | 'faturas' | 'transacoes'>('cartoes');
  const [showFormCartao, setShowFormCartao] = useState(false);
  const [showFormTransacao, setShowFormTransacao] = useState(false);
  const [formDataCartao, setFormDataCartao] = useState({
    nome: '', bandeira: 'visa' as const, ultimos4digitos: '', limite: '', diaFechamento: '5', diaVencimento: '15',
  });
  const [formDataTransacao, setFormDataTransacao] = useState({
    cartaoId: '', descricao: '', valor: '', categoria: 'Geral', data: new Date().toISOString().slice(0, 10),
  });

  const carregar = () => {
    seedCartoesPadrao();
    setCartoes(getCartoes());
    setFaturas(getFaturas());
    setTransacoes(getTransacoesCartao());
  };

  useEffect(() => { carregar(); }, []);

  const salvarCartao = () => {
    if (!formDataCartao.nome || !formDataCartao.limite) return;
    criarCartao({
      nome: formDataCartao.nome,
      bandeira: formDataCartao.bandeira,
      ultimos4digitos: formDataCartao.ultimos4digitos,
      limite: parseFloat(formDataCartao.limite),
      diaFechamento: parseInt(formDataCartao.diaFechamento),
      diaVencimento: parseInt(formDataCartao.diaVencimento),
    });
    carregar();
    setFormDataCartao({ nome: '', bandeira: 'visa', ultimos4digitos: '', limite: '', diaFechamento: '5', diaVencimento: '15' });
    setShowFormCartao(false);
  };

  const salvarTransacao = () => {
    if (!formDataTransacao.cartaoId || !formDataTransacao.descricao || !formDataTransacao.valor) return;
    const cartao = cartoes.find(c => c.id === formDataTransacao.cartaoId);
    if (!cartao) return;

    let fatura = faturas.find(f => f.cartaoId === formDataTransacao.cartaoId && !f.pago);
    if (!fatura) {
      const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      const now = new Date();
      fatura = { id: Date.now().toString(), cartaoId: formDataTransacao.cartaoId, mes: meses[now.getMonth()], ano: now.getFullYear(), valorTotal: 0, pago: false, criadaEm: new Date().toISOString().slice(0, 10) };
      // Note: we don't persist this here for simplicity, the transaction will handle it
    }

    criarTransacaoCartao({
      cartaoId: formDataTransacao.cartaoId,
      faturaId: fatura.id,
      descricao: formDataTransacao.descricao,
      valor: parseFloat(formDataTransacao.valor),
      data: formDataTransacao.data,
      categoria: formDataTransacao.categoria,
    });
    carregar();
    setFormDataTransacao({ cartaoId: '', descricao: '', valor: '', categoria: 'Geral', data: new Date().toISOString().slice(0, 10) });
    setShowFormTransacao(false);
  };

  const getBandeiraColor = (bandeira: string) => {
    switch (bandeira) {
      case 'visa': return 'from-blue-600 to-blue-800';
      case 'mastercard': return 'from-red-600 to-orange-600';
      case 'elo': return 'from-yellow-600 to-yellow-800';
      case 'amex': return 'from-green-600 to-green-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const totalLimite = cartoes.reduce((s, c) => s + c.limite, 0);
  const totalUtilizado = cartoes.reduce((s, c) => s + c.faturaAtual, 0);

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Cartões</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gestão de cartões de crédito</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowFormTransacao(true)} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${darkMode ? 'bg-gray-800/50 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            <Plus size={14} /> Nova Transação
          </button>
          <button onClick={() => setShowFormCartao(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <CreditCard size={16} /> Novo Cartão
          </button>
        </div>
      </div>

      <div className={`flex gap-1 p-1 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
        {(['cartoes', 'faturas', 'transacoes'] as const).map(a => (
          <button key={a} onClick={() => setAba(a)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${aba === a ? (darkMode ? 'bg-cyan-600 text-white' : 'bg-cyan-500 text-white') : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}`}>
            {a === 'cartoes' ? 'Cartões' : a === 'faturas' ? 'Faturas' : 'Transações'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><CreditCard size={14} className="text-cyan-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Limite Total</span></div>
          <p className="text-lg font-bold text-cyan-400">R$ {totalLimite.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><ArrowUpRight size={14} className="text-amber-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Utilizado</span></div>
          <p className="text-lg font-bold text-amber-400">R$ {totalUtilizado.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><ArrowDownLeft size={14} className="text-emerald-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Disponível</span></div>
          <p className="text-lg font-bold text-emerald-400">R$ {(totalLimite - totalUtilizado).toLocaleString()}</p>
        </div>
      </div>

      {aba === 'cartoes' && (
        <div className="space-y-3">
          {cartoes.map(c => (
            <div key={c.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
              <div className={`p-4 rounded-xl bg-gradient-to-r ${getBandeiraColor(c.bandeira)} text-white mb-3`}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-2">
                    <CreditCard size={20} />
                    <span className="text-sm font-medium">{c.nome}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-white/20 rounded">{c.bandeira.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] opacity-70">NÚMERO</p>
                    <p className="text-sm font-mono">•••• •••• •••• {c.ultimos4digitos}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] opacity-70">FECHAMENTO DIA {c.diaFechamento}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                  <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Limite</p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>R$ {c.limite.toLocaleString()}</p>
                </div>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                  <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Fatura</p>
                  <p className="text-sm font-medium text-amber-400">R$ {c.faturaAtual.toLocaleString()}</p>
                </div>
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                  <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Disponível</p>
                  <p className="text-sm font-medium text-emerald-400">R$ {c.limiteDisponivel.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {c.status === 'ativo' ? (
                  <button onClick={() => { bloquearCartao(c.id); carregar(); }} className="flex-1 py-1.5 bg-gray-700 rounded-lg text-gray-300 text-xs flex items-center justify-center gap-1"><Lock size={12} /> Bloquear</button>
                ) : (
                  <button onClick={() => { desbloquearCartao(c.id); carregar(); }} className="flex-1 py-1.5 bg-gray-700 rounded-lg text-gray-300 text-xs flex items-center justify-center gap-1"><Unlock size={12} /> Desbloquear</button>
                )}
                <button onClick={() => { cancelarCartao(c.id); carregar(); }} className="py-1.5 px-3 bg-gray-700 rounded-lg text-gray-400 hover:text-red-400 text-xs">Cancelar</button>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${Math.min((c.faturaAtual / c.limite) * 100, 100)}%` }} />
                </div>
                <p className={`text-[10px] mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{((c.faturaAtual / c.limite) * 100).toFixed(1)}% utilizado</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {aba === 'faturas' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Faturas</h3>
          <div className="space-y-2">
            {faturas.map(f => {
              const cartao = cartoes.find(c => c.id === f.cartaoId);
              return (
                <div key={f.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${f.pago ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
                      {f.pago ? <CheckCircle size={16} className="text-emerald-400" /> : <AlertCircle size={16} className="text-amber-400" />}
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cartao?.nome || 'Cartão'}</p>
                      <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{f.mes}/{f.ano}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-cyan-400">R$ {f.valorTotal.toLocaleString()}</span>
                    {!f.pago && (
                      <button onClick={() => { pagarFatura(f.id); carregar(); }} className="px-2 py-1 bg-emerald-600 rounded text-[10px] text-white">Pagar</button>
                    )}
                  </div>
                </div>
              );
            })}
            {faturas.length === 0 && <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma fatura encontrada.</p>}
          </div>
        </div>
      )}

      {aba === 'transacoes' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Transações no Cartão</h3>
          <div className="space-y-2">
            {transacoes.sort((a, b) => b.id.localeCompare(a.id)).map(t => {
              const cartao = cartoes.find(c => c.id === t.cartaoId);
              return (
                <div key={t.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'} ${t.status === 'estornada' ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center">
                      <CreditCard size={16} className="text-cyan-400" />
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.descricao}</p>
                      <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{cartao?.nome} • {t.data} • {t.categoria}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${t.status === 'estornada' ? 'text-gray-500 line-through' : 'text-red-400'}`}>
                      - R$ {t.valor.toLocaleString()}
                    </span>
                    {t.status !== 'estornada' && (
                      <button onClick={() => { estornarTransacao(t.id); carregar(); }} className="px-2 py-1 bg-gray-700 rounded text-[10px] text-gray-400 hover:text-white">Estornar</button>
                    )}
                  </div>
                </div>
              );
            })}
            {transacoes.length === 0 && <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma transação encontrada.</p>}
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
              <input type="text" value={formDataCartao.nome} onChange={e => setFormDataCartao({ ...formDataCartao, nome: e.target.value })} placeholder="Nome do cartão" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <select value={formDataCartao.bandeira} onChange={e => setFormDataCartao({ ...formDataCartao, bandeira: e.target.value as any })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none">
                <option value="visa">Visa</option><option value="mastercard">Mastercard</option><option value="elo">Elo</option><option value="amex">American Express</option><option value="outros">Outros</option>
              </select>
              <input type="text" value={formDataCartao.ultimos4digitos} onChange={e => setFormDataCartao({ ...formDataCartao, ultimos4digitos: e.target.value })} placeholder="Últimos 4 dígitos" maxLength={4} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="number" value={formDataCartao.limite} onChange={e => setFormDataCartao({ ...formDataCartao, limite: e.target.value })} placeholder="Limite (R$)" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Fechamento dia</label>
                  <input type="number" value={formDataCartao.diaFechamento} onChange={e => setFormDataCartao({ ...formDataCartao, diaFechamento: e.target.value })} min="1" max="31" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none mt-1" />
                </div>
                <div>
                  <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Vencimento dia</label>
                  <input type="number" value={formDataCartao.diaVencimento} onChange={e => setFormDataCartao({ ...formDataCartao, diaVencimento: e.target.value })} min="1" max="31" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none mt-1" />
                </div>
              </div>
              <button onClick={salvarCartao} className="w-full py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">Cadastrar Cartão</button>
            </div>
          </div>
        </div>
      )}

      {showFormTransacao && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-5 rounded-xl w-full max-w-md border ${darkMode ? 'bg-gray-800 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nova Transação no Cartão</h2>
              <button onClick={() => setShowFormTransacao(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <select value={formDataTransacao.cartaoId} onChange={e => setFormDataTransacao({ ...formDataTransacao, cartaoId: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none">
                <option value="">Selecione o cartão</option>
                {cartoes.filter(c => c.status === 'ativo').map(c => <option key={c.id} value={c.id}>{c.nome} (•••• {c.ultimos4digitos})</option>)}
              </select>
              <input type="text" value={formDataTransacao.descricao} onChange={e => setFormDataTransacao({ ...formDataTransacao, descricao: e.target.value })} placeholder="Descrição da compra" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="number" value={formDataTransacao.valor} onChange={e => setFormDataTransacao({ ...formDataTransacao, valor: e.target.value })} placeholder="Valor (R$)" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="date" value={formDataTransacao.data} onChange={e => setFormDataTransacao({ ...formDataTransacao, data: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <select value={formDataTransacao.categoria} onChange={e => setFormDataTransacao({ ...formDataTransacao, categoria: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none">
                <option>Geral</option><option>Alimentação</option><option>Transporte</option><option>Salúde</option><option>Educação</option><option>Lazer</option><option>Compras</option><option>Assinaturas</option><option>Outros</option>
              </select>
              <button onClick={salvarTransacao} className="w-full py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">Registrar Transação</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cartoes;

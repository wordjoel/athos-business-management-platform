import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Plus, Search, Check, X, Trash2, Copy, Clock, AlertTriangle, CheckCircle, Building2 } from 'lucide-react';
import { getBoletos, criarBoleto, baixarBoleto, cancelarBoleto, excluirBoleto, verificarVencidos, getCedentePadrao, Boleto } from '../../services/boletoService';

const Boletos: React.FC = () => {
  const { darkMode } = useApp();
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDetalhes, setShowDetalhes] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pendente' | 'pago' | 'vencido' | 'cancelado'>('todos');
  const [formData, setFormData] = useState({
    sacado: '', cpfCnpj: '', sacadoEndereco: '', valor: '', vencimento: '', observacao: '',
  });

  const cedente = getCedentePadrao();
  const carregar = () => { setBoletos(getBoletos()); };
  useEffect(() => { carregar(); }, []);

  const boletosFiltrados = boletos.filter(b => {
    const matchSearch = b.sacado.toLowerCase().includes(searchTerm.toLowerCase()) || b.cpfCnpj.includes(searchTerm);
    const matchStatus = filterStatus === 'todos' || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const vencidos = verificarVencidos();
  const totalPendente = boletos.filter(b => b.status === 'pendente').reduce((s, b) => s + b.valor, 0);
  const totalPago = boletos.filter(b => b.status === 'pago').reduce((s, b) => s + b.valor, 0);

  const salvar = () => {
    if (!formData.sacado || !formData.valor || !formData.vencimento) return;
    criarBoleto({
      sacado: formData.sacado,
      cpfCnpj: formData.cpfCnpj,
      sacadoEndereco: formData.sacadoEndereco,
      valor: parseFloat(formData.valor),
      vencimento: formData.vencimento,
      dataEmissao: new Date().toLocaleDateString('pt-BR'),
      observacao: formData.observacao,
    });
    carregar();
    setFormData({ sacado: '', cpfCnpj: '', sacadoEndereco: '', valor: '', vencimento: '', observacao: '' });
    setShowForm(false);
  };

  const baixar = (id: string) => {
    if (confirm('Marcar boleto como pago?')) {
      baixarBoleto(id);
      carregar();
    }
  };

  const cancelar = (id: string) => {
    if (confirm('Cancelar este boleto?')) {
      cancelarBoleto(id);
      carregar();
    }
  };

  const excluir = (id: string) => {
    if (confirm('Excluir este boleto permanentemente?')) {
      excluirBoleto(id);
      carregar();
      setShowDetalhes(null);
    }
  };

  const copiar = (texto: string) => {
    navigator.clipboard.writeText(texto).catch(() => {});
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-emerald-500/20 text-emerald-400';
      case 'pendente': return 'bg-amber-500/20 text-amber-400';
      case 'vencido': return 'bg-red-500/20 text-red-400';
      case 'cancelado': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const boletoDetalhes = showDetalhes ? boletos.find(b => b.id === showDetalhes) : null;

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Boletos</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Emissão e gestão de boletos bancários</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Novo Boleto
        </button>
      </div>

      <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2 mb-3">
          <Building2 size={16} className="text-cyan-400" />
          <span className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>CEDENTE</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Razão Social</p>
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cedente.cedenteNome}</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>CNPJ</p>
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cedente.cedenteCnpj}</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Endereço</p>
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cedente.cedenteEndereco} - {cedente.cedenteCidade}/{cedente.cedenteUf}</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>CEP</p>
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cedente.cedenteCep}</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Banco</p>
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cedente.cedenteBanco}</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Agência</p>
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cedente.cedenteAgencia}</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Conta</p>
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cedente.cedenteConta}</p>
          </div>
          <div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Carteira</p>
            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cedente.cedenteCarteira}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><FileText size={14} className="text-cyan-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total</span></div>
          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{boletos.length}</p>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><Clock size={14} className="text-amber-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Pendentes</span></div>
          <p className="text-lg font-bold text-amber-400">R$ {totalPendente.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><CheckCircle size={14} className="text-emerald-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Pagos</span></div>
          <p className="text-lg font-bold text-emerald-400">R$ {totalPago.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><AlertTriangle size={14} className="text-red-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Vencidos</span></div>
          <p className="text-lg font-bold text-red-400">{vencidos.length}</p>
        </div>
      </div>

      <div className={`flex gap-1 p-1 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
        {(['todos', 'pendente', 'pago', 'vencido', 'cancelado'] as const).map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${filterStatus === s ? (darkMode ? 'bg-cyan-600 text-white' : 'bg-cyan-500 text-white') : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}`}>
            {s === 'todos' ? 'Todos' : s === 'pendente' ? 'Pendente' : s === 'pago' ? 'Pago' : s === 'vencido' ? 'Vencido' : 'Cancelado'}
          </button>
        ))}
      </div>

      <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2 px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 mb-3">
          <Search size={14} className="text-gray-500" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Buscar por sacado ou CPF/CNPJ..." className="bg-transparent text-sm outline-none text-white placeholder-gray-600 w-full" />
        </div>
        <div className="space-y-2">
          {boletosFiltrados.map(b => (
            <div key={b.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'} hover:bg-gray-800/50 transition-colors cursor-pointer`} onClick={() => setShowDetalhes(b.id)}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${b.status === 'pago' ? 'bg-emerald-500/20' : b.status === 'vencido' ? 'bg-red-500/20' : 'bg-amber-500/20'}`}>
                  <FileText size={16} className={b.status === 'pago' ? 'text-emerald-400' : b.status === 'vencido' ? 'text-red-400' : 'text-amber-400'} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{b.sacado}</p>
                  <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{b.cpfCnpj} • Vence: {b.vencimento}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-cyan-400">R$ {b.valor.toLocaleString()}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(b.status)}`}>{b.status}</span>
              </div>
            </div>
          ))}
          {boletosFiltrados.length === 0 && <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhum boleto encontrado.</p>}
        </div>
      </div>

      {boletoDetalhes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-5 rounded-xl w-full max-w-lg border max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-gray-800 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Detalhes do Boleto</h2>
              <button onClick={() => setShowDetalhes(null)}><X size={18} className="text-gray-400" /></button>
            </div>

            <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <p className={`text-xs mb-2 font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>CEDENTE (ATHOS)</p>
              <div className="grid grid-cols-2 gap-2">
                <div><p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Razão Social</p><p className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{boletoDetalhes.cedenteNome}</p></div>
                <div><p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>CNPJ</p><p className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{boletoDetalhes.cedenteCnpj}</p></div>
                <div><p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Endereço</p><p className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{boletoDetalhes.cedenteEndereco} - {boletoDetalhes.cedenteCidade}/{boletoDetalhes.cedenteUf}</p></div>
                <div><p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Banco</p><p className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{boletoDetalhes.cedenteBanco} - Ag: {boletoDetalhes.cedenteAgencia} / Cc: {boletoDetalhes.cedenteConta}</p></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between"><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sacado</span><span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{boletoDetalhes.sacado}</span></div>
              <div className="flex justify-between"><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>CPF/CNPJ</span><span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{boletoDetalhes.cpfCnpj}</span></div>
              {boletoDetalhes.sacadoEndereco && <div className="flex justify-between"><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Endereço Sacado</span><span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{boletoDetalhes.sacadoEndereco}</span></div>}
              <div className="flex justify-between"><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Valor</span><span className="text-sm font-bold text-cyan-400">R$ {boletoDetalhes.valor.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Vencimento</span><span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{boletoDetalhes.vencimento}</span></div>
              <div className="flex justify-between"><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Emissão</span><span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{boletoDetalhes.dataEmissao}</span></div>
              <div className="flex justify-between"><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nosso Número</span><span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{boletoDetalhes.nossoNumero}</span></div>
              <div className="flex justify-between items-center"><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</span><span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(boletoDetalhes.status)}`}>{boletoDetalhes.status}</span></div>
              {boletoDetalhes.observacao && <div className="flex justify-between"><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Observação</span><span className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{boletoDetalhes.observacao}</span></div>}

              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Linha Digitável</p>
                <div className="flex items-center gap-2">
                  <code className={`text-xs flex-1 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{boletoDetalhes.linhaDigitavel}</code>
                  <button onClick={() => copiar(boletoDetalhes.linhaDigitavel)} className="p-1 text-gray-500 hover:text-cyan-400"><Copy size={12} /></button>
                </div>
              </div>

              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Código de Barras</p>
                <div className="flex items-center gap-2">
                  <code className={`text-xs flex-1 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{boletoDetalhes.codigoBarras}</code>
                  <button onClick={() => copiar(boletoDetalhes.codigoBarras)} className="p-1 text-gray-500 hover:text-cyan-400"><Copy size={12} /></button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {boletoDetalhes.status === 'pendente' && (
                  <button onClick={() => { baixar(boletoDetalhes.id); setShowDetalhes(null); }} className="flex-1 py-2 bg-emerald-600 rounded-lg text-white text-sm hover:bg-emerald-500 flex items-center justify-center gap-1">
                    <Check size={14} /> Baixar (Pago)
                  </button>
                )}
                {boletoDetalhes.status !== 'cancelado' && boletoDetalhes.status !== 'pago' && (
                  <button onClick={() => { cancelar(boletoDetalhes.id); setShowDetalhes(null); }} className="flex-1 py-2 bg-gray-700 rounded-lg text-gray-300 text-sm flex items-center justify-center gap-1">
                    <X size={14} /> Cancelar
                  </button>
                )}
                <button onClick={() => excluir(boletoDetalhes.id)} className="py-2 px-3 bg-gray-700 rounded-lg text-gray-400 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-5 rounded-xl w-full max-w-md border ${darkMode ? 'bg-gray-800 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Novo Boleto</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className={`p-3 rounded-lg mb-3 ${darkMode ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
              <p className={`text-[10px] mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Cedente: {cedente.cedenteNome} - {cedente.cedenteCnpj}</p>
              <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Banco: {cedente.cedenteBanco} | Ag: {cedente.cedenteAgencia} | Cc: {cedente.cedenteConta} | Carteira: {cedente.cedenteCarteira}</p>
            </div>
            <div className="space-y-3">
              <input type="text" value={formData.sacado} onChange={e => setFormData({ ...formData, sacado: e.target.value })} placeholder="Nome do sacado" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="text" value={formData.cpfCnpj} onChange={e => setFormData({ ...formData, cpfCnpj: e.target.value })} placeholder="CPF ou CNPJ do sacado" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="text" value={formData.sacadoEndereco} onChange={e => setFormData({ ...formData, sacadoEndereco: e.target.value })} placeholder="Endereço do sacado" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="number" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} placeholder="Valor (R$)" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="date" value={formData.vencimento} onChange={e => setFormData({ ...formData, vencimento: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="text" value={formData.observacao} onChange={e => setFormData({ ...formData, observacao: e.target.value })} placeholder="Observação (opcional)" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <button onClick={salvar} className="w-full py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">Emitir Boleto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Boletos;

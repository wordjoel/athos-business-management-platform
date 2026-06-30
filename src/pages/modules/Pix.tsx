import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QrCode, Key, Send, Download, Copy, Trash2, Check, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { getChaves, criarChave, desativarChave, excluirChave, getTransacoes, criarPixEnvio, criarPixRecebido, gerarQrCode, getQrCodes, excluirQrCode, PixChave, PixTransacao, PixQrCode } from '../../services/pixService';

const Pix: React.FC = () => {
  const { darkMode } = useApp();
  const [chaves, setChaves] = useState<PixChave[]>([]);
  const [transacoes, setTransacoes] = useState<PixTransacao[]>([]);
  const [qrCodes, setQrCodes] = useState<PixQrCode[]>([]);
  const [aba, setAba] = useState<'chaves' | 'enviar' | 'receber' | 'historico' | 'qrcode'>('chaves');
  const [showFormChave, setShowFormChave] = useState(false);
  const [showFormEnvio, setShowFormEnvio] = useState(false);
  const [showFormRecebimento, setShowFormRecebimento] = useState(false);
  const [showFormQrCode, setShowFormQrCode] = useState(false);
  const [copiado, setCopiado] = useState<string | null>(null);
  const [formDataChave, setFormDataChave] = useState({ tipo: 'cpf' as const, valor: '', banco: '001', conta: '67890-1' });
  const [formDataEnvio, setFormDataEnvio] = useState({ chave: '', valor: '', descricao: '', contraparte: '' });
  const [formDataRecebimento, setFormDataRecebimento] = useState({ chave: '', valor: '', descricao: '', contraparte: '' });
  const [formDataQrCode, setFormDataQrCode] = useState({ chave: '', valor: '', descricao: '' });

  const carregar = () => {
    setChaves(getChaves());
    setTransacoes(getTransacoes());
    setQrCodes(getQrCodes());
  };

  useEffect(() => { carregar(); }, []);

  const copiar = (texto: string, id: string) => {
    navigator.clipboard.writeText(texto).catch(() => {});
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000);
  };

  const salvarChave = () => {
    if (!formDataChave.valor) return;
    criarChave({ tipo: formDataChave.tipo, valor: formDataChave.valor, banco: formDataChave.banco, conta: formDataChave.conta });
    carregar();
    setFormDataChave({ tipo: 'cpf', valor: '', banco: '001', conta: '67890-1' });
    setShowFormChave(false);
  };

  const enviarPix = () => {
    if (!formDataEnvio.chave || !formDataEnvio.valor) return;
    criarPixEnvio(formDataEnvio.chave, parseFloat(formDataEnvio.valor), formDataEnvio.descricao, formDataEnvio.contraparte);
    carregar();
    setFormDataEnvio({ chave: '', valor: '', descricao: '', contraparte: '' });
    setShowFormEnvio(false);
    setAba('historico');
  };

  const receberPix = () => {
    if (!formDataRecebimento.chave || !formDataRecebimento.valor) return;
    criarPixRecebido(formDataRecebimento.chave, parseFloat(formDataRecebimento.valor), formDataRecebimento.descricao, formDataRecebimento.contraparte);
    carregar();
    setFormDataRecebimento({ chave: '', valor: '', descricao: '', contraparte: '' });
    setShowFormRecebimento(false);
    setAba('historico');
  };

  const gerarQr = () => {
    if (!formDataQrCode.chave || !formDataQrCode.valor) return;
    gerarQrCode(formDataQrCode.chave, parseFloat(formDataQrCode.valor), formDataQrCode.descricao);
    carregar();
    setFormDataQrCode({ chave: '', valor: '', descricao: '' });
    setShowFormQrCode(false);
    setAba('qrcode');
  };

  const totalEnviado = transacoes.filter(t => t.tipo === 'enviada' && t.status === 'concluida').reduce((s, t) => s + t.valor, 0);
  const totalRecebido = transacoes.filter(t => t.tipo === 'recebida' && t.status === 'concluida').reduce((s, t) => s + t.valor, 0);

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">PIX</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Transferências instantâneas</p>
        </div>
      </div>

      <div className={`flex gap-1 p-1 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'}`}>
        {(['chaves', 'enviar', 'receber', 'historico', 'qrcode'] as const).map(a => (
          <button key={a} onClick={() => setAba(a)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${aba === a ? (darkMode ? 'bg-cyan-600 text-white' : 'bg-cyan-500 text-white') : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}`}>
            {a === 'chaves' ? 'Chaves' : a === 'enviar' ? 'Enviar' : a === 'receber' ? 'Receber' : a === 'historico' ? 'Histórico' : 'QR Code'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><ArrowUpRight size={14} className="text-emerald-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Enviado</span></div>
          <p className="text-lg font-bold text-red-400">R$ {totalEnviado.toLocaleString()}</p>
        </div>
        <div className={`p-3 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center gap-1 mb-1"><ArrowDownLeft size={14} className="text-emerald-400" /><span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Recebido</span></div>
          <p className="text-lg font-bold text-emerald-400">R$ {totalRecebido.toLocaleString()}</p>
        </div>
      </div>

      {aba === 'chaves' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Minhas Chaves PIX</h3>
            <button onClick={() => setShowFormChave(true)} className="px-3 py-1.5 bg-cyan-600 rounded text-xs text-white">+ Nova Chave</button>
          </div>
          <div className="space-y-2">
            {chaves.map(c => (
              <div key={c.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.ativa ? 'bg-cyan-500/20' : 'bg-gray-600/20'}`}>
                    <Key size={14} className={c.ativa ? 'text-cyan-400' : 'text-gray-500'} />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{c.valor}</p>
                    <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{c.tipo.toUpperCase()} • {c.banco}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => copiar(c.valor, c.id)} className="p-1.5 text-gray-500 hover:text-cyan-400">
                    {copiado === c.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </button>
                  <button onClick={() => { desativarChave(c.id); carregar(); }} className="p-1.5 text-gray-500 hover:text-amber-400"><X size={14} /></button>
                  <button onClick={() => { excluirChave(c.id); carregar(); }} className="p-1.5 text-gray-500 hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
            {chaves.length === 0 && <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma chave cadastrada.</p>}
          </div>
        </div>
      )}

      {aba === 'enviar' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Enviar PIX</h3>
          <div className="space-y-3">
            <div>
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chave PIX do destinatário</label>
              <input type="text" value={formDataEnvio.chave} onChange={e => setFormDataEnvio({ ...formDataEnvio, chave: e.target.value })} placeholder="CPF, e-mail, telefone ou chave aleatória" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none mt-1" />
            </div>
            <div>
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nome do destinatário</label>
              <input type="text" value={formDataEnvio.contraparte} onChange={e => setFormDataEnvio({ ...formDataEnvio, contraparte: e.target.value })} placeholder="Nome completo" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none mt-1" />
            </div>
            <div>
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Valor (R$)</label>
              <input type="number" value={formDataEnvio.valor} onChange={e => setFormDataEnvio({ ...formDataEnvio, valor: e.target.value })} placeholder="0,00" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none mt-1" />
            </div>
            <div>
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Descrição</label>
              <input type="text" value={formDataEnvio.descricao} onChange={e => setFormDataEnvio({ ...formDataEnvio, descricao: e.target.value })} placeholder="Motivo da transferência" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none mt-1" />
            </div>
            <button onClick={enviarPix} className="w-full py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500 flex items-center justify-center gap-2">
              <Send size={14} /> Enviar PIX
            </button>
          </div>
        </div>
      )}

      {aba === 'receber' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Receber PIX</h3>
          <div className="space-y-3">
            <div>
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Minha chave PIX</label>
              <select value={formDataRecebimento.chave} onChange={e => setFormDataRecebimento({ ...formDataRecebimento, chave: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none mt-1">
                <option value="">Selecione uma chave</option>
                {chaves.filter(c => c.ativa).map(c => <option key={c.id} value={c.valor}>{c.valor} ({c.tipo})</option>)}
              </select>
            </div>
            <div>
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nome do remetente</label>
              <input type="text" value={formDataRecebimento.contraparte} onChange={e => setFormDataRecebimento({ ...formDataRecebimento, contraparte: e.target.value })} placeholder="Nome de quem vai enviar" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none mt-1" />
            </div>
            <div>
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Valor (R$)</label>
              <input type="number" value={formDataRecebimento.valor} onChange={e => setFormDataRecebimento({ ...formDataRecebimento, valor: e.target.value })} placeholder="0,00" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none mt-1" />
            </div>
            <div>
              <label className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Descrição</label>
              <input type="text" value={formDataRecebimento.descricao} onChange={e => setFormDataRecebimento({ ...formDataRecebimento, descricao: e.target.value })} placeholder="Motivo da transferência" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none mt-1" />
            </div>
            <button onClick={receberPix} className="w-full py-2 bg-emerald-600 rounded-lg text-white text-sm hover:bg-emerald-500 flex items-center justify-center gap-2">
              <Download size={14} /> Registrar Recebimento
            </button>
          </div>
        </div>
      )}

      {aba === 'historico' && (
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
          <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Histórico de Transações</h3>
          <div className="space-y-2">
            {transacoes.sort((a, b) => b.id.localeCompare(a.id)).map(t => (
              <div key={t.id} className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.tipo === 'enviada' ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                    {t.tipo === 'enviada' ? <ArrowUpRight size={14} className="text-red-400" /> : <ArrowDownLeft size={14} className="text-emerald-400" />}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t.contraparte}</p>
                    <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{t.data} {t.hora} • {t.descricao}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${t.tipo === 'enviada' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {t.tipo === 'enviada' ? '-' : '+'} R$ {t.valor.toLocaleString()}
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.status === 'concluida' ? 'bg-emerald-500/20 text-emerald-400' : t.status === 'pendente' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                    {t.status === 'concluida' ? 'Concluída' : t.status === 'pendente' ? 'Pendente' : 'Falha'}
                  </span>
                </div>
              </div>
            ))}
            {transacoes.length === 0 && <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma transação realizada.</p>}
          </div>
        </div>
      )}

      {aba === 'qrcode' && (
        <div className="space-y-3">
          <div className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Gerar QR Code</h3>
              <button onClick={() => setShowFormQrCode(true)} className="px-3 py-1.5 bg-cyan-600 rounded text-xs text-white">+ Novo QR Code</button>
            </div>
          </div>
          {qrCodes.map(qr => (
            <div key={qr.id} className={`p-4 rounded-xl border ${darkMode ? 'bg-gray-800/40 border-white/5' : 'bg-white border-gray-200'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{qr.descricao}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Chave: {qr.chave}</p>
                </div>
                <span className="text-lg font-bold text-cyan-400">R$ {qr.valor.toLocaleString()}</span>
              </div>
              <div className={`p-4 rounded-lg text-center mb-3 ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                <QrCode size={80} className="text-white mx-auto" />
                <p className={`text-[10px] mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Código: {qr.copiaECola.slice(0, 30)}...</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => copiar(qr.copiaECola, `qr-${qr.id}`)} className="flex-1 py-2 bg-gray-700 rounded-lg text-gray-300 text-xs flex items-center justify-center gap-1">
                  {copiado === `qr-${qr.id}` ? <><Check size={12} /> Copiado!</> : <><Copy size={12} /> Copiar Código</>}
                </button>
                <button onClick={() => { excluirQrCode(qr.id); carregar(); }} className="py-2 px-3 bg-gray-700 rounded-lg text-gray-400 hover:text-red-400">
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {qrCodes.length === 0 && !showFormQrCode && (
            <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhum QR Code gerado.</p>
          )}
        </div>
      )}

      {showFormChave && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-5 rounded-xl w-full max-w-md border ${darkMode ? 'bg-gray-800 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nova Chave PIX</h2>
              <button onClick={() => setShowFormChave(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <select value={formDataChave.tipo} onChange={e => setFormDataChave({ ...formDataChave, tipo: e.target.value as any })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none">
                <option value="cpf">CPF</option><option value="cnpj">CNPJ</option><option value="email">E-mail</option><option value="telefone">Telefone</option><option value="aleatoria">Chave Aleatória</option>
              </select>
              <input type="text" value={formDataChave.valor} onChange={e => setFormDataChave({ ...formDataChave, valor: e.target.value })} placeholder="Valor da chave" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <button onClick={salvarChave} className="w-full py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500">Cadastrar Chave</button>
            </div>
          </div>
        </div>
      )}

      {showFormEnvio && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-5 rounded-xl w-full max-w-md border ${darkMode ? 'bg-gray-800 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Enviar PIX</h2>
              <button onClick={() => setShowFormEnvio(false)}><X size={18} className="text-gray-400" /></button>
            </div>
          </div>
        </div>
      )}

      {showFormRecebimento && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-5 rounded-xl w-full max-w-md border ${darkMode ? 'bg-gray-800 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Receber PIX</h2>
              <button onClick={() => setShowFormRecebimento(false)}><X size={18} className="text-gray-400" /></button>
            </div>
          </div>
        </div>
      )}

      {showFormQrCode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-5 rounded-xl w-full max-w-md border ${darkMode ? 'bg-gray-800 border-white/10' : 'bg-white border-gray-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Gerar QR Code PIX</h2>
              <button onClick={() => setShowFormQrCode(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <select value={formDataQrCode.chave} onChange={e => setFormDataQrCode({ ...formDataQrCode, chave: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none">
                <option value="">Selecione uma chave</option>
                {chaves.filter(c => c.ativa).map(c => <option key={c.id} value={c.valor}>{c.valor} ({c.tipo})</option>)}
              </select>
              <input type="number" value={formDataQrCode.valor} onChange={e => setFormDataQrCode({ ...formDataQrCode, valor: e.target.value })} placeholder="Valor (R$)" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <input type="text" value={formDataQrCode.descricao} onChange={e => setFormDataQrCode({ ...formDataQrCode, descricao: e.target.value })} placeholder="Descrição (opcional)" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm outline-none" />
              <button onClick={gerarQr} className="w-full py-2 bg-cyan-600 rounded-lg text-white text-sm hover:bg-cyan-500 flex items-center justify-center gap-2">
                <QrCode size={14} /> Gerar QR Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pix;

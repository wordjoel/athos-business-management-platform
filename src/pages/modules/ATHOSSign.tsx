import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FileSignature, FileText, CheckCircle, Clock, AlertTriangle, Send, History, Scale, Sparkles, Upload, Eye, Plus, Trash2, X, Save, Edit2, Calendar, User, Building2, Phone, MapPin, Receipt, Bell } from 'lucide-react';

interface Contrato {
  id: string;
  titulo: string;
  parte: string;
  cnpj: string;
  telefone: string;
  endereco: string;
  valor: number;
  tipo: 'servico' | 'licenca' | 'parceria' | 'fornecimento' | 'outro';
  categoria: string;
  inicio: string;
  fim: string;
  status: 'rascunho' | 'enviado' | 'assinado' | 'ativo' | 'encerrado' | 'cancelado';
  modificadoPor: string;
  ultimaModificacao: string;
  observacoes?: string;
  enviarPara?: string;
  lembrar?: number;
}

interface Recibo {
  id: string;
  contratoId: string;
  nomeFuncionario: string;
  cpf: string;
  valor: number;
  descricao: string;
  data: string;
  emitidoPor: string;
}

const ATHOSSign: React.FC = () => {
  const { darkMode, usuarioLogado } = useApp();

  const [contratos, setContratos] = useState<Contrato[]>(() => {
    const saved = localStorage.getItem('athos_contratos');
    return saved ? JSON.parse(saved) : [];
  });

  const [recibos, setRecibos] = useState<Recibo[]>(() => {
    const saved = localStorage.getItem('athos_recibos');
    return saved ? JSON.parse(saved) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [showRecibo, setShowRecibo] = useState(false);
  const [contratoRecibo, setContratoRecibo] = useState<Contrato | null>(null);
  const [aba, setAba] = useState<'contratos' | 'modelos' | 'assinaturas' | 'recibos' | 'lembretes'>('contratos');
  const [formData, setFormData] = useState({ titulo: '', parte: '', cnpj: '', telefone: '', endereco: '', valor: '', tipo: 'servico' as 'servico' | 'licenca' | 'parceria' | 'fornecimento' | 'outro', categoria: 'Serviços', inicio: '', fim: '', enviarPara: 'Joel Oliveira', lembrar: '15' });
  const [formRecibo, setFormRecibo] = useState({ nomeFuncionario: '', cpf: '', valor: '', descricao: '' });

  useEffect(() => { localStorage.setItem('athos_contratos', JSON.stringify(contratos)); }, [contratos]);
  useEffect(() => { localStorage.setItem('athos_recibos', JSON.stringify(recibos)); }, [recibos]);

  const usuarioAtual = usuarioLogado?.nome || 'Usuário';

  const salvarContrato = () => {
    if (!formData.titulo || !formData.parte) return;
    const { lembrar, ...restForm } = formData;
    const novo: Contrato = {
      id: Date.now().toString(),
      ...restForm,
      valor: parseFloat(formData.valor) || 0,
      lembrar: parseInt(lembrar) || 15,
      status: 'rascunho',
      modificadoPor: usuarioAtual,
      ultimaModificacao: new Date().toLocaleDateString('pt-BR'),
    };
    setContratos([novo, ...contratos]);
    setFormData({ titulo: '', parte: '', cnpj: '', telefone: '', endereco: '', valor: '', tipo: 'servico', categoria: 'Serviços', inicio: '', fim: '', enviarPara: 'Joel Oliveira', lembrar: '15' });
    setShowForm(false);
  };

  const excluirContrato = (id: string) => {
    if (confirm('Excluir este contrato?')) setContratos(contratos.filter(c => c.id !== id));
  };

  const gerarRecibo = () => {
    if (!contratoRecibo || !formRecibo.nomeFuncionario) return;
    const novo: Recibo = {
      id: Date.now().toString(),
      contratoId: contratoRecibo.id,
      nomeFuncionario: formRecibo.nomeFuncionario,
      cpf: formRecibo.cpf,
      valor: parseFloat(formRecibo.valor) || contratoRecibo.valor,
      descricao: formRecibo.descricao,
      data: new Date().toLocaleDateString('pt-BR'),
      emitidoPor: usuarioAtual,
    };
    setRecibos([novo, ...recibos]);
    setFormRecibo({ nomeFuncionario: '', cpf: '', valor: '', descricao: '' });
    setShowRecibo(false);
    setContratoRecibo(null);
  };

  const statusCores: Record<string, string> = { rascunho: 'gray', enviado: 'blue', assinado: 'violet', ativo: 'emerald', encerrado: 'red', cancelado: 'gray' };
  const tipoLabels: Record<string, string> = { servico: 'Serviço', licenca: 'Licença', parceria: 'Parceria', fornecimento: 'Fornecimento', outro: 'Outro' };

  const contratosVencendo = contratos.filter(c => {
    if (c.status !== 'ativo') return false;
    const fim = new Date(c.fim.split('/').reverse().join('-'));
    const dias = Math.ceil((fim.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return dias <= (c.lembrar || 30);
  });

  const stats = [
    { title: 'Ativos', value: contratos.filter(c => c.status === 'ativo').length, icon: FileSignature, color: 'emerald' },
    { title: 'Pendentes', value: contratos.filter(c => c.status === 'enviado' || c.status === 'rascunho').length, icon: Clock, color: 'amber' },
    { title: 'Vencendo', value: contratosVencendo.length, icon: AlertTriangle, color: 'red' },
    { title: 'Valor Mensal', value: `R$ ${contratos.filter(c => c.status === 'ativo').reduce((s, c) => s + c.valor, 0).toLocaleString()}`, icon: Receipt, color: 'cyan' },
  ];

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">ATHOS Sign</h1>
          <p className="text-sm text-gray-500">Gestão de Contratos</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <User size={12} />
          <span>Logado: {usuarioAtual}</span>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg">
        {(['contratos', 'modelos', 'assinaturas', 'recibos', 'lembretes'] as const).map(a => (
          <button key={a} onClick={() => setAba(a)} className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${aba === a ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            {a === 'contratos' ? 'Contratos' : a === 'modelos' ? 'Modelos' : a === 'assinaturas' ? 'Assinaturas' : a === 'recibos' ? 'Recibos' : 'Lembretes'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-800/40 p-3 rounded-xl border border-white/5">
            <stat.icon size={16} className={`text-${stat.color}-400 mb-1`} />
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      {aba === 'contratos' && (
        <>
          <div className="flex justify-end">
            <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-sm font-medium flex items-center gap-2">
              <Plus size={16} /> Novo Contrato
            </button>
          </div>
          <div className="space-y-2">
            {contratos.map(ct => (
              <div key={ct.id} className="bg-gray-800/40 p-4 rounded-xl border border-white/5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{ct.titulo}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium bg-${statusCores[ct.status]}-500/20 text-${statusCores[ct.status]}-400`}>{ct.status}</span>
                    </div>
                    <p className="text-sm text-gray-400">{ct.parte}</p>
                    <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-500">
                      <span>CNPJ: {ct.cnpj}</span>
                      <span>•</span>
                      <span>{ct.telefone}</span>
                      <span>•</span>
                      <span>{ct.endereco}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-400">R$ {ct.valor.toLocaleString()}/mês</p>
                    <p className="text-xs text-gray-500">{ct.inicio} - {ct.fim}</p>
                    <p className="text-[10px] text-gray-600">{ct.modificadoPor} • {ct.ultimaModificacao}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                  <button onClick={() => { setContratoRecibo(ct); setShowRecibo(true); }} className="px-3 py-1.5 bg-gray-700 rounded text-xs text-gray-300 hover:text-white flex items-center gap-1"><Receipt size={12} /> Gerar Recibo</button>
                  <button className="px-3 py-1.5 bg-violet-600/50 rounded text-xs text-violet-300 hover:text-white flex items-center gap-1"><Send size={12} /> Enviar para Financeiro</button>
                  <button onClick={() => excluirContrato(ct.id)} className="px-3 py-1.5 bg-gray-700 rounded text-xs text-gray-500 hover:text-red-400"><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {aba === 'lembretes' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <Bell size={18} className="text-amber-400" />
            <span className="text-sm text-amber-400">Lembretes de vencimento próximos</span>
          </div>
          {contratosVencendo.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhum contrato vencendo em breve</p>
          ) : (
            contratosVencendo.map(ct => {
              const fim = new Date(ct.fim.split('/').reverse().join('-'));
              const dias = Math.ceil((fim.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <div key={ct.id} className="flex items-center justify-between p-3 bg-gray-800/40 rounded-xl border border-white/5">
                  <div>
                    <p className="text-sm font-medium text-white">{ct.titulo}</p>
                    <p className="text-xs text-gray-500">{ct.parte} - Vence em {dias} dias</p>
                  </div>
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs">{dias} dias</span>
                </div>
              );
            })
          )}
        </div>
      )}

      {aba === 'recibos' && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white">Recibos Emitidos</h3>
          {recibos.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Nenhum recibo emitido ainda</p>
          ) : (
            <div className="bg-gray-800/40 rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="text-left p-2 text-gray-500">Funcionário</th>
                    <th className="text-left p-2 text-gray-500">CPF</th>
                    <th className="text-left p-2 text-gray-500">Descrição</th>
                    <th className="text-right p-2 text-gray-500">Valor</th>
                    <th className="text-right p-2 text-gray-500">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {recibos.map(r => (
                    <tr key={r.id} className="border-t border-white/5">
                      <td className="p-2 text-white">{r.nomeFuncionario}</td>
                      <td className="p-2 text-gray-400">{r.cpf}</td>
                      <td className="p-2 text-gray-400">{r.descricao}</td>
                      <td className="p-2 text-right text-emerald-400">R$ {r.valor.toLocaleString()}</td>
                      <td className="p-2 text-right text-gray-500">{r.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {aba === 'modelos' && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white">Modelos de Contrato</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {['Prestação de Serviço', 'Licença de Software', 'Contrato de Parceria', 'Fornecimento'].map((m, i) => (
              <div key={i} className="p-4 bg-gray-800/40 rounded-xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-violet-400" />
                  <span className="text-sm text-white">{m}</span>
                </div>
                <button className="text-xs text-violet-400 hover:text-violet-300">Editar</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {aba === 'assinaturas' && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white">Assinaturas Pendentes</h3>
          {contratos.filter(c => c.status === 'enviado').map(ct => (
            <div key={ct.id} className="p-3 bg-gray-800/40 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <p className="text-sm text-white">{ct.titulo}</p>
                <p className="text-xs text-gray-500">{ct.parte}</p>
              </div>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Aguardando</span>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto py-8">
          <div className="bg-gray-800 p-5 rounded-xl w-full max-w-lg border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Novo Contrato</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              <input type="text" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} placeholder="Título do contrato" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <input type="text" value={formData.parte} onChange={e => setFormData({ ...formData, parte: e.target.value })} placeholder="Nome da empresa/parte" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input type="text" value={formData.cnpj} onChange={e => setFormData({ ...formData, cnpj: e.target.value })} placeholder="CNPJ" className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
                <input type="text" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} placeholder="Telefone" className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              </div>
              <input type="text" value={formData.endereco} onChange={e => setFormData({ ...formData, endereco: e.target.value })} placeholder="Endereço completo" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} placeholder="Valor mensal" className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
                <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm">
                  <option>Serviços</option><option>Software</option><option>Aluguel</option><option>Marketing</option><option>Outros</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={formData.inicio} onChange={e => setFormData({ ...formData, inicio: e.target.value })} className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
                <input type="date" value={formData.fim} onChange={e => setFormData({ ...formData, fim: e.target.value })} className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              </div>
              <select value={formData.enviarPara} onChange={e => setFormData({ ...formData, enviarPara: e.target.value })} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm">
                <option value="Joel Oliveira">Joel Oliveira (Diretor Administrativo e Financeiro)</option>
                <option value="Kleber Duarte">Kleber Duarte (CEO)</option>
                <option value="Oscar Carvalho">Oscar Carvalho (Diretor de Qualidade e Desenvolvimento)</option>
              </select>
              <div className="flex items-center gap-2">
                <input type="number" value={formData.lembrar} onChange={e => setFormData({ ...formData, lembrar: e.target.value })} className="w-20 px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
                <span className="text-xs text-gray-500">dias de lembrete antes do vencimento</span>
              </div>
              <button onClick={salvarContrato} className="w-full py-2 bg-violet-600 rounded-lg text-white text-sm hover:bg-violet-500">Criar Contrato</button>
            </div>
          </div>
        </div>
      )}

      {showRecibo && contratoRecibo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-5 rounded-xl w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Gerar Recibo</h2>
              <button onClick={() => { setShowRecibo(false); setContratoRecibo(null); }}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-700/30 rounded-lg">
                <p className="text-xs text-gray-500">Empresa</p>
                <p className="text-sm text-white font-medium">{contratoRecibo.parte}</p>
                <p className="text-xs text-gray-400">{contratoRecibo.cnpj}</p>
                <p className="text-xs text-gray-400">{contratoRecibo.endereco}</p>
                <p className="text-xs text-gray-400">{contratoRecibo.telefone}</p>
              </div>
              <input type="text" value={formRecibo.nomeFuncionario} onChange={e => setFormRecibo({ ...formRecibo, nomeFuncionario: e.target.value })} placeholder="Nome do funcionário" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <input type="text" value={formRecibo.cpf} onChange={e => setFormRecibo({ ...formRecibo, cpf: e.target.value })} placeholder="CPF" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <input type="number" value={formRecibo.valor} onChange={e => setFormRecibo({ ...formRecibo, valor: e.target.value })} placeholder="Valor" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <input type="text" value={formRecibo.descricao} onChange={e => setFormRecibo({ ...formRecibo, descricao: e.target.value })} placeholder="Descrição do serviço" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <button onClick={gerarRecibo} className="w-full py-2 bg-violet-600 rounded-lg text-white text-sm hover:bg-violet-500">Emitir Recibo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATHOSSign;
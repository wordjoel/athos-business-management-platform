import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Headphones, Ticket, Clock, CheckCircle, AlertTriangle, Users, Monitor,
  MessageSquare, Wifi, Plus, Trash2, X, Save, User, BookOpen, Shield,
  Timer, ArrowRight, Search, FileText, ExternalLink, Star
} from 'lucide-react';

interface Chamado {
  id: string;
  titulo: string;
  descricao: string;
  prioridade: 'critica' | 'alta' | 'media' | 'baixa';
  status: 'aberto' | 'em_andamento' | 'pendente' | 'resolvido' | 'fechado';
  solicitante: string;
  responsavel: string;
  data: string;
  sla?: { horas: number; expiraEm: string };
  categoria?: string;
}

interface Artigo {
  id: string;
  titulo: string;
  conteudo: string;
  categoria: string;
  visualizacoes: number;
  util: number;
  criadoEm: string;
}

const SLA_CONFIG = {
  critica: { horas: 4, label: '4 horas' },
  alta: { horas: 8, label: '8 horas' },
  media: { horas: 24, label: '24 horas' },
  baixa: { horas: 72, label: '72 horas' },
};

const ARTIGOS_DEFAULT: Artigo[] = [
  { id: '1', titulo: 'Como configurar email corporativo', conteudo: 'Acesse Configurações > Integrações > Email. Preencha os dados do servidor SMTP (gmail-smtp ou outlook). Teste a conexão antes de salvar.', categoria: 'Email', visualizacoes: 142, util: 38, criadoEm: '01/06/2026' },
  { id: '2', titulo: 'Problemas com login no sistema', conteudo: 'Se não conseguir acessar, verifique: 1) Senha correta 2) Caps Lock desligado 3) Email correto. Se persistir, limpe o cache do navegador.', categoria: 'Geral', visualizacoes: 230, util: 95, criadoEm: '15/05/2026' },
  { id: '3', titulo: 'Como exportar relatórios em PDF', conteudo: 'No módulo desejado, clique em Relatórios > Selecione o período > Clique em Exportar > Escolha PDF. O arquivo será baixado automaticamente.', categoria: 'Relatórios', visualizacoes: 89, util: 22, criadoEm: '10/06/2026' },
  { id: '4', titulo: 'Configuração do WhatsApp Business', conteudo: 'Acesse CRM > WhatsApp > Configurações. Insira o token da Meta Cloud API. Configure o número de telefone e webhook. Teste com mensagem de teste.', categoria: 'Integração', visualizacoes: 67, util: 18, criadoEm: '20/06/2026' },
  { id: '5', titulo: 'Ponto digital — como registrar entrada', conteudo: 'Acesse RH > Ponto Digital. Clique em "Registrar Ponto". O sistema captura horário e geolocalização. Registros após 09:00 são marcados como atraso.', categoria: 'RH', visualizacoes: 156, util: 45, criadoEm: '05/06/2026' },
];

const ATHOSSupport: React.FC = () => {
  const { darkMode } = useApp();
  const [activeTab, setActiveTab] = useState<'chamados' | 'sla' | 'base'>('chamados');
  const [chamados, setChamados] = useState<Chamado[]>(() => {
    const saved = localStorage.getItem('athos_chamados');
    return saved ? JSON.parse(saved) : [];
  });
  const [artigos, setArtigos] = useState<Artigo[]>(ARTIGOS_DEFAULT);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ titulo: '', descricao: '', prioridade: 'media' as const, solicitante: 'Administrador', categoria: 'Geral' });

  useEffect(() => { localStorage.setItem('athos_chamados', JSON.stringify(chamados)); }, [chamados]);

  const salvarChamado = () => {
    if (!formData.titulo) return;
    const sla = SLA_CONFIG[formData.prioridade];
    const novo: Chamado = {
      id: Date.now().toString(),
      ...formData,
      status: 'aberto',
      responsavel: 'A definir',
      data: new Date().toLocaleDateString('pt-BR'),
      sla: { horas: sla.horas, expiraEm: new Date(Date.now() + sla.horas * 3600000).toISOString() },
    };
    setChamados([novo, ...chamados]);
    setFormData({ titulo: '', descricao: '', prioridade: 'media', solicitante: 'Administrador', categoria: 'Geral' });
    setShowForm(false);
  };

  const excluirChamado = (id: string) => {
    if (confirm('Excluir este chamado?')) setChamados(chamados.filter(c => c.id !== id));
  };

  const atualizarStatus = (id: string, status: Chamado['status']) => {
    setChamados(chamados.map(c => c.id === id ? { ...c, status } : c));
  };

  const chamadosFiltrados = chamados.filter(c =>
    !searchTerm || c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || c.solicitante.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const abertos = chamados.filter(c => c.status === 'aberto').length;
  const emAndamento = chamados.filter(c => c.status === 'em_andamento').length;
  const resolvidos = chamados.filter(c => c.status === 'resolvido' || c.status === 'fechado').length;
  const violados = chamados.filter(c => c.sla && new Date(c.sla.expiraEm) < new Date() && c.status !== 'resolvido' && c.status !== 'fechado').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient flex items-center gap-2">
            <Headphones size={24} /> ATHOS Support
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Service Desk — SLA e Base de Conhecimento</p>
        </div>
        <div className="flex gap-2">
          {[
            { key: 'chamados' as const, label: 'Chamados', icon: Ticket },
            { key: 'sla' as const, label: 'SLA', icon: Shield },
            { key: 'base' as const, label: 'Base de Conhecimento', icon: BookOpen },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                activeTab === tab.key ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-400 hover:text-white border border-white/5'
              }`}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'chamados' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: 'Abertos', value: abertos, icon: Ticket, color: 'red' },
              { title: 'Em Andamento', value: emAndamento, icon: Clock, color: 'amber' },
              { title: 'Resolvidos', value: resolvidos, icon: CheckCircle, color: 'emerald' },
              { title: 'SLA Violado', value: violados, icon: AlertTriangle, color: 'red' },
            ].map((stat, i) => (
              <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white border border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <stat.icon size={20} className={`text-${stat.color}-400`} />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.title}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-cyan-500/50"
                placeholder="Buscar chamados..." />
            </div>
            <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-cyan-500 text-white rounded-xl text-sm font-medium hover:bg-cyan-600 flex items-center gap-2">
              <Plus size={16} /> Novo Chamado
            </button>
          </div>

          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white border border-gray-200'}`}>
            <h2 className="font-semibold mb-4">Chamados</h2>
            <div className="space-y-3">
              {chamadosFiltrados.map(ch => {
                const slaVencido = ch.sla && new Date(ch.sla.expiraEm) < new Date() && ch.status !== 'resolvido' && ch.status !== 'fechado';
                const slaRestante = ch.sla ? Math.max(0, Math.floor((new Date(ch.sla.expiraEm).getTime() - Date.now()) / 3600000)) : null;
                return (
                  <div key={ch.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50 border border-gray-100'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${slaVencido ? 'bg-red-500/20' : 'bg-cyan-500/20'}`}>
                        {slaVencido ? <AlertTriangle size={18} className="text-red-400" /> : <Ticket size={18} className="text-cyan-400" />}
                      </div>
                      <div>
                        <p className="font-medium">{ch.titulo}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ch.solicitante} • {ch.data} • {ch.categoria || 'Geral'}</p>
                        {ch.sla && (
                          <p className={`text-xs mt-1 ${slaVencido ? 'text-red-400' : slaRestante !== null && slaRestante < 4 ? 'text-amber-400' : 'text-gray-500'}`}>
                            <Timer size={10} className="inline mr-1" />
                            SLA: {slaVencido ? 'VIOLADO' : `${slaRestante}h restantes`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <select value={ch.status} onChange={e => atualizarStatus(ch.id, e.target.value as Chamado['status'])}
                        className={`text-xs font-medium px-3 py-1 rounded-full bg-white/5 border border-white/10 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                        <option value="aberto">Aberto</option>
                        <option value="em_andamento">Em Andamento</option>
                        <option value="pendente">Pendente</option>
                        <option value="resolvido">Resolvido</option>
                        <option value="fechado">Fechado</option>
                      </select>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        ch.prioridade === 'critica' ? 'bg-red-500/20 text-red-400' :
                        ch.prioridade === 'alta' ? 'bg-amber-500/20 text-amber-400' :
                        ch.prioridade === 'media' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'
                      }`}>{ch.prioridade}</span>
                      <button onClick={() => excluirChamado(ch.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
              {chamadosFiltrados.length === 0 && <p className="text-center text-gray-500 py-8">Nenhum chamado encontrado</p>}
            </div>
          </div>
        </>
      )}

      {activeTab === 'sla' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Object.entries(SLA_CONFIG).map(([key, config]) => {
              const total = chamados.filter(c => c.prioridade === key).length;
              const cumpridos = chamados.filter(c => c.prioridade === key && c.sla && new Date(c.sla.expiraEm) >= new Date() && (c.status === 'resolvido' || c.status === 'fechado')).length;
              const taxa = total > 0 ? ((cumpridos / total) * 100).toFixed(0) : '0';
              return (
                <div key={key} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white border border-gray-200'}`}>
                  <p className="text-xs text-gray-400 mb-1">Prioridade {key}</p>
                  <p className="text-lg font-bold">{config.label}</p>
                  <p className="text-sm text-gray-400 mt-1">{total} chamados</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Taxa cumprimento</span>
                      <span className={parseInt(taxa) >= 80 ? 'text-green-400' : parseInt(taxa) >= 50 ? 'text-amber-400' : 'text-red-400'}>{taxa}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-cyan-500" style={{ width: `${taxa}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white border border-gray-200'}`}>
            <h2 className="font-semibold mb-4">Política de SLA</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <AlertTriangle size={16} className="text-red-400 mt-0.5" />
                <div><p className="font-medium text-red-400">Crítica — 4 horas</p><p className="text-gray-400">Sistemas inoperantes, perda de dados, segurança comprometida. Atendimento imediato.</p></div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <Timer size={16} className="text-amber-400 mt-0.5" />
                <div><p className="font-medium text-amber-400">Alta — 8 horas</p><p className="text-gray-400">Funcionalidade crítica indisponível, impacto significativo nas operações.</p></div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <Clock size={16} className="text-blue-400 mt-0.5" />
                <div><p className="font-medium text-blue-400">Média — 24 horas</p><p className="text-gray-400">Problemas moderados, funcionalidade parcialmente disponível.</p></div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <CheckCircle size={16} className="text-gray-400 mt-0.5" />
                <div><p className="font-medium text-gray-400">Baixa — 72 horas</p><p className="text-gray-400">Solicitações de melhorias, dúvidas, configurações não urgentes.</p></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'base' && (
        <div className="space-y-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-cyan-500/50"
              placeholder="Buscar artigos..." />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {artigos.filter(a => !searchTerm || a.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || a.conteudo.toLowerCase().includes(searchTerm.toLowerCase())).map(art => (
              <div key={art.id} className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50 hover:bg-gray-800/50' : 'bg-white border border-gray-200 hover:border-cyan-300'} transition-all cursor-pointer`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">{art.categoria}</span>
                  <span className="text-xs text-gray-500">{art.visualizacoes} views</span>
                </div>
                <h3 className="font-semibold text-sm mb-2">{art.titulo}</h3>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-clamp-3`}>{art.conteudo}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Star size={12} className="text-amber-400" /> {art.util} úteis
                  </div>
                  <span className="text-xs text-gray-500">{art.criadoEm}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl w-full max-w-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Novo Chamado</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Título</label>
                <input type="text" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Título do chamado" />
              </div>
              <div>
                <label className="text-sm">Descrição</label>
                <textarea value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" rows={3} placeholder="Descrição do problema" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm">Prioridade</label>
                  <select value={formData.prioridade} onChange={e => setFormData({ ...formData, prioridade: e.target.value as any })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                    <option value="critica">Crítica (SLA 4h)</option>
                    <option value="alta">Alta (SLA 8h)</option>
                    <option value="media">Média (SLA 24h)</option>
                    <option value="baixa">Baixa (SLA 72h)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm">Categoria</label>
                  <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                    <option value="Geral">Geral</option>
                    <option value="TI">TI</option>
                    <option value="Financeiro">Financeiro</option>
                    <option value="RH">RH</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Infraestrutura">Infraestrutura</option>
                  </select>
                </div>
              </div>
              <button onClick={salvarChamado} className="w-full py-2 bg-cyan-500 rounded-lg font-medium hover:bg-cyan-600 flex items-center justify-center gap-2">
                <Save size={16} /> Abrir Chamado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATHOSSupport;

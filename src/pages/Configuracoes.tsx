import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Building2, Bell, Zap, Smartphone, Cloud, Server, Code, Layers, Wifi, Save, CheckCircle } from 'lucide-react';

const Configuracoes: React.FC = () => {
  const { darkMode, nomeEmpresa, setNomeEmpresa, dadosEmpresa, setDadosEmpresa } = useApp();
  const [configTab, setConfigTab] = useState<'geral' | 'notificacoes' | 'integracoes' | 'api'>('geral');
  const [salvo, setSalvo] = useState(false);

  const [form, setForm] = useState({
    razaoSocial: dadosEmpresa.razaoSocial,
    cnpj: dadosEmpresa.cnpj,
    email: dadosEmpresa.email,
    telefone: dadosEmpresa.telefone,
    endereco: dadosEmpresa.endereco,
    cidade: dadosEmpresa.cidade,
    estado: dadosEmpresa.estado,
    cep: dadosEmpresa.cep,
    site: dadosEmpresa.site,
    segmento: dadosEmpresa.segmento,
    dataAbertura: dadosEmpresa.dataAbertura,
  });

  useEffect(() => {
    setForm({
      razaoSocial: dadosEmpresa.razaoSocial,
      cnpj: dadosEmpresa.cnpj,
      email: dadosEmpresa.email,
      telefone: dadosEmpresa.telefone,
      endereco: dadosEmpresa.endereco,
      cidade: dadosEmpresa.cidade,
      estado: dadosEmpresa.estado,
      cep: dadosEmpresa.cep,
      site: dadosEmpresa.site,
      segmento: dadosEmpresa.segmento,
      dataAbertura: dadosEmpresa.dataAbertura,
    });
  }, [dadosEmpresa]);

  const handleSave = () => {
    setNomeEmpresa(nomeEmpresa);
    setDadosEmpresa(form);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Settings size={24} className="text-athos-400" /> Configurações
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gerencie os dados da empresa e configurações</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${salvo ? 'bg-emerald-500 text-white' : 'bg-athos-500 hover:bg-athos-600 text-white'}`}>
          {salvo ? <CheckCircle size={18} /> : <Save size={18} />}
          {salvo ? 'Salvo!' : 'Salvar Alterações'}
        </button>
      </div>

      <div className={`rounded-2xl border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className={`flex border-b overflow-x-auto ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
          {[
            { id: 'geral' as const, label: 'Cadastro', icon: Building2 },
            { id: 'notificacoes' as const, label: 'Notificações', icon: Bell },
            { id: 'integracoes' as const, label: 'Integrações', icon: Zap },
            { id: 'api' as const, label: 'API & Webhooks', icon: Code },
          ].map(t => (
            <button key={t.id} onClick={() => setConfigTab(t.id)} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              configTab === t.id ? 'border-athos-500 text-athos-400' : `border-transparent ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`
            }`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {configTab === 'geral' && (
            <div className="space-y-6">
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-athos-500/5 border-athos-500/10' : 'bg-athos-50 border-athos-100'}`}>
                <h3 className={`text-lg font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Nome da Empresa</h3>
                <p className={`text-xs mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Este nome aparecerá no menu lateral e tela de login</p>
                <input 
                  type="text" 
                  value={nomeEmpresa} 
                  onChange={(e) => setNomeEmpresa(e.target.value)} 
                  className={`w-full px-4 py-3 rounded-xl text-lg font-bold outline-none border transition-colors ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-athos-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-athos-400'}`}
                  placeholder="Nome da empresa"
                />
              </div>

              <div>
                <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dados Cadastrais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Razão Social *</label>
                    <input type="text" value={form.razaoSocial} onChange={(e) => setForm({...form, razaoSocial: e.target.value})} className={`w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-athos-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-athos-400'}`} />
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>CNPJ</label>
                    <input type="text" value={form.cnpj} onChange={(e) => setForm({...form, cnpj: e.target.value})} className={`w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-athos-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-athos-400'}`} placeholder="00.000.000/0001-00" />
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Segmento</label>
                    <select value={form.segmento} onChange={(e) => setForm({...form, segmento: e.target.value})} className={`w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-athos-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-athos-400'}`}>
                      <option value="">Selecione...</option>
                      <option value="administrativo">Serviços Administrativos</option>
                      <option value="contabil">Contabilidade</option>
                      <option value="juridico">Jurídico</option>
                      <option value="consultoria">Consultoria</option>
                      <option value="tecnologia">Tecnologia</option>
                      <option value="comercio">Comércio</option>
                      <option value="industria">Indústria</option>
                      <option value="servicos">Serviços Gerais</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>E-mail</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className={`w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-athos-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-athos-400'}`} placeholder="contato@empresa.com" />
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Telefone</label>
                    <input type="text" value={form.telefone} onChange={(e) => setForm({...form, telefone: e.target.value})} className={`w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-athos-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-athos-400'}`} placeholder="(11) 99999-0000" />
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Site</label>
                    <input type="text" value={form.site} onChange={(e) => setForm({...form, site: e.target.value})} className={`w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-athos-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-athos-400'}`} placeholder="www.empresa.com.br" />
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Data de Abertura</label>
                    <input type="date" value={form.dataAbertura} onChange={(e) => setForm({...form, dataAbertura: e.target.value})} className={`w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-athos-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-athos-400'}`} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Endereço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Endereço</label>
                    <input type="text" value={form.endereco} onChange={(e) => setForm({...form, endereco: e.target.value})} className={`w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-athos-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-athos-400'}`} placeholder="Av. Paulista, 1000" />
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>CEP</label>
                    <input type="text" value={form.cep} onChange={(e) => setForm({...form, cep: e.target.value})} className={`w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-athos-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-athos-400'}`} placeholder="00000-000" />
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Cidade</label>
                    <input type="text" value={form.cidade} onChange={(e) => setForm({...form, cidade: e.target.value})} className={`w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-athos-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-athos-400'}`} placeholder="São Paulo" />
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Estado</label>
                    <select value={form.estado} onChange={(e) => setForm({...form, estado: e.target.value})} className={`w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-athos-500/50' : 'bg-white border-gray-200 text-gray-900 focus:border-athos-400'}`}>
                      <option value="">Selecione...</option>
                      <option value="AC">Acre</option><option value="AL">Alagoas</option><option value="AP">Amapá</option><option value="AM">Amazonas</option><option value="BA">Bahia</option><option value="CE">Ceará</option><option value="DF">Distrito Federal</option><option value="ES">Espírito Santo</option><option value="GO">Goiás</option><option value="MA">Maranhão</option><option value="MT">Mato Grosso</option><option value="MS">Mato Grosso do Sul</option><option value="MG">Minas Gerais</option><option value="PA">Pará</option><option value="PB">Paraíba</option><option value="PR">Paraná</option><option value="PE">Pernambuco</option><option value="PI">Piauí</option><option value="RJ">Rio de Janeiro</option><option value="RN">Rio Grande do Norte</option><option value="RS">Rio Grande do Sul</option><option value="RO">Rondônia</option><option value="RR">Roraima</option><option value="SC">Santa Catarina</option><option value="SP">São Paulo</option><option value="SE">Sergipe</option><option value="TO">Tocantins</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {configTab === 'notificacoes' && (
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Preferências de Notificação</h3>
              {[
                { label: 'Resumo semanal aos sócios', desc: 'Enviar relatório financeiro semanal por e-mail', active: true },
                { label: 'Alertas de vencimento', desc: 'Notificar 3 dias antes do vencimento', active: true },
                { label: 'Aprovação de despesas', desc: 'Solicitar aprovação para despesas acima de R$ 5.000', active: true },
                { label: 'Relatórios PDF automáticos', desc: 'Gerar e enviar relatórios mensais automaticamente', active: false },
                { label: 'Alertas de gastos anormais', desc: 'Notificar em tempo sobre gastos fora do padrão', active: true },
                { label: 'E-mails de marketing', desc: 'Receber novidades e atualizações da plataforma', active: false },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <div>
                    <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
                  </div>
                  <button className={`w-11 h-6 rounded-full transition-all ${item.active ? 'bg-athos-500' : 'bg-gray-600'} relative`}>
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${item.active ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {configTab === 'integracoes' && (
            <div className="space-y-4">
              <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Integrações Disponíveis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Banco do Brasil', desc: 'Integração bancária direta', status: 'em_breve', icon: '🏦' },
                  { name: 'Itaú Unibanco', desc: 'Extrato e conciliação automática', status: 'em_breve', icon: '🏦' },
                  { name: 'Stripe', desc: 'Processamento de pagamentos', status: 'disponivel', icon: '💳' },
                  { name: 'Mercado Pago', desc: 'Gateway de pagamento', status: 'disponivel', icon: '💳' },
                  { name: 'AWS', desc: 'Infraestrutura cloud', status: 'conectado', icon: '☁️' },
                  { name: 'Google Workspace', desc: 'E-mail e calendário', status: 'disponivel', icon: '📧' },
                  { name: 'Slack', desc: 'Notificações em tempo real', status: 'disponivel', icon: '💬' },
                  { name: 'Conta Azul', desc: 'Integração contábil', status: 'em_breve', icon: '📊' },
                  { name: 'TOTVS', desc: 'ERP integrado', status: 'em_breve', icon: '🏢' },
                ].map((integration, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${darkMode ? 'border-white/5 hover:border-white/10' : 'border-gray-200'} transition-all`}>
                    <div className="text-2xl mb-2">{integration.icon}</div>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{integration.name}</p>
                    <p className={`text-xs mt-0.5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{integration.desc}</p>
                    <span className={`text-[10px] font-bold mt-2 inline-block px-2 py-0.5 rounded-full ${
                      integration.status === 'conectado' ? 'bg-emerald-500/10 text-emerald-400' :
                      integration.status === 'disponivel' ? 'bg-athos-500/10 text-athos-400' :
                      'bg-gray-500/10 text-gray-400'
                    }`}>
                      {integration.status === 'conectado' ? '✅ Conectado' : integration.status === 'disponivel' ? '🔗 Disponível' : '🔜 Em breve'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {configTab === 'api' && (
            <div className="space-y-6">
              <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>API & Webhooks</h3>
              <div className={`p-5 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>API Key</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Use esta chave para acessar a API REST</p>
                  </div>
                  <button className="text-xs text-athos-400 font-medium hover:underline">Gerar Nova</button>
                </div>
                <div className={`px-4 py-3 rounded-lg font-mono text-xs ${darkMode ? 'bg-black/30 text-gray-300' : 'bg-white text-gray-600'}`}>
                  ath_sk_live_xxxxxxxxxxxxxxxxxxxxxxxx
                </div>
              </div>
              <div className={`p-5 rounded-xl border ${darkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-200'}`}>
                <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Documentação da API</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  A API REST da {nomeEmpresa} permite integração com sistemas externos.
                </p>
                <div className="mt-3 space-y-2">
                  {['GET /api/v1/financeiro', 'POST /api/v1/despesas', 'GET /api/v1/relatorios', 'GET /api/v1/setores', 'POST /api/v1/webhooks'].map((endpoint, i) => (
                    <div key={i} className={`px-3 py-2 rounded-lg font-mono text-xs ${darkMode ? 'bg-black/30 text-emerald-400' : 'bg-white text-emerald-600'}`}>{endpoint}</div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Users = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default Configuracoes;
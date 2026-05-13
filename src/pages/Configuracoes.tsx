import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Building2, Bell, Zap, Smartphone, Cloud, Server, Code, Layers, Wifi } from 'lucide-react';

const Configuracoes: React.FC = () => {
  const { darkMode } = useApp();
  const [configTab, setConfigTab] = useState<'geral' | 'notificacoes' | 'integracoes' | 'api'>('geral');

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Settings size={24} className="text-athos-400" /> Configurações
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Configurações gerais do sistema e integrações</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`rounded-2xl border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className={`flex border-b overflow-x-auto ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
          {[
            { id: 'geral' as const, label: 'Geral', icon: Building2 },
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
              <div>
                <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Dados da Empresa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Razão Social', value: 'ATOS Centro de Organização LTDA' },
                    { label: 'CNPJ', value: '12.345.678/0001-90' },
                    { label: 'E-mail', value: 'contato@athos.com' },
                    { label: 'Telefone', value: '(11) 99999-0000' },
                    { label: 'Endereço', value: 'Av. Paulista, 1000 - São Paulo/SP' },
                    { label: 'Site', value: 'www.athos.com.br' },
                  ].map((field, i) => (
                    <div key={i}>
                      <label className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{field.label}</label>
                      <input type="text" defaultValue={field.value} className={`w-full mt-1 px-3 py-2.5 rounded-xl text-sm outline-none border transition-colors ${darkMode ? 'bg-white/5 border-white/10 text-white focus:border-athos-500/50' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-athos-400'}`} />
                    </div>
                  ))}
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${darkMode ? 'bg-athos-500/5 border-athos-500/10' : 'bg-athos-50 border-athos-100'}`}>
                <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🏗️ Arquitetura Preparada para Escalabilidade</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { icon: Cloud, label: 'Cloud Ready', desc: 'AWS, Azure, GCP' },
                    { icon: Smartphone, label: 'App Mobile', desc: 'iOS & Android' },
                    { icon: Layers, label: 'Multi-empresa', desc: 'SaaS Architecture' },
                    { icon: Users, label: 'Multi-usuário', desc: 'Role-based Access' },
                    { icon: Wifi, label: 'API REST', desc: 'Integração total' },
                    { icon: Server, label: 'Banco de Dados', desc: 'PostgreSQL + Redis' },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 p-3 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-white'}`}>
                      <item.icon size={14} className="text-athos-400" />
                      <div>
                        <p className={`text-xs font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</p>
                        <p className={`text-[10px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="px-6 py-2.5 rounded-xl gradient-athos text-white text-sm font-medium shadow-glow">Salvar Alterações</button>
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
                  A API REST da ATOS permite integração com sistemas externos. Endpoints disponíveis:
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

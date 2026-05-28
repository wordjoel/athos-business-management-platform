import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../components/Toast';
import { MessageCircle, Send, Phone, Video, MoreVertical, Search, Paperclip, Image, Sticker, Archive, Settings, Users, MessageSquare, Bot, Webhook, Check, CheckCheck, Clock, Circle, Plus, X, Link, Key, Zap, Bell, Gift, DollarSign, Calendar, FileText, Save, RefreshCw, PhoneCall, MessageFilled } from 'lucide-react';

interface Contato {
  id: string;
  nome: string;
  telefone: string;
  empresa?: string;
  avatar?: string;
  ultimoAcesso?: string;
  status: 'online' | 'offline' | 'ausente';
}

interface MensagemWhatsApp {
  id: string;
  contatoId: string;
  tipo: 'enviada' | 'recebida';
  texto: string;
  timestamp: string;
  status: 'enviada' | 'entregue' | 'lida';
  attachments?: { tipo: string; url: string }[];
}

interface RespostaAutomatica {
  palavraChave: string;
  resposta: string;
  categoria: string;
  executarAcao?: string;
}

interface ConfiguracaoN8N {
  webhookUrl: string;
  apiKey: string;
  ativo: boolean;
  ultimoTeste?: string;
}

interface ConfigWhatsAppCloud {
  provider: 'meta' | 'zapi';
  instanceId: string;
  token: string;
  ativo: boolean;
}

interface ConfigBridge {
  url: string;
  ativo: boolean;
}

const NUMERO_USUARIO = '5511953992662';

const WhatsAppIntegration: React.FC = () => {
  const { usuarioLogado } = useApp();
  const { addToast } = useToast();
  const [contatos, setContatos] = useState<Contato[]>(() => {
    const saved = localStorage.getItem('athos_whatsapp_contatos');
    return saved ? JSON.parse(saved) : [
      { id: '1', nome: 'Cliente Tech Solutions', telefone: '+5511999990001', empresa: 'Tech Solutions LTDA', status: 'online', ultimoAcesso: 'Agora' },
      { id: '2', nome: 'Maria Santos', telefone: '+5511999990002', empresa: 'Clínica Viva Saúde', status: 'offline', ultimoAcesso: '2h atrás' },
      { id: '3', nome: 'Carlos Silva', telefone: '+5511999990003', empresa: 'Restaurante Sabor', status: 'online', ultimoAcesso: 'Agora' },
      { id: '4', nome: 'Ana Paula', telefone: '+5511999990004', empresa: 'XPTO Tecnologia', status: 'ausente', ultimoAcesso: '30min atrás' },
    ];
  });

  const [mensagens, setMensagens] = useState<MensagemWhatsApp[]>(() => {
    const saved = localStorage.getItem('athos_whatsapp_mensagens');
    return saved ? JSON.parse(saved) : [
      { id: '1', contatoId: '1', tipo: 'recebida', texto: 'Olá! Gostaria de informações sobre os serviços da ATHOS.', timestamp: '10:30', status: 'lida' },
      { id: '2', contatoId: '1', tipo: 'enviada', texto: 'Olá! Tudo bem? Somos a ATHOS Business Management. Como posso ajudar?', timestamp: '10:32', status: 'lida' },
      { id: '3', contatoId: '1', tipo: 'recebida', texto: 'Preciso de um sistema de gestão para minha empresa. Vocês oferecem?', timestamp: '10:33', status: 'lida' },
      { id: '4', contatoId: '2', tipo: 'recebida', texto: 'Olá, preciso de suporte técnico.', timestamp: '09:15', status: 'lida' },
    ];
  });

  const [respostasAutomaticas, setRespostasAutomaticas] = useState<RespostaAutomatica[]>(() => {
    const saved = localStorage.getItem('athos_whatsapp_respostas');
    return saved ? JSON.parse(saved) : [
      { palavraChave: 'oi', resposta: 'Olá! Seja bem-vindo à ATHOS Business Management! 🏢 Como posso ajudar você hoje?', categoria: 'saudacao' },
      { palavraChave: 'servico', resposta: 'Oferecemos os seguintes módulos:\n\n📊 ATHOS Finance - Gestão Financeira\n📋 ATHOS Projects - Gestão de Projetos\n💼 ATHOS Flow - CRM\n🔒 ATHOS Shield - Segurança\n📱 ATHOS AI - Inteligência Artificial\n\nQual módulo gostaria de conhecer?', categoria: 'informacao' },
      { palavraChave: 'preco', resposta: 'Nossos planos começam a partir de R$ 497/mês. Temos opções para micro, pequena e média empresa. Posso agendar uma reunião com nosso consultor comercial?', categoria: 'vendas' },
      { palavraChave: 'suporte', resposta: 'Você pode abrir um chamado técnico pelo ATHOS Support ou ligando para (11) 4000-1000. Nosso horário de atendimento é das 8h às 18h.', categoria: 'suporte' },
      { palavraChave: 'obrigado', resposta: 'Por nada! 😊 Estamos sempre à disposição. Qualquer dúvida, é só chamar!', categoria: 'saudacao' },
    ];
  });

  const WEBHOOK_PADRAO = 'https://athos-business-management-platform.vercel.app/api/webhook';
  const [configN8N, setConfigN8N] = useState<ConfiguracaoN8N>(() => {
    const saved = localStorage.getItem('athos_n8n_config');
    const base = saved ? JSON.parse(saved) : {};
    return {
      webhookUrl: base.webhookUrl || WEBHOOK_PADRAO,
      apiKey: base.apiKey || '',
      ativo: base.ativo || false,
    };
  });

  const [configWA, setConfigWA] = useState<ConfigWhatsAppCloud>(() => {
    const saved = localStorage.getItem('athos_whatsapp_cloud_config');
    const base = saved ? JSON.parse(saved) : {};
    return {
      provider: base.provider || 'zapi',
      instanceId: base.instanceId || '3F3CDA897F74E2C64AACDA62BB9C89AA',
      token: base.token || 'BE83650B21DF4F027747525F',
      ativo: base.ativo || false,
    };
  });

  const [configBridge, setConfigBridge] = useState<ConfigBridge>(() => {
    const saved = localStorage.getItem('athos_bridge_config');
    const base = saved ? JSON.parse(saved) : {};
    return { url: base.url || 'https://whatsapp-bridge-production-2140.up.railway.app', ativo: base.ativo || true };
  });

  const [aba, setAba] = useState<'chat' | 'contatos' | 'automacao' | 'config'>('chat');
  const [contatoSelecionado, setContatoSelecionado] = useState<string | null>('1');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [digitando, setDigitando] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { localStorage.setItem('athos_whatsapp_contatos', JSON.stringify(contatos)); }, [contatos]);
  useEffect(() => { localStorage.setItem('athos_whatsapp_mensagens', JSON.stringify(mensagens)); }, [mensagens]);
  useEffect(() => { localStorage.setItem('athos_whatsapp_respostas', JSON.stringify(respostasAutomaticas)); }, [respostasAutomaticas]);
  useEffect(() => { localStorage.setItem('athos_n8n_config', JSON.stringify(configN8N)); }, [configN8N]);
  useEffect(() => { localStorage.setItem('athos_whatsapp_cloud_config', JSON.stringify(configWA)); }, [configWA]);
  useEffect(() => { localStorage.setItem('athos_bridge_config', JSON.stringify(configBridge)); }, [configBridge]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, contatoSelecionado]);

  // Polling de mensagens recebidas via API (n8n → nosso webhook)
  useEffect(() => {
    if (!configN8N.ativo || !configN8N.webhookUrl) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${configN8N.webhookUrl}?t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const novasMensagens = data.filter((item: { id: string }) =>
              !mensagens.some(m => m.id === item.id)
            );
            novasMensagens.forEach((item: { mensagem: string; contato: string; telefone?: string; data?: string; id: string }) => {
              if (!item.mensagem) return;
              const contatoExistente = contatos.find(c => c.telefone === item.telefone || c.nome === item.contato);
              const contatoId = contatoExistente?.id;
              if (!contatoId) return;
              setMensagens(prev => [...prev, {
                id: item.id || `webhook-${Date.now()}-${Math.random()}`,
                contatoId,
                tipo: 'recebida',
                texto: item.mensagem,
                timestamp: item.data ? new Date(item.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                status: 'lida',
              }]);
            });
          }
        }
      } catch {
        // Falha silenciosa no polling
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [configN8N.ativo, configN8N.webhookUrl, contatos, mensagens]);

  const enviarParaWebhook = async (texto: string, contatoId: string) => {
    const cfg = configN8N;
    if (!cfg.ativo || !cfg.webhookUrl) return;
    const contato = contatos.find(c => c.id === contatoId);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (cfg.apiKey) headers['Authorization'] = `Bearer ${cfg.apiKey}`;
      await fetch(cfg.webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tipo: 'mensagem',
          acao: 'enviar',
          numeroUsuario: NUMERO_USUARIO,
          contato: contato?.nome || 'Desconhecido',
          telefone: contato?.telefone || '',
          mensagem: texto,
          timestamp: new Date().toISOString(),
          usuario: usuarioLogado?.nome || 'Sistema',
        }),
      });
    } catch {
      // Falha silenciosa no webhook
    }
  };

  const enviarWhatsAppReal = async (texto: string, numeroDestino: string) => {
    const numero = numeroDestino.replace(/\D/g, '');
    if (numero.length < 10) return false;

    // Try bridge first (local or cloud)
    if (configBridge.ativo && configBridge.url) {
      try {
        const res = await fetch(`${configBridge.url.replace(/\/$/, '')}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telefone: numero, mensagem: texto }),
        });
        if (res.ok) return true;
      } catch {}
    }

    // Fallback: Z-API
    if (!configWA.ativo || !configWA.instanceId || !configWA.token) return false;
    try {
      const baseUrl = `https://api.z-api.io/instances/${configWA.instanceId}/token/${configWA.token}`;
      const res = await fetch(`${baseUrl}/send-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: numero, message: texto }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error('Z-API error:', err);
      }
      return res.ok;
    } catch (err) {
      console.error('Z-API send error:', err);
      return false;
    }
  };

  const configurarWebhookZAPI = async () => {
    const { instanceId, token } = configWA;
    if (!instanceId || !token) return;
    try {
      const webhookUrl = `${window.location.origin}/api/webhook`;
      const res = await fetch(`https://api.z-api.io/instances/${instanceId}/token/${token}/webhook`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: webhookUrl }),
      });
      if (res.ok) {
        addToast('Webhook Z-API configurado com sucesso!', 'success');
      } else {
        const errText = await res.text();
        addToast('Erro ao configurar webhook: ' + errText, 'error');
      }
    } catch {
      addToast('Erro de conexão com Z-API', 'error');
    }
  };

  const enviarMensagem = () => {
    if (!novaMensagem.trim() || !contatoSelecionado) return;
    
    const msg: MensagemWhatsApp = {
      id: Date.now().toString(),
      contatoId: contatoSelecionado,
      tipo: 'enviada',
      texto: novaMensagem,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'enviada'
    };
    setMensagens([...mensagens, msg]);
    setNovaMensagem('');

    // Enviar para webhook n8n se ativo
    enviarParaWebhook(msg.texto, contatoSelecionado);

    // Enviar WhatsApp real se configurado
    const contato = contatos.find(c => c.id === contatoSelecionado);
    if (contato?.telefone) {
      enviarWhatsAppReal(msg.texto, contato.telefone);
    }

    // Simular resposta automática
    setDigitando(true);
    setTimeout(() => {
      const resposta = gerarRespostaAutomatica(novaMensagem.toLowerCase());
      const respostaMsg: MensagemWhatsApp = {
        id: (Date.now() + 1).toString(),
        contatoId: contatoSelecionado,
        tipo: 'recebida',
        texto: resposta,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        status: 'lida'
      };
      setMensagens(prev => [...prev, respostaMsg]);
      setDigitando(false);
    }, 1500 + Math.random() * 2000);
  };

  const gerarRespostaAutomatica = (texto: string): string => {
    const respostas = respostasAutomaticas.filter(r => texto.includes(r.palavraChave));
    if (respostas.length > 0) {
      return respostas[Math.floor(Math.random() * respostas.length)].resposta;
    }
    return 'Obrigado pela mensagem! Um de nossos consultores responderá em breve. 🌟';
  };

  const contatoAtual = contatos.find(c => c.id === contatoSelecionado);
  const mensagensContato = mensagens.filter(m => m.contatoId === contatoSelecionado);

  const testarN8N = async () => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (configN8N.apiKey) headers['Authorization'] = `Bearer ${configN8N.apiKey}`;

      addToast({ type: 'info', title: '🔄 Testando...', message: `Conectando a ${configN8N.webhookUrl}` });

      const res = await fetch(configN8N.webhookUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          tipo: 'teste',
          mensagem: 'Teste de conexão ATHOS WhatsApp',
          timestamp: new Date().toISOString(),
          numero: NUMERO_USUARIO,
          contato: usuarioLogado?.nome || 'Sistema',
        }),
      });

      if (res.ok) {
        setConfigN8N({ ...configN8N, ultimoTeste: new Date().toLocaleString('pt-BR') });
        addToast({ type: 'success', title: '✅ Conexão OK', message: `Webhook respondeu com status ${res.status}` });
      } else {
        const texto = await res.text();
        addToast({ type: 'error', title: `❌ HTTP ${res.status}`, message: texto.slice(0, 100) || 'Resposta vazia' });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Webhook test error:', msg);
      addToast({ type: 'error', title: '❌ Erro de conexão', message: msg });
    }
  };

  return (
    <div className="flex h-full">
      {/* Lista de Conversas */}
      <div className="w-80 bg-gray-900 border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="text-green-400" size={24} />
            <span className="font-bold text-white">ATHOS WhatsApp</span>
            <span className="ml-auto px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded-full">Conectado</span>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Buscar conversas..." className="w-full pl-9 pr-4 py-2 bg-gray-800 rounded-lg text-sm text-white border border-white/10" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contatos.map(contato => {
            const ultimaMsg = mensagens.filter(m => m.contatoId === contato.id).slice(-1)[0];
            return (
              <div
                key={contato.id}
                onClick={() => setContatoSelecionado(contato.id)}
                className={`p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 ${contatoSelecionado === contato.id ? 'bg-green-500/10 border-l-2 border-green-500' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                      {contato.nome.charAt(0)}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-900 ${contato.status === 'online' ? 'bg-green-400' : contato.status === 'ausente' ? 'bg-yellow-400' : 'bg-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white truncate">{contato.nome}</span>
                      <span className="text-[10px] text-gray-500">{ultimaMsg?.timestamp || ''}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{ultimaMsg?.texto || 'Nenhuma mensagem'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Abas inferiores */}
        <div className="p-2 border-t border-white/5 flex justify-around">
          <button onClick={() => setAba('chat')} className={`p-2 rounded-lg ${aba === 'chat' ? 'bg-green-500/20 text-green-400' : 'text-gray-500'}`}>
            <MessageSquare size={20} />
          </button>
          <button onClick={() => setAba('contatos')} className={`p-2 rounded-lg ${aba === 'contatos' ? 'bg-green-500/20 text-green-400' : 'text-gray-500'}`}>
            <Users size={20} />
          </button>
          <button onClick={() => setAba('automacao')} className={`p-2 rounded-lg ${aba === 'automacao' ? 'bg-green-500/20 text-green-400' : 'text-gray-500'}`}>
            <Bot size={20} />
          </button>
          <button onClick={() => setAba('config')} className={`p-2 rounded-lg ${aba === 'config' ? 'bg-green-500/20 text-green-400' : 'text-gray-500'}`}>
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Área de Chat */}
      <div className="flex-1 flex flex-col bg-gray-950">
        {contatoSelecionado && contatoAtual ? (
          <>
            {/* Header do Chat */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
                    {contatoAtual.nome.charAt(0)}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-950 ${contatoAtual.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{contatoAtual.nome}</p>
                  <p className="text-xs text-gray-500">{contatoAtual.telefone} • {contatoAtual.status === 'online' ? 'Online' : contatoAtual.ultimoAcesso}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><Phone size={18} /></button>
                <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><Video size={18} /></button>
                <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mensagensContato.map(msg => (
                <div key={msg.id} className={`flex ${msg.tipo === 'enviada' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl ${msg.tipo === 'enviada' ? 'bg-green-600 text-white rounded-br-sm' : 'bg-gray-800 text-white rounded-bl-sm'}`}>
                    <p className="text-sm">{msg.texto}</p>
                    <div className={`flex items-center gap-1 mt-1 ${msg.tipo === 'enviada' ? 'justify-end' : ''}`}>
                      <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
                      {msg.tipo === 'enviada' && (
                        <span className="text-[10px]">{msg.status === 'lida' ? '✓✓' : msg.status === 'entregue' ? '✓✓' : '✓'}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {digitando && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-sm">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de Mensagem */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-2 bg-gray-800 rounded-full px-4 py-2">
                <button className="text-gray-400 hover:text-white"><Paperclip size={20} /></button>
                <button className="text-gray-400 hover:text-white"><Image size={20} /></button>
                <button className="text-gray-400 hover:text-white"><Sticker size={20} /></button>
                <input
                  type="text"
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && enviarMensagem()}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                />
                <button onClick={enviarMensagem} className="text-green-400 hover:text-green-300">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle size={64} className="text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>

      {/* Painel Lateral - Automação */}
      {aba === 'automacao' && (
        <div className="w-80 bg-gray-900 border-l border-white/5 p-4 overflow-y-auto">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Bot size={16} className="text-green-400" /> Automação n8n
          </h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-800 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white">Saudação Automática</span>
                <span className="w-2 h-2 bg-green-400 rounded-full" />
              </div>
              <p className="text-[10px] text-gray-500">Responde "oi" automaticamente</p>
            </div>
            
            <div className="p-3 bg-gray-800 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white">Atendimento 24h</span>
                <span className="w-2 h-2 bg-green-400 rounded-full" />
              </div>
              <p className="text-[10px] text-gray-500">Responde dúvidas sobre serviços</p>
            </div>
            
            <div className="p-3 bg-gray-800 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white">Agendamento</span>
                <span className="w-2 h-2 bg-yellow-400 rounded-full" />
              </div>
              <p className="text-[10px] text-gray-500">Agenda reuniões via chat</p>
            </div>
            
            <div className="p-3 bg-gray-800 rounded-lg border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white">Suporte Técnico</span>
                <span className="w-2 h-2 bg-green-400 rounded-full" />
              </div>
              <p className="text-[10px] text-gray-500">Abre chamado automaticamente</p>
            </div>
          </div>

          <h3 className="text-sm font-bold text-white mt-6 mb-3 flex items-center gap-2">
            <Zap size={16} className="text-yellow-400" /> Respostas Rápidas
          </h3>
          <div className="space-y-2">
            {respostasAutomaticas.map((r, i) => (
              <div key={i} className="p-2 bg-gray-800/50 rounded-lg border border-white/5">
                <p className="text-[10px] text-green-400">"{r.palavraChave}"</p>
                <p className="text-xs text-gray-300 mt-1 line-clamp-2">{r.resposta}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Painel Lateral - Configuração n8n */}
      {aba === 'config' && (
        <div className="w-80 bg-gray-900 border-l border-white/5 p-4 overflow-y-auto">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Webhook size={16} className="text-violet-400" /> Configuração n8n
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Link size={14} className="text-violet-400" />
                <span className="text-xs font-medium text-white">Webhook URL</span>
              </div>
              <input
                type="text"
                value={configN8N.webhookUrl}
                onChange={(e) => setConfigN8N({ ...configN8N, webhookUrl: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg text-xs text-white border border-white/10"
                placeholder="https://n8n.seu-dominio.com/webhook/..."
              />
            </div>

            <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
              <div className="flex items-center gap-2 mb-2">
                <Key size={14} className="text-blue-400" />
                <span className="text-xs font-medium text-white">API Key</span>
              </div>
              <input
                type="password"
                value={configN8N.apiKey}
                onChange={(e) => setConfigN8N({ ...configN8N, apiKey: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 rounded-lg text-xs text-white border border-white/10"
                placeholder="••••••••••••"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-amber-400" />
                <span className="text-xs text-white">Ativar Integração</span>
              </div>
              <button
                onClick={() => setConfigN8N({ ...configN8N, ativo: !configN8N.ativo })}
                className={`w-10 h-5 rounded-full transition-colors ${configN8N.ativo ? 'bg-green-500' : 'bg-gray-600'}`}
              >
                <span className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${configN8N.ativo ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            <button
              onClick={testarN8N}
              className="w-full py-2 bg-violet-600 hover:bg-violet-500 rounded-lg text-xs text-white font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw size={14} /> Testar Conexão
            </button>

            {configN8N.ultimoTeste && (
              <p className="text-[10px] text-gray-500 text-center">Último teste: {configN8N.ultimoTeste}</p>
            )}

            <div className="p-3 bg-gray-800/50 rounded-lg border border-white/5">
              <p className="text-xs text-gray-400">
                <strong className="text-white">Como integrar com n8n:</strong>
              </p>
              <ol className="text-[10px] text-gray-500 mt-2 space-y-1">
                <li>1. Crie um workflow no n8n</li>
                <li>2. Adicione Webhook (POST)</li>
                <li>3. Copie a URL acima</li>
                <li>4. Configure as ações</li>
                <li>5. Ative a integração</li>
              </ol>
            </div>

            <hr className="border-white/10 my-4" />

            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <MessageCircle size={16} className="text-green-400" /> Z-API (WhatsApp Real)
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-white">ID da Instância</span>
                </div>
                <input
                  type="text"
                  value={configWA.instanceId}
                  onChange={(e) => setConfigWA({ ...configWA, instanceId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 rounded-lg text-xs text-white border border-white/10 font-mono"
                />
              </div>

              <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-white">Token</span>
                </div>
                <input
                  type="password"
                  value={configWA.token}
                  onChange={(e) => setConfigWA({ ...configWA, token: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 rounded-lg text-xs text-white border border-white/10 font-mono"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-green-400" />
                  <span className="text-xs text-white">Ativar WhatsApp Real</span>
                </div>
                <button
                  onClick={() => setConfigWA({ ...configWA, ativo: !configWA.ativo })}
                  className={`w-10 h-5 rounded-full transition-colors ${configWA.ativo ? 'bg-green-500' : 'bg-gray-600'}`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${configWA.ativo ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="p-3 bg-gray-800/50 rounded-lg border border-white/5">
                <p className="text-xs font-medium text-green-400 mb-2">📋 Configurar Webhook (Z-API)</p>
                <button
                  onClick={configurarWebhookZAPI}
                  className="w-full mb-3 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-xs text-white font-medium transition-colors"
                >
                  🔄 Configurar Webhook Automaticamente
                </button>
                <p className="text-[10px] text-gray-500 mb-2">Ou copie a URL abaixo e cole no painel Z-API:</p>
                <div className="px-2 py-1.5 bg-gray-900 rounded text-[10px] text-green-400 font-mono break-all select-all">
                  {typeof window !== 'undefined' ? window.location.origin : 'https://athos-business-management-platform.vercel.app'}/api/webhook
                </div>
              </div>
            </div>

            <hr className="border-white/10 my-4" />

            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <MessageCircle size={16} className="text-blue-400" /> WhatsApp Bridge (Grátis)
            </h3>

            <div className="space-y-4">
              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-white">URL do Bridge</span>
                </div>
                <input
                  type="text"
                  value={configBridge.url}
                  onChange={(e) => setConfigBridge({ ...configBridge, url: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-800 rounded-lg text-xs text-white border border-white/10 font-mono"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-blue-400" />
                  <span className="text-xs text-white">Usar Bridge</span>
                </div>
                <button
                  onClick={() => setConfigBridge({ ...configBridge, ativo: !configBridge.ativo })}
                  className={`w-10 h-5 rounded-full transition-colors ${configBridge.ativo ? 'bg-blue-500' : 'bg-gray-600'}`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${configBridge.ativo ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </div>

              <div className="p-3 bg-gray-800/50 rounded-lg border border-white/5">
                <p className="text-xs font-medium text-blue-400 mb-2">📋 Como usar (100% grátis)</p>
                <ol className="text-[10px] text-gray-500 space-y-1.5">
                  <li>1. Abra a pasta <strong className="text-white">whatsapp-bridge</strong></li>
                  <li>2. Dê um duplo clique em <strong className="text-white">iniciar-bridge.bat</strong></li>
                  <li>3. Escaneie o QR Code com seu WhatsApp</li>
                  <li>4. Ative o toggle "Usar Bridge" acima</li>
                  <li>5. Mantenha o terminal aberto (pode minimizar)</li>
                </ol>
              </div>
              <BridgeQRCode url={configBridge.url} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppIntegration;

function BridgeQRCode({ url }: { url: string }) {
  const [qrData, setQrData] = useState<string | null>(null);
  const [status, setStatus] = useState('disconnected');

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch(`${url.replace(/\/$/, '')}/qr`);
        if (res.ok) {
          const data = await res.json();
          setQrData(data.qr);
          setStatus(data.status);
        }
      } catch { /* bridge offline */ }
    };
    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, [url]);

  if (status === 'connected') {
    return <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-center">
      <p className="text-xs text-green-400 font-medium">WhatsApp Conectado ✅</p>
    </div>;
  }

  return <div className="p-3 bg-gray-800/50 rounded-lg border border-white/5 text-center">
    {qrData ? (
      <>
        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`} alt="QR Code WhatsApp" className="mx-auto mb-2" />
        <p className="text-[10px] text-gray-500">Escaneie o QR Code com seu WhatsApp</p>
      </>
    ) : (
      <>
        <div className="animate-pulse flex justify-center mb-2">
          <div className="w-12 h-12 bg-gray-700 rounded-lg"></div>
        </div>
        <p className="text-[10px] text-gray-500">Aguardando QR Code...</p>
      </>
    )}
  </div>;
}
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
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

const WhatsAppIntegration: React.FC = () => {
  const { usuarioLogado } = useApp();
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

  const [configN8N, setConfigN8N] = useState<ConfiguracaoN8N>(() => {
    const saved = localStorage.getItem('athos_n8n_config');
    return saved ? JSON.parse(saved) : {
      webhookUrl: 'https://seu-n8n.com/webhook/athos-whatsapp',
      apiKey: '',
      ativo: false
    };
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, contatoSelecionado]);

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

  const testarN8N = () => {
    setConfigN8N({ ...configN8N, ultimoTeste: new Date().toLocaleString('pt-BR') });
    alert(`✅ Webhook testado!\n\nURL: ${configN8N.webhookUrl}\nStatus: Conectado\n\nO n8n está pronto para receber mensagens.`);
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
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppIntegration;
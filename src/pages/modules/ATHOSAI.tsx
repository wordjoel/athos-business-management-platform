import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { agents, getAgentById, Agent } from '../../data/agents';
import { aiEngine } from '../../services/aiEngine';
import {
  BrainCircuit, Send, Bot, User, Sparkles, MessageSquare,
  FileText, TrendingUp, Lightbulb, BarChart3, X, Loader
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  agentId: string;
  timestamp: string;
}

const ATHOSAI: React.FC = () => {
  const { darkMode, toggleAIPanel } = useApp();
  const { user } = useAuth();
  const [activeAgentId, setActiveAgentId] = useState('zeus');
  const [activeTab, setActiveTab] = useState<'chat' | 'insights'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeAgent = getAgentById(activeAgentId);

  useEffect(() => {
    if (user) {
      aiEngine.setContext({
        userId: user.email || 'local-user',
        userName: user.nome || 'Usuário',
        empresa: 'ATHOS',
        agentId: activeAgentId,
      });
    }
  }, [user, activeAgentId]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'ai',
        content: activeAgent.greeting,
        agentId: activeAgent.id,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }
  }, [activeAgentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      agentId: activeAgentId,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    const query = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiEngine.chat(query, activeAgentId);

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `**[${activeAgent.name} - ${activeAgent.role}]**\n\n${response}`,
        agentId: activeAgentId,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: `**[${activeAgent.name} - ${activeAgent.role}]**\n\nDesculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente.`,
        agentId: activeAgentId,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const switchAgent = (agentId: string) => {
    setActiveAgentId(agentId);
    setMessages([]);
  };

  const quickActions = [
    { label: 'Análise Financeira', query: 'Faça uma análise financeira completa' },
    { label: 'Insights', query: 'Quais insights você pode me dar?' },
    { label: 'Relatório', query: 'Gere um relatório executivo resumido' },
    { label: 'Oportunidades', query: 'Identifique oportunidades de melhoria' },
  ];

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-sm">{renderInlineFormatting(line.slice(2))}</li>;
      if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.') || line.startsWith('4.') || line.startsWith('5.')) return <li key={i} className="ml-4 list-decimal text-sm">{renderInlineFormatting(line.substring(line.indexOf(' ')+1))}</li>;
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="text-sm leading-relaxed">{renderInlineFormatting(line)}</p>;
    });
  };

  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>
        : part
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 flex items-center justify-center">
            <BrainCircuit size={20} className="text-gray-900" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">ATHOS AI</h1>
            <p className="text-xs text-gray-500">Hub de Inteligência Artificial</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab('insights')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeTab === 'insights' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-gray-400 hover:text-white'}`}>
            <Lightbulb size={14} className="inline mr-1" />Insights
          </button>
          <button onClick={toggleAIPanel} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20">
            <Sparkles size={14} className="inline mr-1" />Painel
          </button>
        </div>
      </div>

      <div className="flex gap-2 px-4 py-3 border-b border-white/5 overflow-x-auto">
        {agents.map(agent => (
          <motion.button
            key={agent.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => switchAgent(agent.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeAgentId === agent.id
                ? `bg-gradient-to-r ${agent.color} text-white shadow-lg`
                : 'bg-gray-800/50 border border-white/5 text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span className="text-lg">{agent.icon}</span>
            <div className="text-left">
              <p className="text-sm font-bold">{agent.name}</p>
              <p className="text-[10px] opacity-80">{agent.role}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'chat' ? (
          <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => {
                const isCurrentAgent = msg.agentId === activeAgentId;
                const msgAgent = agents.find(a => a.id === msg.agentId) || activeAgent;

                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'ai' && isCurrentAgent && (
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${msgAgent.color} flex items-center justify-center flex-shrink-0 mt-1`}>
                        <span className="text-lg">{msgAgent.icon}</span>
                      </div>
                    )}
                    {msg.role === 'ai' && !isCurrentAgent && (
                      <div className="w-9 h-9 rounded-xl bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot size={16} className="text-gray-400" />
                      </div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white'
                        : darkMode
                          ? 'bg-gray-800/80 border border-white/5 text-gray-300'
                          : 'bg-white border border-gray-200 text-gray-700'
                    }`}>
                      {renderContent(msg.content)}
                      <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-white/50' : 'text-gray-500'}`}>{msg.timestamp}</p>
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-9 h-9 rounded-xl bg-gray-700 flex items-center justify-center flex-shrink-0 mt-1">
                        <User size={16} className="text-gray-300" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-r ${activeAgent.color} flex items-center justify-center flex-shrink-0 mt-1`}>
                    <span className="text-lg">{activeAgent.icon}</span>
                  </div>
                  <div className={`rounded-2xl px-4 py-3 border ${darkMode ? 'bg-gray-800/80 border-white/5' : 'bg-white border-gray-200'}`}>
                    <div className="flex items-center gap-2">
                      <Loader size={16} className="text-cyan-400 animate-spin" />
                      <span className="text-sm text-gray-400">{activeAgent.name} está analisando...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-2 border-t border-white/5">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(action.query)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={`Pergunte ao ${activeAgent.name}...`}
                  className="flex-1 px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white outline-none focus:border-cyan-500/50 transition-colors placeholder-gray-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-gray-900 transition-all hover:shadow-glow disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <InsightsTab />
        )}
      </AnimatePresence>
    </div>
  );
};

const InsightsTab: React.FC = () => {
  const [data, setData] = useState<{ agent: Agent; insight: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await aiEngine.getInsights();
        setData(result);
      } catch {
        setData(agents.map(a => ({ agent: a, insight: `${a.name} está analisando os dados do sistema para gerar recomendações personalizadas na área de ${a.role.toLowerCase()}.` })));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <motion.div key="insights" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto p-4 space-y-3">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white">Insights dos Agentes</h3>
        <span className="text-[10px] text-gray-500">Baseado nos dados do sistema</span>
      </div>
      {loading ? agents.map(agent => (
        <div key={agent.id} className="p-4 rounded-xl border border-white/5 bg-white/5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{agent.icon}</span>
            <div>
              <h4 className="text-sm font-bold text-white">{agent.name}</h4>
              <p className="text-[10px] text-gray-400">{agent.role}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">Gerando insights...</p>
        </div>
      )) : data.map(({ agent, insight }) => (
        <div key={agent.id} className={`p-4 rounded-xl border border-white/5`} style={{ background: `linear-gradient(135deg, ${agent.color.replace('from-', '').split(' ')[0]}08, ${agent.color.replace('to-', '').split(' ')[1]}08)` }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{agent.icon}</span>
            <div>
              <h4 className="text-sm font-bold text-white">{agent.name}</h4>
              <p className="text-[10px] text-gray-400">{agent.role}</p>
            </div>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">{insight}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {agent.specialties.map(s => (
              <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{s}</span>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default ATHOSAI;

import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, Send, Sparkles, X, Bot, User, Loader2 } from 'lucide-react';
import { insightsIA } from '../data/mockData';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
  type?: 'normal' | 'insight' | 'alert' | 'chart';
}

const aiResponses: Record<string, string> = {
  'fluxo de caixa': 'Analisando o fluxo de caixa atual...\n\n📊 **Resumo Janeiro/2025:**\n• Receitas realizadas: R$ 120.500\n• Despesas pagas: R$ 113.500\n• Saldo atual: R$ 7.000\n• A receber: R$ 129.500\n• A pagar: R$ 48.700\n\n🔮 **Projeção Fevereiro:**\nBaseado no histórico dos últimos 6 meses, a tendência é de crescimento de 5-8% nas receitas. Projeção de saldo para fevereiro: R$ 75.000.\n\n⚠️ **Atenção:** Os gastos com pessoal cresceram 12% nos últimos 3 meses.',
  'despesas': '📋 **Análise de Despesas - Janeiro 2025:**\n\nTotal de despesas: R$ 162.200\n• ✅ Pagas: R$ 113.500 (70%)\n• ⏳ Pendentes: R$ 48.700 (30%)\n\n🔍 **Gastos anormais detectados:**\n1. Treinamento equipe: R$ 15.000 (40% acima da média)\n2. Viagem negócios: R$ 7.500 (25% acima do budget)\n\n💡 **Sugestões de economia:**\n• Otimização AWS: economia potencial de R$ 576/mês\n• Licenças subutilizadas: R$ 2.400/mês\n• Negociação de contratos: R$ 3.050/mês',
  'receitas': '💰 **Análise de Receitas - Janeiro 2025:**\n\nTotal de receitas: R$ 220.000\n• ✅ Recebidas: R$ 120.500 (54.8%)\n• ⏳ A receber: R$ 129.500 (45.2%)\n\n📈 **Principais clientes:**\n1. Delta Tech: R$ 67.000 (venc. 25/01)\n2. Alpha Corp: R$ 45.000 ✅\n3. Theta Soluções: R$ 35.000 (venc. 10/02)\n\n📊 **Receita recorrente mensal:** R$ 36.500\n• Gamma SA: R$ 12.000 ✅\n• Epsilon Group: R$ 15.000 (venc. 20/01)\n• Zeta Inc: R$ 8.500 (venc. 30/01)',
  'economia': '💡 **Insights de Economia Identificados:**\n\n1. **AWS - Otimização de instâncias**\n   • Economia: ~R$ 576/mês (18%)\n   • Ação: Revisar configurações auto-scaling\n   • Impacto: ALTO\n\n2. **Licenças de software subutilizadas**\n   • Economia: ~R$ 2.400/mês\n   • Setor: Comercial\n   • Impacto: MÉDIO\n\n3. **Negociação antecipada de contratos**\n   • Economia: ~R$ 3.050/mês (10%)\n   • 3 contratos com renovação em 6 meses\n   • Impacto: MÉDIO\n\n💰 **Economia total potencial: R$ 6.026/mês (R$ 72.312/ano)**',
  'relatório': '📊 **Relatório Executivo Gerado Automaticamente:**\n\n🏢 **ATOS - Resumo Executivo Janeiro 2025**\n\n• Receita total: R$ 220.000 (+8.3% vs mês anterior)\n• Despesas totais: R$ 162.200 (+2.6% vs mês anterior)\n• Lucro líquido: R$ 57.800 (margem: 26.3%)\n\n📈 **Destaques positivos:**\n• Receita recorrente cresceu 15%\n• Margem de lucro acima da meta (25%)\n• 3 novos contratos assinados\n\n⚠️ **Pontos de atenção:**\n• RH ultrapassou orçamento mensal\n• 2 gastos anormais identificados\n• Setor Operacional com KPIs abaixo da meta\n\n🔮 **Previsão Q1 2025: Positiva**\nProjeção de crescimento contínuo com margem estimada de 28-30%.',
};

function getAIResponse(query: string): string {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('fluxo') || lowerQuery.includes('caixa') || lowerQuery.includes('proje') || lowerQuery.includes('previs')) return aiResponses['fluxo de caixa'];
  if (lowerQuery.includes('despesa') || lowerQuery.includes('gasto') || lowerQuery.includes('pagar')) return aiResponses['despesas'];
  if (lowerQuery.includes('receita') || lowerQuery.includes('receber') || lowerQuery.includes('faturamento')) return aiResponses['receitas'];
  if (lowerQuery.includes('economia') || lowerQuery.includes('economizar') || lowerQuery.includes('reduzir') || lowerQuery.includes('cortar')) return aiResponses['economia'];
  if (lowerQuery.includes('relatório') || lowerQuery.includes('relatorio') || lowerQuery.includes('resumo') || lowerQuery.includes('executivo')) return aiResponses['relatório'];
  return `Compreendo sua consulta sobre "${query}".\n\nAnalisando os dados da ATOS Centro de Organização...\n\n📊 **Análise realizada:**\n\nBaseado nos dados atuais do sistema, posso informar que:\n\n• A empresa apresenta tendência de crescimento consistente\n• O fluxo de caixa está saudável com margem de 26.3%\n• Existem oportunidades de economia identificadas totalizando R$ 72.312/ano\n\n💡 **Recomendações:**\n1. Revise os gastos anormais dos últimos 30 dias\n2. Avalie a renegociação de contratos próximos ao vencimento\n3. Monitore o setor Operacional que apresenta KPIs abaixo da meta\n\nPrecisa de uma análise mais específica? Posso detalhar qualquer área.`;
}

const AIAssistant: React.FC<{ darkMode: boolean; onClose: () => void }> = ({ darkMode, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'ai',
      content: 'Olá! Sou o assistente de IA da ATOS. Posso ajudar com:\n\n📊 **Análise financeira** - Despesas, receitas, fluxo de caixa\n💡 **Insights de economia** - Oportunidades de redução de custos\n🔮 **Previsões** - Projeções baseadas em dados históricos\n📋 **Relatórios** - Geração automática de relatórios executivos\n⚠️ **Alertas** - Detecção de gastos anormais e tendências\n\nComo posso ajudar hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    const query = input;
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: getAIResponse(query),
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        type: 'normal',
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const quickActions = [
    { label: 'Fluxo de Caixa', query: 'Como está o fluxo de caixa?' },
    { label: 'Despesas', query: 'Análise de despesas do mês' },
    { label: 'Economia', query: 'Quais oportunidades de economia?' },
    { label: 'Relatório', query: 'Gere um relatório executivo' },
  ];

  const bg = darkMode ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200';
  const textMain = darkMode ? 'text-white' : 'text-gray-900';
  const textMuted = darkMode ? 'text-gray-400' : 'text-gray-500';
  const textSub = darkMode ? 'text-gray-500' : 'text-gray-400';
  const inputBg = darkMode ? 'bg-white/5 border-white/10 focus:border-athos-500/50' : 'bg-gray-50 border-gray-200 focus:border-athos-400';
  const aiBubble = darkMode ? 'bg-athos-500/10 border-athos-500/20' : 'bg-athos-50 border-athos-100';
  const userBubble = 'gradient-athos';

  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('• ')) return <li key={i} className="ml-4 list-disc">{renderInlineFormatting(line.slice(2))}</li>;
      if (line.trim() === '') return <br key={i} />;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold mt-2">{renderInlineFormatting(line)}</p>;
      return <p key={i}>{renderInlineFormatting(line)}</p>;
    });
  };

  const renderInlineFormatting = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={`fixed right-0 top-0 h-full w-[480px] z-50 flex flex-col border-l shadow-2xl transition-all animate-slide-right ${bg}`}>
      {/* Header */}
      <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-athos flex items-center justify-center">
            <BrainCircuit size={20} className="text-white" />
          </div>
          <div>
            <h3 className={`text-sm font-bold ${textMain}`}>ATOS AI</h3>
            <p className={`text-xs ${textSub}`}>Assistente Inteligente</p>
          </div>
        </div>
        <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
          <X size={18} />
        </button>
      </div>

      {/* Insights */}
      <div className={`px-4 py-3 border-b ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={14} className="text-athos-400" />
          <span className={`text-xs font-semibold ${textSub}`}>INSIGHTS ATIVOS</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {insightsIA.slice(0, 3).map(insight => (
            <div key={insight.id} className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs border max-w-[200px] ${
              insight.impacto === 'alto' 
                ? darkMode ? 'bg-red-500/10 border-red-500/20 text-red-300' : 'bg-red-50 border-red-200 text-red-600'
                : insight.impacto === 'medio'
                ? darkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-600'
                : darkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
            }`}>
              <p className="font-medium truncate">{insight.titulo}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            {msg.role === 'ai' && (
              <div className="w-7 h-7 rounded-lg gradient-athos flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={14} className="text-white" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? `${userBubble} text-white`
                : `${aiBubble} border ${textMain}`
            }`}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{renderContent(msg.content)}</div>
              <p className={`text-[10px] mt-2 ${msg.role === 'user' ? 'text-white/60' : textSub}`}>{msg.timestamp}</p>
            </div>
            {msg.role === 'user' && (
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-1 ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                <User size={14} className={textMuted} />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 justify-start animate-fade-in">
            <div className="w-7 h-7 rounded-lg gradient-athos flex items-center justify-center flex-shrink-0 mt-1">
              <Bot size={14} className="text-white" />
            </div>
            <div className={`rounded-2xl px-4 py-3 border ${aiBubble}`}>
              <div className="flex items-center gap-2">
                <Loader2 size={16} className="text-athos-400 animate-spin" />
                <span className={`text-sm ${textMuted}`}>Analisando dados...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className={`px-4 py-2 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => { setInput(action.query); }}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                darkMode 
                  ? 'border-white/10 text-gray-300 hover:border-athos-500/50 hover:text-athos-300 hover:bg-athos-500/10' 
                  : 'border-gray-200 text-gray-600 hover:border-athos-400 hover:text-athos-600 hover:bg-athos-50'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Pergunte sobre seus dados..."
            className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none border transition-colors ${inputBg} ${textMain} placeholder:${textSub}`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 rounded-xl gradient-athos text-white transition-all hover:shadow-glow disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;

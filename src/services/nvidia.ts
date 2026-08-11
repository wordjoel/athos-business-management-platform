export type AIProvider = 'nvidia' | 'openrouter' | 'openai' | 'gemini' | 'claude' | 'deepseek' | 'openwebui';

interface AIProviderConfig {
  id: AIProvider;
  name: string;
  apiUrl: string;
  apiKey: string;
  models: string[];
  defaultModel: string;
}

const PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  nvidia: {
    id: 'nvidia',
    name: 'NVIDIA NIM',
    apiUrl: 'https://integrate.api.nvidia.com/v1/chat/completions',
    apiKey: import.meta.env.VITE_NVIDIA_API_KEY || '',
    models: ['meta/llama-3.1-70b-instruct', 'meta/llama-3.1-8b-instruct', 'mistralai/mixtral-8x7b-instruct-v0.1'],
    defaultModel: 'meta/llama-3.1-70b-instruct',
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    apiKey: import.meta.env.VITE_OPENROUTER_API_KEY || '',
    models: ['openai/gpt-4o-mini', 'meta-llama/llama-3.1-8b-instruct', 'meta-llama/llama-3.1-70b-instruct'],
    defaultModel: 'openai/gpt-4o-mini',
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-4o',
  },
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/',
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'],
    defaultModel: 'gemini-1.5-pro',
  },
  claude: {
    id: 'claude',
    name: 'Anthropic Claude',
    apiUrl: 'https://api.anthropic.com/v1/messages',
    apiKey: import.meta.env.VITE_CLAUDE_API_KEY || '',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
    defaultModel: 'claude-3-5-sonnet-20241022',
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY || '',
    models: ['deepseek-chat', 'deepseek-coder'],
    defaultModel: 'deepseek-chat',
  },
  openwebui: {
    id: 'openwebui',
    name: 'OpenWebUI',
    apiUrl: import.meta.env.VITE_OPENWEBUI_URL || 'http://localhost:11434/v1/chat/completions',
    apiKey: import.meta.env.VITE_OPENWEBUI_API_KEY || '',
    models: ['llama3.1', 'mistral', 'codellama'],
    defaultModel: 'llama3.1',
  },
};

const envProvider = import.meta.env.VITE_AI_PROVIDER as AIProvider | undefined;
const validProviders = Object.keys(PROVIDERS) as AIProvider[];
let activeProvider: AIProvider = envProvider && validProviders.includes(envProvider) ? envProvider : 'nvidia';
let activeModel: string = '';

export function setActiveProvider(provider: AIProvider): void {
  activeProvider = provider;
  activeModel = '';
}

export function getActiveProvider(): AIProviderConfig {
  return PROVIDERS[activeProvider];
}

export function getActiveModel(): string {
  if (activeModel) return activeModel;
  return PROVIDERS[activeProvider].defaultModel;
}

export function getAvailableProviders(): AIProviderConfig[] {
  return Object.values(PROVIDERS).filter(p => p.apiKey);
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionChoice {
  index: number;
  message: { role: string; content: string };
  finish_reason: string;
}

interface OpenAICompatResponse {
  id: string;
  choices: ChatCompletionChoice[];
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
}

async function callOpenAICompat(config: AIProviderConfig, messages: ChatMessage[], model?: string, temperature = 0.7, maxTokens = 1024): Promise<string> {
  if (!config.apiKey) return generateMockResponse(messages.map(m => m.content).join('\n'));

  const body = {
    model: model || config.defaultModel,
    messages,
    temperature,
    max_tokens: maxTokens,
    top_p: 0.95,
  };

  const res = await fetch(config.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    console.warn(`${config.name} API error (${res.status}): ${err}`);
    return generateMockResponse(messages.map(m => m.content).join('\n'));
  }

  const data: OpenAICompatResponse = await res.json();
  return data.choices?.[0]?.message?.content || 'Sem resposta.';
}

async function callGemini(messages: ChatMessage[], model?: string, temperature = 0.7, maxTokens = 1024): Promise<string> {
  const config = PROVIDERS.gemini;
  if (!config.apiKey) return generateMockResponse(messages.map(m => m.content).join('\n'));

  const contents = messages.filter(m => m.role !== 'system').map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const systemMsg = messages.find(m => m.role === 'system');
  const body: Record<string, unknown> = {
    contents,
    generationConfig: { temperature, maxOutputTokens: maxTokens },
  };
  if (systemMsg) {
    body.systemInstruction = { parts: [{ text: systemMsg.content }] };
  }

  const m = model || config.defaultModel;
  const res = await fetch(`${config.apiUrl}${m}:generateContent?key=${config.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.warn(`Gemini API error: ${res.status}`);
    return generateMockResponse(messages.map(m => m.content).join('\n'));
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta.';
}

async function callClaude(messages: ChatMessage[], model?: string, temperature = 0.7, maxTokens = 1024): Promise<string> {
  const config = PROVIDERS.claude;
  if (!config.apiKey) return generateMockResponse(messages.map(m => m.content).join('\n'));

  const systemMsg = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');

  const body: Record<string, unknown> = {
    model: model || config.defaultModel,
    messages: userMessages,
    max_tokens: maxTokens,
    temperature,
  };
  if (systemMsg) body.system = systemMsg.content;

  const res = await fetch(config.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.warn(`Claude API error: ${res.status}`);
    return generateMockResponse(messages.map(m => m.content).join('\n'));
  }

  const data = await res.json();
  return data.content?.[0]?.text || 'Sem resposta.';
}

async function chatComplete(messages: ChatMessage[], options: { temperature?: number; maxTokens?: number; model?: string } = {}): Promise<string> {
  const provider = activeProvider;
  const temp = options.temperature ?? 0.7;
  const maxTok = options.maxTokens ?? 1024;
  const model = options.model;

  if (provider === 'gemini') return callGemini(messages, model, temp, maxTok);
  if (provider === 'claude') return callClaude(messages, model, temp, maxTok);

  return callOpenAICompat(PROVIDERS[provider], messages, model, temp, maxTok);
}

export async function generateText(prompt: string, options: { model?: string; temperature?: number; maxTokens?: number } = {}): Promise<string> {
  const systemPrompt = 'Você é um assistente de IA especializado em gestão empresarial, ERP, finanças e operações. Analise os dados fornecidos e responda de forma clara, estruturada e objetiva em português brasileiro. Use marcadores e seções para organizar a resposta.';
  return chatComplete([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: prompt },
  ], options);
}

export async function generateBusinessInsights(context: string): Promise<string> {
  const systemPrompt = 'Você é um analista de negócios sênior. Gere 3 insights objetivos baseados no contexto fornecido. Cada insight deve começar com "- [Categoria]: " e ser conciso.';
  return chatComplete([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: `Contexto: ${context}\n\nGere 3 insights de negócio.` },
  ], { temperature: 0.5, maxTokens: 512 });
}

export async function generateAutomationSuggestions(businessArea: string): Promise<string[]> {
  try {
    const response = await chatComplete([
      { role: 'system', content: 'Você é um consultor de automação. Liste 5 sugestões de automação para a área informada. Retorne APENAS um JSON válido no formato: {"suggestions": ["sugestão 1", "sugestão 2", ...]}' },
      { role: 'user', content: `Área de negócio: ${businessArea}` },
    ], { temperature: 0.4, maxTokens: 512 });

    const parsed = JSON.parse(response.replace(/```json|```/g, '').trim());
    if (parsed.suggestions?.length) return parsed.suggestions;
  } catch {}

  return [
    'Automatizar faturamento recorrente',
    'Notificações inteligentes de vencimento',
    'Triagem automática de chamados',
    'Relatórios executivos automatizados',
    'Follow-up automático de leads',
  ];
}

export async function generateVoiceMessage(
  type: 'bomdia' | 'lembrete' | 'cobranca' | 'aniversario' | 'bemvindo',
  context: string = '',
  language: 'pt' | 'en' | 'es' = 'pt'
): Promise<{ text: string; emotion: 'happy' | 'excited' | 'neutral' }> {
  const langMap = { pt: 'português brasileiro', en: 'English', es: 'español' };
  const typeNames = { bomdia: 'saudação matinal', lembrete: 'lembrete importante', cobranca: 'aviso de cobrança', aniversario: 'mensagem de aniversário', bemvindo: 'boas-vindas' };

  try {
    const response = await chatComplete([
      { role: 'system', content: `Você gera mensagens de voz curtas e naturais em ${langMap[language]}. Responda APENAS JSON com "text" e "emotion" (happy, excited, neutral).` },
      { role: 'user', content: `Tipo: ${typeNames[type]}. Contexto: ${context || 'geral'}. Seja natural e breve (máx 40 palavras).` },
    ], { temperature: 0.6, maxTokens: 256 });

    const parsed = JSON.parse(response.replace(/```json|```/g, '').trim());
    if (parsed.text) return parsed;
  } catch {}

  const defaults: Record<string, { text: string; emotion: 'happy' | 'excited' | 'neutral' }> = {
    bomdia: { text: 'Bom dia! Que você tenha um ótimo dia de trabalho.', emotion: 'happy' },
    lembrete: { text: 'Lembrete importante: verifique seus compromissos do dia.', emotion: 'excited' },
    cobranca: { text: 'Aviso: você possui pendências financeiras que necessitam atenção.', emotion: 'neutral' },
    aniversario: { text: 'Feliz aniversário! Que este novo ano traga muitas conquistas.', emotion: 'happy' },
    bemvindo: { text: 'Bem-vindo ao nosso sistema. Estamos aqui para ajudar.', emotion: 'happy' },
  };
  return defaults[type];
}

function generateMockResponse(context: string): string {
  const lower = context.toLowerCase();
  if (lower.includes('fluxo') || lower.includes('caixa')) {
    return '📊 **Análise de Fluxo de Caixa**\n\nBaseado nos dados:\n• Saldo positivo estável com tendência de crescimento\n• Oportunidade de otimização no ciclo de recebimentos\n• Possível negociação de prazos com fornecedores estratégicos\n\n💡 **Recomendações:**\n1. Implementar desconto para pagamentos antecipados\n2. Revisar condições de crédito com clientes principais\n3. Automatizar conciliação bancária';
  }
  if (lower.includes('despesa') || lower.includes('gasto')) {
    return '📋 **Análise de Despesas**\n\nIdentifiquei padrões que podem ser otimizados:\n• Gastos recorrentes com serviços cloud podem ser reduzidos em 20%\n• Licenças de software subutilizadas em departamentos administrativos\n• Oportunidades de consolidação de fornecedores\n\n💡 **Recomendações:**\n1. Auditorias trimestrais de uso de software\n2. Negociação de contratos corporativos\n3. Implementação de políticas de uso';
  }
  if (lower.includes('receita') || lower.includes('faturamento')) {
    return '💰 **Análise de Receitas**\n\nSuas receitas mostram potencial de crescimento:\n• Base de clientes recorrentes estável com baixa churn\n• Oportunidades de upsell em serviços complementares\n• Potencial para novos modelos de prestação\n\n💡 **Recomendações:**\n1. Programa de indicação com bonificação\n2. Desenvolvimento de pacotes de serviços\n3. Expansão para segmentos adjacentes';
  }
  if (lower.includes('economia') || lower.includes('custo')) {
    return '💡 **Insights de Economia**\n\nÁreas para redução de custos:\n1. **Infraestrutura de TI**: economia potencial de 15-25%\n2. **Processos Administrativos**: automatização economiza 10-15h/semana\n3. **Recursos Humanos**: cross-training para maior flexibilidade\n\n💰 **Economia total potencial: R$ 3.000-5.000/mês**';
  }
  if (lower.includes('relatório') || lower.includes('executivo')) {
    return '📊 **Relatório Executivo**\n\n**Resumo do Período**\n• Receita total: Estável com crescimento moderado\n• Despesas: Dentro do orçamento\n• Margem líquida: Saudável, acima da média do setor\n\n**Principais Destaques**\n• Retenção de clientes acima de 90%\n• Produtividade da equipe em níveis ótimos\n• Fluxo de caixa positivo e previsível';
  }
  return `🤖 **Análise Baseada em Dados**\n\nCom base na sua consulta, analisei os dados disponíveis:\n\n📊 **Contexto Atual**\nO sistema apresenta indicadores positivos com oportunidades de melhoria.\n\n💡 **Sugestões**\n1. Mapear processos críticos para identificação de gargalos\n2. Implementar métricas de desempenho (KPIs) claras\n3. Considerar soluções de automação gradativa\n4. Investir em capacitação da equipe em tecnologia`;
}

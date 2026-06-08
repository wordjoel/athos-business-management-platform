// Alternative implementation using mock data when NVIDIA API is not available
// This provides similar functionality without requiring an API key

// Mock responses for different types of queries
const mockResponses = {
  insights: [
    "- [Financeiro]: Oportunidade de Receita Extra - Implementar cobrança automática de serviços não utilizados (Impacto: Alto)",
    "- [Operacional]: Redução de Custos - Otimizar agendamento de recursos humanos baseado em demanda prevista (Impacto: Médio)",
    "- [Vendas]: Melhoria de Processo - Automatizar follow-up de leads com scoring inteligente (Impacto: Alto)"
  ],
  automation: [
    "1. Faturamento Automático - Sistema gera e envia faturas mensais automaticamente - Benefício: Redução de 5h/semana em trabalho manual - Complexidade: Baixa",
    "2. Lembretes de Pagamento - Notificação automática via WhatsApp/Email para clientes inadimplentes - Benefício: Redução de inadimplência em 30% - Complexidade: Média",
    "3. Atualização de Estoque - Integração com fornecedores para reposição automática - Benefício: Evitar rupturas e excesso de estoque - Complexidade: Média",
    "4. Relatórios Executivos - Geração e distribuição automática de relatórios gerenciais - Benefício: Economia de 3h/dia em preparação de relatórios - Complexidade: Baixa",
    "5. Triagem de Suporte - Chatbot inteligente para classificação inicial de chamados - Benefício: Redução de 40% no tempo de atendimento inicial - Complexidade: Alta"
  ]
};

// Text generation mock (alternative to NVIDIA API)
export async function generateText(prompt: string, _options: {
  model?: string;
  temperature?: number;
  maxTokens?: number;
} = {}): Promise<string> {

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  // Return contextual mock response based on prompt
  if (prompt.includes('fluxo de caixa') || prompt.includes('caixa')) {
    return `📊 **Análise de Fluxo de Caixa - Alternativa Mock**\n\nBaseado nos dados fornecidos, identifiquei:\n\n• Saldo positivo estável com tendência de crescimento\n• Oportunidade de otimização no ciclo de recebimentos (currently 45 dias)\n• Possível negociação de prazos com fornecedores estratégicos\n\n💡 **Recomendações:**\n1. Implementar desconto para pagamentos antecipados\n2. Revisar condições de crédito com clientes principais\n3. Automatizar conciliação bancária`;
  } else if (prompt.includes('despesa') || prompt.includes('gasto')) {
    return `📋 **Análise de Despesas - Alternativa Mock**\n\nIdentifiquei padrões de gastos que podem ser otimizados:\n\n• Gastos recorrentes com serviços de nuvem podem ser reduzidos em 20%\n• Licenças de software subutilizadas em departamentos administrativos\n• Oportunidades de consolidação de fornecedores\n\n💡 **Recomendações:**\n1. Auditorias trimestrais de uso de software\n2. Negociação de contratos corporativos\n3. Implementação de políticas de uso`;
  } else if (prompt.includes('receita') || prompt.includes('faturamento')) {
    return `💰 **Análise de Receitas - Alternativa Mock**\n\nSuas fontes de receita mostram potencial de crescimento:\n\n• Base de clientes recorrentes estável com baixa churn\n• Oportunidades de upsell em serviços complementares\n• Potencial para novos modelos de prestação\n\n💡 **Recomendações:**\n1. Programa de indicação com bonificação\n2. Desenvolvimento de pacotes de serviços\n3. Expansão para segmentos adjacentes`;
  } else if (prompt.includes('economia') || prompt.includes('custo')) {
    return `💡 **Insights de Economia - Alternativa Mock**\n\nÁreas identificadas para redução de custos:\n\n1. **Infraestrutura de TI**\n   • Otimização de recursos cloud: economia potencial de 15-25%\n   • Revisão de licenças e serviços subutilizados\n\n2. **Processos Administrativos**\n   • Automatização de tarefas repetitivas: economia de 10-15h/semana\n   • Padronização de procedimentos operacionais\n\n3. **Recursos Humanos**\n   • Cross-training de equipes para maior flexibilidade\n   • Incentivos baseados em produtividade e qualidade\n\n💰 **Economia total potencial estimada: R$ 3.000-5.000/mês`;
  } else if (prompt.includes('relatório') || prompt.includes('executivo')) {
    return `📊 **Relatório Executivo - Alternativa Mock**\n\n**Resumo do Período**\n• Receita total: Estável com crescimento moderado\n• Despesas: Dentro do orçamento com oportunidades de otimização\n• Margem líquida: Saudável, acima da média do setor\n\n**Principais Destaques**\n• Retenção de clientes acima de 90%\n• Produtividade da equipe em níveis ótimos\n• Fluxo de caixa positivo e previsível\n\n**Áreas de Atenção**\n• Sazonalidade na demanda em certos períodos\n• Dependência de poucos clientes-chave\n• Necessidade de atualização tecnológica gradual\n\n**Próximos Passos**\n1. Desenvolvimento de plano de expansão de serviços\n2. Implementação de dashboard de KPIs em tempo real\n3. Programa de capacitação técnica da equipe`;
  } else {
    // Generic response
    return `🤖 **Resposta da IA Alternativa (Modo Simulação)**\n\nCom base na sua consulta: "${prompt.substring(0, 50)}...\n\nComo estamos em modo de simulação (sem API NVIDIA configurada), forneço uma análise baseada em padrões comuns de gestão empresarial:\n\n📊 **Análise Contextual**\nSeu negócio apresenta características típicas de empresas de serviços em crescimento, com:\n• Base de clientes estabelecida\n• Oportunidades de otimização operacional\n• Potencial para automação de processos\n\n💡 **Sugestões Gerais**\n1. Mapear processos críticos para identificação de gargalos\n2. Implementar métricas de desempenho (KPIs) claras\n3. Considerar soluções de automação gradativa\n4. Investir em capacitação da equipe em tecnologia\n\n⚠️ **Nota**: Para respostas mais precisas e personalizadas, configure uma chave de API válida da NVIDIA AI Foundations no arquivo .env`;
  }
}

// Generate business insights using mock data (alternative to NVIDIA AI)
export async function generateBusinessInsights(_context: string): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  
  // Return 3 random insights from our mock data
  const selectedInsights = mockResponses.insights
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);
    
  return selectedInsights.join('\n\n');
}

// Generate automated suggestions for business processes (mock alternative)
export async function generateAutomationSuggestions(_businessArea: string): Promise<string[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 1000));
  
  // Return mock automation suggestions
  return mockResponses.automation.map(suggestion => 
    `🤖 [SIMULAÇÃO] ${suggestion}`
  );
}

// Generate voice message text with emotion
export async function generateVoiceMessage(
  type: 'bomdia' | 'lembrete' | 'cobranca' | 'aniversario' | 'bemvindo',
  _context: string = '',
  _language: 'pt' | 'en' | 'es' = 'pt'
): Promise<{ text: string; emotion: 'happy' | 'excited' | 'neutral' }> {
  const defaults: Record<typeof type, { text: string; emotion: 'happy' | 'excited' | 'neutral' }> = {
    bomdia: { text: 'Bom dia! Que você tenha um ótimo dia de trabalho.', emotion: 'happy' },
    lembrete: { text: 'Lembrete importante: verifique seus compromissos do dia.', emotion: 'excited' },
    cobranca: { text: 'Aviso: você possui pendências financeiras que necessitam atenção.', emotion: 'neutral' },
    aniversario: { text: 'Feliz aniversário! Que este novo ano traga muitas conquistas.', emotion: 'happy' },
    bemvindo: { text: 'Bem-vindo ao nosso sistema. Estamos aqui para ajudar.', emotion: 'happy' }
  };

  return defaults[type];
}
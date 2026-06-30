import { generateText, generateBusinessInsights, generateAutomationSuggestions } from './nvidia';
import { getLancamentos, getFluxoCaixaMensal, getDREValores } from './lancamentoService';
import { agents, Agent } from '../data/agents';

interface AiCache {
  key: string;
  response: string;
  timestamp: number;
}

interface AiContext {
  userId: string;
  userName: string;
  empresa: string;
  agentId: string;
  sessionId: string;
  previousMessages: { role: string; content: string }[];
}

const CACHE_KEY = 'athos_ai_cache';
const CACHE_TTL = 5 * 60 * 1000;

class AiEngine {
  private context: AiContext | null = null;

  setContext(ctx: Partial<AiContext>): void {
    this.context = { ...this.getDefaultContext(), ...ctx };
  }

  getContext(): AiContext {
    if (!this.context) this.context = this.getDefaultContext();
    return this.context;
  }

  private getDefaultContext(): AiContext {
    return {
      userId: 'local-user',
      userName: 'Usuário',
      empresa: 'ATHOS',
      agentId: 'zeus',
      sessionId: Date.now().toString(36),
      previousMessages: [],
    };
  }

  private getCache(): Map<string, AiCache> {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      return new Map(raw ? JSON.parse(raw) : []);
    } catch {
      return new Map();
    }
  }

  private setCache(key: string, response: string): void {
    const cache = this.getCache();
    cache.set(key, { key, response, timestamp: Date.now() });
    const entries = Array.from(cache.entries())
      .filter(([_, v]) => Date.now() - v.timestamp < CACHE_TTL)
      .slice(-50);
    localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
  }

  private getCached(key: string): string | null {
    const cache = this.getCache();
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      cache.delete(key);
      return null;
    }
    return entry.response;
  }

  private buildSystemPrompt(agent: Agent): string {
    return `Você é ${agent.name}, ${agent.role} da ATHOS ERP. ${agent.description}.
Especialidades: ${agent.specialties.join(', ')}.
Contexto atual: ${this.getContext().empresa}, usuário ${this.getContext().userName}.
Responda em português brasileiro, de forma objetiva e profissional.`;
  }

  private buildFinancialContext(): string {
    const lancamentos = getLancamentos();
    const fluxo = getFluxoCaixaMensal();
    const dre = getDREValores();

    const receitas = lancamentos.filter(l => l.tipo === 'receita');
    const despesas = lancamentos.filter(l => l.tipo === 'despesa');
    const totalRec = receitas.reduce((s, l) => s + l.valor, 0);
    const totalDesp = despesas.reduce((s, l) => s + l.valor, 0);

    return `DADOS DO SISTEMA (${new Date().toLocaleDateString('pt-BR')}):
- Receitas: R$ ${totalRec.toLocaleString()} (${receitas.length} lançamentos)
- Despesas: R$ ${totalDesp.toLocaleString()} (${despesas.length} lançamentos)
- Saldo: R$ ${(totalRec - totalDesp).toLocaleString()}
- DRE: Receita Bruta R$ ${dre.receitaBruta.toLocaleString()}, Lucro Líquido R$ ${dre.lucroLiquido.toLocaleString()}
- Fluxo de Caixa: ${fluxo.length} meses registrados`;
  }

  async chat(message: string, agentId?: string): Promise<string> {
    const agent = agents.find(a => a.id === (agentId || this.getContext().agentId)) || agents[0];

    if (agentId) this.getContext().agentId = agentId;

    const cacheKey = `chat:${agent.id}:${message.slice(0, 100)}`;
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    const systemPrompt = this.buildSystemPrompt(agent);
    const financialData = this.buildFinancialContext();

    const fullPrompt = `${systemPrompt}\n\n${financialData}\n\n${message}`;
    const response = await generateText(fullPrompt, {
      temperature: 0.7,
      maxTokens: 1024,
    });

    this.setCache(cacheKey, response);
    this.getContext().previousMessages.push(
      { role: 'user', content: message },
      { role: 'assistant', content: response }
    );

    return response;
  }

  async getInsights(): Promise<{ agent: Agent; insight: string }[]> {
    const results: { agent: Agent; insight: string }[] = [];

    for (const agent of agents) {
      try {
        const context = `${this.buildFinancialContext()}\nÁrea: ${agent.role} - ${agent.specialties.join(', ')}`;
        const insights = await generateBusinessInsights(context);
        results.push({ agent, insight: insights });
      } catch {
        results.push({ agent, insight: `${agent.name}: Analisando dados para gerar recomendações...` });
      }
    }

    return results;
  }

  async getAutomations(area: string): Promise<string[]> {
    return generateAutomationSuggestions(area);
  }

  clearCache(): void {
    localStorage.removeItem(CACHE_KEY);
  }

  clearContext(): void {
    this.context = this.getDefaultContext();
  }
}

export const aiEngine = new AiEngine();

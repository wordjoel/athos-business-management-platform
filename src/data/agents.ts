export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  greeting: string;
  icon: string;
  color: string;
  gradient: string;
  specialties: string[];
}

export const agents: Agent[] = [
  {
    id: 'athena',
    name: 'Athena',
    role: 'Jurídica',
    description: 'Advogada Corporativa especializada em contratos, compliance e documentação legal',
    greeting: 'Olá! Sou Athena, sua consultora jurídica. Posso ajudar com análise de contratos, compliance regulatório, due diligence e documentação legal. Como posso auxiliá-lo hoje?',
    icon: '⚖️',
    color: 'from-violet-500 to-purple-600',
    gradient: 'from-violet-500/20 to-purple-600/20',
    specialties: ['Contratos', 'Compliance', 'Due Diligence', 'Regulatório', 'LGPD'],
  },
  {
    id: 'zeus',
    name: 'Zeus',
    role: 'Estratégico',
    description: 'CEO Virtual — planejamento, estratégia, governança e tomada de decisão',
    greeting: 'Saudações! Zeus aqui, seu estrategista corporativo. Trago insights sobre macrotendências, análise de cenários, planejamento estratégico e otimização de resultados. Vamos traçar o futuro do seu negócio?',
    icon: '⚡',
    color: 'from-amber-500 to-orange-600',
    gradient: 'from-amber-500/20 to-orange-600/20',
    specialties: ['Estratégia', 'Planejamento', 'M&A', 'Riscos', 'Governança', 'Indicadores'],
  },
  {
    id: 'ares',
    name: 'Ares',
    role: 'Comercial',
    description: 'Diretor Comercial — vendas, CRM, prospecção, negociação e expansão de mercado',
    greeting: 'Olá! Sou Ares, seu especialista comercial. Posso ajudar com estratégias de vendas, otimização do funil, prospecção de leads e expansão de mercado. Vamos crescer juntos?',
    icon: '🛡️',
    color: 'from-red-500 to-rose-600',
    gradient: 'from-red-500/20 to-rose-600/20',
    specialties: ['Vendas', 'CRM', 'Prospecção', 'Negociação', 'Funil', 'Expansão', 'Marketing'],
  },
  {
    id: 'artemis',
    name: 'Artemis',
    role: 'Documental',
    description: 'Document Controller — OCR, versionamento, busca inteligente e organização de arquivos',
    greeting: 'Olá! Artemis aqui, sua especialista em gestão documental. Posso organizar seus arquivos, controlar versões, extrair dados via OCR e manter tudo documentado. Como posso ajudar?',
    icon: '🏹',
    color: 'from-emerald-500 to-teal-600',
    gradient: 'from-emerald-500/20 to-teal-600/20',
    specialties: ['Documentos', 'OCR', 'Versionamento', 'Arquivo', 'Busca Inteligente'],
  },
  {
    id: 'hermes',
    name: 'Hermes',
    role: 'Comunicação',
    description: 'Especialista em comunicação — email, WhatsApp, chatbots, campanhas e relações públicas',
    greeting: 'Olá! Sou Hermes, seu especialista em comunicação. Posso ajudar com estratégias de email marketing, automação de WhatsApp, criação de chatbots, campanhas e gestão de relações públicas. Como posso comunicar melhor?',
    icon: '📧',
    color: 'from-sky-500 to-blue-600',
    gradient: 'from-sky-500/20 to-blue-600/20',
    specialties: ['Email', 'WhatsApp', 'Chatbots', 'Campanhas', 'Relações Públicas', 'Automação'],
  },
  {
    id: 'hephaestus',
    name: 'Hephaestus',
    role: 'Engenharia',
    description: 'Engenheiro de Software — código, arquitetura, CI/CD, infraestrutura, Docker e APIs',
    greeting: 'Olá! Hephaestus aqui, seu engenheiro de software. Posso ajudar com arquitetura de sistemas, revisão de código, configuração de CI/CD, Docker, APIs e infraestrutura. Vamos construir algo robusto?',
    icon: '🔧',
    color: 'from-slate-500 to-zinc-600',
    gradient: 'from-slate-500/20 to-zinc-600/20',
    specialties: ['Código', 'Arquitetura', 'CI/CD', 'Infraestrutura', 'Docker', 'APIs'],
  },
  {
    id: 'cronos',
    name: 'Cronos',
    role: 'Gestão de Projetos',
    description: 'Gestor de Projetos — sprints, backlog, roadmap, Kanban, cronograma e milestones',
    greeting: 'Olá! Sou Cronos, seu gestor de projetos. Posso ajudar com planejamento de sprints, gestão de backlog, criação de roadmaps, cronogramas e acompanhamento de milestones. Vamos organizar seus projetos?',
    icon: '⏱️',
    color: 'from-cyan-500 to-sky-600',
    gradient: 'from-cyan-500/20 to-sky-600/20',
    specialties: ['Sprint', 'Backlog', 'Roadmap', 'Kanban', 'Cronograma', 'Milestones'],
  },
];

export function getAgentById(id: string): Agent {
  return agents.find(a => a.id === id) || agents[0];
}

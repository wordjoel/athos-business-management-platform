import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BrainCircuit, MessageSquare, FileText, TrendingUp, Shield, Zap, Sparkles, Bot, Mic, BarChart3, AlertTriangle, Plus, Trash2, X, Save, Send, Calendar, Mail, Phone, Bell, Users, Building2, Gift, Clock, CheckCircle, AlertCircle, Lightbulb, MessageCircle, Wrench, Receipt, User } from 'lucide-react';

interface Insight {
  id: string;
  tipo: 'financeiro' | 'vendas' | 'operacional' | 'rh' | 'melhoria';
  titulo: string;
  descricao: string;
  impacto: 'alto' | 'medio' | 'baixo';
  data: string;
  lido: boolean;
  implementado?: boolean;
}

interface Aniversario {
  id: string;
  nome: string;
  tipo: 'colaborador' | 'empresa' | 'cliente';
  data: string;
  email?: string;
  telefone?: string;
  empresa?: string;
}

interface Compromisso {
  id: string;
  titulo: string;
  tipo: 'pagamento' | 'reuniao' | 'vencimento' | 'entrega' | 'outro';
  data: string;
  hora?: string;
  responsavel: string;
  valor?: number;
  lembretes: number[];
  completado: boolean;
  modificadoPor: string;
}

interface Mensagem {
  id: string;
  destinatario: string;
  email?: string;
  telefone?: string;
  tipo: 'lembrete' | 'aviso' | 'aniversario' | 'cobranca' | 'geral' | 'despesa' | 'recibo';
  titulo: string;
  mensagem: string;
  dataEnvio: string;
  enviada: boolean;
}

interface NotaDespesa {
  id: string;
  colaborador: string;
  telefone: string;
  cpf?: string;
  empresa?: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  comprovante?: string;
  dataRecebimento: string;
}

interface ReciboRecebido {
  id: string;
  emitente: string;
  cnpj: string;
  telefone: string;
  endereco: string;
  servico: string;
  valor: number;
  data: string;
  status: 'pendente' | 'recebido' | 'processado';
  dataRecebimento: string;
}

const ATHOSAI: React.FC = () => {
  const { darkMode, usuarioLogado, dadosEmpresa } = useApp();
  const [aba, setAba] = useState<'insights' | 'agenda' | 'mensagens' | 'sugestoes' | 'automacao' | 'recebimentos'>('insights');

  const [insights, setInsights] = useState<Insight[]>(() => {
    const saved = localStorage.getItem('athos_insights');
    return saved ? JSON.parse(saved) : [
      { id: '1', tipo: 'financeiro', titulo: 'Aumento de 15% em receitas', descricao: 'Meta fiscal atingida com folga. Considere reinvestir parte do lucro.', impacto: 'alto', data: '13/05', lido: true },
      { id: '2', tipo: 'vendas', titulo: '3 novos leads qualificados', descricao: 'Pipeline crescendo. Recomendo follow-up em 48h.', impacto: 'medio', data: '12/05', lido: false },
      { id: '3', tipo: 'operacional', titulo: 'Contrato vencendo em 30 dias', descricao: 'Renegociar contrato Tech Solutions antes do vencimento.', impacto: 'alto', data: '11/05', lido: false },
      { id: '4', tipo: 'melhoria', titulo: 'Automatizar envio de faturas', descricao: 'Sugestão IA: Implementar automate de faturas para reduzir manualidade.', impacto: 'medio', data: '10/05', lido: false },
    ];
  });

  const [aniversarios, setAniversarios] = useState<Aniversario[]>(() => {
    const saved = localStorage.getItem('athos_aniversarios');
    return saved ? JSON.parse(saved) : [
      { id: '1', nome: 'Kleber Duarte', tipo: 'colaborador', data: '15/05', email: 'kleber@athos.com', telefone: '(11) 99999-0001' },
      { id: '2', nome: 'Tech Solutions LTDA', tipo: 'empresa', data: '20/05', email: 'contato@techsolutions.com', telefone: '(11) 99999-0002' },
      { id: '3', nome: 'Maria Santos', tipo: 'colaborador', data: '25/05', email: 'maria@athos.com', telefone: '(11) 99999-0003' },
      { id: '4', nome: 'Clínica Viva Saúde', tipo: 'cliente', data: '28/05', email: 'adm@clinicavivasaude.com', telefone: '(11) 3333-0000' },
    ];
  });

  const [compromissos, setCompromissos] = useState<Compromisso[]>(() => {
    const saved = localStorage.getItem('athos_compromissos');
    return saved ? JSON.parse(saved) : [
      { id: '1', titulo: 'Pagamento Tech Solutions', tipo: 'pagamento', data: '15/05/2026', responsavel: 'Joel Oliveira', valor: 15000, lembretes: [15, 7, 1], completado: false, modificadoPor: 'Joel Oliveira' },
      { id: '2', titulo: 'Reunião de alinhamento', tipo: 'reuniao', data: '18/05/2026', hora: '14:00', responsavel: 'Kleber Duarte', lembretes: [1], completado: false, modificadoPor: 'Kleber Duarte' },
      { id: '3', titulo: 'Vencimento licença software', tipo: 'vencimento', data: '01/06/2026', responsavel: 'Mauricio Baro', valor: 2500, lembretes: [30, 15], completado: false, modificadoPor: 'Mauricio Baro' },
    ];
  });

  const [mensagens, setMensagens] = useState<Mensagem[]>(() => {
    const saved = localStorage.getItem('athos_mensagens_ia');
    return saved ? JSON.parse(saved) : [];
  });

  const [notasDespesa, setNotasDespesa] = useState<NotaDespesa[]>(() => {
    const saved = localStorage.getItem('athos_notas_despesa');
    return saved ? JSON.parse(saved) : [
      { id: '1', colaborador: 'Carlos Silva', telefone: '(11) 99999-1234', cpf: '123.456.789-00', descricao: 'Material de escritório', valor: 250, categoria: 'Escritório', data: '10/05/2026', status: 'pendente', dataRecebimento: '13/05/2026' },
      { id: '2', colaborador: 'Ana Paula', telefone: '(11) 99999-5678', cpf: '987.654.321-00', descricao: 'Transporte - Cliente XPTO', valor: 180, categoria: 'Transporte', data: '08/05/2026', status: 'aprovada', dataRecebimento: '12/05/2026' },
    ];
  });

  const [recibosRecebidos, setRecibosRecebidos] = useState<ReciboRecebido[]>(() => {
    const saved = localStorage.getItem('athos_recibos_recebidos');
    return saved ? JSON.parse(saved) : [
      { id: '1', emitente: 'Restaurante Sabor Caseiro', cnpj: '11.222.333/0001-44', telefone: '(11) 4444-5555', endereco: 'Av. Brigadeiro, 500', servico: 'Alimentação', valor: 450, data: '10/05/2026', status: 'pendente', dataRecebimento: '13/05/2026' },
    ];
  });

  const [showForm, setShowForm] = useState(false);
  const [showFormMsg, setShowFormMsg] = useState(false);
  const [formData, setFormData] = useState({ titulo: '', descricao: '', tipo: 'operacional' as any, impacto: 'medio' });
  const [formMsg, setFormMsg] = useState({ destinatario: '', email: '', telefone: '', tipo: 'lembrete' as any, titulo: '', mensagem: '', idioma: 'pt' });
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const idiomas = [
    { code: 'pt', nome: 'Português', flag: '🇧🇷' },
    { code: 'en', nome: 'English', flag: '🇺🇸' },
    { code: 'es', nome: 'Español', flag: '🇪🇸' },
    { code: 'fr', nome: 'Français', flag: '🇫🇷' },
    { code: 'de', nome: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', nome: 'Italiano', flag: '🇮🇹' },
    { code: 'zh', nome: '中文', flag: '🇨🇳' },
    { code: 'ja', nome: '日本語', flag: '🇯🇵' },
  ];

  const templatesMensagem: Record<string, Record<string, { titulo: string; corpo: string }>> = {
    lembrete: {
      pt: { titulo: '🔔 Lembrete ATHOS', corpo: 'Olá {nome}! Você tem um compromisso pendente: {mensagem}. Não se esqueça!' },
      en: { titulo: '🔔 ATHOS Reminder', corpo: 'Hello {name}! You have a pending appointment: {message}. Don\'t forget!' },
      es: { titulo: '🔔 Recordatorio ATHOS', cuerpo: '¡Hola {nombre}! Tienes una cita pendiente: {mensaje}. ¡No olvides!' },
      fr: { titulo: '🔔 Rappel ATHOS', corpo: 'Bonjour {nom}! Vous avez un rendez-vous en attente: {message}. N\'oubliez pas!' },
      de: { titulo: '🔔 ATHOS Erinnerung', corpo: 'Hallo {name}! Sie haben einen ausstehenden Termin: {message}. Nicht vergessen!' },
      it: { titulo: '🔔 Promemoria ATHOS', corpo: 'Ciao {nome}! Hai un appuntamento in sospeso: {message}. Non dimenticare!' },
      zh: { titulo: '🔔 ATHOS提醒', corpo: '您好{nome}！您有一个待处理的事项：{message}。请不要忘记！' },
      ja: { titulo: '🔔 ATHOSリマインダー', corpo: 'こんにちは{nome}さん！保留中の予定があります：{message}。お忘れなく！' },
    },
    cobranca: {
      pt: { titulo: '💰 Athos - Aviso de Cobrança', corpo: 'Olá {nome}! Este é um aviso de cobrança da ATHOS. Valor: R${valor}. Vencimento: {vencimento}. Pague em dia para evitar juros.' },
      en: { titulo: '💰 ATHOS - Payment Notice', corpo: 'Hello {name}! This is a payment notice from ATHOS. Amount: ${value}. Due: {due}. Pay on time to avoid fees.' },
      es: { titulo: '💰 ATHOS - Aviso de Cobro', corpo: '¡Hola {nombre}! Este es un aviso de cobro de ATHOS. Monto: ${valor}. Vencimiento: {vencimiento}. Pague a tiempo.' },
    },
    aniversario: {
      pt: { titulo: '🎂 ATHOS deseja feliz aniversário!', corpo: 'Olá {nome}! A equipe ATHOS deseja a você um feliz aniversário! Que este novo ano trouque muitas alegrias e sucesso!' },
      en: { titulo: '🎂 Happy Birthday from ATHOS!', corpo: 'Hello {name}! The ATHOS team wishes you a happy birthday! May this new year bring you joy and success!' },
      es: { titulo: '🎂 ¡Feliz cumpleaños de ATHOS!', corpo: '¡Hola {nombre}! El equipo de ATHOS te desea un feliz cumpleaños! ¡Que este nuevo año te trae alegría y éxito!' },
    },
    bemvindo: {
      pt: { titulo: '👋 Bem-vindo à ATHOS!', corpo: 'Olá {nome}! Seja bem-vindo ao sistema ATHOS Business Management. Estamos felizes em ter você conosco!' },
      en: { titulo: '👋 Welcome to ATHOS!', corpo: 'Hello {name}! Welcome to ATHOS Business Management System. We are happy to have you with us!' },
      es: { titulo: '👋 ¡Bienvenido a ATHOS!', corpo: '¡Hola {nombre}! Bienvenido al sistema ATHOS Business Management. ¡Nos alegra tenerte con nosotros!' },
    },
  };

  const usuarioAtual = usuarioLogado?.nome || 'Usuário';

  useEffect(() => { localStorage.setItem('athos_insights', JSON.stringify(insights)); }, [insights]);
  useEffect(() => { localStorage.setItem('athos_aniversarios', JSON.stringify(aniversarios)); }, [aniversarios]);
  useEffect(() => { localStorage.setItem('athos_compromissos', JSON.stringify(compromissos)); }, [compromissos]);
  useEffect(() => { localStorage.setItem('athos_mensagens_ia', JSON.stringify(mensagens)); }, [mensagens]);
  useEffect(() => { localStorage.setItem('athos_notas_despesa', JSON.stringify(notasDespesa)); }, [notasDespesa]);
  useEffect(() => { localStorage.setItem('athos_recibos_recebidos', JSON.stringify(recibosRecebidos)); }, [recibosRecebidos]);

  const gerarSugestoes = () => {
    const sugestoes = [
      '📊 Implementar dashboard de métricas em tempo real para acompanhamento de KPIs',
      '📧 Criar automação de envio de faturas mensais para clientes',
      '🎂 Configurar lembretes automáticos de aniversário de clientes 7 dias antes',
      '💼 Adicionar campo de CNPJ nos contratos para controle fiscal',
      '🔔 Sistema de alerta para contratos vencendo em 30/15/7 dias',
      '📱 Integrar WhatsApp Business para envio de lembretes automáticos',
      '📈 Criar relatório mensal automático de fluxo de caixa',
      '👥 Agenda de birthdays de colaboradores com mensagem automática',
      '📋 Pipeline de projetos com notificação de atrasos',
      '💰 Alertas de contas a pagar vencendo com 5 dias de antecedência',
    ];
    setSuggestions(sugestoes);
  };

  const speakWithEmotion = (text: string, lang: string = 'pt-BR', emotion: 'happy' | 'neutral' | 'excited' = 'neutral') => {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta síntese de voz');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = speechSynthesis.getVoices();
    const langCode = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : lang === 'fr' ? 'fr-FR' : 'de-DE';
    const voice = voices.find(v => v.lang.startsWith(langCode.split('-')[0])) || voices[0];
    
    if (voice) utterance.voice = voice;
    utterance.lang = langCode;
    utterance.rate = emotion === 'excited' ? 1.2 : emotion === 'happy' ? 1.05 : 0.9;
    utterance.pitch = emotion === 'happy' ? 1.1 : emotion === 'excited' ? 1.2 : 1;
    utterance.volume = 1;

    speechSynthesis.speak(utterance);
  };

  const templatesVoz: Record<string, { texto: string; emocao: 'happy' | 'excited' | 'neutral' }> = {
    bomdia: { texto: 'Bom dia, Sr. Joel! Que você tenha um excelente dia de trabalho. Estou aqui para ajudar com qualquer coisa que precisar.', emocao: 'happy' },
    lembrete: { texto: 'Atenção! Você tem um compromisso importante agendado para hoje. Não se esqueça de verificar os detalhes.', emocao: 'excited' },
    cobranca: { texto: 'Aviso importante. Você possui contas pendentes que precisam de atenção. Verifique o painel financeiro para mais detalhes.', emocao: 'neutral' },
    aniversario: { texto: 'Parabéns!Hoje é um dia especial. A equipe ATHOS deseja a você um feliz aniversário cheio de alegrias e sucesso!', emocao: 'happy' },
    bemvindo: { texto: 'Olá! Seja bem-vindo ao sistema ATHOS Business Management. É um prazer ter você conosco. Estou aqui para auxiliar em tudo o que precisar.', emocao: 'happy' },
  };

  const salvarInsight = () => {
    if (!formData.titulo) return;
    const novo: Insight = {
      id: Date.now().toString(),
      ...formData,
      data: new Date().toLocaleDateString('pt-BR'),
      lido: false,
    };
    setInsights([novo, ...insights]);
    setFormData({ titulo: '', descricao: '', tipo: 'operacional', impacto: 'medio' });
    setShowForm(false);
  };

  const excluirInsight = (id: string) => setInsights(insights.filter(i => i.id !== id));
  const marcarLido = (id: string) => setInsights(insights.map(i => i.id === id ? { ...i, lido: true } : i));
  const marcarImplementado = (id: string) => setInsights(insights.map(i => i.id === id ? { ...i, implementado: true } : i));

  const enviarMensagem = () => {
    if (!formMsg.destinatario || !formMsg.mensagem) return;
    const nova: Mensagem = {
      id: Date.now().toString(),
      ...formMsg,
      dataEnvio: new Date().toLocaleString('pt-BR'),
      enviada: true,
    };
    setMensagens([nova, ...mensagens]);
    alert(`✅ Mensagem準備 para ${formMsg.destinatario}\n📧 Email: ${formMsg.email || 'Não informado'}\n📱 WhatsApp: ${formMsg.telefone || 'Não informado'}\n\nMensagem: ${formMsg.mensagem}`);
    setFormMsg({ destinatario: '', email: '', telefone: '', tipo: 'lembrete', titulo: '', mensagem: '' });
    setShowFormMsg(false);
  };

  const toggleCompromisso = (id: string) => {
    setCompromissos(compromissos.map(c => c.id === id ? { ...c, completado: !c.completado } : c));
  };

  const getAniversariosProximos = () => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    return aniversarios.filter(a => {
      const [dia, mes] = a.data.split('/').map(Number);
      return mes === mesAtual;
    });
  };

  const getCompromissosProximos = () => {
    const hoje = new Date();
    const proximos = compromissos.filter(c => {
      if (c.completado) return false;
      const data = new Date(c.data.split('/').reverse().join('-'));
      const dias = Math.ceil((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
      return dias >= 0 && dias <= 15;
    });
    return proximos.sort((a, b) => new Date(a.data.split('/').reverse().join('-')).getTime() - new Date(b.data.split('/').reverse().join('-')).getTime());
  };

  const stats = [
    { title: 'Insights IA', value: insights.length.toString(), icon: BrainCircuit, color: 'amber' },
    { title: 'Novos', value: insights.filter(i => !i.lido).length.toString(), icon: AlertTriangle, color: 'red' },
    { title: 'Alto Impacto', value: insights.filter(i => i.impacto === 'alto').length.toString(), icon: TrendingUp, color: 'emerald' },
    { title: 'Sugestões', value: suggestions.length > 0 ? suggestions.length.toString() : '0', icon: Lightbulb, color: 'violet' },
  ];

  const impactoCores: Record<string, string> = { alto: 'red', medio: 'amber', baixo: 'gray' };
  const tipoCompromissoIcon: Record<string, any> = { pagamento: '💰', reuniao: '📅', vencimento: '⚠️', entrega: '📦', outro: '📌' };

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">ATHOS AI</h1>
          <p className="text-sm text-gray-500">Inteligência Artificial Integrada</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <User size={12} />
          <span>{usuarioAtual}</span>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg overflow-x-auto">
        {(['insights', 'agenda', 'mensagens', 'sugestoes', 'automacao', 'recebimentos'] as const).map(a => (
          <button key={a} onClick={() => { setAba(a); if (a === 'sugestoes') gerarSugestoes(); }} className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${aba === a ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            {a === 'insights' ? '💡 Insights' : a === 'agenda' ? '📅 Agenda' : a === 'mensagens' ? '✉️ Mensagens' : a === 'sugestoes' ? '💡 Sugestões' : a === 'automacao' ? '⚙️ Automação' : '📥 Recebimentos'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <div key={i} className="bg-gray-800/40 p-3 rounded-xl border border-white/5">
            <stat.icon size={16} className={`text-${stat.color}-400 mb-1`} />
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>

      {aba === 'insights' && (
        <>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowForm(true)} className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium flex items-center gap-1">
              <Plus size={14} /> Novo Insight
            </button>
          </div>
          <div className="space-y-2">
            {insights.map(insight => (
              <div key={insight.id} onClick={() => marcarLido(insight.id)} className={`p-3 rounded-xl border border-white/5 cursor-pointer transition-colors ${!insight.lido ? 'bg-amber-500/5 border-amber-500/30' : 'bg-gray-800/40'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${insight.tipo === 'melhoria' ? 'bg-violet-500/20' : 'bg-gray-700'}`}>
                      {insight.tipo === 'melhoria' ? <Lightbulb size={14} className="text-violet-400" /> : <BrainCircuit size={14} className="text-amber-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{insight.titulo}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{insight.descricao}</p>
                      <p className="text-[10px] text-gray-600 mt-1">{insight.data} • {insight.tipo}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium bg-${impactoCores[insight.impacto]}-500/20 text-${impactoCores[insight.impacto]}-400`}>{insight.impacto}</span>
                    {insight.implementado && <span className="text-[10px] text-emerald-400">✅ Implementado</span>}
                    {insight.tipo === 'melhoria' && !insight.implementado && (
                      <button onClick={(e) => { e.stopPropagation(); marcarImplementado(insight.id); }} className="text-[10px] text-violet-400 hover:text-violet-300">Implementar</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {aba === 'agenda' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-violet-600/20 to-cyan-600/20 p-4 rounded-xl border border-violet-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Gift size={18} className="text-violet-400" />
              <h3 className="text-sm font-medium text-white">Aniversários deste mês</h3>
            </div>
            {getAniversariosProximos().length === 0 ? (
              <p className="text-xs text-gray-500">Nenhum aniversário este mês</p>
            ) : (
              <div className="space-y-2">
                {getAniversariosProximos().map(aniv => (
                  <div key={aniv.id} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎂</span>
                      <div>
                        <p className="text-xs font-medium text-white">{aniv.nome}</p>
                        <p className="text-[10px] text-gray-500">{aniv.tipo} • {aniv.data}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {aniv.email && <button onClick={() => { setFormMsg({ destinatario: aniv.nome, email: aniv.email!, telefone: aniv.telefone || '', tipo: 'aniversario', titulo: 'Feliz Aniversário!', mensagem: `Olá ${aniv.nome}, a ATHOS deseja Ihnen um feliz aniversário! Parabéns e sucesso!` }); setShowFormMsg(true); }} className="p-1.5 bg-violet-600/50 rounded text-violet-300 hover:text-white"><Mail size={12} /></button>}
                      {aniv.telefone && <button className="p-1.5 bg-green-600/50 rounded text-green-300 hover:text-white"><Phone size={12} /></button>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800/40 p-4 rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-amber-400" />
              <h3 className="text-sm font-medium text-white">Próximos 15 dias</h3>
            </div>
            {getCompromissosProximos().length === 0 ? (
              <p className="text-xs text-gray-500">Nenhum compromisso próximo</p>
            ) : (
              <div className="space-y-2">
                {getCompromissosProximos().map(comp => (
                  <div key={comp.id} onClick={() => toggleCompromisso(comp.id)} className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${comp.completado ? 'bg-gray-800/30 opacity-50' : 'bg-gray-700/50 hover:bg-gray-700'}`}>
                    <div className="flex items-center gap-2">
                      <span>{tipoCompromissoIcon[comp.tipo]}</span>
                      <div>
                        <p className={`text-xs font-medium ${comp.completado ? 'text-gray-500 line-through' : 'text-white'}`}>{comp.titulo}</p>
                        <p className="text-[10px] text-gray-500">{comp.data} • {comp.responsavel}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {comp.valor && <span className="text-xs text-emerald-400">R$ {comp.valor.toLocaleString()}</span>}
                      <button className={`p-1 rounded ${comp.completado ? 'text-emerald-400' : 'text-gray-500'}`}><CheckCircle size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-gray-800/40 p-4 rounded-xl border border-white/5">
            <h3 className="text-sm font-medium text-white mb-3">Todos os Compromissos</h3>
            <div className="space-y-2">
              {compromissos.map(comp => (
                <div key={comp.id} className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>{tipoCompromissoIcon[comp.tipo]}</span>
                    <div>
                      <p className="text-xs text-white">{comp.titulo}</p>
                      <p className="text-[10px] text-gray-500">{comp.data}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleCompromisso(comp.id)} className={`text-xs px-2 py-1 rounded ${comp.completado ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-600 text-gray-400'}`}>
                    {comp.completado ? 'Concluído' : 'Pendente'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {aba === 'mensagens' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setShowFormMsg(true)} className="px-3 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-medium flex items-center gap-1">
              <Send size={14} /> Nova Mensagem
            </button>
          </div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div onClick={() => { setFormMsg({ destinatario: 'Joel Oliveira', email: 'joel@athos.com', telefone: '+5511953992662', tipo: 'lembrete' as any, titulo: 'Lembrete deテスト', mensagem: 'Olá! Este é um mensaje de teste do sistema ATHOS AI.' }); setShowFormMsg(true); }} className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/30 cursor-pointer hover:bg-blue-500/20">
              <Bell size={20} className="text-blue-400 mb-1" />
              <p className="text-xs font-medium text-white">Lembrete</p>
              <p className="text-[10px] text-gray-500">Lembrar compromissos</p>
            </div>
            <div onClick={() => { setFormMsg({ ...formMsg, tipo: 'cobranca' }); setShowFormMsg(true); }} className="p-3 bg-red-500/10 rounded-xl border border-red-500/30 cursor-pointer hover:bg-red-500/20">
              <AlertCircle size={20} className="text-red-400 mb-1" />
              <p className="text-xs font-medium text-white">Aviso/Cobrança</p>
              <p className="text-[10px] text-gray-500">Enviar avisos</p>
            </div>
            <div onClick={() => { setFormMsg({ ...formMsg, tipo: 'aniversario' }); setShowFormMsg(true); }} className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/30 cursor-pointer hover:bg-violet-500/20">
              <Gift size={20} className="text-violet-400 mb-1" />
              <p className="text-xs font-medium text-white">Aniversário</p>
              <p className="text-[10px] text-gray-500">Parabenizar</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-green-600/20 rounded-xl border border-green-500/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Phone size={20} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">🎙️ Assistente de Voz ATHOS</p>
                <p className="text-xs text-gray-400">Clique para ouvir a mensagem com emoção</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {Object.entries(templatesVoz).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => speakWithEmotion(template.texto, 'pt', template.emocao)}
                  className="p-2 bg-gray-800/50 rounded-lg border border-white/10 hover:bg-gray-700/50 transition-colors flex flex-col items-center gap-1"
                >
                  <span className="text-lg">
                    {key === 'bomdia' ? '☀️' : key === 'lembrete' ? '🔔' : key === 'cobranca' ? '💰' : key === 'aniversario' ? '🎂' : '👋'}
                  </span>
                  <span className="text-[10px] text-gray-300">{key === 'bomdia' ? 'Bom dia' : key === 'lembrete' ? 'Lembrete' : key === 'cobranca' ? 'Cobrança' : key === 'aniversario' ? 'Aniversário' : 'Bem-vindo'}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 p-4 bg-amber-600/20 rounded-xl border border-amber-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
                  <Mail size={20} className="text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">WhatsApp Multilíngue</p>
                  <p className="text-xs text-gray-400">Enviar mensaje para +55 11 95399-2662</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {idiomas.map(idioma => (
                <button 
                  key={idioma.code}
                  onClick={() => {
                    const template = templatesMensagem.bemvindo[idioma.code as keyof typeof templatesMensagem.bemvindo] || templatesMensagem.bemvindo.pt;
                    const testMsg: Mensagem = {
                      id: Date.now().toString(),
                      destinatario: 'Joel Oliveira',
                      telefone: '+5511953992662',
                      tipo: 'geral',
                      titulo: `${idioma.flag} ${template.titulo}`,
                      mensagem: template.corpo.replace('{nome}', 'Joel Oliveira'),
                      dataEnvio: new Date().toLocaleString('pt-BR'),
                      enviada: true
                    };
                    setMensagens([testMsg, ...mensagens]);
                    alert(`${idioma.flag} Mensagem enviada em ${idioma.nome}!\n\n"${template.corpo.replace('{nome}', 'Joel Oliveira')}"`);
                  }}
                  className="px-3 py-1.5 bg-green-600/50 hover:bg-green-600 rounded-lg text-xs text-white font-medium flex items-center gap-1"
                >
                  {idioma.flag}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/40 p-4 rounded-xl border border-white/5">
            <h3 className="text-sm font-medium text-white mb-3">Mensagens Enviadas</h3>
            {mensagens.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">Nenhuma mensagem enviada ainda</p>
            ) : (
              <div className="space-y-2">
                {mensagens.map(msg => (
                  <div key={msg.id} className="p-2 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded ${msg.tipo === 'aniversario' ? 'bg-violet-500/20 text-violet-400' : msg.tipo === 'cobranca' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>{msg.tipo}</span>
                      <span className="text-[10px] text-gray-500">{msg.dataEnvio}</span>
                    </div>
                    <p className="text-xs text-white font-medium">{msg.titulo}</p>
                    <p className="text-[10px] text-gray-400">{msg.destinatario}</p>
                    <p className="text-[10px] text-gray-500 mt-1">{msg.mensagem.substring(0, 60)}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {aba === 'sugestoes' && (
        <div className="space-y-3">
          <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/30">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-400" />
              <p className="text-xs text-amber-400">Sugestões geradas pela IA baseadas no seu negócio</p>
            </div>
          </div>
          <div className="grid gap-2">
            {suggestions.map((sug, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-gray-800/40 rounded-xl border border-white/5">
                <Sparkles size={14} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-300">{sug}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {aba === 'automacao' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 bg-gray-800/40 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Bell size={16} className="text-cyan-400" />
                <h3 className="text-sm font-medium text-white">Lembretes Automáticos</h3>
              </div>
              <div className="space-y-2">
                {[
                  { nome: 'Contratos vencendo', dias: '30, 15, 7', ativo: true },
                  { nome: 'Pagamentos pendentes', dias: '5, 2, 1', ativo: true },
                  { nome: 'Aniversários', dias: '7 dias antes', ativo: true },
                  { nome: 'Reuniões', dias: '1 dia antes', ativo: true },
                ].map((auto, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="text-xs text-white">{auto.nome}</p>
                      <p className="text-[10px] text-gray-500">A cada {auto.dias}</p>
                    </div>
                    <span className="text-xs text-emerald-400">✅ Ativo</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-gray-800/40 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} className="text-violet-400" />
                <h3 className="text-sm font-medium text-white">Envio Automático</h3>
              </div>
              <div className="space-y-2">
                {[
                  { nome: 'Faturas mensais', canal: 'Email', ativo: true },
                  { nome: 'Relatório financeiro', canal: 'Email', ativo: true },
                  { nome: 'Lembretes de pagamento', canal: 'WhatsApp', ativo: true },
                  { nome: 'Boas-vindas novos clientes', canal: 'Email', ativo: false },
                ].map((auto, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="text-xs text-white">{auto.nome}</p>
                      <p className="text-[10px] text-gray-500">{auto.canal}</p>
                    </div>
                    <span className={`text-xs ${auto.ativo ? 'text-emerald-400' : 'text-gray-500'}`}>{auto.ativo ? '✅ Ativo' : '❌ Inativo'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-cyan-600/20 to-violet-600/20 rounded-xl border border-cyan-500/30">
            <div className="flex items-center gap-2">
              <Wrench size={18} className="text-cyan-400" />
              <h3 className="text-sm font-medium text-white">Configurar Nova Automação</h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">Crie regras personalizadas para envio de mensagens e lembretes</p>
            <button className="mt-3 px-4 py-2 bg-cyan-600 rounded-lg text-xs text-white hover:bg-cyan-500">Criar Automação</button>
          </div>
        </div>
      )}

      {aba === 'recebimentos' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-600/20 to-cyan-600/20 p-4 rounded-xl border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Phone size={18} className="text-green-400" />
              <h3 className="text-sm font-medium text-white">Portal do Colaborador</h3>
            </div>
            <p className="text-xs text-gray-400">Receba notas de despesas e recibos via WhatsApp/Email dos colaboradores</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/30">
              <p className="text-lg font-bold text-orange-400">{notasDespesa.filter(n => n.status === 'pendente').length}</p>
              <p className="text-xs text-gray-500">Despesas Pendentes</p>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
              <p className="text-lg font-bold text-emerald-400">{notasDespesa.filter(n => n.status === 'aprovada').length}</p>
              <p className="text-xs text-gray-500">Aprovadas</p>
            </div>
            <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/30">
              <p className="text-lg font-bold text-violet-400">{recibosRecebidos.length}</p>
              <p className="text-xs text-gray-500">Recibos Recebidos</p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Notas de Despesa Recebidas</h3>
            {notasDespesa.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">Nenhuma nota de despesa recebida</p>
            ) : (
              notasDespesa.map(nota => (
                <div key={nota.id} className="p-3 bg-gray-800/40 rounded-xl border border-white/5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{nota.colaborador}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${nota.status === 'pendente' ? 'bg-orange-500/20 text-orange-400' : nota.status === 'aprovada' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{nota.status}</span>
                      </div>
                      <p className="text-xs text-gray-400">{nota.descricao}</p>
                      <div className="flex gap-2 mt-1 text-[10px] text-gray-500">
                        <span>📱 {nota.telefone}</span>
                        <span>📋 {nota.categoria}</span>
                        <span>📅 {nota.data}</span>
                      </div>
                      {nota.cpf && <p className="text-[10px] text-gray-600 mt-1">CPF: {nota.cpf}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-400">R$ {nota.valor.toLocaleString()}</p>
                      {nota.status === 'pendente' && (
                        <div className="flex gap-1 mt-2">
                          <button onClick={() => setNotasDespesa(notasDespesa.map(n => n.id === nota.id ? { ...n, status: 'aprovada' as const } : n))} className="px-2 py-1 bg-emerald-600/50 rounded text-[10px] text-emerald-400 hover:text-white">Aprovar</button>
                          <button onClick={() => setNotasDespesa(notasDespesa.map(n => n.id === nota.id ? { ...n, status: 'rejeitada' as const } : n))} className="px-2 py-1 bg-red-600/50 rounded text-[10px] text-red-400 hover:text-white">Rejeitar</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Recibos Recebidos</h3>
            {recibosRecebidos.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">Nenhum recibo recebido</p>
            ) : (
              recibosRecebidos.map(recibo => (
                <div key={recibo.id} className="p-3 bg-gray-800/40 rounded-xl border border-white/5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 size={14} className="text-violet-400" />
                        <span className="text-sm font-medium text-white">{recibo.emitente}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${recibo.status === 'pendente' ? 'bg-orange-500/20 text-orange-400' : recibo.status === 'recebido' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{recibo.status}</span>
                      </div>
                      <p className="text-xs text-gray-400">{recibo.servico}</p>
                      <div className="flex gap-2 mt-1 text-[10px] text-gray-500">
                        <span>CNPJ: {recibo.cnpj}</span>
                        <span>📱 {recibo.telefone}</span>
                        <span>📅 {recibo.data}</span>
                      </div>
                      <p className="text-[10px] text-gray-600 mt-1">📍 {recibo.endereco}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-violet-400">R$ {recibo.valor.toLocaleString()}</p>
                      {recibo.status === 'pendente' && (
                        <button onClick={() => setRecibosRecebidos(recibosRecebidos.map(r => r.id === recibo.id ? { ...r, status: 'recebido' as const } : r))} className="mt-2 px-2 py-1 bg-violet-600/50 rounded text-[10px] text-violet-400 hover:text-white">Marcar Recebido</button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-gray-800/40 rounded-xl border border-white/5">
            <h3 className="text-sm font-medium text-white mb-3">Simular Recebimento via WhatsApp</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button onClick={() => {
                const novaNota: NotaDespesa = {
                  id: Date.now().toString(),
                  colaborador: 'Novo Colaborador',
                  telefone: '(11) 99999-9999',
                  cpf: '000.000.000-00',
                  descricao: 'Despesa teste via WhatsApp',
                  valor: Math.floor(Math.random() * 500) + 50,
                  categoria: 'Transporte',
                  data: new Date().toLocaleDateString('pt-BR'),
                  status: 'pendente',
                  dataRecebimento: new Date().toLocaleDateString('pt-BR')
                };
                setNotasDespesa([novaNota, ...notasDespesa]);
              }} className="p-3 bg-green-600/20 rounded-lg border border-green-600/30 hover:bg-green-600/30">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-green-400" />
                  <span className="text-xs text-white">Receber Nota de Despesa</span>
                </div>
              </button>
              <button onClick={() => {
                const novoRecibo: ReciboRecebido = {
                  id: Date.now().toString(),
                  emitente: 'Nova Empresa LTDA',
                  cnpj: '00.000.000/0001-00',
                  telefone: '(11) 0000-0000',
                  endereco: 'Rua Nova, 100',
                  servico: 'Serviço Prestado',
                  valor: Math.floor(Math.random() * 1000) + 100,
                  data: new Date().toLocaleDateString('pt-BR'),
                  status: 'pendente',
                  dataRecebimento: new Date().toLocaleDateString('pt-BR')
                };
                setRecibosRecebidos([novoRecibo, ...recibosRecebidos]);
              }} className="p-3 bg-violet-600/20 rounded-lg border border-violet-600/30 hover:bg-violet-600/30">
                <div className="flex items-center gap-2">
                  <Receipt size={16} className="text-violet-400" />
                  <span className="text-xs text-white">Receber Recibo</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto py-8">
          <div className="bg-gray-800 p-5 rounded-xl w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Novo Insight</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} placeholder="Título do insight" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <textarea value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} placeholder="Descrição" rows={3} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm">
                  <option value="financeiro">Financeiro</option>
                  <option value="vendas">Vendas</option>
                  <option value="operacional">Operacional</option>
                  <option value="rh">RH</option>
                  <option value="melhoria">Melhoria</option>
                </select>
                <select value={formData.impacto} onChange={e => setFormData({ ...formData, impacto: e.target.value })} className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm">
                  <option value="alto">Alto Impacto</option>
                  <option value="medio">Médio Impacto</option>
                  <option value="baixo">Baixo Impacto</option>
                </select>
              </div>
              <button onClick={salvarInsight} className="w-full py-2 bg-amber-600 rounded-lg text-white text-sm hover:bg-amber-500">Salvar Insight</button>
            </div>
          </div>
        </div>
      )}

      {showFormMsg && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto py-8">
          <div className="bg-gray-800 p-5 rounded-xl w-full max-w-md border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Enviar Mensagem</h2>
              <button onClick={() => setShowFormMsg(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={formMsg.destinatario} onChange={e => setFormMsg({ ...formMsg, destinatario: e.target.value })} placeholder="Nome do destinatário" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <input type="email" value={formMsg.email} onChange={e => setFormMsg({ ...formMsg, email: e.target.value })} placeholder="Email (opcional)" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <input type="tel" value={formMsg.telefone} onChange={e => setFormMsg({ ...formMsg, telefone: e.target.value })} placeholder="WhatsApp (opcional)" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <select value={formMsg.tipo} onChange={e => setFormMsg({ ...formMsg, tipo: e.target.value })} className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm">
                  <option value="lembrete">Lembrete</option>
                  <option value="aviso">Aviso</option>
                  <option value="cobranca">Cobrança</option>
                  <option value="aniversario">Aniversário</option>
                  <option value="geral">Geral</option>
                </select>
                <select value={formMsg.idioma} onChange={e => setFormMsg({ ...formMsg, idioma: e.target.value })} className="px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm">
                  {idiomas.map(idioma => (
                    <option key={idioma.code} value={idioma.code}>{idioma.flag} {idioma.nome}</option>
                  ))}
                </select>
              </div>
              <input type="text" value={formMsg.titulo} onChange={e => setFormMsg({ ...formMsg, titulo: e.target.value })} placeholder="Assunto/Título" className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <textarea value={formMsg.mensagem} onChange={e => setFormMsg({ ...formMsg, mensagem: e.target.value })} placeholder="Mensagem..." rows={4} className="w-full px-3 py-2 bg-gray-700/50 rounded-lg border border-white/10 text-white text-sm" />
              <button onClick={enviarMensagem} className="w-full py-2 bg-violet-600 rounded-lg text-white text-sm hover:bg-violet-500 flex items-center justify-center gap-2">
                <Send size={14} /> Enviar Mensagem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATHOSAI;
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  FileText, Send, Bot, Image, CheckCircle, AlertCircle, Loader2,
  Sparkles, Wand2, BookOpen, PenTool, Eye, Copy, Download, RefreshCw,
  User, Building2, Calendar, DollarSign, ChevronDown, X
} from 'lucide-react';

interface Contrato {
  id: string;
  titulo: string;
  tipo: string;
  partes: { nome: string; tipo: 'cliente' | 'fornecedor' | 'parceiro' }[];
  valor: number;
  vigencia: { inicio: string; fim: string };
  descricao: string;
  clausulas: string[];
  status: 'rascunho' | 'revisao' | 'aprovado' | 'assinatura' | 'concluido';
  capa?: string;
  createdAt: string;
}

interface AIAgent {
  nome: string;
  funcao: string;
  icon: React.ReactNode;
  color: string;
  status: 'idle' | 'working' | 'completed' | 'error';
  mensagem?: string;
}

const modelosContratos = [
  { id: 'servicos', label: 'Prestação de Serviços', descricao: 'Contrato para prestação de serviços gerais' },
  { id: 'consultoria', label: 'Consultoria', descricao: 'Contrato de consultoria técnica ou empresarial' },
  { id: 'parceria', label: 'Parceria Comercial', descricao: 'Acordo de parceria comercial' },
  { id: 'locacao', label: 'Locação', descricao: 'Contrato de locação de imóveis ou equipamentos' },
  { id: 'fornecimento', label: 'Fornecimento', descricao: 'Contrato de fornecimento de produtos' },
  { id: 'licenca', label: 'Licença de Software', descricao: 'Contrato de licenciamento de software' },
];

const ContratosPage: React.FC = () => {
  const { darkMode } = useApp();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [contratoAtual, setContratoAtual] = useState<Partial<Contrato> | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [step, setStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  
  const [formData, setFormData] = useState({
    tipo: '',
    titulo: '',
    parte1: '',
    parte1Tipo: 'cliente' as 'cliente' | 'fornecedor' | 'parceiro',
    parte2: '',
    parte2Tipo: 'fornecedor' as 'cliente' | 'fornecedor' | 'parceiro',
    valor: '',
    vigenciaInicio: '',
    vigenciaFim: '',
    descricao: '',
    clausulasAdicionais: '',
  });

  const [squadIA, setSquadIA] = useState<AIAgent[]>([
    { nome: 'Athena', funcao: 'Redatora', icon: <PenTool size={16} />, color: 'text-purple-400', status: 'idle' },
    { nome: 'Zeus', funcao: 'Jurista', icon: <BookOpen size={16} />, color: 'text-amber-400', status: 'idle' },
    { nome: 'Artemis', funcao: 'Revisora', icon: <Eye size={16} />, color: 'text-emerald-400', status: 'idle' },
    { nome: 'Ares', funcao: 'Designer', icon: <Wand2 size={16} />, color: 'text-red-400', status: 'idle' },
  ]);

  const [logs, setLogs] = useState<string[]>([]);
  const [contratoGerado, setContratoGerado] = useState<string>('');
  const [capaGerada, setCapaGerada] = useState<string>('');

  const simulateIA = async (agentIndex: number, mensagem: string, delay: number) => {
    setSquadIA(prev => prev.map((a, i) => i === agentIndex ? { ...a, status: 'working', mensagem } : a));
    await new Promise(resolve => setTimeout(resolve, delay));
    setSquadIA(prev => prev.map((a, i) => i === agentIndex ? { ...a, status: 'completed' } : a));
    setLogs(prev => [...prev, `[${squadIA[agentIndex].nome}] ${mensagem}`]);
  };

  const generateContract = async () => {
    setLogs([]);
    setContratoGerado('');
    setCapaGerada('');
    
    setSquadIA(prev => prev.map(a => ({ ...a, status: 'idle', mensagem: undefined })));
    
    await simulateIA(0, 'Analisando requisitos e estrutura do contrato...', 1500);
    
    const template = modelosContratos.find(m => m.id === formData.tipo);
    
    await simulateIA(0, `Elaborando contrato do tipo: ${template?.label || 'Personalizado'}`, 2000);
    
    const contratoTexto = `
CONTRATO DE ${template?.label?.toUpperCase() || 'PRESTAÇÃO DE SERVIÇOS'}

CONTRATANTE: ${formData.parte1}
${formData.parte1Tipo === 'cliente' ? '(CLIENTE)' : formData.parte1Tipo === 'fornecedor' ? '(FORNECEDOR)' : '(PARCEIRO)'}

CONTRATADO: ${formData.parte2}
${formData.parte2Tipo === 'cliente' ? '(CLIENTE)' : formData.parte2Tipo === 'fornecedor' ? '(FORNECEDOR)' : '(PARCEIRO)'}

OBJETO: ${formData.descricao || 'Prestação de serviços conforme especificado nas cláusulas abaixo.'}

VALOR TOTAL: R$ ${formData.valor}

VIGÊNCIA: ${formData.vigenciaInicio} até ${formData.vigenciaFim}

CLÁUSULAS:

1. DO OBJETO
O presente contrato tem como objeto a prestação de serviços conforme descrito no caput, devendo ser executada em conformidade com as melhores práticas do mercado.

2. DAS OBRIGAÇÕES DAS PARTES
2.1. O CONTRATANTE obriga-se a fornecer todas as informações necessárias para a execução do objeto.
2.2. O CONTRATADO obriga-se a executar o serviço com excelência, dentro dos prazos estabelecidos.

3. DO PAGAMENTO
O pagamento será realizado conforme negociação entre as partes, sendo o valor total de R$ ${formData.valor}.

4. DA VIGÊNCIA
Este contrato terá vigência de ${formData.vigenciaInicio} até ${formData.vigenciaFim}.

5. DAS CLÁUSULAS ADICIONAIS
${formData.clausulasAdicionais || 'Não há cláusulas adicionais beyond as previstas neste instrumento.'}

6. DA RESCISÃO
Este contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 30 dias.

7. DO FORO
Fica elegendo o foro da comarca de São Paulo/SP para dirimir quaisquer questões decorrentes deste contrato.

${formData.parte1}, ${new Date().toLocaleDateString('pt-BR')}

___________________________
${formData.parte1}
CONTRATANTE

___________________________
${formData.parte2}
CONTRATADO
`;
    
    setContratoGerado(contratoTexto);
    
    await simulateIA(1, 'Verificando conformidade legal e aspectos jurídicos...', 1500);
    await simulateIA(1, 'Validando cláusulas e termos contratuais...', 1000);
    
    await simulateIA(2, 'Revisando ortografia e formatação...', 1200);
    await simulateIA(2, 'Verificando consistência dos dados...', 800);
    
    await simulateIA(3, 'Gerando capa ilustrativa para o contrato...', 2000);
    
    const cores = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    const corAleatoria = cores[Math.floor(Math.random() * cores.length)];
    setCapaGerada(corAleatoria);
    
    await simulateIA(3, 'Capa criada com sucesso!', 500);
    
    const novoContrato: Contrato = {
      id: Date.now().toString(),
      titulo: formData.titulo,
      tipo: formData.tipo,
      partes: [
        { nome: formData.parte1, tipo: formData.parte1Tipo },
        { nome: formData.parte2, tipo: formData.parte2Tipo },
      ],
      valor: parseFloat(formData.valor) || 0,
      vigencia: { inicio: formData.vigenciaInicio, fim: formData.vigenciaFim },
      descricao: formData.descricao,
      clausulas: formData.clausulasAdicionais.split('\n').filter(c => c.trim()),
      status: 'rascunho',
      capa: corAleatoria,
      createdAt: new Date().toISOString(),
    };
    
    setContratos(prev => [novoContrato, ...prev]);
    setContratoAtual(novoContrato);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      rascunho: 'bg-gray-500/20 text-gray-400',
      revisao: 'bg-amber-500/20 text-amber-400',
      aprovado: 'bg-emerald-500/20 text-emerald-400',
      assinatura: 'bg-blue-500/20 text-blue-400',
      concluido: 'bg-purple-500/20 text-purple-400',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getAgentStatusIcon = (status: string) => {
    switch (status) {
      case 'working': return <Loader2 size={14} className="animate-spin" />;
      case 'completed': return <CheckCircle size={14} />;
      case 'error': return <AlertCircle size={14} />;
      default: return <Bot size={14} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <span className="text-athos-400">Contratos</span> com IA
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Squad de IAs trabalhando juntos para elaborar seus contratos
          </p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-athos-500 hover:bg-athos-600 text-white rounded-xl font-medium transition-colors"
        >
          <Sparkles size={18} />
          Novo Contrato com IA
        </button>
      </div>

      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl ${
            darkMode ? 'bg-gray-900' : 'bg-white'
          } shadow-2xl`}>
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-athos-500/20 flex items-center justify-center">
                  <Bot className="text-athos-400" size={20} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Criar Contrato com Squad de IA
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Passo {step} de 3
                  </p>
                </div>
              </div>
              <button
                onClick={() => { setShowWizard(false); setStep(1); }}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Tipo de Contrato
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {modelosContratos.map(modelo => (
                        <button
                          key={modelo.id}
                          onClick={() => setFormData({ ...formData, tipo: modelo.id })}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            formData.tipo === modelo.id
                              ? 'border-athos-500 bg-athos-500/10'
                              : darkMode ? 'border-white/10 hover:border-white/20' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{modelo.label}</p>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{modelo.descricao}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Título do Contrato
                    </label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                      placeholder="Ex: Contrato de Prestação de Serviços - Projeto X"
                      className={`w-full px-4 py-3 rounded-xl border ${
                        darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                      } focus:border-athos-500 focus:ring-2 focus:ring-athos-500/20 outline-none transition-all`}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Parte 1</h3>
                      <input
                        type="text"
                        value={formData.parte1}
                        onChange={e => setFormData({ ...formData, parte1: e.target.value })}
                        placeholder="Nome da parte 1"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                        } focus:border-athos-500 focus:ring-2 focus:ring-athos-500/20 outline-none`}
                      />
                      <select
                        value={formData.parte1Tipo}
                        onChange={e => setFormData({ ...formData, parte1Tipo: e.target.value as any })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                        } focus:border-athos-500 outline-none`}
                      >
                        <option value="cliente">Cliente</option>
                        <option value="fornecedor">Fornecedor</option>
                        <option value="parceiro">Parceiro</option>
                      </select>
                    </div>
                    <div className="space-y-4">
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Parte 2</h3>
                      <input
                        type="text"
                        value={formData.parte2}
                        onChange={e => setFormData({ ...formData, parte2: e.target.value })}
                        placeholder="Nome da parte 2"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                        } focus:border-athos-500 focus:ring-2 focus:ring-athos-500/20 outline-none`}
                      />
                      <select
                        value={formData.parte2Tipo}
                        onChange={e => setFormData({ ...formData, parte2Tipo: e.target.value as any })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                        } focus:border-athos-500 outline-none`}
                      >
                        <option value="cliente">Cliente</option>
                        <option value="fornecedor">Fornecedor</option>
                        <option value="parceiro">Parceiro</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Valor (R$)
                      </label>
                      <input
                        type="number"
                        value={formData.valor}
                        onChange={e => setFormData({ ...formData, valor: e.target.value })}
                        placeholder="0,00"
                        className={`w-full px-4 py-3 rounded-xl border ${
                          darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                        } focus:border-athos-500 outline-none`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Início da Vigência
                      </label>
                      <input
                        type="date"
                        value={formData.vigenciaInicio}
                        onChange={e => setFormData({ ...formData, vigenciaInicio: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                        } focus:border-athos-500 outline-none`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Fim da Vigência
                      </label>
                      <input
                        type="date"
                        value={formData.vigenciaFim}
                        onChange={e => setFormData({ ...formData, vigenciaFim: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border ${
                          darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                        } focus:border-athos-500 outline-none`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Descrição do Objeto
                    </label>
                    <textarea
                      value={formData.descricao}
                      onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                      placeholder="Descreva o objeto do contrato..."
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                      } focus:border-athos-500 outline-none resize-none`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Cláusulas Adicionais (opcional)
                    </label>
                    <textarea
                      value={formData.clausulasAdicionais}
                      onChange={e => setFormData({ ...formData, clausulasAdicionais: e.target.value })}
                      placeholder="Adicione cláusulas específicas..."
                      rows={3}
                      className={`w-full px-4 py-3 rounded-xl border ${
                        darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
                      } focus:border-athos-500 outline-none resize-none`}
                    />
                  </div>

                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <h3 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      🤖 Squad de IA que trabalhará no seu contrato:
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {squadIA.map((agent, idx) => (
                        <div key={idx} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
                          <div className="flex items-center gap-2">
                            <span className={agent.color}>{agent.icon}</span>
                            <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{agent.nome}</span>
                          </div>
                          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{agent.funcao}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {logs.length > 0 && (
                    <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} space-y-2 max-h-40 overflow-y-auto`}>
                      {logs.map((log, idx) => (
                        <p key={idx} className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{log}</p>
                      ))}
                    </div>
                  )}

                  {contratoGerado && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        {capaGerada && (
                          <div 
                            className="w-20 h-28 rounded-lg flex items-center justify-center shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${capaGerada}, ${capaGerada}88)` }}
                          >
                            <FileText className="text-white/80" size={32} />
                          </div>
                        )}
                        <div>
                          <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Contrato Gerado com Sucesso!
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Revisado e validado pelo Squad de IA
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowPreview(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-athos-500 text-white rounded-lg"
                      >
                        <Eye size={16} />
                        Visualizar Contrato
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="sticky bottom-0 flex items-center justify-between p-6 border-t border-white/10 bg-inherit">
              <button
                onClick={() => step > 1 && setStep(step - 1)}
                disabled={step === 1}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} disabled:opacity-50`}
              >
                Voltar
              </button>
              
              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !formData.tipo}
                  className="px-6 py-2.5 bg-athos-500 hover:bg-athos-600 text-white rounded-lg font-medium disabled:opacity-50"
                >
                  Continuar
                </button>
              ) : (
                <button
                  onClick={generateContract}
                  disabled={squadIA.some(a => a.status === 'working')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-athos-500 to-purple-500 hover:from-athos-600 hover:to-purple-600 text-white rounded-lg font-medium"
                >
                  {squadIA.some(a => a.status === 'working') ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Gerar Contrato
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showPreview && contratoGerado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl ${
            darkMode ? 'bg-gray-900' : 'bg-white'
          } shadow-2xl`}>
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-white/10">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Visualização do Contrato
              </h2>
              <button
                onClick={() => setShowPreview(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                <X size={20} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            </div>
            <div className="p-6">
              <pre className={`whitespace-pre-wrap font-mono text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {contratoGerado}
              </pre>
            </div>
            <div className="sticky bottom-0 flex items-center justify-center gap-4 p-6 border-t border-white/10">
              <button className="flex items-center gap-2 px-4 py-2 bg-athos-500 text-white rounded-lg">
                <Download size={16} />
                Baixar PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg">
                <Copy size={16} />
                Copiar Texto
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {squadIA.map((agent, idx) => (
          <div key={idx} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                agent.status === 'working' ? 'bg-athos-500/20 animate-pulse' :
                agent.status === 'completed' ? 'bg-emerald-500/20' :
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <span className={agent.color}>{agent.icon}</span>
              </div>
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{agent.nome}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{agent.funcao}</p>
              </div>
              <div className={`ml-auto ${agent.status === 'completed' ? 'text-emerald-400' : agent.status === 'working' ? 'text-athos-400' : 'text-gray-400'}`}>
                {getAgentStatusIcon(agent.status)}
              </div>
            </div>
            {agent.mensagem && (
              <p className={`text-xs mt-3 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {agent.mensagem}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="p-6 border-b border-white/10">
          <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Contratos Criados
          </h2>
        </div>
        <div className="divide-y divide-white/5">
          {contratos.length === 0 ? (
            <div className="p-12 text-center">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                <FileText className={darkMode ? 'text-gray-500' : 'text-gray-400'} size={32} />
              </div>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Nenhum contrato criado ainda
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Clique em "Novo Contrato com IA" para começar
              </p>
            </div>
          ) : (
            contratos.map(contrato => (
              <div key={contrato.id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${contrato.capa || '#6366f1'}, ${contrato.capa || '#6366f1'}88)` }}
                  >
                    <FileText className="text-white/80" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {contrato.titulo}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {contrato.partes.map(p => p.nome).join(' + ')}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        R$ {contrato.valor.toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contrato.status)}`}>
                    {contrato.status.charAt(0).toUpperCase() + contrato.status.slice(1)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContratosPage;
import React, { useState } from 'react';
import { X, Send, Camera, FileText, Image, CheckCircle, Loader2, Phone, MessageCircle } from 'lucide-react';

interface Mensagem {
  id: string;
  tipo: 'usuario' | 'sextafeira';
  texto: string;
  timestamp: string;
  anexo?: { tipo: string; nome: string; url: string };
}

interface SextaFeiraProps {
  darkMode: boolean;
  onClose: () => void;
  despesas: DespesaComprovante[];
  onAddComprovante: (despesaId: string, arquivo: File) => void;
}

interface DespesaComprovante {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
  comprovantes: { nome: string; url: string; tipo: string }[];
}

const SextaFeira: React.FC<SextaFeiraProps> = ({ darkMode, onClose, despesas, onAddComprovante }) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      id: '1',
      tipo: 'sextafeira',
      texto: 'Olá! Sou a Sexta-feira, sua assistente de controle de despesas. Posso ajudar você a registrar custos, enviar comprovantes e manter tudo organizado. O que precisa hoje?',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [enviando, setEnviando] = useState(false);

  const categorias = [
    { id: 'alimentacao', label: 'Alimentação', emoji: '🍔' },
    { id: 'transporte', label: 'Transporte', emoji: '🚗' },
    { id: 'material', label: 'Material', emoji: '📦' },
    { id: 'servico', label: 'Serviço', emoji: '🔧' },
    { id: 'energia', label: 'Energia', emoji: '⚡' },
    { id: 'agua', label: 'Água', emoji: '💧' },
    { id: 'internet', label: 'Internet', emoji: '📶' },
    { id: 'outros', label: 'Outros', emoji: '📝' },
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      tipo: 'usuario',
      texto: input,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMensagens(prev => [...prev, novaMensagem]);
    setInput('');
    setEnviando(true);

    setTimeout(() => {
      const palavras = input.toLowerCase();
      let resposta = '';

      if (palavras.includes('despesa') || palavras.includes('gasto') || palavras.includes('custo')) {
        resposta = 'Para adicionar uma nova despesa, vá até a aba "Despesas" e clique em "+ Nova Despesa". Você pode incluir o valor, categoria e data. Após criar, pode attached os comprovantes aqui mesmo!';
      } else if (palavras.includes('comprovante') || palavras.includes('nota') || palavras.includes('foto')) {
        resposta = 'Para enviar comprovantes, você pode:\n1️⃣ Anexar arquivos aqui\n2️⃣ Tirar foto na hora\nOs documentos ficarão salvos junto com a despesa correspondente.';
      } else if (palavras.includes('total') || palavras.includes('quanto')) {
        const total = despesas.reduce((acc, d) => acc + d.valor, 0);
        resposta = `Seu total de despesas até agora é R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}. Tem ${despesas.length} despesas registradas. 📊`;
      } else if (palavras.includes('categoria')) {
        resposta = `Категоrias disponíveis: ${categorias.map(c => `${c.emoji} ${c.label}`).join(', ')}. Escolha uma ao criar a despesa!`;
      } else if (palavras.includes('oi') || palavras.includes('olá') || palavras.includes('oi!' )) {
        resposta = 'Olá! 👋 Sou a Sexta-feira! Posso te ajudar a gerenciar despesas, enviar comprovantes e ficar por dentro dos seus custos. O que precisa?';
      } else {
        resposta = 'Entendi! Posso te ajudar com:\n\n💰 Registrar despesas\n📷 Enviar comprovantes e notas\n📊 Ver totals e relatórios\n🏷️ Organizar por categoria\n\nO que gostaria de fazer?';
      }

      const respostaMsg: Mensagem = {
        id: (Date.now() + 1).toString(),
        tipo: 'sextafeira',
        texto: resposta,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMensagens(prev => [...prev, respostaMsg]);
      setEnviando(false);
    }, 1000);
  };

  const enviarComprovante = (despesaId: string, arquivos: FileList) => {
    Array.from(arquivos).forEach(arquivo => {
      const url = URL.createObjectURL(arquivo);
      onAddComprovante(despesaId, arquivo);

      const msgComprovante: Mensagem = {
        id: Date.now().toString(),
        tipo: 'usuario',
        texto: `📎 Enviado: ${arquivo.name}`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        anexo: { tipo: arquivo.type, nome: arquivo.name, url },
      };
      setMensagens(prev => [...prev, msgComprovante]);

      setTimeout(() => {
        setMensagens(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          tipo: 'sextafeira',
          texto: `✅ Comprovante "${arquivo.name}" adicionado com sucesso! O documento foi vinculado à despesa e será armazenado.`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }]);
      }, 500);
    });
  };

  return (
    <div className={`w-96 h-full flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-white'} border-l border-white/10`}>
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <MessageCircle className="text-white" size={20} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900" />
          </div>
          <div>
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Sexta-feira</h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Assistente de Despesas - WhatsApp</p>
          </div>
        </div>
        <button onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
          <X size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagens.map(msg => (
          <div key={msg.id} className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.tipo === 'usuario' ? 'order-2' : 'order-1'}`}>
              <div className={`p-3 rounded-2xl ${
                msg.tipo === 'usuario'
                  ? 'bg-green-500 text-white rounded-br-md'
                  : darkMode ? 'bg-gray-800 text-gray-100 rounded-bl-md' : 'bg-gray-100 text-gray-900 rounded-bl-md'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.texto}</p>
                {msg.anexo && (
                  <div className={`mt-2 p-2 rounded-lg ${msg.tipo === 'usuario' ? 'bg-green-400/30' : 'bg-gray-700/50'} flex items-center gap-2`}>
                    {msg.anexo.tipo.startsWith('image/') ? <Image size={14} /> : <FileText size={14} />}
                    <span className="text-xs">{msg.anexo.nome}</span>
                  </div>
                )}
              </div>
              <p className={`text-[10px] mt-1 ${msg.tipo === 'usuario' ? 'text-right text-green-400' : 'text-gray-500'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
        {enviando && (
          <div className="flex justify-start">
            <div className={`p-3 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-bl-md`}>
              <Loader2 size={16} className="animate-spin text-gray-400" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10 space-y-3">
        {despesas.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {despesas.slice(0, 3).map(d => (
              <button
                key={d.id}
                onClick={() => setInput(`Anexar comprovante na despesa: ${d.descricao}`)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                📎 {d.descricao.substring(0, 15)}...
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2">
          <label className={`p-2 rounded-lg cursor-pointer ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
            <input type="file" multiple accept="image/*,.pdf" className="hidden" onChange={(e) => e.target.files && setInput(`📎 Anexar ${e.target.files.length} arquivo(s)`)} />
            <Camera size={18} className="text-gray-400" />
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Digite uma mensagem..."
            className={`flex-1 px-4 py-2 rounded-full border ${
              darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'
            } text-sm focus:outline-none focus:border-green-500`}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="p-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SextaFeira;
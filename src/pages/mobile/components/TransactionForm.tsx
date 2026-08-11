import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  DollarSign, 
  FileText, 
  Tag, 
  Building, 
  Layers, 
  User, 
  Calendar, 
  Paperclip, 
  CreditCard,
  Plus,
  Trash,
  CheckCircle,
  Camera,
  Sparkles,
  Cpu,
  Database,
  Eye,
  AlertCircle
} from 'lucide-react';
import { Transaction, Category, CostCenter, BankAccount } from '../types';
import { getIconComponent } from './DashboardScreen';

// Mock dataset representing receipts for instant AI-OCR scanning simulation
const demoReceipts = [
  {
    id: 1,
    type: 'expense',
    label: 'Combustível - Posto Shell (R$ 180,50)',
    amount: '180,50',
    description: 'Abastecimento Frota de Veículos',
    category: 'Transporte',
    costCenter: 'Administrativo',
    clientOrSupplier: 'Posto Shell S/A',
    observation: 'Abastecimento de combustível para veículo operacional Hilux placa ATH-2026 para visita técnica.',
    fileName: 'comprovante_combustivel_shell.jpg'
  },
  {
    id: 2,
    type: 'expense',
    label: 'Google Cloud Platform (R$ 890,00)',
    amount: '890,00',
    description: 'Servidores em Nuvem Google Cloud',
    category: 'Serviços',
    costCenter: 'Projetos',
    clientOrSupplier: 'Google Cloud Platform',
    observation: 'Faturamento mensal de hospedagem dos bancos de dados e ambiente de APIs da plataforma Athos.',
    fileName: 'gcp_fatura_mensal.pdf'
  },
  {
    id: 3,
    type: 'revenue',
    label: 'Consultoria - Tech Corp (R$ 4.500,00)',
    amount: '4.500,00',
    description: 'Consultoria Mensal em Governança',
    category: 'Serviços de Consultoria',
    costCenter: 'Projetos',
    clientOrSupplier: 'Tech Corp S/A',
    observation: 'Honorários corporativos referentes aos serviços prestados em Governança de TI do mês de Junho.',
    fileName: 'nf_servicos_consultoria_tech_corp.pdf'
  }
];

interface TransactionFormProps {
  type: 'revenue' | 'expense';
  categories: Category[];
  costCenters: CostCenter[];
  accounts: BankAccount[];
  onSubmit: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onBack: () => void;
}

export default function TransactionForm({
  type,
  categories,
  costCenters,
  accounts,
  onSubmit,
  onBack
}: TransactionFormProps) {
  // Filter categories by type
  const filteredCategories = categories.filter(c => c.type === type);

  // Form State
  const [value, setValue] = useState<string>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [costCenter, setCostCenter] = useState('');
  const [account, setAccount] = useState('');
  const [clientOrSupplier, setClientOrSupplier] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  
  // Custom requested states: Location (local do anexo) and Observation (campo de observação)
  const [attachmentLocation, setAttachmentLocation] = useState('Drive Digital - Pasta Financeira');
  const [observation, setObservation] = useState('');

  // AI OCR Scanning simulation states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraFlash, setCameraFlash] = useState(false);
  const [selectedDemoReceipt, setSelectedDemoReceipt] = useState<number | null>(null);
  const [aiSuccessToast, setAiSuccessToast] = useState(false);
  const [scanningStep, setScanningStep] = useState(0);

  // Custom visual state
  const [isDragging, setIsDragging] = useState(false);

  // AI Scanning logic sequence
  useEffect(() => {
    if (isAnalyzing) {
      const step1 = setTimeout(() => setScanningStep(1), 650);
      const step2 = setTimeout(() => setScanningStep(2), 1300);
      const step3 = setTimeout(() => setScanningStep(3), 1950);
      const step4 = setTimeout(() => {
        setScanningStep(4);
        
        // Find receipt and auto fill all form states
        const selected = demoReceipts.find(r => r.id === selectedDemoReceipt);
        if (selected) {
          setValue(selected.amount);
          setDescription(selected.description);
          setCategory(selected.category);
          setCostCenter(selected.costCenter);
          setClientOrSupplier(selected.clientOrSupplier);
          setObservation(selected.observation);
          setAttachmentName(selected.fileName);
        }
      }, 2600);

      const finish = setTimeout(() => {
        setIsAnalyzing(false);
        setAiSuccessToast(true);
      }, 3200);

      return () => {
        clearTimeout(step1);
        clearTimeout(step2);
        clearTimeout(step3);
        clearTimeout(step4);
        clearTimeout(finish);
      };
    }
  }, [isAnalyzing, selectedDemoReceipt]);

  // Dismiss success toast automatically
  useEffect(() => {
    if (aiSuccessToast) {
      const timer = setTimeout(() => setAiSuccessToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [aiSuccessToast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedValue = parseFloat(value.replace(/[^0-9,-]/g, '').replace(',', '.'));
    if (isNaN(parsedValue) || parsedValue <= 0) {
      alert('Por favor, insira um valor válido');
      return;
    }

    onSubmit({
      type,
      value: parsedValue,
      description: description || (type === 'revenue' ? 'Nova Receita' : 'Nova Despesa'),
      category: category || (filteredCategories[0]?.name || 'Outros'),
      costCenter: costCenter || (costCenters[0]?.name || 'Financeiro'),
      account: account || (accounts[0]?.bankName || 'Caixa Econômica'),
      clientOrSupplier: clientOrSupplier || (type === 'revenue' ? 'Cliente Padrão' : 'Fornecedor Padrão'),
      date,
      paymentMethod: type === 'expense' ? (paymentMethod || 'Cartão de Crédito') : undefined,
      attachment: attachmentName || undefined,
      attachmentLocation: attachmentName ? attachmentLocation : undefined,
      observation: observation || undefined
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setAttachmentName(e.dataTransfer.files[0].name);
    }
  };

  const startScanningSim = (receiptId: number) => {
    setSelectedDemoReceipt(receiptId);
    setCameraFlash(true);
    setTimeout(() => {
      setCameraFlash(false);
      setShowCamera(false);
      setIsAnalyzing(true);
      setScanningStep(0);
    }, 450);
  };

  return (
    <div className="flex-1 flex flex-col bg-black text-white pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900 bg-slate-950/80 sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-bold font-display uppercase tracking-widest text-slate-200">
          {type === 'revenue' ? 'Nova Receita' : 'Nova Despesa'}
        </h2>
        <div className="w-8"></div> {/* Spacer for symmetry */}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 p-5 space-y-5 overflow-y-auto">
        {aiSuccessToast && (
          <div className="p-3.5 bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-slate-950/80 border border-blue-500/30 rounded-2xl flex items-start gap-3 shadow-xl animate-bounce-short">
            <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 text-left">
              <h5 className="text-[11px] font-bold text-white uppercase tracking-wider">Leitura por IA Concluída!</h5>
              <p className="text-[10px] text-slate-300 font-medium leading-relaxed mt-0.5">
                Preenchemos automaticamente o valor, descrição, categoria, centro de custo, fornecedor/cliente e observações com alta precisão.
              </p>
            </div>
          </div>
        )}

        {/* Value Input (Glow and large numbers) */}
        <div className="space-y-1.5 text-center py-4 bg-slate-950/30 rounded-2xl border border-slate-900">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Valor do Lançamento</label>
          <div className="relative inline-flex items-center justify-center">
            <span className="text-xl font-bold font-display text-slate-400 mr-1.5">R$</span>
            <input
              type="text"
              placeholder="0,00"
              value={value}
              onChange={(e) => {
                // simple numbers-only mask
                const clean = e.target.value.replace(/[^0-9]/g, '');
                if (!clean) {
                  setValue('');
                  return;
                }
                const num = parseFloat(clean) / 100;
                setValue(num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
              }}
              required
              className={`bg-transparent text-3xl font-bold font-mono text-center focus:outline-none min-w-[120px] max-w-[240px] tracking-tight ${
                type === 'revenue' 
                  ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                  : 'text-rose-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]'
              }`}
            />
          </div>
        </div>

        {/* Descrição */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" /> Descrição
          </label>
          <input
            type="text"
            placeholder={type === 'revenue' ? 'Ex: Venda de produto' : 'Ex: Compra de materiais'}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-200 transition"
          />
        </div>

        {/* Categoria */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-200 transition appearance-none cursor-pointer"
          >
            <option value="">Selecione uma categoria</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fornecedor ou Cliente */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" /> {type === 'revenue' ? 'Cliente' : 'Fornecedor'}
          </label>
          <input
            type="text"
            placeholder={type === 'revenue' ? 'Ex: Tech Corp S/A' : 'Ex: Distribuidora Central'}
            value={clientOrSupplier}
            onChange={(e) => setClientOrSupplier(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-200 transition"
          />
        </div>

        {/* Conta Bancária */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5" /> Conta para {type === 'revenue' ? 'Depósito' : 'Pagamento'}
          </label>
          <select
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-200 transition appearance-none cursor-pointer"
          >
            <option value="">Selecione uma conta</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.bankName}>
                {acc.bankName} (Saldo: R$ {acc.balance.toLocaleString('pt-BR')})
              </option>
            ))}
          </select>
        </div>

        {/* Centro de Custo */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Centro de Custo
          </label>
          <select
            value={costCenter}
            onChange={(e) => setCostCenter(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-200 transition appearance-none cursor-pointer"
          >
            <option value="">Selecione o centro de custo</option>
            {costCenters.map((cc) => (
              <option key={cc.id} value={cc.name}>
                {cc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Forma de Pagamento (ONLY for Expense / Despesa) */}
        {type === 'expense' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Forma de Pagamento
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-200 transition appearance-none cursor-pointer"
            >
              <option value="">Selecione a forma de pagamento</option>
              <option value="Cartão de Crédito">Cartão de Crédito Corporativo</option>
              <option value="PIX">PIX Corporativo</option>
              <option value="Boleto Bancário">Boleto Bancário</option>
              <option value="Transferência">TED / DOC</option>
              <option value="Dinheiro">Dinheiro</option>
            </select>
          </div>
        )}

        {/* Data */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Data do Lançamento
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-slate-200 transition appearance-none cursor-pointer"
          />
        </div>

        {/* Anexo - Drag and Drop File Upload */}
        <div className="space-y-3.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Paperclip className="w-3.5 h-3.5" /> Anexar Comprovante
          </label>
          
          {/* Custom Buttons Group for Attachment Source Selection */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              className="py-3 bg-cyan-950/30 border border-cyan-800/30 rounded-xl text-xs font-bold text-cyan-400 hover:bg-cyan-900/20 hover:border-cyan-700/50 transition active:scale-98 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Camera className="w-4 h-4 text-cyan-400" /> Tirar Foto (IA)
            </button>
            
            <label
              htmlFor="file-upload"
              className="py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-850 hover:text-white transition active:scale-98 flex items-center justify-center gap-1.5 cursor-pointer text-center shadow-sm"
            >
              <Paperclip className="w-4 h-4 text-slate-400" /> Escolher Arquivo
            </label>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Drag & Drop View Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border border-dashed rounded-xl p-4.5 flex flex-col items-center justify-center transition ${
              isDragging 
                ? 'border-blue-500 bg-blue-500/10' 
                : attachmentName 
                ? 'border-emerald-500/50 bg-emerald-500/5' 
                : 'border-slate-850 bg-slate-950/20 hover:border-slate-800'
            }`}
          >
            {attachmentName ? (
              <div className="flex flex-col items-center text-center space-y-1">
                <CheckCircle className="w-6.5 h-6.5 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 mt-1 max-w-[220px] truncate">{attachmentName}</span>
                <span className="text-[10px] text-slate-500">Local: {attachmentLocation}</span>
                <button
                  type="button"
                  onClick={() => setAttachmentName(null)}
                  className="text-[10px] font-bold text-red-400 hover:text-red-300 mt-1.5 flex items-center gap-1 active:scale-95 transition"
                >
                  <Trash className="w-3 h-3" /> Remover anexo
                </button>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-[11px] text-slate-500">Ou arraste seu arquivo para esta área</span>
              </div>
            )}
          </div>
        </div>

        {/* Local de Anexo Selection (Selector de Destino) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-blue-400" /> Local de Armazenamento do Anexo
          </label>
          <div className="relative">
            <select
              value={attachmentLocation}
              onChange={(e) => setAttachmentLocation(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-200 transition appearance-none cursor-pointer"
            >
              <option value="Drive Digital - Pasta Financeira">📁 Drive Digital - Pasta Financeira</option>
              <option value="Drive Digital - Notas Fiscais">📁 Drive Digital - Notas Fiscais</option>
              <option value="Pasta Pessoal de Nuvem (CFO)">📁 Pasta Pessoal de Nuvem (CFO)</option>
              <option value="Servidor Corporativo Criptografado">📁 Servidor Corporativo Criptografado</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-[10px]">
              ▼
            </div>
          </div>
        </div>

        {/* Campo de Observação (Observações Field) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-400" /> Observações do Lançamento
          </label>
          <textarea
            rows={2.5}
            placeholder="Insira detalhes adicionais sobre este lançamento corporativo (ex: projeto, aprovação, etc.)..."
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500 text-slate-200 transition resize-none leading-relaxed"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition shadow-lg active:scale-[0.99] ${
            type === 'revenue'
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40 hover:shadow-glow-green'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-950/40 hover:shadow-glow-blue'
          }`}
        >
          {type === 'revenue' ? 'Salvar receita' : 'Salvar despesa'}
        </button>
      </form>

      {/* ======================================= */}
      {/* 1. CAMERA SIMULATOR OVERLAY             */}
      {/* ======================================= */}
      {showCamera && (
        <div className="absolute inset-0 bg-slate-950/95 z-50 flex flex-col justify-between p-5 text-center">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowCamera(false)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 hover:text-white transition active:scale-95 uppercase tracking-wider"
            >
              Cancelar
            </button>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              ATHOS AI CAM
            </span>
            <div className="w-16"></div>
          </div>

          {/* Camera Viewfinder */}
          <div className="flex-1 flex flex-col items-center justify-center my-4 relative">
            {/* Viewfinder brackets */}
            <div className="absolute inset-x-4 inset-y-6 border border-slate-800/40 rounded-3xl flex flex-col justify-between p-4 pointer-events-none">
              <div className="flex justify-between">
                <div className="w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl-md"></div>
                <div className="w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr-md"></div>
              </div>
              
              {/* Central scanning grid line */}
              <div className="w-full h-0.5 bg-cyan-400/30 shadow-[0_0_8px_rgba(34,211,238,0.4)] animate-[bounce_2.5s_infinite_ease-in-out]"></div>

              <div className="flex justify-between">
                <div className="w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl-md"></div>
                <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br-md"></div>
              </div>
            </div>

            {/* Instruction text inside viewfinder */}
            <div className="z-10 max-w-[240px] space-y-4">
              <Camera className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="bg-slate-900/90 border border-slate-850 rounded-2xl p-4 shadow-xl text-left">
                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-1">
                  MOCK DISPOSITIVO
                </span>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  Para testar a leitura de comprovantes com IA de forma instantânea, selecione um recibo de exemplo abaixo e clique no botão de captura:
                </p>
              </div>
            </div>
          </div>

          {/* Demo Receipts List to simulate */}
          <div className="space-y-3 pb-2 z-10">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block text-left px-1">
              Selecione o Comprovante:
            </span>
            <div className="grid grid-cols-1 gap-2 max-h-[140px] overflow-y-auto px-1">
              {demoReceipts
                .filter(r => r.type === type)
                .map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setSelectedDemoReceipt(r.id);
                      startScanningSim(r.id);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      selectedDemoReceipt === r.id
                        ? 'bg-blue-600/15 border-blue-500 text-white'
                        : 'bg-slate-900/80 border-slate-850 hover:border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <h5 className="text-[11px] font-bold truncate">{r.label}</h5>
                      <p className="text-[9px] text-slate-500 font-medium mt-0.5 truncate">{r.description}</p>
                    </div>
                    <Sparkles className="w-4 h-4 text-blue-400 shrink-0 ml-2" />
                  </button>
                ))}
            </div>
            
            {/* Shutter Button container */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  // Fallback: pick first matching if none selected
                  const matching = demoReceipts.filter(r => r.type === type);
                  if (matching.length > 0) {
                    setSelectedDemoReceipt(matching[0].id);
                    startScanningSim(matching[0].id);
                  }
                }}
                className="w-16 h-16 rounded-full bg-white border-4 border-slate-800 flex items-center justify-center text-slate-950 transition hover:scale-105 active:scale-95 shadow-lg relative"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-500 animate-pulse"></div>
              </button>
            </div>
          </div>

          {/* Flash Effect Layer */}
          {cameraFlash && (
            <div className="absolute inset-0 bg-white z-50 animate-[fadeOut_0.4s_ease-out_forwards]"></div>
          )}
        </div>
      )}

      {/* ======================================= */}
      {/* 2. AI ANALYZING VIEW OVERLAY            */}
      {/* ======================================= */}
      {isAnalyzing && (
        <div className="absolute inset-0 bg-black/98 z-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="space-y-6 max-w-[280px]">
            {/* Pulsing AI Scanner Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl scale-125"></div>
              <div className="w-20 h-20 bg-slate-900 border-2 border-cyan-500 rounded-2xl flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)] animate-pulse mx-auto">
                <Cpu className="w-10 h-10 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <Sparkles className="absolute top-0 right-2 w-6 h-6 text-yellow-400 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="font-bold font-display text-sm uppercase tracking-widest text-slate-100">
                ATHOS Intelligence AI
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Analisando imagem do comprovante e extraindo dados...
              </p>
            </div>

            {/* Stepper Logs */}
            <div className="bg-slate-950/60 border border-slate-900 rounded-2xl p-4 text-left font-mono text-[9px] text-slate-500 space-y-2.5">
              {[
                "⚙️ Inicializando Rede ATHOS OCR...",
                "🔍 Detectando bordas & corrigindo perspectiva...",
                "🧬 Executando leitura de valores e datas...",
                "✨ Classificando categoria e fornecedor...",
                "✅ Formulário preenchido com sucesso!"
              ].map((log, index) => {
                const isActive = index === scanningStep;
                const isCompleted = index < scanningStep;
                return (
                  <div
                    key={index}
                    className={`flex items-center gap-2 transition duration-200 ${
                      isActive 
                        ? 'text-cyan-400 font-bold' 
                        : isCompleted 
                        ? 'text-emerald-400' 
                        : 'text-slate-700'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current"></span>
                    <span>{log}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CSS Keyframes for Flash Effect */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}} />
    </div>
  );
}

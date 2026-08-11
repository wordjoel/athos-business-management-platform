import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Camera, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Sparkles,
  FileText,
  FileCheck,
  VideoOff,
  Plus
} from 'lucide-react';
import { AgendaItem, OCRDocument } from '../types';

interface AgendaAndOCRProps {
  initialSubScreen: 'agenda' | 'ocr_scanner';
  agendaItems: AgendaItem[];
  ocrDocuments: OCRDocument[];
  onNavigate: (screen: any) => void;
  onBack: () => void;
  onAddOCRDocument?: (doc: OCRDocument) => void;
  onAddTransactionDirectly?: (tx: any) => void;
}

export default function AgendaAndOCR({
  initialSubScreen,
  agendaItems,
  ocrDocuments,
  onNavigate,
  onBack,
  onAddOCRDocument,
  onAddTransactionDirectly
}: AgendaAndOCRProps) {
  const [subScreen, setSubScreen] = useState<'agenda' | 'ocr_scanner'>(initialSubScreen);
  const [agendaFilter, setAgendaFilter] = useState<'all' | 'pay' | 'receive'>('all');
  
  // OCR states
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Start client webcam for realistic OCR
  const startCamera = async () => {
    setCameraError(false);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } else {
        setCameraError(true);
      }
    } catch (err) {
      console.warn("Webcam access error or iframe permission restriction:", err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
  };

  useEffect(() => {
    if (subScreen === 'ocr_scanner') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [subScreen]);

  // Simulate OCR scan
  const triggerScanSimulation = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // OCR Extraction success callback
          setTimeout(() => {
            setIsScanning(false);
            const mockDoc: OCRDocument = {
              id: `ocr-${Date.now()}`,
              name: `Nota_Fiscal_Athos_${Math.floor(1000 + Math.random() * 9000)}.pdf`,
              date: new Date().toISOString().split('T')[0],
              status: 'processed',
              extractedValue: 85.90,
              extractedDescription: 'Almoço de Negócios (OCR)',
              extractedCategory: 'Alimentação',
              extractedSupplier: 'Restaurante Central'
            };
            if (onAddOCRDocument) {
              onAddOCRDocument(mockDoc);
            }
            alert(`OCR Processado com sucesso! \nNota Fiscal de R$ 85,90 adicionada com sucesso aos seus Lançamentos corporativos.`);
            if (onAddTransactionDirectly) {
              onAddTransactionDirectly({
                type: 'expense',
                value: 85.90,
                description: 'Almoço de Negócios (OCR)',
                category: 'Alimentação',
                costCenter: 'Administrativo',
                account: 'Caixa Econômica',
                clientOrSupplier: 'Restaurante Central',
                date: new Date().toISOString().split('T')[0],
                paymentMethod: 'Dinheiro',
                attachment: mockDoc.name
              });
            }
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  // Filter agenda
  const filteredAgenda = agendaItems.filter(item => {
    if (agendaFilter === 'all') return true;
    return item.type === agendaFilter;
  });

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
          {subScreen === 'agenda' ? 'Agenda Financeira' : 'Scanner OCR Inteligente'}
        </h2>
        <div className="w-8"></div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex gap-2 px-5 py-3 border-b border-slate-900/60 bg-slate-950/30">
        <button
          onClick={() => setSubScreen('agenda')}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
            subScreen === 'agenda' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5 inline mr-1.5" /> Agenda
        </button>
        <button
          onClick={() => setSubScreen('ocr_scanner')}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
            subScreen === 'ocr_scanner' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
          }`}
        >
          <Camera className="w-3.5 h-3.5 inline mr-1.5 text-cyan-400" /> Scanner OCR
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ======================================= */}
        {/* 1. AGENDA FINANCEIRA                     */}
        {/* ======================================= */}
        {subScreen === 'agenda' && (
          <div className="p-5 space-y-5">
            {/* Visual Calendar Grid simulator */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <div className="flex justify-between items-center text-xs font-bold text-white mb-3">
                <span>Julho 2026</span>
                <span className="text-blue-400 font-mono">Simulado</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] text-slate-500 font-bold mb-1.5">
                <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-semibold">
                {/* 28 empty slots for padding */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={`p-${i}`} className="text-transparent">0</span>
                ))}
                {/* Days of July */}
                {Array.from({ length: 31 }).map((_, i) => {
                  const dayNum = i + 1;
                  const hasPay = agendaItems.some(item => new Date(item.date).getDate() === dayNum && item.type === 'pay');
                  const hasReceive = agendaItems.some(item => new Date(item.date).getDate() === dayNum && item.type === 'receive');
                  const isToday = dayNum === 10;

                  return (
                    <div 
                      key={dayNum} 
                      className={`h-7.5 rounded-lg flex flex-col items-center justify-center relative cursor-pointer active:scale-90 transition ${
                        isToday 
                          ? 'bg-blue-600 text-white font-bold shadow-md' 
                          : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="leading-none text-[11px]">{dayNum}</span>
                      <div className="flex gap-0.5 absolute bottom-0.5 justify-center w-full">
                        {hasPay && <span className="w-1 h-1 rounded-full bg-rose-500"></span>}
                        {hasReceive && <span className="w-1 h-1 rounded-full bg-emerald-500"></span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Agenda Filter Toggle */}
            <div className="flex bg-slate-950 border border-slate-900 rounded-xl p-1 gap-1">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'pay', label: 'A Pagar' },
                { id: 'receive', label: 'A Receber' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setAgendaFilter(filter.id as any)}
                  className={`flex-1 py-1.5 text-center rounded-lg text-[10px] font-bold uppercase transition ${
                    agendaFilter === filter.id 
                      ? 'bg-slate-800 text-white' 
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Invoices List */}
            <div className="space-y-2.5">
              {filteredAgenda.map((item) => (
                <div 
                  key={item.id}
                  className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      item.type === 'receive' 
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    }`}>
                      {item.type === 'receive' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-white leading-tight">{item.title}</h4>
                      <p className="text-[9px] text-slate-500 mt-1 uppercase font-semibold">Vencimento: {new Date(item.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-300 block">
                      {formatCurrency(item.value)}
                    </span>
                    <span className={`inline-block text-[9px] font-extrabold uppercase mt-1 leading-none ${
                      item.status === 'completed'
                        ? 'text-emerald-500'
                        : item.status === 'overdue'
                        ? 'text-red-500'
                        : 'text-amber-500'
                    }`}>
                      ● {item.status === 'completed' ? 'Pago' : item.status === 'overdue' ? 'Atrasado' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 2. SCANNER OCR                          */}
        {/* ======================================= */}
        {subScreen === 'ocr_scanner' && (
          <div className="p-5 space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Posicione o comprovante ou nota fiscal em frente à câmera para extrair os dados e criar o lançamento instantaneamente.
            </p>

            {/* Simulated / Real Camera Area */}
            <div className="relative aspect-video sm:aspect-square bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col items-center justify-center">
              {cameraStream ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center text-slate-500 space-y-2">
                  <VideoOff className="w-8 h-8 text-slate-600" />
                  <span className="text-xs font-semibold">Utilizando modo de emulação de scanner</span>
                  <span className="text-[10px] text-slate-700">Por favor, clique abaixo para escanear a nota simulada</span>
                </div>
              )}

              {/* Glowing scanning laser lines */}
              {isScanning && (
                <div className="absolute inset-x-0 h-1 bg-cyan-500 shadow-glow-blue animate-[bounce_2s_infinite] z-10"></div>
              )}

              {/* Camera focus box borders */}
              <div className="absolute inset-5 border border-cyan-500/40 rounded-xl pointer-events-none z-10 flex items-center justify-center">
                <div className="w-8 h-8 absolute -top-1 -left-1 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg"></div>
                <div className="w-8 h-8 absolute -top-1 -right-1 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg"></div>
                <div className="w-8 h-8 absolute -bottom-1 -left-1 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg"></div>
                <div className="w-8 h-8 absolute -bottom-1 -right-1 border-b-2 border-r-2 border-cyan-400 rounded-br-lg"></div>
                
                {!isScanning && (
                  <span className="text-[10px] text-cyan-400/80 uppercase tracking-wider bg-slate-950/80 px-2 py-1 rounded font-bold font-mono">
                    Área de Captura
                  </span>
                )}
              </div>
            </div>

            {/* Scan Control Action */}
            <button
              onClick={triggerScanSimulation}
              disabled={isScanning}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-xs font-bold text-white uppercase tracking-widest transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <Camera className="w-4.5 h-4.5" />
              {isScanning ? `Escanenando nota (${scanProgress}%)` : 'Escanear comprovante'}
            </button>

            {/* OCR Document History List */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 px-1">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Últimos documentos processados
              </h4>

              {ocrDocuments.map((doc) => (
                <div key={doc.id} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400">
                      <FileCheck className="w-4.5 h-4.5 text-cyan-400" />
                    </div>
                    <div className="text-left">
                      <h5 className="text-xs font-bold text-white max-w-[150px] truncate leading-tight">{doc.name}</h5>
                      <p className="text-[9px] text-slate-500 mt-1 uppercase font-semibold">Status: {doc.status}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    {doc.extractedValue ? (
                      <span className="text-xs font-bold text-slate-300">
                        {formatCurrency(doc.extractedValue)}
                      </span>
                    ) : (
                      <span className="text-[9px] font-semibold text-slate-500 animate-pulse">Lendo...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

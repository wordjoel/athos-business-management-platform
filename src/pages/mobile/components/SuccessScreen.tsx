import React from 'react';
import { Check, ArrowRight, Plus, Calendar } from 'lucide-react';
import { Transaction } from '../types';

interface SuccessScreenProps {
  transaction: Transaction | null;
  onViewLaunches: () => void;
  onNewLaunch: () => void;
}

export default function SuccessScreen({ transaction, onViewLaunches, onNewLaunch }: SuccessScreenProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const getCleanTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-black text-white p-6 pb-24 text-center">
      {/* Spacer top */}
      <div></div>

      {/* Center animation / check */}
      <div className="space-y-6 flex flex-col items-center">
        <div className="relative">
          {/* Visual glow backdrop */}
          <div className="absolute inset-0 bg-emerald-500/25 rounded-full blur-xl scale-125"></div>
          
          {/* Pulse ring */}
          <div className="absolute -inset-2.5 rounded-full border-4 border-emerald-500/10 animate-ping"></div>

          <div className="w-20 h-20 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center text-slate-950 shadow-glow-green relative z-10">
            <Check className="w-10 h-10 stroke-[3.5]" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold font-display text-white">Lançamento concluído!</h2>
          <p className="text-xs text-slate-400 font-medium">Seu lançamento foi registrado com sucesso na plataforma.</p>
        </div>

        {/* Transaction Detail Card */}
        {transaction && (
          <div className="w-full max-w-[280px] p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3.5 text-left mt-2">
            <div className={`p-2.5 rounded-xl ${
              transaction.type === 'revenue' 
                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
            }`}>
              <Calendar className="w-4.5 h-4.5" />
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
                {transaction.type === 'revenue' ? 'Receita Recebida' : 'Despesa Lançada'}
              </span>
              <h4 className="text-xs font-bold text-white truncate mt-0.5">{transaction.description}</h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-1 font-mono">
                {formatCurrency(transaction.value)}
              </p>
              <span className="text-[9px] text-slate-500 block mt-0.5 leading-none">
                Hoje, {getCleanTime()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="space-y-3.5 w-full">
        <button
          onClick={onViewLaunches}
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-xs uppercase tracking-widest text-white transition shadow-lg active:scale-98 flex items-center justify-center gap-1.5"
        >
          Ver lançamentos <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onNewLaunch}
          className="w-full py-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-slate-200 transition active:scale-98 flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Novo lançamento
        </button>
      </div>
    </div>
  );
}

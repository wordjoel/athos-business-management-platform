import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Wallet, 
  Smartphone, 
  CreditCard as CreditCardIcon, 
  TrendingUp, 
  Percent, 
  Target, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  CircleDollarSign,
  Plus,
  Coins
} from 'lucide-react';
import { BankAccount, CreditCard, FinancialGoal } from '../types';
import { getIconComponent } from './DashboardScreen';

interface AssetsAndResourcesProps {
  initialSubScreen: 'bank_accounts' | 'credit_cards' | 'resources' | 'goals';
  accounts: BankAccount[];
  cards: CreditCard[];
  goals: FinancialGoal[];
  onNavigate: (screen: any) => void;
  onBack: () => void;
  onAddGoal?: (goal: Omit<FinancialGoal, 'id'>) => void;
  onAddAccount?: (acc: Omit<BankAccount, 'id'>) => void;
  onAddCard?: (card: Omit<CreditCard, 'id'>) => void;
}

const CARD_COLORS = [
  'from-slate-800 to-slate-950',
  'from-purple-800 to-purple-950',
  'from-blue-800 to-blue-950',
  'from-emerald-800 to-emerald-950',
  'from-rose-800 to-rose-950',
  'from-amber-800 to-amber-950',
];

export default function AssetsAndResources({
  initialSubScreen,
  accounts,
  cards,
  goals,
  onNavigate,
  onBack,
  onAddGoal,
  onAddAccount,
  onAddCard
}: AssetsAndResourcesProps) {
  const [subScreen, setSubScreen] = useState<'bank_accounts' | 'credit_cards' | 'resources' | 'goals'>(initialSubScreen);

  // Goal Modal / Form state
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');

  // Account Form state
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState('Conta Corrente PJ');
  const [accountBalance, setAccountBalance] = useState('');
  const [agency, setAgency] = useState('');
  const [accountNum, setAccountNum] = useState('');

  // Card Form state
  const [showAddCard, setShowAddCard] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardBankName, setCardBankName] = useState('');
  const [cardLast4, setCardLast4] = useState('');
  const [cardLimit, setCardLimit] = useState('');
  const [cardInvoice, setCardInvoice] = useState('');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const submitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalName || !goalTarget) return;
    if (onAddGoal) {
      onAddGoal({
        name: goalName,
        targetValue: parseFloat(goalTarget),
        currentValue: parseFloat(goalCurrent || '0'),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
        color: '#5B7FA8'
      });
      setGoalName('');
      setGoalTarget('');
      setGoalCurrent('');
      setShowAddGoal(false);
    }
  };

  const submitCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardName || !cardBankName || !cardLimit) return;
    if (onAddCard) {
      const limit = parseFloat(cardLimit);
      const invoice = parseFloat(cardInvoice || '0');
      onAddCard({
        cardName,
        bankName: cardBankName,
        cardNumber: `•••• •••• •••• ${(cardLast4 || '0000').padStart(4, '0').slice(-4)}`,
        limit,
        availableLimit: Math.max(limit - invoice, 0),
        invoiceValue: invoice,
        color: CARD_COLORS[cards.length % CARD_COLORS.length],
      });
      setCardName('');
      setCardBankName('');
      setCardLast4('');
      setCardLimit('');
      setCardInvoice('');
      setShowAddCard(false);
    }
  };

  const submitAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName || !accountBalance) return;
    if (onAddAccount) {
      onAddAccount({
        bankName,
        accountType,
        balance: parseFloat(accountBalance),
        agency: agency || '0001',
        accountNumber: accountNum || '12.345-6',
        status: 'active',
        icon: 'Building2',
        color: '#5B7FA8'
      });
      setBankName('');
      setAccountBalance('');
      setAgency('');
      setAccountNum('');
      setShowAddAccount(false);
    }
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
          {subScreen === 'bank_accounts' && 'Contas Bancárias'}
          {subScreen === 'credit_cards' && 'Cartões Corporativos'}
          {subScreen === 'resources' && 'Recursos Financeiros'}
          {subScreen === 'goals' && 'Metas Financeiras'}
        </h2>
        <div className="w-8"></div>
      </div>

      {/* Internal Navigation tabs */}
      <div className="flex gap-2 px-5 py-3 overflow-x-auto scrollbar-none border-b border-slate-900/60 bg-slate-950/30">
        {[
          { id: 'bank_accounts', label: 'Contas' },
          { id: 'credit_cards', label: 'Cartões' },
          { id: 'goals', label: 'Metas' },
          { id: 'resources', label: 'Recursos' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubScreen(tab.id as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
              subScreen === tab.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* ======================================= */}
        {/* 1. CONTAS BANCÁRIAS                      */}
        {/* ======================================= */}
        {subScreen === 'bank_accounts' && (
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Suas contas correntes e saldos corporativos vinculados.</span>
              <button
                onClick={() => setShowAddAccount(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[11px] font-bold text-white flex items-center gap-1 transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Nova Conta
              </button>
            </div>

            {/* Add Account Modal Overlay Form */}
            {showAddAccount && (
              <form onSubmit={submitAccount} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-left">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Adicionar Conta Bancária</h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Banco</label>
                  <input
                    type="text"
                    placeholder="Ex: Santander PJ"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Tipo</label>
                    <input
                      type="text"
                      placeholder="Conta Corrente"
                      value={accountType}
                      onChange={(e) => setAccountType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Saldo Inicial (R$)</label>
                    <input
                      type="number"
                      placeholder="1500"
                      value={accountBalance}
                      onChange={(e) => setAccountBalance(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Agência</label>
                    <input
                      type="text"
                      placeholder="1234"
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Conta</label>
                    <input
                      type="text"
                      placeholder="45678-9"
                      value={accountNum}
                      onChange={(e) => setAccountNum(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddAccount(false)}
                    className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-blue-600 text-[10px] font-bold text-white hover:bg-blue-500"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {accounts.map((acc) => (
                <div 
                  key={acc.id}
                  className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center justify-between hover:bg-slate-900 transition"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-950 font-bold"
                      style={{ backgroundColor: acc.color || '#5B7FA8' }}
                    >
                      {acc.bankName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-white leading-tight">{acc.bankName}</h4>
                      <p className="text-[10px] text-slate-500 mt-1">{acc.accountType}</p>
                      <p className="text-[9px] text-slate-600 font-mono mt-0.5">Ag: {acc.agency} | CC: {acc.accountNumber}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`font-mono text-sm font-bold ${acc.balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {formatCurrency(acc.balance)}
                    </span>
                    <span className="block text-[9px] text-emerald-500 font-bold uppercase mt-1">● Ativo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 2. CARTÕES CORPORATIVOS                  */}
        {/* ======================================= */}
        {subScreen === 'credit_cards' && (
          <div className="p-5 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Cartões corporativos físicos e virtuais de limite executivo.</span>
              <button
                onClick={() => setShowAddCard(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[11px] font-bold text-white flex items-center gap-1 transition active:scale-95 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Novo Cartão
              </button>
            </div>

            {/* Add Card Form Overlay */}
            {showAddCard && (
              <form onSubmit={submitCard} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-left">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Adicionar Cartão Corporativo</h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Nome do Cartão</label>
                  <input
                    type="text"
                    placeholder="Ex: Athos Black Platinum"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Banco</label>
                    <input
                      type="text"
                      placeholder="Itaú Empresas"
                      value={cardBankName}
                      onChange={(e) => setCardBankName(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Últimos 4 dígitos</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="8842"
                      value={cardLast4}
                      onChange={(e) => setCardLast4(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Limite Total (R$)</label>
                    <input
                      type="number"
                      placeholder="50000"
                      value={cardLimit}
                      onChange={(e) => setCardLimit(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Fatura Atual (R$)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={cardInvoice}
                      onChange={(e) => setCardInvoice(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddCard(false)}
                    className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-blue-600 text-[10px] font-bold text-white hover:bg-blue-500"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            )}

            {cards.length === 0 && (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-900/40 border border-slate-800 rounded-xl">
                Nenhum cartão cadastrado ainda.
              </div>
            )}

            <div className="space-y-4">
              {cards.map((card) => (
                <div key={card.id} className="space-y-2">
                  {/* Physical Styled Credit Card Visual */}
                  <div className={`relative p-5 bg-gradient-to-br ${card.color} border border-slate-700/40 rounded-2xl shadow-xl aspect-[1.58/1] overflow-hidden text-left flex flex-col justify-between`}>
                    {/* Gloss highlights & overlay branding circles */}
                    <div className="absolute -right-16 -top-16 w-44 h-44 bg-white/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-200/90 leading-none">ATHOS MOBILE</span>
                        <p className="text-[8px] text-slate-300 font-medium mt-0.5">{card.cardName}</p>
                      </div>
                      <span className="text-xs font-black italic text-slate-300 tracking-wider">VISA</span>
                    </div>

                    {/* Chip & contactless icons */}
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-5.5 bg-yellow-500/80 rounded-md border border-yellow-600/40 relative">
                        <div className="absolute inset-y-1 inset-x-1.5 border border-yellow-700/30 grid grid-cols-2">
                          <div className="border-r border-b border-yellow-700/10"></div>
                          <div className="border-b border-yellow-700/10"></div>
                        </div>
                      </div>
                      {/* Contactless waves simulated with custom vectors */}
                      <svg className="w-4 h-4 text-slate-300/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 5a8 8 0 018 8m-4-8a4 4 0 014 4m-4-4v4" />
                      </svg>
                    </div>

                    {/* Masked Card Number */}
                    <div className="font-mono text-base tracking-widest text-white font-medium my-2.5">
                      {card.cardNumber}
                    </div>

                    {/* Card Holder & Expiry */}
                    <div className="flex justify-between items-end text-[10px] font-semibold text-slate-200">
                      <div>
                        <span className="text-[8px] text-slate-400 font-bold uppercase block leading-none mb-0.5">Gestor de Conta</span>
                        <p className="uppercase leading-none">GUSTAVO MARTINS</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-slate-400 font-bold uppercase block leading-none mb-0.5 font-sans">VAL</span>
                        <p className="font-mono leading-none">08/30</p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Metrics Under the card */}
                  <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">Fatura Atual</span>
                      <span className="font-mono font-bold text-rose-400">{formatCurrency(card.invoiceValue)}</span>
                    </div>
                    <div className="space-y-0.5 border-x border-slate-800/80">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">Disponível</span>
                      <span className="font-mono font-bold text-emerald-400">{formatCurrency(card.availableLimit)}</span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-slate-500 font-bold uppercase block">Limite Total</span>
                      <span className="font-mono font-bold text-slate-300">{formatCurrency(card.limit)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 3. METAS FINANCEIRAS                    */}
        {/* ======================================= */}
        {subScreen === 'goals' && (
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">Acompanhamento de metas e teto de gastos corporativos.</span>
              <button
                onClick={() => setShowAddGoal(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[11px] font-bold text-white flex items-center gap-1 transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Nova Meta
              </button>
            </div>

            {/* Add Goal Form Overlay */}
            {showAddGoal && (
              <form onSubmit={submitGoal} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3 text-left">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Criar Nova Meta</h4>
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Nome da Meta</label>
                  <input
                    type="text"
                    placeholder="Ex: Reserva de emergência corporativa"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Valor Alvo (R$)</label>
                    <input
                      type="number"
                      placeholder="50000"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Valor Atual (R$)</label>
                    <input
                      type="number"
                      placeholder="10000"
                      value={goalCurrent}
                      onChange={(e) => setGoalCurrent(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddGoal(false)}
                    className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-blue-600 text-[10px] font-bold text-white hover:bg-blue-500"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {goals.map((goal) => {
                const percentage = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);
                const isOverspent = goal.name.toLowerCase().includes('reduzir') && goal.currentValue > goal.targetValue;
                
                return (
                  <div key={goal.id} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Target className="w-4 h-4 text-blue-400" />
                          {goal.name}
                        </h4>
                        <p className="text-[9px] text-slate-500 mt-1 font-semibold uppercase">Vence em: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</p>
                      </div>

                      <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                        isOverspent 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {percentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${isOverspent ? 'bg-red-500' : 'bg-emerald-500'}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 font-mono">
                      <span>Progresso: {formatCurrency(goal.currentValue)}</span>
                      <span>Meta: {formatCurrency(goal.targetValue)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 4. RECURSOS FINANCEIROS                  */}
        {/* ======================================= */}
        {subScreen === 'resources' && (
          <div className="p-5 space-y-4">
            <p className="text-xs text-slate-400">Lista consolidada de recursos financeiros e carteiras adicionais.</p>

            <div className="space-y-2.5">
              {[
                { name: 'PIX Institucionais', count: '4 chaves ativas', val: 'Chaves Pix PJ', icon: <Percent className="text-blue-400" /> },
                { name: 'Contas Bancárias PJ', count: `${accounts.length} bancos vinculados`, val: 'Saldos consolidados', icon: <Building2 className="text-emerald-400" /> },
                { name: 'Cartões Corporativos', count: `${cards.length} cartões de crédito`, val: 'Limites integrados', icon: <CreditCardIcon className="text-purple-400" /> },
                { name: 'Carteiras Digitais', count: 'PagBank, MercadoPago', val: 'Fundos de conveniência', icon: <Wallet className="text-yellow-400" /> },
                { name: 'Investimentos de Caixa', count: 'CDB Liquidez Diária 102% CDI', val: 'R$ 152.400,00 aplicados', icon: <TrendingUp className="text-amber-400" /> },
                { name: 'Metas Corporativas', count: `${goals.length} metas ativas`, val: 'Acompanhamento', icon: <Target className="text-red-400" /> }
              ].map((res, i) => (
                <div key={i} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between hover:bg-slate-900 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                      {res.icon}
                    </div>
                    <div className="text-left">
                      <h4 className="text-xs font-bold text-white leading-tight">{res.name}</h4>
                      <p className="text-[9px] text-slate-500 mt-1">{res.count}</p>
                    </div>
                  </div>

                  <div className="text-right text-[10px] font-bold text-slate-400 font-mono">
                    {res.val}
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

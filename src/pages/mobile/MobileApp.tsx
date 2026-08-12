import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Camera,
  Settings as SettingsIcon,
  ArrowRight,
  X,
  Plus,
  RefreshCw,
  Clock,
  Smartphone
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import {
  BankAccount,
  CreditCard,
  Transaction,
  Category,
  CostCenter,
  FinancialGoal,
  NotificationItem,
  AgendaItem,
  OCRDocument,
  UserProfile,
  ScreenId,
  TabId
} from './types';

import {
  initialAccounts,
  initialCards,
  initialTransactions,
  initialCategories,
  initialCostCenters,
  initialGoals,
  initialNotifications,
  initialAgenda,
  initialOCRDocuments,
  defaultProfile
} from './data';

import DashboardScreen from './components/DashboardScreen';
import TransactionForm from './components/TransactionForm';
import CashFlowAndReports from './components/CashFlowAndReports';
import AssetsAndResources from './components/AssetsAndResources';
import AgendaAndOCR from './components/AgendaAndOCR';
import ProfileAndSettings from './components/ProfileAndSettings';
import MoreMenuScreen from './components/MoreMenuScreen';
import SuccessScreen from './components/SuccessScreen';

export default function MobileApp() {
  const [accounts, setAccounts] = useState<BankAccount[]>(initialAccounts);
  const [cards, setCards] = useState<CreditCard[]>(initialCards);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [costCenters, setCostCenters] = useState<CostCenter[]>(initialCostCenters);
  const [goals, setGoals] = useState<FinancialGoal[]>(initialGoals);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [agenda, setAgenda] = useState<AgendaItem[]>(initialAgenda);
  const [ocrDocs, setOcrDocs] = useState<OCRDocument[]>(initialOCRDocuments);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [previousScreen, setPreviousScreen] = useState<ScreenId | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [subScreenKey, setSubScreenKey] = useState<string>('');
  const [latestCreatedTransaction, setLatestCreatedTransaction] = useState<Transaction | null>(null);

  const [showFABSheet, setShowFABSheet] = useState(false);

  const navigateTo = (screen: ScreenId) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    setShowFABSheet(false);
  };

  const navigateToSub = (screen: ScreenId, subKey: string) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    setSubScreenKey(subKey);
    setShowFABSheet(false);
  };

  const handleBack = () => {
    if (previousScreen) {
      setCurrentScreen(previousScreen);
    } else {
      setCurrentScreen('dashboard');
    }
  };

  const handleAddCategory = (newCat: Omit<Category, 'id'>) => {
    const created: Category = {
      ...newCat,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [created, ...prev]);
  };

  const handleAddAccount = (newAcc: Omit<BankAccount, 'id'>) => {
    const created: BankAccount = {
      ...newAcc,
      id: `acc-${Date.now()}`
    };
    setAccounts(prev => [...prev, created]);
  };

  const handleAddGoal = (newGoal: Omit<FinancialGoal, 'id'>) => {
    const created: FinancialGoal = {
      ...newGoal,
      id: `g-${Date.now()}`
    };
    setGoals(prev => [created, ...prev]);
  };

  const handleAddCard = (newCard: Omit<CreditCard, 'id'>) => {
    const created: CreditCard = {
      ...newCard,
      id: `card-${Date.now()}`
    };
    setCards(prev => [created, ...prev]);
  };

  const handleAddOCRDoc = (newDoc: OCRDocument) => {
    setOcrDocs(prev => [newDoc, ...prev]);
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const createdTx: Transaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setTransactions(prev => [createdTx, ...prev]);
    setLatestCreatedTransaction(createdTx);

    setAccounts(prevAccounts => {
      return prevAccounts.map(acc => {
        if (acc.bankName.toLowerCase().includes(newTx.account.toLowerCase()) ||
            newTx.account.toLowerCase().includes(acc.bankName.toLowerCase())) {
          return {
            ...acc,
            balance: newTx.type === 'revenue'
              ? acc.balance + newTx.value
              : acc.balance - newTx.value
          };
        }
        return acc;
      });
    });

    setCategories(prevCats => {
      return prevCats.map(cat => {
        if (cat.name.toLowerCase() === newTx.category.toLowerCase()) {
          return {
            ...cat,
            value: cat.value + newTx.value
          };
        }
        return cat;
      });
    });

    setCostCenters(prevCC => {
      return prevCC.map(cc => {
        if (cc.name.toLowerCase() === newTx.costCenter.toLowerCase()) {
          return {
            ...cc,
            value: cc.value + newTx.value
          };
        }
        return cc;
      });
    });

    setGoals(prevGoals => {
      return prevGoals.map(goal => {
        if (newTx.type === 'revenue') {
          if (goal.name.toLowerCase().includes('faturamento')) {
            return { ...goal, currentValue: goal.currentValue + newTx.value };
          }
          if (goal.name.toLowerCase().includes('lucro')) {
            return { ...goal, currentValue: goal.currentValue + (newTx.value * 0.42) };
          }
        } else {
          if (goal.name.toLowerCase().includes('despesa') || goal.name.toLowerCase().includes('reduzir')) {
            return { ...goal, currentValue: goal.currentValue + newTx.value };
          }
        }
        return goal;
      });
    });

    const newNotif: NotificationItem = {
      id: `n-${Date.now()}`,
      title: newTx.type === 'revenue' ? 'Receita Confirmada' : 'Lançamento Efetuado',
      message: `${newTx.description}: R$ ${newTx.value.toLocaleString('pt-BR')} registrado na conta ${newTx.account}.`,
      time: 'Agora mesmo',
      type: newTx.type === 'revenue' ? 'receipt' : 'financial',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    navigateTo('success_screen');
  };

  const handleAddTransactionDirectly = (tx: any) => {
    handleAddTransaction(tx);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-black">
      <div className="flex-1 flex flex-col overflow-y-auto">
        {currentScreen === 'dashboard' && (
          <DashboardScreen
            accounts={accounts}
            transactions={transactions}
            profile={profile}
            onNavigate={(scr) => {
              if (scr === 'notifications') navigateTo('notifications');
              else if (scr === 'profile') navigateTo('profile');
              else if (scr === 'bank_accounts') navigateToSub('bank_accounts', 'bank_accounts');
              else if (scr === 'new_revenue') navigateTo('new_revenue');
              else if (scr === 'new_expense') navigateTo('new_expense');
              else if (scr === 'cash_flow') navigateToSub('cash_flow', 'cash_flow');
            }}
            onOpenFAB={() => setShowFABSheet(true)}
            unreadNotificationsCount={unreadNotificationsCount}
          />
        )}

        {currentScreen === 'new_revenue' && (
          <TransactionForm
            type="revenue"
            categories={categories}
            costCenters={costCenters}
            accounts={accounts}
            onSubmit={handleAddTransaction}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'new_expense' && (
          <TransactionForm
            type="expense"
            categories={categories}
            costCenters={costCenters}
            accounts={accounts}
            onSubmit={handleAddTransaction}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'cash_flow' && (
          <CashFlowAndReports
            initialSubScreen={subScreenKey as any || 'cash_flow'}
            transactions={transactions}
            categories={categories}
            costCenters={costCenters}
            onNavigate={navigateTo}
            onBack={handleBack}
            onAddCategory={handleAddCategory}
          />
        )}

        {currentScreen === 'bank_accounts' && (
          <AssetsAndResources
            initialSubScreen={subScreenKey as any || 'bank_accounts'}
            accounts={accounts}
            cards={cards}
            goals={goals}
            onNavigate={navigateTo}
            onBack={handleBack}
            onAddGoal={handleAddGoal}
            onAddAccount={handleAddAccount}
            onAddCard={handleAddCard}
          />
        )}

        {currentScreen === 'agenda' && (
          <AgendaAndOCR
            initialSubScreen={subScreenKey as any || 'agenda'}
            agendaItems={agenda}
            ocrDocuments={ocrDocs}
            onNavigate={navigateTo}
            onBack={handleBack}
            onAddOCRDocument={handleAddOCRDoc}
            onAddTransactionDirectly={handleAddTransactionDirectly}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileAndSettings
            initialSubScreen={subScreenKey as any || 'profile'}
            profile={profile}
            notifications={notifications}
            onNavigate={navigateTo}
            onBack={handleBack}
            onUpdateProfile={setProfile}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        )}

        {currentScreen === 'more_menu' && (
          <MoreMenuScreen
            onNavigate={navigateTo}
            onNavigateSubScreen={navigateToSub}
            onBack={handleBack}
          />
        )}

        {currentScreen === 'success_screen' && (
          <SuccessScreen
            transaction={latestCreatedTransaction}
            onViewLaunches={() => navigateToSub('cash_flow', 'cash_flow')}
            onNewLaunch={() => {
              setShowFABSheet(true);
              navigateTo('dashboard');
            }}
          />
        )}
      </div>

      {/* Bottom Navigation Tab Bar */}
      <div
        className="absolute bottom-0 inset-x-0 bg-slate-950/95 border-t border-slate-900 px-3 pt-2 flex items-center justify-between z-40 select-none"
        style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={() => {
            setActiveTab('home');
            navigateTo('dashboard');
          }}
          className={`flex-1 flex flex-col items-center py-1 transition ${
            activeTab === 'home' && currentScreen === 'dashboard'
              ? 'text-blue-500'
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[9px] font-bold mt-1">Inicio</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('financial');
            navigateToSub('bank_accounts', 'bank_accounts');
          }}
          className={`flex-1 flex flex-col items-center py-1 transition ${
            activeTab === 'financial' && ['bank_accounts', 'credit_cards', 'goals', 'resources'].includes(currentScreen)
              ? 'text-blue-500'
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[9px] font-bold mt-1">Financeiro</span>
        </button>

        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={() => {
              setActiveTab('more');
              navigateTo('more_menu');
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition duration-200 active:scale-95 border-4 border-slate-950 relative z-50 ${
              activeTab === 'more' && currentScreen === 'more_menu'
                ? 'bg-blue-600 text-white shadow-glow-blue'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            <Plus className="w-6 h-6 stroke-[3.5]" />
          </button>
        </div>

        <button
          onClick={() => {
            setActiveTab('reports');
            navigateToSub('cash_flow', 'reports');
          }}
          className={`flex-1 flex flex-col items-center py-1 transition ${
            activeTab === 'reports' && currentScreen === 'cash_flow' && subScreenKey === 'reports'
              ? 'text-blue-500'
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
          <span className="text-[9px] font-bold mt-1">Relatorios</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('settings');
            navigateToSub('profile', 'settings');
          }}
          className={`flex-1 flex flex-col items-center py-1 transition ${
            activeTab === 'settings' && currentScreen === 'profile' && subScreenKey === 'settings'
              ? 'text-blue-500'
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <SettingsIcon className="w-5 h-5" />
          <span className="text-[9px] font-bold mt-1">Ajustes</span>
        </button>
      </div>

      {/* FAB Overlay Bottom Sheet */}
      <AnimatePresence>
        {showFABSheet && (
          <div className="absolute inset-0 z-50 flex flex-col justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFABSheet(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 pb-8 relative z-50 text-left space-y-4 shadow-2xl max-w-[412px] mx-auto w-full"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-800/60">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">REGISTROS</span>
                  <h4 className="font-bold font-display text-sm text-white">Adicionar Lancamento</h4>
                </div>
                <button
                  onClick={() => setShowFABSheet(false)}
                  className="p-1.5 rounded-full bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 pt-1.5">
                {[
                  {
                    label: 'Nova receita',
                    desc: 'Registrar entrada de capital',
                    icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
                    action: () => navigateTo('new_revenue')
                  },
                  {
                    label: 'Nova despesa',
                    desc: 'Lancar saida ou custo operacional',
                    icon: <TrendingDown className="w-5 h-5 text-rose-400" />,
                    action: () => navigateTo('new_expense')
                  },
                  {
                    label: 'Transferencia',
                    desc: 'Movimentar saldos entre contas',
                    icon: <RefreshCw className="w-5 h-5 text-blue-400" />,
                    action: () => {
                      alert('Transferencia Bancaria PJ simulada com sucesso!');
                      setShowFABSheet(false);
                    }
                  },
                  {
                    label: 'Lancamento recorrente',
                    desc: 'Configurar cobranca mensal fixa',
                    icon: <Clock className="w-5 h-5 text-[#8E6E9F]" />,
                    action: () => {
                      alert('Lancamento recorrente corporativo simulado!');
                      setShowFABSheet(false);
                    }
                  },
                  {
                    label: 'Digitalizar comprovante',
                    desc: 'Extracao inteligente por camera OCR',
                    icon: <Camera className="w-5 h-5 text-cyan-400" />,
                    action: () => navigateToSub('agenda', 'ocr_scanner')
                  }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={item.action}
                    className="w-full p-3.5 bg-slate-950 hover:bg-slate-850/80 rounded-2xl flex items-center justify-between border border-slate-850 transition duration-150 text-left active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
                        {item.icon}
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-white">{item.label}</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{item.desc}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-600" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowFABSheet(false)}
                className="w-full py-3 rounded-xl bg-slate-950 border border-slate-850 text-slate-400 hover:text-slate-200 font-semibold text-xs text-center transition"
              >
                Cancelar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  FileSpreadsheet, 
  FileDown, 
  ChevronRight, 
  Share2, 
  Calendar, 
  Tag, 
  PieChart, 
  BarChart3, 
  ListFilter,
  DollarSign,
  Plus
} from 'lucide-react';
import { Transaction, Category, CostCenter } from '../types';
import { getIconComponent } from './DashboardScreen';

interface CashFlowAndReportsProps {
  initialSubScreen: 'cash_flow' | 'reports' | 'analytical_dashboard' | 'categories' | 'cost_centers';
  transactions: Transaction[];
  categories: Category[];
  costCenters: CostCenter[];
  onNavigate: (screen: any) => void;
  onBack: () => void;
  onAddCategory?: (cat: Omit<Category, 'id'>) => void;
}

export default function CashFlowAndReports({
  initialSubScreen,
  transactions,
  categories,
  costCenters,
  onNavigate,
  onBack,
  onAddCategory
}: CashFlowAndReportsProps) {
  const [subScreen, setSubScreen] = useState<'cash_flow' | 'reports' | 'analytical_dashboard' | 'categories' | 'cost_centers'>(initialSubScreen);
  const [timeFilter, setTimeFilter] = useState<'Hoje' | 'Semana' | 'Mês' | 'Ano'>('Mês');
  
  // Category Form Overlay state
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'revenue' | 'expense'>('expense');
  const [newCatColor, setNewCatColor] = useState('#5B7FA8');
  const [newCatIcon, setNewCatIcon] = useState('Folder');

  // PDF / Excel simulation state
  const [exportingType, setExportingType] = useState<string | null>(null);

  // Math helpers
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const handleExport = (type: 'pdf' | 'excel', docName: string) => {
    setExportingType(`${type}-${docName}`);
    setTimeout(() => {
      setExportingType(null);
      alert(`${type.toUpperCase()} do relatório "${docName}" exportado com sucesso!`);
    }, 1500);
  };

  const submitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    if (onAddCategory) {
      onAddCategory({
        name: newCatName,
        type: newCatType,
        icon: newCatIcon,
        color: newCatColor,
        value: 0
      });
      setNewCatName('');
      setShowAddCat(false);
    }
  };

  // Calculations
  const revenuesTotal = transactions
    .filter(tx => tx.type === 'revenue')
    .reduce((acc, tx) => acc + tx.value, 0);

  const expensesTotal = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => acc + tx.value, 0);

  const netBalance = revenuesTotal - expensesTotal;

  return (
    <div className="flex-1 flex flex-col bg-black text-white pb-24">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900 bg-slate-950/80 sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-bold font-display uppercase tracking-widest text-slate-200">
          {subScreen === 'cash_flow' && 'Fluxo de Caixa'}
          {subScreen === 'reports' && 'Relatórios Corporativos'}
          {subScreen === 'analytical_dashboard' && 'Painel Analítico'}
          {subScreen === 'categories' && 'Categorias'}
          {subScreen === 'cost_centers' && 'Centros de Custo'}
        </h2>
        <div className="w-8"></div>
      </div>

      {/* Internal Menu Tabs */}
      <div className="flex gap-2 px-5 py-3 overflow-x-auto scrollbar-none border-b border-slate-900/60 bg-slate-950/30">
        {[
          { id: 'cash_flow', label: 'Fluxo' },
          { id: 'reports', label: 'Relatórios' },
          { id: 'analytical_dashboard', label: 'Analítico' },
          { id: 'categories', label: 'Categorias' },
          { id: 'cost_centers', label: 'Custos' }
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
        {/* 1. FLUXO DE CAIXA                       */}
        {/* ======================================= */}
        {subScreen === 'cash_flow' && (
          <div className="p-5 space-y-5">
            {/* Time Filter Tabs */}
            <div className="flex bg-slate-950/80 border border-slate-900 rounded-xl p-1 gap-1">
              {(['Hoje', 'Semana', 'Mês', 'Ano'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold transition active:scale-98 ${
                    timeFilter === filter 
                      ? 'bg-slate-800 text-white font-bold' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Inflow / Outflow metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/80 border border-slate-800/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Entradas</span>
                </div>
                <div className="font-mono text-base font-bold text-emerald-400">
                  {formatCurrency(revenuesTotal)}
                </div>
              </div>
              <div className="p-4 bg-slate-900/80 border border-slate-800/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-rose-400 mb-1">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Saídas</span>
                </div>
                <div className="font-mono text-base font-bold text-rose-400">
                  {formatCurrency(expensesTotal)}
                </div>
              </div>
            </div>

            {/* Total balance for period */}
            <div className="p-4 bg-gradient-to-r from-blue-950/40 to-slate-900 border border-slate-800/80 rounded-xl">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Saldo Liquido Período</span>
              <div className="flex items-center justify-between mt-1">
                <span className={`font-mono text-lg font-bold ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(netBalance)}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Balanço do {timeFilter}</span>
              </div>
            </div>

            {/* Animated Double-bar Visualizer */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center text-xs text-slate-400 mb-3 font-semibold">
                <span>Distribuição Histórica</span>
                <span className="text-blue-400 font-mono">Simulação</span>
              </div>
              {/* Daily/Weekly visual columns */}
              <div className="h-32 flex items-end justify-between gap-2.5 px-2 pt-2">
                {[
                  { label: '01', revenue: 30, expense: 15 },
                  { label: '05', revenue: 45, expense: 35 },
                  { label: '10', revenue: 20, expense: 45 },
                  { label: '15', revenue: 80, expense: 25 },
                  { label: '20', revenue: 55, expense: 60 },
                  { label: '25', revenue: 35, expense: 20 },
                  { label: '30', revenue: 65, expense: 10 }
                ].map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                    <div className="w-full flex justify-center items-end gap-1 h-24">
                      {/* Revenue Bar */}
                      <div 
                        className="w-2 rounded-t bg-emerald-500 shadow-glow-green transition-all duration-500" 
                        style={{ height: `${item.revenue}%` }}
                      ></div>
                      {/* Expense Bar */}
                      <div 
                        className="w-2 rounded-t bg-rose-500 shadow-glow-red transition-all duration-500" 
                        style={{ height: `${item.expense}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Table */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-white">Lançamentos Detalhados</span>
                <span className="text-[10px] text-slate-400 font-mono">{transactions.length} registros</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/30">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                      <th className="p-3">Data</th>
                      <th className="p-3">Descrição</th>
                      <th className="p-3 text-right">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-900/40 transition">
                        <td className="p-3 text-slate-400 whitespace-nowrap">
                          {new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </td>
                        <td className="p-3">
                          <p className="text-white font-semibold">{tx.description}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 leading-none">{tx.category}</p>
                        </td>
                        <td className={`p-3 text-right font-mono font-bold ${
                          tx.type === 'revenue' ? 'text-emerald-400' : 'text-slate-300'
                        }`}>
                          {tx.type === 'revenue' ? '+' : '-'} {formatCurrency(tx.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 2. RELATÓRIOS                           */}
        {/* ======================================= */}
        {subScreen === 'reports' && (
          <div className="p-5 space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              Consulte e exporte os demonstrativos corporativos da sua empresa em formato PDF ou planilha Excel.
            </p>

            <div className="space-y-3 pt-2">
              {[
                { name: 'Relatório Geral de Receitas', desc: 'Demonstrativo consolidado de todas as entradas.', icon: <TrendingUp className="text-emerald-400" /> },
                { name: 'Relatório Geral de Despesas', desc: 'Detalhamento de saídas, fornecedores e contas.', icon: <TrendingDown className="text-rose-400" /> },
                { name: 'Fluxo de Caixa Mensal', desc: 'Série histórica do saldo operacional de caixa.', icon: <BarChart3 className="text-blue-400" /> },
                { name: 'Demonstrativo por Categoria', desc: 'Movimentações agrupadas por categorias de contas.', icon: <Tag className="text-amber-400" /> },
                { name: 'Demonstrativo por Centro de Custos', desc: 'Análise de gastos de departamentos corporativos.', icon: <PieChart className="text-purple-400" /> },
                { name: 'Balanço Comparativo Trimestral', desc: 'Performance financeira contra períodos passados.', icon: <FileSpreadsheet className="text-cyan-400" /> }
              ].map((report, i) => (
                <div key={i} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3 hover:bg-slate-900 transition">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                      {report.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{report.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">{report.desc}</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-2 border-t border-slate-800/40">
                    <button
                      onClick={() => handleExport('pdf', report.name)}
                      disabled={exportingType !== null}
                      className="flex-1 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50"
                    >
                      <FileDown className="w-3.5 h-3.5 text-red-400" />
                      {exportingType === `pdf-${report.name}` ? 'Exportando...' : 'Exportar PDF'}
                    </button>
                    <button
                      onClick={() => handleExport('excel', report.name)}
                      disabled={exportingType !== null}
                      className="flex-1 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold text-slate-300 flex items-center justify-center gap-1.5 transition active:scale-95 disabled:opacity-50"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                      {exportingType === `excel-${report.name}` ? 'Exportando...' : 'Excel (XLS)'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 3. DASHBOARD ANALÍTICO                  */}
        {/* ======================================= */}
        {subScreen === 'analytical_dashboard' && (
          <div className="p-5 space-y-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-left">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Margem de Lucro</span>
                <span className="font-mono text-lg font-bold text-emerald-400 block mt-1">42.6%</span>
                <span className="text-[9px] text-slate-500 block mt-1">+2.4% vs prevendo</span>
              </div>
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-left">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">Receita Média</span>
                <span className="font-mono text-lg font-bold text-blue-400 block mt-1">R$ 8,3k</span>
                <span className="text-[9px] text-slate-500 block mt-1">Ticket médio por transação</span>
              </div>
            </div>

            {/* Custom Pie Chart Visualizer (SVG) */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <h4 className="text-xs font-bold text-white mb-4">Composição de Receitas por Categoria</h4>
              <div className="flex items-center gap-5">
                {/* SVG Pie Chart */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    {/* Background Circle */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#232837" strokeWidth="3" />
                    {/* Slice 1 (Venda de produtos: 60%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2F9E7C" strokeWidth="3" strokeDasharray="60 40" strokeDashoffset="0" />
                    {/* Slice 2 (Serviços: 35%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#C9A961" strokeWidth="3" strokeDasharray="35 65" strokeDashoffset="-60" />
                    {/* Slice 3 (Rendimentos: 5%) */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#5B7FA8" strokeWidth="3" strokeDasharray="5 95" strokeDashoffset="-95" />
                  </svg>
                  <div className="absolute font-mono text-[10px] font-bold text-white">60%</div>
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span className="w-2.5 h-2.5 rounded bg-[#2F9E7C]"></span>
                      <span className="text-white">Venda de produtos</span>
                    </div>
                    <span className="font-mono text-[10px] font-medium">60%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span className="w-2.5 h-2.5 rounded bg-[#C9A961]"></span>
                      <span className="text-white">Serviços</span>
                    </div>
                    <span className="font-mono text-[10px] font-medium">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <span className="w-2.5 h-2.5 rounded bg-[#5B7FA8]"></span>
                      <span className="text-white">Rendimentos</span>
                    </div>
                    <span className="font-mono text-[10px] font-medium">5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Custom Horizontal Bar Chart for Expenditures */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
              <h4 className="text-xs font-bold text-white">Top Maiores Despesas</h4>
              
              <div className="space-y-3">
                {[
                  { name: 'Salários', val: 12000.00, pct: 60, color: 'bg-emerald-500' },
                  { name: 'Marketing', val: 3500.00, pct: 25, color: 'bg-[#5B7FA8]' },
                  { name: 'Serviços de Escritório', val: 2780.00, pct: 15, color: 'bg-purple-500' }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-300">
                      <span>{item.name}</span>
                      <span className="font-mono">{formatCurrency(item.val)} ({item.pct}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 4. CATEGORIAS                           */}
        {/* ======================================= */}
        {subScreen === 'categories' && (
          <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-slate-400">Gerencie o plano de contas e cores por categoria.</p>
              <button
                onClick={() => setShowAddCat(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-[11px] font-bold text-white flex items-center gap-1 transition active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Nova Categoria
              </button>
            </div>

            {/* Add Category Overlay Form */}
            {showAddCat && (
              <form onSubmit={submitCategory} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Criar Categoria</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Nome</label>
                    <input
                      type="text"
                      placeholder="Ex: Softwares"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Tipo</label>
                    <select
                      value={newCatType}
                      onChange={(e) => setNewCatType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    >
                      <option value="expense">Despesa</option>
                      <option value="revenue">Receita</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Cor</label>
                    <select
                      value={newCatColor}
                      onChange={(e) => setNewCatColor(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    >
                      <option value="#A6484A">Vermelho</option>
                      <option value="#C9A961">Dourado</option>
                      <option value="#5B7FA8">Azul</option>
                      <option value="#2F9E7C">Verde</option>
                      <option value="#8E6E9F">Roxo</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-slate-500 uppercase">Ícone</label>
                    <select
                      value={newCatIcon}
                      onChange={(e) => setNewCatIcon(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs focus:outline-none"
                    >
                      <option value="Folder">Pasta (Padrão)</option>
                      <option value="Laptop">Tecnologia</option>
                      <option value="Utensils">Alimentação</option>
                      <option value="Car">Transporte</option>
                      <option value="Megaphone">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-1 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddCat(false)}
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

            <div className="space-y-2">
              {categories.map((cat) => (
                <div 
                  key={cat.id} 
                  className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg border text-white"
                      style={{ 
                        backgroundColor: `${cat.color}15`, 
                        borderColor: `${cat.color}30`,
                        color: cat.color
                      }}
                    >
                      {getIconComponent(cat.icon, "w-4.5 h-4.5")}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        cat.type === 'revenue' 
                          ? 'bg-emerald-500/10 text-emerald-400' 
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {cat.type === 'revenue' ? 'Receita' : 'Despesa'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-slate-300">
                      {formatCurrency(cat.value)}
                    </span>
                    <p className="text-[9px] text-slate-500 mt-0.5 leading-none">Total acumulado</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/* 5. CENTROS DE CUSTO                     */}
        {/* ======================================= */}
        {subScreen === 'cost_centers' && (
          <div className="p-5 space-y-4">
            <p className="text-xs text-slate-400">Distribuição orçamentária por departamento da corporação.</p>

            <div className="grid grid-cols-2 gap-3.5 pt-1">
              {costCenters.map((cc) => (
                <div 
                  key={cc.id} 
                  className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl relative overflow-hidden text-left hover:bg-slate-900 transition cursor-pointer"
                >
                  {/* Subtle vertical bar accent */}
                  <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: cc.color }}></div>

                  <h4 className="text-xs font-bold text-white truncate">{cc.name}</h4>
                  <div className="font-mono text-sm font-bold text-slate-300 mt-2">
                    {formatCurrency(cc.value)}
                  </div>

                  {/* Progress bar info */}
                  <div className="mt-3.5 space-y-1">
                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-bold font-mono">
                      <span>ORÇAMENTO</span>
                      <span>{cc.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${cc.percentage}%`, backgroundColor: cc.color }}
                      ></div>
                    </div>
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

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DollarSign, ArrowUpRight, ArrowDownRight, Plus, CheckCircle, Clock, Receipt, Building2, Calendar } from 'lucide-react';
import { getLancamentos, Lancamento } from '../services/lancamentoService';
import { fornecedores, contratos } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#22C55E', '#EF4444', '#6366F1', '#F59E0B', '#06B6D4', '#EC4899', '#8B5CF6', '#FB923C'];

const Financeiro: React.FC = () => {
  const { darkMode } = useApp();
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [tab, setTab] = useState<'despesas' | 'receitas' | 'categorias' | 'fornecedores' | 'contratos'>('despesas');

  useEffect(() => { setLancamentos(getLancamentos()); }, []);

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const tooltipFmt = (value: unknown) => typeof value === 'number' ? fmt(value) : String(value);

  const despesas = lancamentos.filter(l => l.tipo === 'despesa');
  const receitas = lancamentos.filter(l => l.tipo === 'receita');
  const totalReceitas = receitas.reduce((s, l) => s + l.valor, 0);
  const totalDespesas = despesas.reduce((s, l) => s + l.valor, 0);
  const recebidas = receitas.filter(l => l.status === 'recebido').length;
  const pagas = despesas.filter(l => l.status === 'pago').length;
  const aVencer = despesas.filter(l => l.status === 'pendente').reduce((s, l) => s + l.valor, 0);
  const pendentes = despesas.filter(l => l.status === 'pendente').length;

  const catMap = new Map<string, { gasto: number; orcamento: number }>();
  despesas.forEach(l => {
    if (!catMap.has(l.categoria)) catMap.set(l.categoria, { gasto: 0, orcamento: 0 });
    catMap.get(l.categoria)!.gasto += l.valor;
  });
  const catData = Array.from(catMap.entries()).map(([name, data], i) => ({
    name, orcamento: Math.round(data.gasto * 1.3), gasto: data.gasto, cor: COLORS[i % COLORS.length],
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <DollarSign size={24} className="text-emerald-400" /> Gestão Financeira
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Controle completo das finanças da empresa</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
        <div className={`rounded-2xl p-5 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10"><ArrowUpRight size={16} className="text-emerald-400" /></div>
            <span className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Receitas</span>
          </div>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(totalReceitas)}</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{recebidas} recebidas / {receitas.length} total</p>
        </div>
        <div className={`rounded-2xl p-5 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-red-500/10"><ArrowDownRight size={16} className="text-red-400" /></div>
            <span className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Despesas</span>
          </div>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(totalDespesas)}</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{pagas} pagas / {despesas.length} total</p>
        </div>
        <div className={`rounded-2xl p-5 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-athos-500/10"><DollarSign size={16} className="text-athos-400" /></div>
            <span className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Saldo</span>
          </div>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(totalReceitas - totalDespesas)}</p>
          <p className={`text-xs mt-1 text-emerald-400`}>Margem: {totalReceitas > 0 ? ((totalReceitas - totalDespesas) / totalReceitas * 100).toFixed(1) : '0.0'}%</p>
        </div>
        <div className={`rounded-2xl p-5 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-amber-500/10"><Clock size={16} className="text-amber-400" /></div>
            <span className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>A Vencer</span>
          </div>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(aVencer)}</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{pendentes} contas pendentes</p>
        </div>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className={`flex border-b overflow-x-auto ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
          {[
            { id: 'despesas' as const, label: 'Contas a Pagar', icon: ArrowDownRight },
            { id: 'receitas' as const, label: 'Contas a Receber', icon: ArrowUpRight },
            { id: 'categorias' as const, label: 'Categorias', icon: Receipt },
            { id: 'fornecedores' as const, label: 'Fornecedores', icon: Building2 },
            { id: 'contratos' as const, label: 'Contratos', icon: Calendar },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              tab === t.id ? 'border-athos-500 text-athos-400' : `border-transparent ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`
            }`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'despesas' && (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-3 mb-2">
                {['Descrição', 'Valor', 'Categoria', 'Fornecedor', 'Vencimento', 'Status', ''].map((h, i) => (
                  <div key={i} className={`text-[10px] font-semibold uppercase tracking-wider ${i === 0 ? 'col-span-3' : i === 1 || i === 5 || i === 6 ? 'col-span-1' : 'col-span-2'} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{h}</div>
                ))}
              </div>
              {despesas.map(l => (
                <div key={l.id} className={`grid grid-cols-12 gap-3 items-center p-3 rounded-xl transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                  <div className={`col-span-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{l.descricao}</div>
                  <div className={`col-span-1 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(l.valor)}</div>
                  <div className="col-span-2"><span className={`text-xs px-2 py-1 rounded-lg ${darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{l.categoria}</span></div>
                  <div className={`col-span-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{l.contraparte}</div>
                  <div className={`col-span-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{l.vencimento}</div>
                  <div className="col-span-1">
                    {l.status === 'pago' ? <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle size={12} /> Pago</span> : l.status === 'atrasado' ? <span className="flex items-center gap-1 text-xs text-red-400"><Clock size={12} /> Atrasado</span> : <span className="flex items-center gap-1 text-xs text-amber-400"><Clock size={12} /> Pendente</span>}
                  </div>
                  <div className="col-span-1" />
                </div>
              ))}
              {despesas.length === 0 && <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma despesa lançada.</p>}
            </div>
          )}

          {tab === 'receitas' && (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-3 mb-2">
                {['Descrição', 'Valor', 'Cliente', 'Categoria', 'Vencimento', 'Status', ''].map((h, i) => (
                  <div key={i} className={`text-[10px] font-semibold uppercase tracking-wider ${i === 0 ? 'col-span-3' : i === 1 || i === 5 || i === 6 ? 'col-span-1' : 'col-span-2'} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{h}</div>
                ))}
              </div>
              {receitas.map(l => (
                <div key={l.id} className={`grid grid-cols-12 gap-3 items-center p-3 rounded-xl transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                  <div className={`col-span-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{l.descricao}</div>
                  <div className="col-span-1 text-sm font-bold text-emerald-400">{fmt(l.valor)}</div>
                  <div className={`col-span-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{l.contraparte}</div>
                  <div className="col-span-2"><span className={`text-xs px-2 py-1 rounded-lg ${darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{l.categoria}</span></div>
                  <div className={`col-span-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{l.vencimento}</div>
                  <div className="col-span-1">
                    {l.status === 'recebido' ? <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle size={12} /> Recebido</span> : l.status === 'atrasado' ? <span className="flex items-center gap-1 text-xs text-red-400"><Clock size={12} /> Atrasado</span> : <span className="flex items-center gap-1 text-xs text-amber-400"><Clock size={12} /> Pendente</span>}
                  </div>
                  <div className="col-span-1" />
                </div>
              ))}
              {receitas.length === 0 && <p className={`text-sm text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma receita lançada.</p>}
            </div>
          )}

          {tab === 'categorias' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Gastos por Categoria</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={catData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                    <XAxis tick={{ fill: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <YAxis dataKey="name" tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 11 }} width={100} />
                    <RTooltip formatter={tooltipFmt} contentStyle={{ background: darkMode ? '#111827' : '#fff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '8px' }} />
                    <Bar dataKey="gasto" name="Gasto" radius={[0, 4, 4, 0]}>
                      {catData.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Detalhamento</h4>
                {catData.map((cat, i) => {
                  const pct = cat.orcamento > 0 ? Math.min((cat.gasto / cat.orcamento) * 100, 100) : 100;
                  const over = cat.gasto > cat.orcamento;
                  return (
                    <div key={i} className={`p-4 rounded-xl border ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.cor }} />
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cat.name}</span>
                        </div>
                        <span className={`text-xs font-medium ${over ? 'text-red-400' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{pct.toFixed(0)}%</span>
                      </div>
                      <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                        <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: over ? '#EF4444' : cat.cor }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{fmt(cat.gasto)} gasto</span>
                        <span className={`text-[11px] ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{fmt(cat.orcamento)} orçamento</span>
                      </div>
                    </div>
                  );
                })}
                {catData.length === 0 && <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nenhuma categoria de despesa.</p>}
              </div>
            </div>
          )}

          {tab === 'fornecedores' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fornecedores.map(f => (
                <div key={f.id} className={`p-5 rounded-xl border transition-all hover:scale-[1.01] ${darkMode ? 'bg-gray-900/50 border-white/5 hover:border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl gradient-athos flex items-center justify-center text-white text-sm font-bold">{f.nome.charAt(0)}</div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${f.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>{f.status.toUpperCase()}</span>
                  </div>
                  <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{f.nome}</h4>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{f.cnpj}</p>
                  <div className={`mt-3 pt-3 border-t ${darkMode ? 'border-white/5' : 'border-gray-200'}`}>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contato: {f.contato}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{f.email}</p>
                    <p className={`text-xs font-semibold mt-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mensal: {fmt(f.valorMensal)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'contratos' && (
            <div className="space-y-3">
              {contratos.map(c => (
                <div key={c.id} className={`flex items-center justify-between p-4 rounded-xl border ${darkMode ? 'border-white/5 hover:border-white/10' : 'border-gray-200 hover:border-gray-300'} transition-all`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{c.titulo}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{c.fornecedor} • {c.inicio} até {c.fim}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(c.valor)}/mês</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${c.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>{c.status}</span>
                    {c.renovacaoAutomatica && <span className="text-[10px] text-athos-400">Auto</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Financeiro;

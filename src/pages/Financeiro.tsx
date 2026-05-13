import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DollarSign, ArrowUpRight, ArrowDownRight, Plus, CheckCircle, Clock, Receipt, Building2, Calendar } from 'lucide-react';
import { despesas, receitas, categorias, fornecedores, contratos } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Cell } from 'recharts';

const Financeiro: React.FC = () => {
  const { darkMode } = useApp();
  const [tab, setTab] = useState<'despesas' | 'receitas' | 'categorias' | 'fornecedores' | 'contratos'>('despesas');

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  const tooltipFmt = (value: unknown) => typeof value === 'number' ? fmt(value) : String(value);

  const catData = categorias.filter(c => c.tipo === 'despesa').map(c => ({
    name: c.nome, orcamento: c.orcamento, gasto: despesas.filter(d => d.categoria === c.nome).reduce((s, d) => s + d.valor, 0), cor: c.cor
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <DollarSign size={24} className="text-emerald-400" /> Gestão Financeira
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Controle completo das finanças da empresa</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-athos text-white text-sm font-medium shadow-glow hover:shadow-lg transition-all">
          <Plus size={14} /> Nova Transação
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
        <div className={`rounded-2xl p-5 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10"><ArrowUpRight size={16} className="text-emerald-400" /></div>
            <span className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Receitas</span>
          </div>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(receitas.reduce((s, r) => s + r.valor, 0))}</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{receitas.filter(r => r.recebido).length} recebidas / {receitas.length} total</p>
        </div>
        <div className={`rounded-2xl p-5 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-red-500/10"><ArrowDownRight size={16} className="text-red-400" /></div>
            <span className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Despesas</span>
          </div>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(despesas.reduce((s, d) => s + d.valor, 0))}</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{despesas.filter(d => d.pago).length} pagas / {despesas.length} total</p>
        </div>
        <div className={`rounded-2xl p-5 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-athos-500/10"><DollarSign size={16} className="text-athos-400" /></div>
            <span className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Saldo</span>
          </div>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(receitas.reduce((s, r) => s + r.valor, 0) - despesas.reduce((s, d) => s + d.valor, 0))}</p>
          <p className={`text-xs mt-1 text-emerald-400`}>Margem: {((receitas.reduce((s, r) => s + r.valor, 0) - despesas.reduce((s, d) => s + d.valor, 0)) / receitas.reduce((s, r) => s + r.valor, 0) * 100).toFixed(1)}%</p>
        </div>
        <div className={`rounded-2xl p-5 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-amber-500/10"><Clock size={16} className="text-amber-400" /></div>
            <span className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>A Vencer</span>
          </div>
          <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(despesas.filter(d => !d.pago).reduce((s, d) => s + d.valor, 0))}</p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{despesas.filter(d => !d.pago).length} contas pendentes</p>
        </div>
      </div>

      {/* Tabs */}
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
              tab === t.id
                ? 'border-athos-500 text-athos-400'
                : `border-transparent ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`
            }`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Despesas */}
          {tab === 'despesas' && (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-3 mb-2">
                {['Descrição', 'Valor', 'Categoria', 'Fornecedor', 'Vencimento', 'Status', ''].map((h, i) => (
                  <div key={i} className={`text-[10px] font-semibold uppercase tracking-wider ${i === 0 ? 'col-span-3' : i === 1 || i === 5 || i === 6 ? 'col-span-1' : 'col-span-2'} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{h}</div>
                ))}
              </div>
              {despesas.map(d => (
                <div key={d.id} className={`grid grid-cols-12 gap-3 items-center p-3 rounded-xl transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                  <div className={`col-span-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} ${d.anormal ? 'text-amber-400' : ''}`}>
                    {d.descricao} {d.anormal && <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded ml-1">⚠ Anormal</span>}
                    {d.recorrente && <span className={`text-[10px] ml-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>🔄 Recorrente</span>}
                  </div>
                  <div className={`col-span-1 text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{fmt(d.valor)}</div>
                  <div className="col-span-2"><span className={`text-xs px-2 py-1 rounded-lg ${darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{d.categoria}</span></div>
                  <div className={`col-span-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{d.fornecedor}</div>
                  <div className={`col-span-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{d.vencimento}</div>
                  <div className="col-span-1">
                    {d.pago ? <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle size={12} /> Pago</span> : <span className="flex items-center gap-1 text-xs text-amber-400"><Clock size={12} /> Pendente</span>}
                  </div>
                  <div className="col-span-1">
                    <button className="text-xs text-athos-400 hover:underline">Detalhes</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Receitas */}
          {tab === 'receitas' && (
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-3 mb-2">
                {['Descrição', 'Valor', 'Cliente', 'Categoria', 'Vencimento', 'Status', ''].map((h, i) => (
                  <div key={i} className={`text-[10px] font-semibold uppercase tracking-wider ${i === 0 ? 'col-span-3' : i === 1 || i === 5 || i === 6 ? 'col-span-1' : 'col-span-2'} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{h}</div>
                ))}
              </div>
              {receitas.map(r => (
                <div key={r.id} className={`grid grid-cols-12 gap-3 items-center p-3 rounded-xl transition-all ${darkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                  <div className={`col-span-3 text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{r.descricao} {r.recorrente && <span className={`text-[10px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>🔄 Recorrente</span>}</div>
                  <div className="col-span-1 text-sm font-bold text-emerald-400">{fmt(r.valor)}</div>
                  <div className={`col-span-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{r.cliente}</div>
                  <div className="col-span-2"><span className={`text-xs px-2 py-1 rounded-lg ${darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{r.categoria}</span></div>
                  <div className={`col-span-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{r.vencimento}</div>
                  <div className="col-span-1">
                    {r.recebido ? <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle size={12} /> Recebido</span> : <span className="flex items-center gap-1 text-xs text-amber-400"><Clock size={12} /> Pendente</span>}
                  </div>
                  <div className="col-span-1"><button className="text-xs text-athos-400 hover:underline">Detalhes</button></div>
                </div>
              ))}
            </div>
          )}

          {/* Categorias */}
          {tab === 'categorias' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Orçamento por Categoria</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={catData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                    <XAxis tick={{ fill: darkMode ? '#6B7280' : '#9CA3AF', fontSize: 10 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <YAxis dataKey="name" tick={{ fill: darkMode ? '#9CA3AF' : '#6B7280', fontSize: 11 }} width={100} />
                    <RTooltip formatter={tooltipFmt} contentStyle={{ background: darkMode ? '#111827' : '#fff', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, borderRadius: '8px' }} />
                    <Bar dataKey="orcamento" name="Orçamento" fill="#6366F1" radius={[0, 4, 4, 0]} opacity={0.3} />
                    <Bar dataKey="gasto" name="Gasto" radius={[0, 4, 4, 0]}>
                      {catData.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <h4 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Detalhamento</h4>
                {catData.map((cat, i) => {
                  const pct = Math.min((cat.gasto / cat.orcamento) * 100, 100);
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
              </div>
            </div>
          )}

          {/* Fornecedores */}
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

          {/* Contratos */}
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
                    {c.renovacaoAutomatica && <span className="text-[10px] text-athos-400">🔄 Auto</span>}
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

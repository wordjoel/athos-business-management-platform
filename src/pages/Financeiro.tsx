import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, Receipt, Building2, Calendar } from 'lucide-react';
import { getLancamentos, refreshLancamentos, Lancamento } from '../services/lancamentoService';
import { fornecedores, contratos } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#C9A961', '#5B7FA8', '#2F9E7C', '#A6484A', '#8E6E9F', '#B8785A', '#B06E85', '#8B93A6'];
const TOOLTIP_STYLE = { background: '#131722', border: '1px solid #232837', borderRadius: 10, fontSize: '12px', color: '#E9E4D8', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' };
const AXIS_TICK = { fill: '#8B93A6', fontSize: 10 };
const GRID_STROKE = 'rgba(201,169,97,0.08)';

const StatusBadge: React.FC<{ status: Lancamento['status']; kind: 'despesa' | 'receita' }> = ({ status, kind }) => {
  if (status === (kind === 'despesa' ? 'pago' : 'recebido')) {
    return <span className="flex items-center gap-1 text-xs text-[#C9A961]"><CheckCircle size={12} /> {kind === 'despesa' ? 'Pago' : 'Recebido'}</span>;
  }
  if (status === 'atrasado') {
    return <span className="flex items-center gap-1 text-xs text-[#A6484A]"><Clock size={12} /> Atrasado</span>;
  }
  return <span className="flex items-center gap-1 text-xs text-[#5B7FA8]"><Clock size={12} /> Pendente</span>;
};

const Financeiro: React.FC = () => {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [tab, setTab] = useState<'despesas' | 'receitas' | 'categorias' | 'fornecedores' | 'contratos'>('despesas');

  useEffect(() => {
    refreshLancamentos()
      .catch(err => console.error('Falha ao buscar lançamentos no Supabase:', err))
      .finally(() => setLancamentos(getLancamentos()));
  }, []);

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

  const statCards = [
    { icon: ArrowUpRight, label: 'Receitas', value: fmt(totalReceitas), sub: `${recebidas} recebidas / ${receitas.length} total`, color: '#C9A961' },
    { icon: ArrowDownRight, label: 'Despesas', value: fmt(totalDespesas), sub: `${pagas} pagas / ${despesas.length} total`, color: '#A6484A' },
    { icon: DollarSign, label: 'Saldo', value: fmt(totalReceitas - totalDespesas), sub: `Margem: ${totalReceitas > 0 ? ((totalReceitas - totalDespesas) / totalReceitas * 100).toFixed(1) : '0.0'}%`, color: '#C9A961' },
    { icon: Clock, label: 'A Vencer', value: fmt(aVencer), sub: `${pendentes} contas pendentes`, color: '#5B7FA8' },
  ];

  const tabs = [
    { id: 'despesas' as const, label: 'Contas a Pagar', icon: ArrowDownRight },
    { id: 'receitas' as const, label: 'Contas a Receber', icon: ArrowUpRight },
    { id: 'categorias' as const, label: 'Categorias', icon: Receipt },
    { id: 'fornecedores' as const, label: 'Fornecedores', icon: Building2 },
    { id: 'contratos' as const, label: 'Contratos', icon: Calendar },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="module-eyebrow mb-1">Financeiro</p>
          <h1 className="font-display text-3xl text-[#F0E6CC] flex items-center gap-2.5">
            <DollarSign size={24} className="text-[#C9A961]" /> Gestão Financeira
          </h1>
          <p className="text-sm mt-1.5 text-[#8B93A6]">Controle completo das finanças da empresa</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="p-5 rounded-2xl border border-[#232837] bg-[#131722] hover:border-[#C9A961]/40 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-[#1E2430]"><card.icon size={16} style={{ color: card.color }} /></div>
              <span className="text-xs font-medium uppercase tracking-wider text-[#8B93A6]">{card.label}</span>
            </div>
            <p className="font-display text-xl text-[#F0E6CC]">{card.value}</p>
            <p className="text-xs mt-1 text-[#8B93A6]">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-[#232837] bg-[#131722] overflow-hidden">
        <div className="flex border-b border-[#232837] overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
              tab === t.id ? 'border-[#C9A961] text-[#C9A961] bg-[#1E2430]' : 'border-transparent text-[#8B93A6] hover:text-[#C9A961]'
            }`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'despesas' && (
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-3 mb-2 px-3">
                {['Descrição', 'Valor', 'Categoria', 'Fornecedor', 'Vencimento', 'Status'].map((h, i) => (
                  <div key={i} className={`text-[10px] font-semibold uppercase tracking-wider text-[#8B93A6] ${i === 0 ? 'col-span-3' : i === 1 || i === 5 ? 'col-span-2' : 'col-span-2'}`}>{h}</div>
                ))}
              </div>
              {despesas.map(l => (
                <div key={l.id} className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg border-b border-[#232837] transition-all hover:bg-[#12151E]">
                  <div className="col-span-3 text-sm font-medium text-[#E9E4D8]">{l.descricao}</div>
                  <div className="col-span-2 text-sm font-bold text-[#A6484A]">{fmt(l.valor)}</div>
                  <div className="col-span-2"><span className="text-xs px-2 py-1 rounded-full border border-[#2A2F3D] text-[#8B93A6]">{l.categoria}</span></div>
                  <div className="col-span-2 text-xs text-[#8B93A6]">{l.contraparte}</div>
                  <div className="col-span-1 text-xs text-[#8B93A6]">{l.vencimento}</div>
                  <div className="col-span-2"><StatusBadge status={l.status} kind="despesa" /></div>
                </div>
              ))}
              {despesas.length === 0 && <p className="text-sm text-center py-8 text-[#4E5468] italic">Nenhuma despesa lançada.</p>}
            </div>
          )}

          {tab === 'receitas' && (
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-3 mb-2 px-3">
                {['Descrição', 'Valor', 'Cliente', 'Categoria', 'Vencimento', 'Status'].map((h, i) => (
                  <div key={i} className={`text-[10px] font-semibold uppercase tracking-wider text-[#8B93A6] ${i === 0 ? 'col-span-3' : 'col-span-2'}`}>{h}</div>
                ))}
              </div>
              {receitas.map(l => (
                <div key={l.id} className="grid grid-cols-12 gap-3 items-center p-3 rounded-lg border-b border-[#232837] transition-all hover:bg-[#12151E]">
                  <div className="col-span-3 text-sm font-medium text-[#E9E4D8]">{l.descricao}</div>
                  <div className="col-span-2 text-sm font-bold text-[#2F9E7C]">{fmt(l.valor)}</div>
                  <div className="col-span-2 text-xs text-[#8B93A6]">{l.contraparte}</div>
                  <div className="col-span-2"><span className="text-xs px-2 py-1 rounded-full border border-[#2A2F3D] text-[#8B93A6]">{l.categoria}</span></div>
                  <div className="col-span-1 text-xs text-[#8B93A6]">{l.vencimento}</div>
                  <div className="col-span-2"><StatusBadge status={l.status} kind="receita" /></div>
                </div>
              ))}
              {receitas.length === 0 && <p className="text-sm text-center py-8 text-[#4E5468] italic">Nenhuma receita lançada.</p>}
            </div>
          )}

          {tab === 'categorias' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-[13px] font-semibold tracking-[0.06em] uppercase mb-4 text-[#8B93A6]">Gastos por Categoria</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={catData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke={GRID_STROKE} />
                    <XAxis type="number" tick={AXIS_TICK} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                    <YAxis dataKey="name" type="category" tick={AXIS_TICK} width={100} />
                    <RTooltip formatter={tooltipFmt} contentStyle={TOOLTIP_STYLE} />
                    <Bar dataKey="gasto" name="Gasto">
                      {catData.map((entry, i) => <Cell key={i} fill={entry.cor} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                <h4 className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[#8B93A6]">Detalhamento</h4>
                {catData.map((cat, i) => {
                  const pct = cat.orcamento > 0 ? Math.min((cat.gasto / cat.orcamento) * 100, 100) : 100;
                  const over = cat.gasto > cat.orcamento;
                  return (
                    <div key={i} className="p-4 rounded-xl border border-[#232837] bg-[#131722]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.cor }} />
                          <span className="text-sm font-medium text-[#E9E4D8]">{cat.name}</span>
                        </div>
                        <span className={`text-xs font-medium ${over ? 'text-[#A6484A]' : 'text-[#8B93A6]'}`}>{pct.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#232837] overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: over ? '#A6484A' : cat.cor }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[11px] text-[#8B93A6]">{fmt(cat.gasto)} gasto</span>
                        <span className="text-[11px] text-[#8B93A6]">{fmt(cat.orcamento)} orçamento</span>
                      </div>
                    </div>
                  );
                })}
                {catData.length === 0 && <p className="text-sm text-[#4E5468] italic">Nenhuma categoria de despesa.</p>}
              </div>
            </div>
          )}

          {tab === 'fornecedores' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fornecedores.map(f => (
                <div key={f.id} className="p-5 rounded-2xl border border-[#232837] bg-[#131722] hover:border-[#C9A961]/40 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#0B0E14] text-sm font-bold" style={{ background: 'linear-gradient(135deg, #E0C583 0%, #C9A961 55%, #A98A47 100%)' }}>{f.nome.charAt(0)}</div>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${f.status === 'ativo' ? 'border-[#2F9E7C]/50 text-[#2F9E7C]' : 'border-[#2A2F3D] text-[#4E5468]'}`}>{f.status.toUpperCase()}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#F0E6CC]">{f.nome}</h4>
                  <p className="text-xs mt-1 text-[#8B93A6]">{f.cnpj}</p>
                  <div className="mt-3 pt-3 border-t border-[#232837]">
                    <p className="text-xs text-[#8B93A6]">Contato: {f.contato}</p>
                    <p className="text-xs text-[#8B93A6]">{f.email}</p>
                    <p className="text-xs font-semibold mt-2 text-[#C9A961]">Mensal: {fmt(f.valorMensal)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'contratos' && (
            <div className="space-y-2">
              {contratos.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 rounded-xl border border-[#232837] bg-[#131722] hover:border-[#C9A961]/40 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${c.status === 'ativo' ? 'bg-[#1E2430] text-[#C9A961]' : 'bg-[#1a1d26] text-[#4E5468]'}`}>
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#F0E6CC]">{c.titulo}</p>
                      <p className="text-xs text-[#8B93A6]">{c.fornecedor} • {c.inicio} até {c.fim}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[#C9A961]">{fmt(c.valor)}/mês</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${c.status === 'ativo' ? 'border-[#2F9E7C]/50 text-[#2F9E7C]' : 'border-[#2A2F3D] text-[#4E5468]'}`}>{c.status}</span>
                    {c.renovacaoAutomatica && <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#5B7FA8]/15 text-[#5B7FA8]">Auto</span>}
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

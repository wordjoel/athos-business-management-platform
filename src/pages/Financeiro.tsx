import React, { useState, useEffect } from 'react';
import { DollarSign, ArrowUpRight, ArrowDownRight, CheckCircle, Clock, Receipt, Building2, Calendar } from 'lucide-react';
import { getLancamentos, refreshLancamentos, Lancamento } from '../services/lancamentoService';
import { fornecedores, contratos } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#33ff00', '#ffb000', '#5ecf7f', '#8fe6a8', '#1f9900', '#3f9e5c', '#ff3333', '#c9f7d6'];
const TOOLTIP_STYLE = { background: '#0a0a0a', border: '1px solid #1f521f', borderRadius: 0, fontSize: '12px', color: '#33ff00' };
const AXIS_TICK = { fill: '#3f9e5c', fontSize: 10 };
const GRID_STROKE = 'rgba(51,255,0,0.08)';

const StatusBadge: React.FC<{ status: Lancamento['status']; kind: 'despesa' | 'receita' }> = ({ status, kind }) => {
  if (status === (kind === 'despesa' ? 'pago' : 'recebido')) {
    return <span className="flex items-center gap-1 text-xs text-[#33ff00]"><CheckCircle size={12} /> {kind === 'despesa' ? 'Pago' : 'Recebido'}</span>;
  }
  if (status === 'atrasado') {
    return <span className="flex items-center gap-1 text-xs text-[#ff3333]"><Clock size={12} /> Atrasado</span>;
  }
  return <span className="flex items-center gap-1 text-xs text-[#ffb000]"><Clock size={12} /> Pendente</span>;
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
    { icon: ArrowUpRight, label: 'Receitas', value: fmt(totalReceitas), sub: `${recebidas} recebidas / ${receitas.length} total`, color: '#33ff00' },
    { icon: ArrowDownRight, label: 'Despesas', value: fmt(totalDespesas), sub: `${pagas} pagas / ${despesas.length} total`, color: '#ff3333' },
    { icon: DollarSign, label: 'Saldo', value: fmt(totalReceitas - totalDespesas), sub: `Margem: ${totalReceitas > 0 ? ((totalReceitas - totalDespesas) / totalReceitas * 100).toFixed(1) : '0.0'}%`, color: '#33ff00' },
    { icon: Clock, label: 'A Vencer', value: fmt(aVencer), sub: `${pendentes} contas pendentes`, color: '#ffb000' },
  ];

  const tabs = [
    { id: 'despesas' as const, label: 'CONTAS_A_PAGAR', icon: ArrowDownRight },
    { id: 'receitas' as const, label: 'CONTAS_A_RECEBER', icon: ArrowUpRight },
    { id: 'categorias' as const, label: 'CATEGORIAS', icon: Receipt },
    { id: 'fornecedores' as const, label: 'FORNECEDORES', icon: Building2 },
    { id: 'contratos' as const, label: 'CONTRATOS', icon: Calendar },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-[#33ff00] term-glow">
            <DollarSign size={22} /> GESTAO_FINANCEIRA
          </h1>
          <p className="text-sm mt-1 text-[#3f9e5c]"># controle completo das finanças da empresa</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="p-5 border border-[#1f521f] hover:border-[#33ff00] transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 border border-[#1f521f]"><card.icon size={16} style={{ color: card.color }} /></div>
              <span className="text-xs font-medium uppercase tracking-wider text-[#3f9e5c]">{card.label}</span>
            </div>
            <p className="text-xl font-bold text-[#33ff00]">{card.value}</p>
            <p className="text-xs mt-1 text-[#3f9e5c]">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="border border-[#1f521f] bg-[#0a0a0a] overflow-hidden">
        <div className="flex border-b border-[#1f521f] overflow-x-auto">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-5 py-3.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${
              tab === t.id ? 'border-[#33ff00] text-[#33ff00] bg-[#0f2610]' : 'border-transparent text-[#3f9e5c] hover:text-[#33ff00]'
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
                  <div key={i} className={`text-[10px] font-semibold uppercase tracking-wider text-[#1f521f] ${i === 0 ? 'col-span-3' : i === 1 || i === 5 ? 'col-span-2' : 'col-span-2'}`}>{h}</div>
                ))}
              </div>
              {despesas.map(l => (
                <div key={l.id} className="grid grid-cols-12 gap-3 items-center p-3 border-b border-[#1f521f] transition-all hover:bg-[#0d1a0d]">
                  <div className="col-span-3 text-sm font-medium text-[#33ff00]">{l.descricao}</div>
                  <div className="col-span-2 text-sm font-bold text-[#33ff00]">{fmt(l.valor)}</div>
                  <div className="col-span-2"><span className="text-xs px-2 py-1 border border-[#1f521f] text-[#3f9e5c]">{l.categoria}</span></div>
                  <div className="col-span-2 text-xs text-[#3f9e5c]">{l.contraparte}</div>
                  <div className="col-span-1 text-xs text-[#3f9e5c]">{l.vencimento}</div>
                  <div className="col-span-2"><StatusBadge status={l.status} kind="despesa" /></div>
                </div>
              ))}
              {despesas.length === 0 && <p className="text-sm text-center py-8 text-[#1f521f]"># nenhuma despesa lançada</p>}
            </div>
          )}

          {tab === 'receitas' && (
            <div className="space-y-1">
              <div className="grid grid-cols-12 gap-3 mb-2 px-3">
                {['Descrição', 'Valor', 'Cliente', 'Categoria', 'Vencimento', 'Status'].map((h, i) => (
                  <div key={i} className={`text-[10px] font-semibold uppercase tracking-wider text-[#1f521f] ${i === 0 ? 'col-span-3' : 'col-span-2'}`}>{h}</div>
                ))}
              </div>
              {receitas.map(l => (
                <div key={l.id} className="grid grid-cols-12 gap-3 items-center p-3 border-b border-[#1f521f] transition-all hover:bg-[#0d1a0d]">
                  <div className="col-span-3 text-sm font-medium text-[#33ff00]">{l.descricao}</div>
                  <div className="col-span-2 text-sm font-bold text-[#33ff00]">{fmt(l.valor)}</div>
                  <div className="col-span-2 text-xs text-[#3f9e5c]">{l.contraparte}</div>
                  <div className="col-span-2"><span className="text-xs px-2 py-1 border border-[#1f521f] text-[#3f9e5c]">{l.categoria}</span></div>
                  <div className="col-span-1 text-xs text-[#3f9e5c]">{l.vencimento}</div>
                  <div className="col-span-2"><StatusBadge status={l.status} kind="receita" /></div>
                </div>
              ))}
              {receitas.length === 0 && <p className="text-sm text-center py-8 text-[#1f521f]"># nenhuma receita lançada</p>}
            </div>
          )}

          {tab === 'categorias' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#33ff00]">// gastos_por_categoria</h4>
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
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#33ff00]">// detalhamento</h4>
                {catData.map((cat, i) => {
                  const pct = cat.orcamento > 0 ? Math.min((cat.gasto / cat.orcamento) * 100, 100) : 100;
                  const over = cat.gasto > cat.orcamento;
                  return (
                    <div key={i} className="p-4 border border-[#1f521f]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3" style={{ backgroundColor: cat.cor }} />
                          <span className="text-sm font-medium text-[#33ff00]">{cat.name}</span>
                        </div>
                        <span className={`text-xs font-medium ${over ? 'text-[#ff3333]' : 'text-[#3f9e5c]'}`}>{pct.toFixed(0)}%</span>
                      </div>
                      <div className="w-full h-2 border border-[#1f521f]">
                        <div className="h-full transition-all" style={{ width: `${pct}%`, backgroundColor: over ? '#ff3333' : cat.cor }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-[11px] text-[#3f9e5c]">{fmt(cat.gasto)} gasto</span>
                        <span className="text-[11px] text-[#3f9e5c]">{fmt(cat.orcamento)} orçamento</span>
                      </div>
                    </div>
                  );
                })}
                {catData.length === 0 && <p className="text-sm text-[#1f521f]"># nenhuma categoria de despesa</p>}
              </div>
            </div>
          )}

          {tab === 'fornecedores' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {fornecedores.map(f => (
                <div key={f.id} className="p-5 border border-[#1f521f] hover:border-[#33ff00] transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 border border-[#33ff00] flex items-center justify-center text-[#33ff00] text-sm font-bold">{f.nome.charAt(0)}</div>
                    <span className={`text-[10px] font-bold px-2 py-1 border ${f.status === 'ativo' ? 'border-[#33ff00] text-[#33ff00]' : 'border-[#1f521f] text-[#1f521f]'}`}>{f.status.toUpperCase()}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#33ff00]">{f.nome}</h4>
                  <p className="text-xs mt-1 text-[#3f9e5c]">{f.cnpj}</p>
                  <div className="mt-3 pt-3 border-t border-[#1f521f]">
                    <p className="text-xs text-[#3f9e5c]">Contato: {f.contato}</p>
                    <p className="text-xs text-[#3f9e5c]">{f.email}</p>
                    <p className="text-xs font-semibold mt-2 text-[#33ff00]">Mensal: {fmt(f.valorMensal)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'contratos' && (
            <div className="space-y-2">
              {contratos.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 border border-[#1f521f] hover:border-[#33ff00] transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 border flex items-center justify-center ${c.status === 'ativo' ? 'border-[#33ff00] text-[#33ff00]' : 'border-[#1f521f] text-[#1f521f]'}`}>
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#33ff00]">{c.titulo}</p>
                      <p className="text-xs text-[#3f9e5c]">{c.fornecedor} • {c.inicio} até {c.fim}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[#33ff00]">{fmt(c.valor)}/mês</span>
                    <span className={`text-[10px] font-bold px-2 py-1 border ${c.status === 'ativo' ? 'border-[#33ff00] text-[#33ff00]' : 'border-[#1f521f] text-[#1f521f]'}`}>{c.status}</span>
                    {c.renovacaoAutomatica && <span className="text-[10px] text-[#ffb000]">[AUTO]</span>}
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

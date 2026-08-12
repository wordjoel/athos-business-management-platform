import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Receipt, X } from 'lucide-react';
import { getLancamentos, criarLancamento, excluirLancamento, getFluxoCaixaMensal, getDREValores, refreshLancamentos, Lancamento } from '../../services/lancamentoService';
import { useToast } from '../../components/Toast';

const ATHOSFinance: React.FC = () => {
  const { addToast } = useToast();
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [fluxo, setFluxo] = useState<ReturnType<typeof getFluxoCaixaMensal>>([]);
  const [dre, setDre] = useState(getDREValores());
  const [aba, setAba] = useState<'resumo' | 'contas-pagar' | 'contas-receber' | 'fluxo' | 'dre'>('resumo');
  const [showForm, setShowForm] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [formData, setFormData] = useState({ descricao: '', contraparte: '', valor: '', tipo: 'receita' as 'receita' | 'despesa', categoria: 'Serviços' });

  const carregarLocal = () => {
    const todos = getLancamentos();
    setLancamentos(todos);
    setFluxo(getFluxoCaixaMensal());
    setDre(getDREValores());
  };

  const carregar = async () => {
    try {
      await refreshLancamentos();
    } catch (err) {
      console.error('Falha ao buscar lançamentos no Supabase:', err);
      addToast({ type: 'error', title: 'Sem conexão com o servidor', message: 'Mostrando os últimos dados salvos localmente.' });
    }
    carregarLocal();
  };
  useEffect(() => { carregar(); }, []);

  const receitasTotal = lancamentos.filter(l => l.tipo === 'receita' && l.status === 'recebido').reduce((s, l) => s + l.valor, 0);
  const despesasTotal = lancamentos.filter(l => l.tipo === 'despesa' && l.status === 'pago').reduce((s, l) => s + l.valor, 0);
  const saldo = receitasTotal - despesasTotal;
  const contasPagar = lancamentos.filter(l => l.tipo === 'despesa' && l.status === 'pendente');
  const contasReceber = lancamentos.filter(l => l.tipo === 'receita' && l.status === 'pendente');

  const salvarTransacao = async () => {
    if (!formData.descricao || !formData.valor) return;
    setSalvando(true);
    try {
      await criarLancamento({
        tipo: formData.tipo,
        descricao: formData.descricao,
        contraparte: formData.contraparte,
        valor: parseFloat(formData.valor),
        vencimento: new Date().toLocaleDateString('pt-BR'),
        data: new Date().toLocaleDateString('pt-BR'),
        status: 'pendente',
        categoria: formData.categoria,
      });
      await carregar();
      addToast({ type: 'success', title: 'Lançamento criado' });
      setFormData({ descricao: '', contraparte: '', valor: '', tipo: 'receita', categoria: 'Serviços' });
      setShowForm(false);
    } catch (err) {
      console.error('Falha ao criar lançamento:', err);
      addToast({ type: 'error', title: 'Não foi possível salvar o lançamento' });
    } finally {
      setSalvando(false);
    }
  };

  const excluir = async (id: string) => {
    if (!confirm('Excluir este lançamento?')) return;
    try {
      await excluirLancamento(id);
      await carregar();
      addToast({ type: 'success', title: 'Lançamento excluído' });
    } catch (err) {
      console.error('Falha ao excluir lançamento:', err);
      addToast({ type: 'error', title: 'Não foi possível excluir o lançamento' });
    }
  };

  const maxFluxo = Math.max(...fluxo.map(m => Math.max(m.receita, m.despesa, 1)), 1000);

  const abas = [
    { id: 'resumo' as const, label: 'RESUMO' },
    { id: 'contas-pagar' as const, label: 'PAGAR' },
    { id: 'contas-receber' as const, label: 'RECEBER' },
    { id: 'fluxo' as const, label: 'FLUXO' },
    { id: 'dre' as const, label: 'DRE' },
  ];

  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="module-eyebrow mb-1">Financeiro</p>
          <h1 className="font-display text-2xl text-[#F0E6CC]">Central de Caixa</h1>
        </div>
      </div>

      <div className="flex gap-1 rounded-xl border border-[#232837] p-1 bg-[#131722]">
        {abas.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-colors ${aba === a.id ? 'bg-[#C9A961] text-[#0B0E14]' : 'text-[#8B93A6] hover:text-[#C9A961]'}`}>
            {a.label}
          </button>
        ))}
      </div>

      {aba === 'resumo' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-[#232837] bg-[#131722]">
              <div className="flex items-center gap-1 mb-1"><ArrowUpRight size={14} className="text-[#2F9E7C]" /><span className="text-xs text-[#8B93A6]">Receitas</span></div>
              <p className="text-lg font-bold text-[#2F9E7C]">R$ {receitasTotal.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl border border-[#232837] bg-[#131722]">
              <div className="flex items-center gap-1 mb-1"><ArrowDownRight size={14} className="text-[#A6484A]" /><span className="text-xs text-[#8B93A6]">Despesas</span></div>
              <p className="text-lg font-bold text-[#A6484A]">R$ {despesasTotal.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl border border-[#232837] bg-[#131722]">
              <div className="flex items-center gap-1 mb-1"><Wallet size={14} className="text-[#C9A961]" /><span className="text-xs text-[#8B93A6]">Saldo</span></div>
              <p className={`text-lg font-bold ${saldo >= 0 ? 'text-[#C9A961]' : 'text-[#A6484A]'}`}>R$ {saldo.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl border border-[#232837] bg-[#131722]">
              <div className="flex items-center gap-1 mb-1"><Receipt size={14} className="text-[#5B7FA8]" /><span className="text-xs text-[#8B93A6]">Lançamentos</span></div>
              <p className="text-lg font-bold text-[#C9A961]">{lancamentos.length}</p>
            </div>
          </div>

          <div className="glass-card">
            <div className="px-4 py-3 border-b border-[#2A2F3D] flex items-center justify-between">
              <h3 className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[#8B93A6]">Lançamentos Recentes</h3>
              <button onClick={() => setShowForm(true)} className="px-3 py-1.5 rounded-lg border border-[#C9A961]/50 text-xs font-medium text-[#C9A961] hover:bg-[#C9A961] hover:text-[#0B0E14] transition-all">+ Novo</button>
            </div>
            <div className="p-4 space-y-1">
              {lancamentos.slice(0, 5).map(l => (
                <div key={l.id} className="flex items-center justify-between p-2 border-b border-[#2A2F3D]">
                  <div>
                    <p className="text-sm text-[#C9A961]">{l.descricao}</p>
                    <p className="text-[10px] text-[#8B93A6]">{l.vencimento} • {l.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${l.tipo === 'receita' ? 'text-[#2F9E7C]' : 'text-[#A6484A]'}`}>{l.tipo === 'receita' ? '+' : '-'} R$ {l.valor.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {lancamentos.length === 0 && <p className="text-xs text-[#4E5468] italic">Nenhum lançamento ainda.</p>}
            </div>
          </div>
        </>
      )}

      {aba === 'contas-pagar' && (
        <div className="glass-card">
          <div className="px-4 py-3 border-b border-[#2A2F3D] flex justify-between items-center">
            <h3 className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[#8B93A6]">Contas a Pagar ({contasPagar.length})</h3>
            <button onClick={() => { setFormData({ ...formData, tipo: 'despesa' }); setShowForm(true); }} className="px-3 py-1.5 rounded-lg border border-[#C9A961]/50 text-xs font-medium text-[#C9A961] hover:bg-[#C9A961] hover:text-[#0B0E14] transition-all">+ Nova Despesa</button>
          </div>
          <div className="p-4">
            {contasPagar.length === 0 ? (
              <p className="text-sm text-[#4E5468] italic">Nenhuma conta pendente.</p>
            ) : (
              <div className="space-y-1">
                {contasPagar.map(l => (
                  <div key={l.id} className="flex items-center justify-between p-2 border-b border-[#2A2F3D]">
                    <div>
                      <p className="text-sm text-[#E9E4D8]">{l.descricao}</p>
                      <p className="text-[10px] text-[#8B93A6]">{l.contraparte} • {l.categoria}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#A6484A]">R$ {l.valor.toLocaleString()}</span>
                      <button onClick={() => excluir(l.id)} className="p-1 text-[#2A2F3D] hover:text-[#A6484A]"><X size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {aba === 'contas-receber' && (
        <div className="glass-card">
          <div className="px-4 py-3 border-b border-[#2A2F3D] flex justify-between items-center">
            <h3 className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[#8B93A6]">Contas a Receber ({contasReceber.length})</h3>
            <button onClick={() => { setFormData({ ...formData, tipo: 'receita' }); setShowForm(true); }} className="px-3 py-1.5 rounded-lg border border-[#C9A961]/50 text-xs font-medium text-[#C9A961] hover:bg-[#C9A961] hover:text-[#0B0E14] transition-all">+ Nova Receita</button>
          </div>
          <div className="p-4">
            {contasReceber.length === 0 ? (
              <p className="text-sm text-[#4E5468] italic">Nenhuma conta a receber.</p>
            ) : (
              <div className="space-y-1">
                {contasReceber.map(l => (
                  <div key={l.id} className="flex items-center justify-between p-2 border-b border-[#2A2F3D]">
                    <div>
                      <p className="text-sm text-[#E9E4D8]">{l.descricao}</p>
                      <p className="text-[10px] text-[#8B93A6]">{l.contraparte} • {l.categoria}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#2F9E7C]">R$ {l.valor.toLocaleString()}</span>
                      <button onClick={() => excluir(l.id)} className="p-1 text-[#2A2F3D] hover:text-[#A6484A]"><X size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {aba === 'fluxo' && (
        <div className="glass-card">
          <div className="px-4 py-3 border-b border-[#2A2F3D]">
            <h3 className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[#8B93A6]">Fluxo de Caixa Mensal</h3>
          </div>
          <div className="p-4">
            <div className="h-40 flex items-end gap-3 overflow-x-auto">
              {fluxo.map(m => (
                <div key={m.mes} className="flex-1 flex flex-col items-center min-w-[40px]">
                  <div className="w-full flex gap-0.5 justify-center">
                    <div className="w-4 rounded-t-[3px] bg-[#2F9E7C]" style={{ height: `${Math.min((m.receita / maxFluxo) * 120, 120)}px` }} />
                    <div className="w-4 rounded-t-[3px] bg-[#A6484A]" style={{ height: `${Math.min((m.despesa / maxFluxo) * 120, 120)}px` }} />
                  </div>
                  <span className="text-[10px] text-[#8B93A6] mt-1">{m.mes}</span>
                </div>
              ))}
              {fluxo.length === 0 && <p className="text-sm w-full text-center py-10 text-[#4E5468] italic">Nenhum dado ainda — lance receitas e despesas.</p>}
            </div>
            <div className="flex justify-center gap-4 mt-3">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#2F9E7C]" /><span className="text-xs text-[#8B93A6]">Receitas</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#A6484A]" /><span className="text-xs text-[#8B93A6]">Despesas</span></div>
            </div>
          </div>
        </div>
      )}

      {aba === 'dre' && (
        <div className="glass-card">
          <div className="px-4 py-3 border-b border-[#2A2F3D]">
            <h3 className="text-[13px] font-semibold tracking-[0.06em] uppercase text-[#8B93A6]">DRE — Demonstrativo de Resultado</h3>
          </div>
          <div className="p-4 space-y-1">
            {[
              { label: 'Receita Bruta', valor: dre.receitaBruta },
              { label: '(-) Deduções', valor: -dre.deducoes },
              { label: '= Receita Líquida', valor: dre.receitaLiquida, bold: true },
              { label: '(-) CPV', valor: -dre.cpv },
              { label: '= Lucro Bruto', valor: dre.lucroBruto, bold: true },
              { label: '(-) Desp. Operacionais', valor: -dre.despesasOperacionais },
              { label: '(-) Desp. Financeiras', valor: -dre.despesasFinanceiras },
              { label: '= EBIT', valor: dre.ebit, bold: true },
              { label: '(-) IR', valor: -dre.irContribuicoes },
              { label: '= Lucro Líquido', valor: dre.lucroLiquido, bold: true },
            ].map((r, i) => (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-[#2A2F3D]">
                <span className={`text-[#E9E4D8] ${r.bold ? 'font-semibold' : ''}`}>{r.label}</span>
                <span className={`font-mono font-medium ${r.valor >= 0 ? 'text-[#2F9E7C]' : 'text-[#A6484A]'}`}>R$ {Math.abs(r.valor).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="p-5 w-full max-w-md rounded-2xl border border-[#232837] bg-[#131722] shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-[#F0E6CC]">{formData.tipo === 'receita' ? 'Nova Receita' : 'Nova Despesa'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-[#8B93A6] hover:text-[#C9A961]" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button onClick={() => setFormData({ ...formData, tipo: 'receita' })} className={`flex-1 py-2 rounded-lg text-sm border transition-all ${formData.tipo === 'receita' ? 'bg-[#2F9E7C] text-[#0B0E14] border-[#2F9E7C]' : 'text-[#8B93A6] border-[#2A2F3D]'}`}>Receita</button>
                <button onClick={() => setFormData({ ...formData, tipo: 'despesa' })} className={`flex-1 py-2 rounded-lg text-sm border transition-all ${formData.tipo === 'despesa' ? 'bg-[#A6484A] text-[#0B0E14] border-[#A6484A]' : 'text-[#8B93A6] border-[#2A2F3D]'}`}>Despesa</button>
              </div>
              <input type="text" value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} placeholder="Descrição" className="w-full py-2.5 px-3 rounded-lg bg-[#0B0E14] border border-[#232837] focus:border-[#C9A961] text-[#E9E4D8] placeholder-[#4E5468] text-sm outline-none transition-colors" />
              <input value={formData.contraparte} onChange={e => setFormData({ ...formData, contraparte: e.target.value })} placeholder="Cliente / Fornecedor" className="w-full py-2.5 px-3 rounded-lg bg-[#0B0E14] border border-[#232837] focus:border-[#C9A961] text-[#E9E4D8] placeholder-[#4E5468] text-sm outline-none transition-colors" />
              <input type="number" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} placeholder="Valor" className="w-full py-2.5 px-3 rounded-lg bg-[#0B0E14] border border-[#232837] focus:border-[#C9A961] text-[#E9E4D8] placeholder-[#4E5468] text-sm outline-none transition-colors" />
              <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} className="w-full py-2.5 px-3 rounded-lg bg-[#0B0E14] border border-[#232837] focus:border-[#C9A961] text-[#E9E4D8] text-sm outline-none transition-colors">
                <option>Serviços</option><option>Aluguel</option><option>Marketing</option><option>Impostos</option><option>Salários</option><option>Operacional</option><option>Financeiro</option><option>Outros</option>
              </select>
              <button onClick={salvarTransacao} disabled={salvando} className="w-full py-2.5 rounded-lg font-medium text-sm transition-all disabled:opacity-50" style={{ background: salvando ? '#232837' : 'linear-gradient(135deg, #E0C583 0%, #C9A961 55%, #A98A47 100%)', color: salvando ? '#8B93A6' : '#12151E' }}>{salvando ? 'Salvando…' : 'Salvar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATHOSFinance;

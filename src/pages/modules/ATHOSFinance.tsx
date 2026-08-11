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
          <h1 className="text-2xl font-bold text-[#33ff00] term-glow">ATHOS_FINANCE</h1>
          <p className="text-sm text-[#3f9e5c]"># gestão financeira</p>
        </div>
      </div>

      <div className="flex gap-1 border border-[#1f521f] p-1">
        {abas.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)} className={`px-3 py-1.5 text-xs font-bold transition-colors ${aba === a.id ? 'bg-[#33ff00] text-[#0a0a0a]' : 'text-[#3f9e5c] hover:text-[#33ff00]'}`}>
            {a.label}
          </button>
        ))}
      </div>

      {aba === 'resumo' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 border border-[#1f521f]">
              <div className="flex items-center gap-1 mb-1"><ArrowUpRight size={14} className="text-[#33ff00]" /><span className="text-xs text-[#3f9e5c]">Receitas</span></div>
              <p className="text-lg font-bold text-[#33ff00]">R$ {receitasTotal.toLocaleString()}</p>
            </div>
            <div className="p-3 border border-[#1f521f]">
              <div className="flex items-center gap-1 mb-1"><ArrowDownRight size={14} className="text-[#ff3333]" /><span className="text-xs text-[#3f9e5c]">Despesas</span></div>
              <p className="text-lg font-bold text-[#ff3333]">R$ {despesasTotal.toLocaleString()}</p>
            </div>
            <div className="p-3 border border-[#1f521f]">
              <div className="flex items-center gap-1 mb-1"><Wallet size={14} className="text-[#33ff00]" /><span className="text-xs text-[#3f9e5c]">Saldo</span></div>
              <p className={`text-lg font-bold ${saldo >= 0 ? 'text-[#33ff00]' : 'text-[#ff3333]'}`}>R$ {saldo.toLocaleString()}</p>
            </div>
            <div className="p-3 border border-[#1f521f]">
              <div className="flex items-center gap-1 mb-1"><Receipt size={14} className="text-[#ffb000]" /><span className="text-xs text-[#3f9e5c]">Lançamentos</span></div>
              <p className="text-lg font-bold text-[#33ff00]">{lancamentos.length}</p>
            </div>
          </div>

          <div className="border border-[#1f521f] bg-[#0a0a0a]">
            <div className="px-4 py-3 border-b border-[#1f521f] flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#33ff00]">+--- LANCAMENTOS_RECENTES ---+</h3>
              <button onClick={() => setShowForm(true)} className="px-3 py-1.5 border border-[#33ff00] text-xs text-[#33ff00] hover:bg-[#33ff00] hover:text-[#0a0a0a] transition-all">[ + NOVO ]</button>
            </div>
            <div className="p-4 space-y-1">
              {lancamentos.slice(0, 5).map(l => (
                <div key={l.id} className="flex items-center justify-between p-2 border-b border-[#1f521f]">
                  <div>
                    <p className="text-sm text-[#33ff00]">{l.descricao}</p>
                    <p className="text-[10px] text-[#3f9e5c]">{l.vencimento} • {l.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${l.tipo === 'receita' ? 'text-[#33ff00]' : 'text-[#ff3333]'}`}>{l.tipo === 'receita' ? '+' : '-'} R$ {l.valor.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {lancamentos.length === 0 && <p className="text-xs text-[#1f521f]"># nenhum lançamento ainda</p>}
            </div>
          </div>
        </>
      )}

      {aba === 'contas-pagar' && (
        <div className="border border-[#1f521f] bg-[#0a0a0a]">
          <div className="px-4 py-3 border-b border-[#1f521f] flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#33ff00]">+--- CONTAS_A_PAGAR ({contasPagar.length}) ---+</h3>
            <button onClick={() => { setFormData({ ...formData, tipo: 'despesa' }); setShowForm(true); }} className="px-3 py-1.5 border border-[#33ff00] text-xs text-[#33ff00] hover:bg-[#33ff00] hover:text-[#0a0a0a] transition-all">[ + NOVA DESPESA ]</button>
          </div>
          <div className="p-4">
            {contasPagar.length === 0 ? (
              <p className="text-sm text-[#1f521f]"># nenhuma conta pendente</p>
            ) : (
              <div className="space-y-1">
                {contasPagar.map(l => (
                  <div key={l.id} className="flex items-center justify-between p-2 border-b border-[#1f521f]">
                    <div>
                      <p className="text-sm text-[#33ff00]">{l.descricao}</p>
                      <p className="text-[10px] text-[#3f9e5c]">{l.contraparte} • {l.categoria}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#ff3333]">R$ {l.valor.toLocaleString()}</span>
                      <button onClick={() => excluir(l.id)} className="p-1 text-[#1f521f] hover:text-[#ff3333]"><X size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {aba === 'contas-receber' && (
        <div className="border border-[#1f521f] bg-[#0a0a0a]">
          <div className="px-4 py-3 border-b border-[#1f521f] flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#33ff00]">+--- CONTAS_A_RECEBER ({contasReceber.length}) ---+</h3>
            <button onClick={() => { setFormData({ ...formData, tipo: 'receita' }); setShowForm(true); }} className="px-3 py-1.5 border border-[#33ff00] text-xs text-[#33ff00] hover:bg-[#33ff00] hover:text-[#0a0a0a] transition-all">[ + NOVA RECEITA ]</button>
          </div>
          <div className="p-4">
            {contasReceber.length === 0 ? (
              <p className="text-sm text-[#1f521f]"># nenhuma conta a receber</p>
            ) : (
              <div className="space-y-1">
                {contasReceber.map(l => (
                  <div key={l.id} className="flex items-center justify-between p-2 border-b border-[#1f521f]">
                    <div>
                      <p className="text-sm text-[#33ff00]">{l.descricao}</p>
                      <p className="text-[10px] text-[#3f9e5c]">{l.contraparte} • {l.categoria}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#33ff00]">R$ {l.valor.toLocaleString()}</span>
                      <button onClick={() => excluir(l.id)} className="p-1 text-[#1f521f] hover:text-[#ff3333]"><X size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {aba === 'fluxo' && (
        <div className="border border-[#1f521f] bg-[#0a0a0a]">
          <div className="px-4 py-3 border-b border-[#1f521f]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#33ff00]">+--- FLUXO_DE_CAIXA_MENSAL ---+</h3>
          </div>
          <div className="p-4">
            <div className="h-40 flex items-end gap-3 overflow-x-auto">
              {fluxo.map(m => (
                <div key={m.mes} className="flex-1 flex flex-col items-center min-w-[40px]">
                  <div className="w-full flex gap-0.5 justify-center">
                    <div className="w-4 bg-[#33ff00]" style={{ height: `${Math.min((m.receita / maxFluxo) * 120, 120)}px` }} />
                    <div className="w-4 bg-[#ff3333]" style={{ height: `${Math.min((m.despesa / maxFluxo) * 120, 120)}px` }} />
                  </div>
                  <span className="text-[10px] text-[#3f9e5c] mt-1">{m.mes}</span>
                </div>
              ))}
              {fluxo.length === 0 && <p className="text-sm w-full text-center py-10 text-[#1f521f]"># nenhum dado. lance receitas e despesas</p>}
            </div>
            <div className="flex justify-center gap-4 mt-3">
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#33ff00]" /><span className="text-xs text-[#3f9e5c]">Receitas</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-[#ff3333]" /><span className="text-xs text-[#3f9e5c]">Despesas</span></div>
            </div>
          </div>
        </div>
      )}

      {aba === 'dre' && (
        <div className="border border-[#1f521f] bg-[#0a0a0a]">
          <div className="px-4 py-3 border-b border-[#1f521f]">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#33ff00]">+--- DRE_DEMONSTRATIVO ---+</h3>
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
              <div key={i} className="flex justify-between text-sm py-1 border-b border-[#1f521f]">
                <span className={`text-[#33ff00] ${r.bold ? 'font-semibold' : ''}`}>{r.label}</span>
                <span className={`font-mono font-medium ${r.valor >= 0 ? 'text-[#33ff00]' : 'text-[#ff3333]'}`}>R$ {Math.abs(r.valor).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="p-5 w-full max-w-md border border-[#33ff00] bg-[#0a0a0a]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#33ff00]">{formData.tipo === 'receita' ? 'NOVA_RECEITA' : 'NOVA_DESPESA'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} className="text-[#3f9e5c] hover:text-[#33ff00]" /></button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <button onClick={() => setFormData({ ...formData, tipo: 'receita' })} className={`flex-1 py-2 text-sm border transition-all ${formData.tipo === 'receita' ? 'bg-[#33ff00] text-[#0a0a0a] border-[#33ff00]' : 'text-[#3f9e5c] border-[#1f521f]'}`}>Receita</button>
                <button onClick={() => setFormData({ ...formData, tipo: 'despesa' })} className={`flex-1 py-2 text-sm border transition-all ${formData.tipo === 'despesa' ? 'bg-[#ff3333] text-[#0a0a0a] border-[#ff3333]' : 'text-[#3f9e5c] border-[#1f521f]'}`}>Despesa</button>
              </div>
              <input type="text" value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} placeholder="Descrição" className="w-full py-2 bg-transparent border-0 border-b border-[#1f521f] focus:border-[#33ff00] text-[#33ff00] placeholder-[#1f521f] text-sm outline-none" />
              <input value={formData.contraparte} onChange={e => setFormData({ ...formData, contraparte: e.target.value })} placeholder="Cliente / Fornecedor" className="w-full py-2 bg-transparent border-0 border-b border-[#1f521f] focus:border-[#33ff00] text-[#33ff00] placeholder-[#1f521f] text-sm outline-none" />
              <input type="number" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} placeholder="Valor" className="w-full py-2 bg-transparent border-0 border-b border-[#1f521f] focus:border-[#33ff00] text-[#33ff00] placeholder-[#1f521f] text-sm outline-none" />
              <select value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} className="w-full py-2 bg-transparent border-0 border-b border-[#1f521f] focus:border-[#33ff00] text-[#33ff00] text-sm outline-none">
                <option>Serviços</option><option>Aluguel</option><option>Marketing</option><option>Impostos</option><option>Salários</option><option>Operacional</option><option>Financeiro</option><option>Outros</option>
              </select>
              <button onClick={salvarTransacao} disabled={salvando} className="w-full py-2.5 border border-[#33ff00] text-[#33ff00] text-sm font-bold hover:bg-[#33ff00] hover:text-[#0a0a0a] transition-all disabled:opacity-40">{salvando ? 'SALVANDO...' : '[ SALVAR ]'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATHOSFinance;

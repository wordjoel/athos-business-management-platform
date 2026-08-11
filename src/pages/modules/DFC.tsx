import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLancamentos, refreshLancamentos } from '../../services/lancamentoService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, ArrowDown, ArrowUp, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const DFC: React.FC = () => {
  const [lancamentos, setLancamentos] = useState(getLancamentos());

  useEffect(() => {
    refreshLancamentos()
      .catch(err => console.error('Falha ao buscar lançamentos no Supabase:', err))
      .finally(() => setLancamentos(getLancamentos()));
  }, []);

  const receitas = lancamentos.filter(l => l.tipo === 'receita');
  const despesas = lancamentos.filter(l => l.tipo === 'despesa');

  const totalReceitas = receitas.reduce((s, l) => s + l.valor, 0);
  const totalDespesas = despesas.reduce((s, l) => s + l.valor, 0);
  const saldoOperacional = totalReceitas - totalDespesas;

  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const fluxoPorMes = meses.map((mes, i) => {
    const rec = receitas.filter(l => parseInt(l.vencimento.split('/')[1]) === i + 1).reduce((s, l) => s + l.valor, 0);
    const desp = despesas.filter(l => parseInt(l.vencimento.split('/')[1]) === i + 1).reduce((s, l) => s + l.valor, 0);
    return { mes, entradas: rec, saidas: desp, liquido: rec - desp };
  });

  const categoriasSaida = despesas.reduce((acc, l) => {
    acc[l.categoria] = (acc[l.categoria] || 0) + l.valor;
    return acc;
  }, {} as Record<string, number>);

  const categoriasEntrada = receitas.reduce((acc, l) => {
    acc[l.categoria] = (acc[l.categoria] || 0) + l.valor;
    return acc;
  }, {} as Record<string, number>);

  const investingimentos = despesas.filter(l => l.categoria === 'Investimento').reduce((s, l) => s + l.valor, 0);
  const financiamentos = 0;

  const fluxoLivre = saldoOperacional - investingimentos;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity size={24} /> Demonstração de Fluxos de Caixa
        </h1>
        <p className="text-sm text-gray-500 mt-1">DFC — Movimentação financeira por período</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <ArrowDown size={16} className="text-green-400" />
            <span className="text-xs text-gray-400">Entradas</span>
          </div>
          <p className="text-xl font-bold text-green-400">R$ {totalReceitas.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 mb-1">
            <ArrowUp size={16} className="text-red-400" />
            <span className="text-xs text-gray-400">Saídas</span>
          </div>
          <p className="text-xl font-bold text-red-400">R$ {totalDespesas.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-cyan-400" />
            <span className="text-xs text-gray-400">Fluxo Operacional</span>
          </div>
          <p className="text-xl font-bold text-cyan-400">R$ {saldoOperacional.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={16} className="text-amber-400" />
            <span className="text-xs text-gray-400">Fluxo Livre</span>
          </div>
          <p className={`text-xl font-bold ${fluxoLivre >= 0 ? 'text-green-400' : 'text-red-400'}`}>R$ {fluxoLivre.toLocaleString()}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-4 rounded-xl bg-white/5 border border-white/5">
          <h3 className="text-sm font-semibold text-white mb-4">Fluxo Mensal</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={fluxoPorMes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="mes" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} formatter={(v: any) => `R$ ${Number(v).toLocaleString()}`} />
              <Legend />
              <Bar dataKey="entradas" name="Entradas" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="saidas" name="Saídas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <h3 className="text-sm font-semibold text-white mb-3">Atividades Operacionais</h3>
            {Object.entries(categoriasEntrada).map(([cat, val]) => (
              <div key={cat} className="flex justify-between py-1.5 text-xs border-b border-white/5 last:border-0">
                <span className="text-gray-400">{cat}</span>
                <span className="text-green-400">+R$ {val.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <h3 className="text-sm font-semibold text-white mb-3">Atividades de Investimento</h3>
            <div className="flex justify-between py-1.5 text-xs">
              <span className="text-gray-400">Investimentos</span>
              <span className="text-red-400">-R$ {investingimentos.toLocaleString()}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <h3 className="text-sm font-semibold text-white mb-3">Atividades de Financiamento</h3>
            <div className="flex justify-between py-1.5 text-xs">
              <span className="text-gray-400">Empréstimos</span>
              <span className="text-blue-400">R$ {financiamentos.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DFC;

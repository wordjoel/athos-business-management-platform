import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { getLancamentos, refreshLancamentos } from '../../services/lancamentoService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Building2, Plus, TrendingDown, TrendingUp, Search, Filter } from 'lucide-react';

const CATEGORIAS_DEFAULT = [
  { nome: 'TI & Tecnologia', orcamento: 50000, cor: '#5B7FA8' },
  { nome: 'Pessoal', orcamento: 120000, cor: '#8E6E9F' },
  { nome: 'Marketing', orcamento: 30000, cor: '#C9A961' },
  { nome: 'Operacional', orcamento: 40000, cor: '#2F9E7C' },
  { nome: 'Administrativo', orcamento: 25000, cor: '#A6484A' },
  { nome: 'Comercial', orcamento: 35000, cor: '#B06E85' },
  { nome: 'Jurídico', orcamento: 15000, cor: '#4C6D95' },
  { nome: 'RH', orcamento: 20000, cor: '#B8785A' },
];

const CentroCustos: React.FC = () => {
  const { darkMode } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [lancamentos, setLancamentos] = useState(getLancamentos());

  useEffect(() => {
    refreshLancamentos()
      .catch(err => console.error('Falha ao buscar lançamentos no Supabase:', err))
      .finally(() => setLancamentos(getLancamentos()));
  }, []);

  const dados = CATEGORIAS_DEFAULT.map(cat => {
    const gastos = lancamentos
      .filter(l => l.tipo === 'despesa' && l.categoria === cat.nome)
      .reduce((s, l) => s + l.valor, 0);
    const percentual = cat.orcamento > 0 ? (gastos / cat.orcamento) * 100 : 0;
    return { ...cat, gasto: gastos, saldo: cat.orcamento - gastos, percentual };
  }).filter(d => !searchTerm || d.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalOrcamento = dados.reduce((s, d) => s + d.orcamento, 0);
  const totalGasto = dados.reduce((s, d) => s + d.gasto, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Building2 size={24} /> Centro de Custos
          </h1>
          <p className="text-sm text-gray-500 mt-1">Controle orçamentário por departamento</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-sm font-medium flex items-center gap-2 hover:bg-cyan-500/20">
          <Plus size={16} /> Novo Centro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20">
          <p className="text-xs text-gray-400">Orçamento Total</p>
          <p className="text-2xl font-bold text-cyan-400">R$ {totalOrcamento.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20">
          <p className="text-xs text-gray-400">Total Gasto</p>
          <p className="text-2xl font-bold text-red-400">R$ {totalGasto.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <p className="text-xs text-gray-400">Saldo Disponível</p>
          <p className="text-2xl font-bold text-green-400">R$ {(totalOrcamento - totalGasto).toLocaleString()}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-cyan-500/50"
            placeholder="Buscar centro de custo..."
          />
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center gap-2 text-sm">
          <Filter size={14} /> Filtrar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {dados.map((d, i) => (
            <motion.div
              key={d.nome}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.cor }} />
                  <span className="text-sm font-medium text-white">{d.nome}</span>
                </div>
                <span className={`text-xs font-medium ${d.percentual > 90 ? 'text-red-400' : d.percentual > 70 ? 'text-amber-400' : 'text-green-400'}`}>
                  {d.percentual.toFixed(0)}%
                </span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(d.percentual, 100)}%`, backgroundColor: d.cor }} />
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Gasto: R$ {d.gasto.toLocaleString()}</span>
                <span>Orçamento: R$ {d.orcamento.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mt-1 text-xs">
                <span className={d.saldo >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {d.saldo >= 0 ? 'Disponível' : 'Estourado'}: R$ {Math.abs(d.saldo).toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <h3 className="text-sm font-semibold text-white mb-4">Distribuição por Centro</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={dados.map(d => ({ name: d.nome, value: d.gasto }))} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value">
                {dados.map((d, i) => <Cell key={i} fill={d.cor} />)}
              </Pie>
              <Tooltip formatter={(v: any) => `R$ ${Number(v).toLocaleString()}`} contentStyle={{ background: '#131722', border: '1px solid #232837', borderRadius: 10, color: '#E9E4D8', fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CentroCustos;

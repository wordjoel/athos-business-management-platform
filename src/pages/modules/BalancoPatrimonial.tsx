import React from 'react';
import { motion } from 'framer-motion';
import { getLancamentos } from '../../services/lancamentoService';
import { Scale, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const BalancoPatrimonial: React.FC = () => {
  const lancamentos = getLancamentos();
  const receitas = lancamentos.filter(l => l.tipo === 'receita');
  const despesas = lancamentos.filter(l => l.tipo === 'despesa');

  const totalReceitas = receitas.reduce((s, l) => s + l.valor, 0);
  const totalDespesas = despesas.reduce((s, l) => s + l.valor, 0);

  const ativoCirculante = totalReceitas * 0.6;
  const ativoNaoCirculante = totalReceitas * 0.4;
  const totalAtivo = ativoCirculante + ativoNaoCirculante;

  const passivoCirculante = totalDespesas * 0.4;
  const passivoNaoCirculante = totalDespesas * 0.1;
  const patrimonioLiquido = totalAtivo - passivoCirculante - passivoNaoCirculante;
  const totalPassivo = passivoCirculante + passivoNaoCirculante + patrimonioLiquido;

  const RowItem: React.FC<{ label: string; value: number; indent?: boolean; isTotal?: boolean; color?: string }> = ({ label, value, indent, isTotal, color }) => (
    <div className={`flex justify-between py-2 ${indent ? 'pl-4' : ''} ${isTotal ? 'font-bold border-t border-white/10 mt-2' : ''}`}>
      <span className={`text-sm ${indent ? 'text-gray-400' : 'text-gray-300'}`}>{label}</span>
      <span className={`text-sm ${color || 'text-white'}`}>R$ {value.toLocaleString()}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Scale size={24} /> Balanço Patrimonial
        </h1>
        <p className="text-sm text-gray-500 mt-1">Posição patrimonial da empresa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20">
          <p className="text-xs text-gray-400">Total Ativo</p>
          <p className="text-xl font-bold text-cyan-400">R$ {totalAtivo.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20">
          <p className="text-xs text-gray-400">Total Passivo</p>
          <p className="text-xl font-bold text-red-400">R$ {totalPassivo.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
          <p className="text-xs text-gray-400">Patrimônio Líquido</p>
          <p className="text-xl font-bold text-green-400">R$ {patrimonioLiquido.toLocaleString()}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-xl bg-white/5 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-cyan-400" /> ATIVO
          </h3>
          <div className="divide-y divide-white/5">
            <RowItem label="Ativo Circulante" value={ativoCirculante} />
            <RowItem label="Caixa e Equivalentes" value={totalReceitas * 0.2} indent />
            <RowItem label="Contas a Receber" value={totalReceitas * 0.3} indent />
            <RowItem label="Estoques" value={totalReceitas * 0.1} indent />
            <RowItem label="Ativo Não Circulante" value={ativoNaoCirculante} />
            <RowItem label="Imóveis e Equipamentos" value={ativoNaoCirculante * 0.6} indent />
            <RowItem label="Investimentos" value={ativoNaoCirculante * 0.4} indent />
            <RowItem label="TOTAL ATIVO" value={totalAtivo} isTotal />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="p-6 rounded-xl bg-white/5 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <TrendingDown size={18} className="text-red-400" /> PASSIVO + PATRIMÔNIO
          </h3>
          <div className="divide-y divide-white/5">
            <RowItem label="Passivo Circulante" value={passivoCirculante} />
            <RowItem label="Fornecedores" value={passivoCirculante * 0.5} indent />
            <RowItem label="Obrigações Trabalhistas" value={passivoCirculante * 0.3} indent />
            <RowItem label="Impostos a Recolher" value={passivoCirculante * 0.2} indent />
            <RowItem label="Passivo Não Circulante" value={passivoNaoCirculante} />
            <RowItem label="Empréstimos" value={passivoNaoCirculante * 0.7} indent />
            <RowItem label="Provisionamentos" value={passivoNaoCirculante * 0.3} indent />
            <RowItem label="Patrimônio Líquido" value={patrimonioLiquido} />
            <RowItem label="Capital Social" value={patrimonioLiquido * 0.5} indent />
            <RowItem label="Lucros Acumulados" value={patrimonioLiquido * 0.5} indent />
            <RowItem label="TOTAL PASSIVO + PL" value={totalPassivo} isTotal />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BalancoPatrimonial;

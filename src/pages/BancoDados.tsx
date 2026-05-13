import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Database, Search, Table, Users, DollarSign, Building2, FileText, Shield, BarChart3, ClipboardList, UserCheck } from 'lucide-react';
import { users, socios, despesas, receitas, categorias, setores, fornecedores, contratos, logs, relatorios } from '../data/mockData';

const tables: Record<string, { data: any[], columns: string[], icon: React.ElementType }> = {
  usuarios: { data: users, columns: ['id', 'name', 'email', 'role', 'sector', 'active', 'lastLogin'], icon: Users },
  socios: { data: socios, columns: ['id', 'name', 'email', 'participation', 'proLabore', 'active'], icon: UserCheck },
  despesas: { data: despesas, columns: ['id', 'descricao', 'valor', 'categoria', 'setor', 'fornecedor', 'vencimento', 'pago'], icon: DollarSign },
  receitas: { data: receitas, columns: ['id', 'descricao', 'valor', 'cliente', 'categoria', 'vencimento', 'recebido'], icon: DollarSign },
  categorias: { data: categorias, columns: ['id', 'nome', 'tipo', 'cor', 'orcamento'], icon: ClipboardList },
  setores: { data: setores, columns: ['id', 'nome', 'responsavel', 'orcamento', 'gastos', 'funcionarios', 'status'], icon: Building2 },
  fornecedores: { data: fornecedores, columns: ['id', 'nome', 'cnpj', 'contato', 'email', 'status', 'valorMensal'], icon: Users },
  contratos: { data: contratos, columns: ['id', 'titulo', 'fornecedor', 'valor', 'inicio', 'fim', 'status', 'renovacaoAutomatica'], icon: FileText },
  logs: { data: logs, columns: ['id', 'usuario', 'acao', 'modulo', 'data', 'detalhes'], icon: Shield },
  relatorios: { data: relatorios, columns: ['id', 'titulo', 'tipo', 'data', 'geradoPor', 'status'], icon: BarChart3 },
};

const BancoDados: React.FC = () => {
  const { darkMode } = useApp();
  const [selectedTable, setSelectedTable] = useState<string>('usuarios');

  const table = tables[selectedTable];
  const fmt = (v: unknown) => {
    if (typeof v === 'number') return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
    if (typeof v === 'boolean') return v ? '✅ Sim' : '❌ Não';
    return String(v);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h1 className={`text-2xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Database size={24} className="text-athos-400" /> Banco de Dados
          </h1>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Visualização e gestão de todas as tabelas do sistema</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${darkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
          <Database size={12} /> {Object.keys(tables).length} tabelas • {Object.values(tables).reduce((s, t) => s + t.data.length, 0)} registros
        </div>
      </div>

      {/* Table Selector */}
      <div className={`rounded-2xl p-4 border ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex flex-wrap gap-2">
          {Object.entries(tables).map(([key, t]) => (
            <button
              key={key}
              onClick={() => setSelectedTable(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedTable === key
                  ? 'gradient-athos text-white shadow-glow'
                  : darkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <t.icon size={14} />
              {key.charAt(0).toUpperCase() + key.slice(1)}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${selectedTable === key ? 'bg-white/20' : darkMode ? 'bg-white/10' : 'bg-gray-200'}`}>{t.data.length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-gray-900/80 border-white/5' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className={`p-4 border-b flex items-center justify-between ${darkMode ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2">
            <Table size={16} className="text-athos-400" />
            <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedTable.charAt(0).toUpperCase() + selectedTable.slice(1)}</h3>
            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>({table.data.length} registros)</span>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${darkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <Search size={12} className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
            <input type="text" placeholder="Buscar..." className={`bg-transparent text-xs outline-none w-32 ${darkMode ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={darkMode ? 'bg-white/[0.02]' : 'bg-gray-50'}>
                {table.columns.map(col => (
                  <th key={col} className={`px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-left whitespace-nowrap ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-white/5' : 'divide-gray-100'}`}>
              {table.data.map((row, i) => (
                <tr key={i} className={`transition-colors ${darkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-gray-50'}`}>
                  {table.columns.map(col => (
                    <td key={col} className={`px-4 py-3 text-xs whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {fmt((row as any)[col])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BancoDados;

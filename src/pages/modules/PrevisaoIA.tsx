import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Brain, AlertTriangle, Sparkles, Plus, Pencil, Trash2, X } from 'lucide-react';
import { previsaoIAService, alertaIAService } from '../../services/seedData';
import type { PrevisaoIA, AlertaIA } from '../../services/seedData';

type ModalTipo = 'previsao' | 'alerta' | null;

interface PrevisaoForm {
  indicador: string;
  atual: string;
  projetado: string;
  variacao: string;
}

interface AlertaForm {
  tipo: 'receita' | 'despesa' | 'fluxo';
  mensagem: string;
  impacto: 'alto' | 'medio' | 'baixo';
}

const emptyPrevisao: PrevisaoForm = { indicador: '', atual: '', projetado: '', variacao: '' };
const emptyAlerta: AlertaForm = { tipo: 'receita', mensagem: '', impacto: 'medio' };

const PrevisaoIA: React.FC = () => {
  const { darkMode } = useApp();
  const [previsoes, setPrevisoes] = useState<PrevisaoIA[]>([]);
  const [alertas, setAlertas] = useState<AlertaIA[]>([]);
  const [modalTipo, setModalTipo] = useState<ModalTipo>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pForm, setPForm] = useState<PrevisaoForm>(emptyPrevisao);
  const [aForm, setAForm] = useState<AlertaForm>(emptyAlerta);

  useEffect(() => {
    setPrevisoes(previsaoIAService.getAll());
    setAlertas(alertaIAService.getAll());
  }, []);

  const openCreatePrevisao = () => {
    setEditingId(null);
    setPForm(emptyPrevisao);
    setModalTipo('previsao');
  };

  const openCreateAlerta = () => {
    setEditingId(null);
    setAForm(emptyAlerta);
    setModalTipo('alerta');
  };

  const openEditPrevisao = (p: PrevisaoIA) => {
    setEditingId(p.id);
    setPForm({ indicador: p.indicador, atual: p.atual, projetado: p.projetado, variacao: p.variacao });
    setModalTipo('previsao');
  };

  const openEditAlerta = (a: AlertaIA) => {
    setEditingId(a.id);
    setAForm({ tipo: a.tipo, mensagem: a.mensagem, impacto: a.impacto });
    setModalTipo('alerta');
  };

  const handleSavePrevisao = () => {
    const data = { indicador: pForm.indicador, atual: pForm.atual, projetado: pForm.projetado, variacao: pForm.variacao };
    if (editingId) {
      previsaoIAService.update(editingId, data);
    } else {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
      previsaoIAService.create({ id, ...data } as PrevisaoIA);
    }
    setPrevisoes(previsaoIAService.getAll());
    setModalTipo(null);
  };

  const handleSaveAlerta = () => {
    const data = { tipo: aForm.tipo, mensagem: aForm.mensagem, impacto: aForm.impacto };
    if (editingId) {
      alertaIAService.update(editingId, data);
    } else {
      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
      alertaIAService.create({ id, ...data } as AlertaIA);
    }
    setAlertas(alertaIAService.getAll());
    setModalTipo(null);
  };

  const handleDeletePrevisao = (id: string) => {
    previsaoIAService.delete(id);
    setPrevisoes(previsaoIAService.getAll());
  };

  const handleDeleteAlerta = (id: string) => {
    alertaIAService.delete(id);
    setAlertas(alertaIAService.getAll());
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient">Previsão com IA</h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ATHOS Finance - Análise Preditiva</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 rounded-lg">
          <Brain size={16} className="text-amber-400" />
          <span className="text-sm font-medium text-amber-400">IA Ativa</span>
        </div>
      </div>

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <h2 className="font-semibold">Projeções baseadas em Machine Learning</h2>
          </div>
          <button onClick={openCreatePrevisao} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm flex items-center gap-1">
            <Plus size={14} /> Nova Previsão
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {previsoes.map(p => (
            <div key={p.id} className={`p-4 rounded-lg group relative ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{p.indicador}</p>
              <p className="text-lg font-bold">{p.atual}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-sm ${p.variacao.includes('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                  → {p.projetado} ({p.variacao})
                </span>
              </div>
              <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                <button onClick={() => openEditPrevisao(p)} className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                  <Pencil size={12} className="text-gray-400" />
                </button>
                <button onClick={() => handleDeletePrevisao(p.id)} className="p-1 rounded hover:bg-red-500/20">
                  <Trash2 size={12} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            <h2 className="font-semibold">Alertas e Insights</h2>
          </div>
          <button onClick={openCreateAlerta} className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm flex items-center gap-1">
            <Plus size={14} /> Novo Alerta
          </button>
        </div>
        <div className="space-y-3">
          {alertas.map(a => (
            <div key={a.id} className={`p-3 rounded-lg group relative ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
              <p className="text-sm">{a.mensagem}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                  a.impacto === 'alto' ? 'bg-red-500/20 text-red-400' :
                  a.impacto === 'medio' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>{a.impacto}</span>
              </div>
              <div className="absolute top-2 right-2 hidden group-hover:flex gap-1">
                <button onClick={() => openEditAlerta(a)} className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
                  <Pencil size={12} className="text-gray-400" />
                </button>
                <button onClick={() => handleDeleteAlerta(a.id)} className="p-1 rounded hover:bg-red-500/20">
                  <Trash2 size={12} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalTipo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`w-full max-w-md p-6 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                {editingId ? 'Editar' : 'Novo'} {modalTipo === 'previsao' ? 'Previsão' : 'Alerta'}
              </h3>
              <button onClick={() => setModalTipo(null)}><X size={18} /></button>
            </div>
            {modalTipo === 'previsao' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1">Indicador</label>
                  <input value={pForm.indicador} onChange={e => setPForm({ ...pForm, indicador: e.target.value })} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border`} />
                </div>
                <div>
                  <label className="block text-xs mb-1">Atual</label>
                  <input value={pForm.atual} onChange={e => setPForm({ ...pForm, atual: e.target.value })} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border`} />
                </div>
                <div>
                  <label className="block text-xs mb-1">Projetado</label>
                  <input value={pForm.projetado} onChange={e => setPForm({ ...pForm, projetado: e.target.value })} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border`} />
                </div>
                <div>
                  <label className="block text-xs mb-1">Variação</label>
                  <input value={pForm.variacao} onChange={e => setPForm({ ...pForm, variacao: e.target.value })} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border`} />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSavePrevisao} className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium">Salvar</button>
                  <button onClick={() => setModalTipo(null)} className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs mb-1">Tipo</label>
                  <select value={aForm.tipo} onChange={e => setAForm({ ...aForm, tipo: e.target.value as 'receita' | 'despesa' | 'fluxo' })} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border`}>
                    <option value="receita">Receita</option>
                    <option value="despesa">Despesa</option>
                    <option value="fluxo">Fluxo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs mb-1">Mensagem</label>
                  <textarea value={aForm.mensagem} onChange={e => setAForm({ ...aForm, mensagem: e.target.value })} rows={3} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border`} />
                </div>
                <div>
                  <label className="block text-xs mb-1">Impacto</label>
                  <select value={aForm.impacto} onChange={e => setAForm({ ...aForm, impacto: e.target.value as 'alto' | 'medio' | 'baixo' })} className={`w-full px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'} border`}>
                    <option value="alto">Alto</option>
                    <option value="medio">Médio</option>
                    <option value="baixo">Baixo</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveAlerta} className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium">Salvar</button>
                  <button onClick={() => setModalTipo(null)} className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrevisaoIA;

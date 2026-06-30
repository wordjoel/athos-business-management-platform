import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Users, Clock, FileText, GraduationCap, TrendingUp, Calendar, CheckCircle, AlertCircle, Baby, Plus, Trash2, X, Save, Mail, Phone } from 'lucide-react';

interface Funcionario {
  id: string;
  nome: string;
  cargo: string;
  departamento: string;
  email: string;
  telefone: string;
  entrada: string;
  status: 'presente' | 'ausente' | 'folga' | 'afastado' | 'desligado';
  dataAdmissao?: string;
  dataDesligamento?: string;
  motivoDesligamento?: string;
}

interface Treinamento {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  responsavel: string;
  concluido: boolean;
  funcionarioId: string;
}

const ATHOSPeople: React.FC = () => {
  const { darkMode } = useApp();

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(() => {
    const saved = localStorage.getItem('athos_funcionarios');
    return saved ? JSON.parse(saved) : [];
  });

  const [treinamentos, setTreinamentos] = useState<Treinamento[]>(() => {
    const saved = localStorage.getItem('athos_treinamentos');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'equipe' | 'treinamentos' | 'offboarding'>('equipe');
  const [showForm, setShowForm] = useState(false);
  const [showOffboard, setShowOffboard] = useState<string | null>(null);
  const [formData, setFormData] = useState({ nome: '', cargo: '', departamento: '', email: '', telefone: '' });
  const [offboardData, setOffboardData] = useState({ motivo: '', data: '', observacoes: '' });

  useEffect(() => { localStorage.setItem('athos_funcionarios', JSON.stringify(funcionarios)); }, [funcionarios]);
  useEffect(() => { localStorage.setItem('athos_treinamentos', JSON.stringify(treinamentos)); }, [treinamentos]);

  const salvarFuncionario = () => {
    if (!formData.nome || !formData.cargo) return;
    const novo: Funcionario = {
      id: Date.now().toString(),
      ...formData,
      entrada: '09:00',
      status: 'presente',
    };
    setFuncionarios([novo, ...funcionarios]);
    setFormData({ nome: '', cargo: '', departamento: '', email: '', telefone: '' });
    setShowForm(false);
  };

  const excluirFuncionario = (id: string) => {
    if (confirm('Excluir este funcionário?')) setFuncionarios(funcionarios.filter(f => f.id !== id));
  };

  const desligarFuncionario = (id: string) => {
    setFuncionarios(funcionarios.map(f => f.id === id ? {
      ...f,
      status: 'desligado' as const,
      dataDesligamento: offboardData.data || new Date().toLocaleDateString('pt-BR'),
      motivoDesligamento: offboardData.motivo,
    } : f));
    setShowOffboard(null);
    setOffboardData({ motivo: '', data: '', observacoes: '' });
  };

  const adicionarTreinamento = (funcionarioId: string) => {
    const func = funcionarios.find(f => f.id === funcionarioId);
    if (!func) return;
    const novo: Treinamento = {
      id: Date.now().toString(),
      titulo: 'Novo Treinamento',
      descricao: 'Descrição do treinamento',
      duracao: '4h',
      responsavel: func.departamento,
      concluido: false,
      funcionarioId,
    };
    setTreinamentos([...treinamentos, novo]);
  };

  const toggleTreinamento = (id: string) => {
    setTreinamentos(treinamentos.map(t => t.id === id ? { ...t, concluido: !t.concluido } : t));
  };

  const funcionariosAtivos = funcionarios.filter(f => f.status !== 'desligado');
  const desligados = funcionarios.filter(f => f.status === 'desligado');

  const stats = [
    { title: 'Ativos', value: funcionariosAtivos.length.toString(), icon: Users, color: 'orange' },
    { title: 'Treinamentos', value: treinamentos.length.toString(), icon: GraduationCap, color: 'blue' },
    { title: 'Concluídos', value: treinamentos.filter(t => t.concluido).length.toString(), icon: CheckCircle, color: 'emerald' },
    { title: 'Desligados', value: desligados.length.toString(), icon: AlertCircle, color: 'red' },
  ];

  const statusCores: Record<string, string> = { presente: 'emerald', ausente: 'red', folga: 'amber', afastado: 'gray', desligado: 'gray' };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gradient flex items-center gap-2">
            <UserCheck size={24} /> ATHOS People
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>RH — Funcionários, Treinamentos e Offboarding</p>
        </div>
        <div className="flex gap-2">
          {[
            { key: 'equipe' as const, label: 'Equipe', icon: Users },
            { key: 'treinamentos' as const, label: 'Treinamentos', icon: GraduationCap },
            { key: 'offboarding' as const, label: 'Offboarding', icon: AlertCircle },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                activeTab === tab.key ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-400 hover:text-white border border-white/5'
              }`}>
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-2">
            <Plus size={16} /> Novo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={20} className={`text-${stat.color}-400`} />
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{stat.title}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl w-full max-w-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Novo Membro</h2>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Nome</label>
                <input type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Nome completo" />
              </div>
              <div>
                <label className="text-sm">Cargo</label>
                <input type="text" value={formData.cargo} onChange={e => setFormData({ ...formData, cargo: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="Cargo/Função" />
              </div>
              <div>
                <label className="text-sm">Departamento</label>
                <select value={formData.departamento} onChange={e => setFormData({ ...formData, departamento: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                  <option value="Administrativo">Administrativo</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Financeiro">Financeiro</option>
                  <option value="TI">TI</option>
                  <option value="Qualidade">Qualidade</option>
                  <option value="Produtos">Produtos</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="email@athos.com" />
              </div>
              <div>
                <label className="text-sm">Telefone</label>
                <input type="tel" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" placeholder="(00) 00000-0000" />
              </div>
              <button onClick={salvarFuncionario} className="w-full py-2 bg-orange-500 rounded-lg font-medium hover:bg-orange-600 flex items-center justify-center gap-2">
                <Save size={16} /> Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`p-5 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-white'}`}>
        {activeTab === 'equipe' && (
          <>
            <h2 className="font-semibold mb-4">Equipe ATHOS</h2>
            <div className="space-y-3">
              {funcionariosAtivos.map(func => (
                <div key={func.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                      {func.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{func.nome}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{func.cargo} • {func.departamento}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{func.entrada}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{func.email}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${statusCores[func.status]}-500/20 text-${statusCores[func.status]}-400`}>
                      {func.status}
                    </span>
                    <button onClick={() => adicionarTreinamento(func.id)} className="p-2 rounded-lg hover:bg-blue-500/20 text-gray-400 hover:text-blue-400" title="Treinamento">
                      <GraduationCap size={14} />
                    </button>
                    <button onClick={() => { setShowOffboard(func.id); setOffboardData({ motivo: '', data: '', observacoes: '' }); }} className="p-2 rounded-lg hover:bg-amber-500/20 text-gray-400 hover:text-amber-400" title="Desligar">
                      <AlertCircle size={14} />
                    </button>
                    <button onClick={() => excluirFuncionario(func.id)} className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {funcionariosAtivos.length === 0 && <p className="text-center text-gray-500 py-8">Nenhum funcionário ativo</p>}
            </div>
          </>
        )}

        {activeTab === 'treinamentos' && (
          <>
            <h2 className="font-semibold mb-4">Treinamentos</h2>
            <div className="space-y-3">
              {treinamentos.map(t => {
                const func = funcionarios.find(f => f.id === t.funcionarioId);
                return (
                  <div key={t.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.concluido ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                        {t.concluido ? <CheckCircle size={18} className="text-green-400" /> : <GraduationCap size={18} className="text-blue-400" />}
                      </div>
                      <div>
                        <p className="font-medium">{t.titulo}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{func?.nome || 'N/A'} • {t.duracao}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${t.concluido ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {t.concluido ? 'Concluído' : 'Pendente'}
                      </span>
                      <button onClick={() => toggleTreinamento(t.id)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white">
                        {t.concluido ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                      </button>
                    </div>
                  </div>
                );
              })}
              {treinamentos.length === 0 && <p className="text-center text-gray-500 py-8">Nenhum treinamento registrado</p>}
            </div>
          </>
        )}

        {activeTab === 'offboarding' && (
          <>
            <h2 className="font-semibold mb-4">Colaboradores Desligados</h2>
            <div className="space-y-3">
              {desligados.map(func => (
                <div key={func.id} className={`flex items-center justify-between p-4 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'} opacity-70`}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-500/20 flex items-center justify-center text-gray-400 font-bold">
                      {func.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium">{func.nome}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{func.cargo} • {func.departamento}</p>
                      {func.motivoDesligamento && <p className="text-xs text-red-400 mt-1">Motivo: {func.motivoDesligamento}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-500/20 text-gray-400">Desligado</span>
                    {func.dataDesligamento && <p className="text-xs text-gray-500 mt-1">{func.dataDesligamento}</p>}
                  </div>
                </div>
              ))}
              {desligados.length === 0 && <p className="text-center text-gray-500 py-8">Nenhum colaborador desligado</p>}
            </div>
          </>
        )}
      </div>

      {showOffboard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-2xl w-full max-w-md ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Processo de Offboarding</h2>
              <button onClick={() => setShowOffboard(null)}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm">Motivo do Desligamento</label>
                <select value={offboardData.motivo} onChange={e => setOffboardData({ ...offboardData, motivo: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700">
                  <option value="">Selecione...</option>
                  <option value="Demissão sem justa causa">Demissão sem justa causa</option>
                  <option value="Demissão por justa causa">Demissão por justa causa</option>
                  <option value="Pedido de demissão">Pedido de demissão</option>
                  <option value="Término de contrato">Término de contrato</option>
                  <option value="Aposentadoria">Aposentadoria</option>
                </select>
              </div>
              <div>
                <label className="text-sm">Data de Desligamento</label>
                <input type="date" value={offboardData.data} onChange={e => setOffboardData({ ...offboardData, data: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" />
              </div>
              <div>
                <label className="text-sm">Observações</label>
                <textarea value={offboardData.observacoes} onChange={e => setOffboardData({ ...offboardData, observacoes: e.target.value })} className="w-full mt-1 p-2 rounded-lg bg-gray-800 border border-gray-700" rows={3} placeholder="Observações sobre o desligamento" />
              </div>
              <button onClick={() => desligarFuncionario(showOffboard)} disabled={!offboardData.motivo} className="w-full py-2 bg-red-500 rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2">
                Confirmar Desligamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ATHOSPeople;
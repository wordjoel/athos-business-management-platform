import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { User, Mail, Phone, Key, Save, CheckCircle, Eye, EyeOff } from 'lucide-react';

const Perfil: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState(user?.nome || '');
  const [telefone, setTelefone] = useState(user?.telefone || '');
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [salvo, setSalvo] = useState(false);
  const [senhaSalva, setSenhaSalva] = useState(false);

  const handleSalvarPerfil = () => {
    const usuarioLogado = JSON.parse(localStorage.getItem('athos_usuario_logado') || '{}');
    const usuarioAtualizado = {
      ...usuarioLogado,
      nome: nome,
      telefone: telefone,
      avatar: nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'US',
    };
    localStorage.setItem('athos_usuario_logado', JSON.stringify(usuarioAtualizado));
    setSalvo(true);
    setEditando(false);
    addToast({ type: 'success', title: 'Perfil atualizado', message: 'Dados salvos com sucesso' });
    setTimeout(() => setSalvo(false), 2000);
  };

  const handleSalvarSenha = () => {
    if (novaSenha !== confirmarSenha) {
      addToast({ type: 'error', title: 'Erro', message: 'Senhas não conferem' });
      return;
    }
    if (novaSenha.length < 6) {
      addToast({ type: 'error', title: 'Erro', message: 'Senha deve ter no mínimo 6 caracteres' });
      return;
    }
    const passwords = JSON.parse(localStorage.getItem('athos_local_passwords') || '{}');
    if (user?.email) {
      if (passwords[user.email] && passwords[user.email] !== senhaAtual) {
        addToast({ type: 'error', title: 'Erro', message: 'Senha atual incorreta' });
        return;
      }
      passwords[user.email] = novaSenha;
      localStorage.setItem('athos_local_passwords', JSON.stringify(passwords));
    }
    setSenhaSalva(true);
    setSenhaAtual('');
    setNovaSenha('');
    setConfirmarSenha('');
    addToast({ type: 'success', title: 'Senha alterada', message: 'Senha atualizada com sucesso' });
    setTimeout(() => setSenhaSalva(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
          <User size={24} className="text-cyan-400" /> Meu Perfil
        </h1>
        <p className="text-sm mt-1 text-gray-400">Gerencie suas informações pessoais e senha</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-white/5 bg-gray-900/80 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center text-gray-900 text-3xl font-bold mb-4 shadow-lg shadow-cyan-500/20">
              {user?.avatar || 'US'}
            </div>
            <h2 className="text-lg font-bold text-white">{user?.nome}</h2>
            <p className="text-sm text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/5 bg-gray-900/80 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white">Informações Pessoais</h3>
              <button
                onClick={() => { setEditando(!editando); if (editando) handleSalvarPerfil(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                {editando ? <Save size={14} /> : <User size={14} />}
                {editando ? 'Salvar' : 'Editar'}
              </button>
            </div>

            {salvo && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                <CheckCircle size={16} /> Dados salvos com sucesso!
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5 mb-1.5">
                  <Mail size={12} /> E-mail
                </label>
                <div className="w-full px-3 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-gray-400">
                  {user?.email}
                </div>
                <p className="text-[10px] text-gray-600 mt-1">O e-mail não pode ser alterado</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5 mb-1.5">
                  <User size={12} /> Nome completo
                </label>
                {editando ? (
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-white/10 bg-white/5 text-white focus:border-cyan-500/50 transition-colors"
                  />
                ) : (
                  <div className="w-full px-3 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-gray-300">
                    {user?.nome}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5 mb-1.5">
                  <Phone size={12} /> Telefone
                </label>
                {editando ? (
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-white/10 bg-white/5 text-white focus:border-cyan-500/50 transition-colors"
                    placeholder="(11) 99999-9999"
                  />
                ) : (
                  <div className="w-full px-3 py-2.5 rounded-xl text-sm border border-white/10 bg-white/5 text-gray-300">
                    {user?.telefone || '—'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-gray-900/80 p-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 mb-6">
              <Key size={14} className="text-cyan-400" /> Alterar Senha
            </h3>

            {senhaSalva && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                <CheckCircle size={16} /> Senha alterada com sucesso!
              </div>
            )}

            <div className="space-y-4 max-w-md">
              <div className="relative">
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Senha atual</label>
                <input
                  type={showSenhaAtual ? 'text' : 'password'}
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-white/10 bg-white/5 text-white focus:border-cyan-500/50 transition-colors pr-10"
                />
                <button
                  onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                  className="absolute right-3 bottom-2.5 text-gray-500 hover:text-cyan-400"
                >
                  {showSenhaAtual ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <div className="relative">
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Nova senha</label>
                <input
                  type={showNovaSenha ? 'text' : 'password'}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-white/10 bg-white/5 text-white focus:border-cyan-500/50 transition-colors pr-10"
                />
                <button
                  onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="absolute right-3 bottom-2.5 text-gray-500 hover:text-cyan-400"
                >
                  {showNovaSenha ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <div className="relative">
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Confirmar nova senha</label>
                <input
                  type={showConfirmar ? 'text' : 'password'}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none border border-white/10 bg-white/5 text-white focus:border-cyan-500/50 transition-colors pr-10"
                />
                <button
                  onClick={() => setShowConfirmar(!showConfirmar)}
                  className="absolute right-3 bottom-2.5 text-gray-500 hover:text-cyan-400"
                >
                  {showConfirmar ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              <button
                onClick={handleSalvarSenha}
                disabled={!senhaAtual || !novaSenha || !confirmarSenha}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-sm"
              >
                <Key size={14} /> Alterar Senha
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;

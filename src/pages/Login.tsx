import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Lock, Mail, Eye, EyeOff, Shield, Brain, Building2, ChevronRight } from 'lucide-react';

const usuariosValidos = [
  { email: 'kleber@athos.com', senha: 'kleber2025', nome: 'Kleber Duarte', avatar: 'KD' },
  { email: 'luiz@athos.com', senha: 'luiz2025', nome: 'Luiz Victor', avatar: 'LV' },
  { email: 'joel@athos.com', senha: 'joel2025', nome: 'Joel Oliveira', avatar: 'JO' },
  { email: 'oscar@athos.com', senha: 'oscar2025', nome: 'Oscar Carvalho', avatar: 'OC' },
  { email: 'mauricio@athos.com', senha: 'mauricio2025', nome: 'Mauricio Baro', avatar: 'MB' },
];

const LoginPage: React.FC = () => {
  const { login, nomeEmpresa } = useApp();
  const [email, setEmail] = useState('kleber@athos.com');
  const [password, setPassword] = useState('kleber2025');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const usuario = usuariosValidos.find(u => u.email === email && u.senha === password);
    
    if (!usuario) {
      setError('Email ou senha inválidos');
      return;
    }
    
    setLoading(true);
    localStorage.setItem('athos_usuario_logado', JSON.stringify(usuario));
    setTimeout(() => {
      login(email, password);
      setLoading(false);
    }, 1500);
  };

  const fillCredentials = (usuario: typeof usuariosValidos[0]) => {
    setEmail(usuario.email);
    setPassword(usuario.senha);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-900">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-3xl" />
      </div>

      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-40 h-40 mb-6 overflow-hidden rounded-3xl shadow-2xl shadow-cyan-500/30">
            <img src="/logo.png" alt="ATHOS Logo" className="w-full h-full object-contain" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-cyan-400 font-medium">ATHOS Solution Tecnologia LTDA</span>
          </div>
        </div>

        <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-slide-up">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">Bem-vindo de volta</h2>
            <p className="text-sm text-gray-500 mt-1">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-gray-900 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-gray-500 mb-3">Selecione um perfil para teste:</p>
            <div className="grid grid-cols-1 gap-2">
              {usuariosValidos.map((u, i) => (
                <button
                  key={i}
                  onClick={() => fillCredentials(u)}
                  className={`p-2 rounded-lg flex items-center gap-3 transition-all text-left ${
                    email === u.email 
                      ? 'bg-cyan-500/20 border border-cyan-500/50' 
                      : 'bg-gray-800/50 border border-white/5 hover:bg-gray-800'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 flex items-center justify-center text-gray-900 text-xs font-bold">
                    {u.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{u.nome}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <span className="text-xs text-cyan-400">Teste</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          © 2026 ATHOS Solution Tecnologia LTDA
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
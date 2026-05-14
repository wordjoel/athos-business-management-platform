import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Lock, Mail, Eye, EyeOff, Shield, Brain, Building2, ChevronRight } from 'lucide-react';

const usuariosValidos = [
  { email: 'kleber@athos.com', senha: 'kleber2025', nome: 'Kleber Duarte', avatar: 'KD', telefone: '' },
  { email: 'luiz@athos.com', senha: 'luiz2025', nome: 'Luiz Victor', avatar: 'LV', telefone: '' },
  { email: 'joel@athos.com', senha: 'joel2025', nome: 'Joel Oliveira', avatar: 'JO', telefone: '+5511953992662' },
  { email: 'oscar@athos.com', senha: 'oscar2025', nome: 'Oscar Carvalho', avatar: 'OC', telefone: '' },
  { email: 'mauricio@athos.com', senha: 'mauricio2025', nome: 'Mauricio Baro', avatar: 'MB', telefone: '' },
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

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex justify-center mb-2">
          <div className="w-28 h-28">
            <img src="/logo.png" alt="ATHOS Logo" className="w-full h-full object-contain opacity-90" />
          </div>
        </div>

        <div className="bg-gray-900/60 backdrop-blur-lg rounded-2xl p-5 mt-2">
          <div className="text-center mb-5">
            <h2 className="text-lg font-semibold text-white">Bem-vindo</h2>
            <p className="text-xs text-gray-500 mt-1">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800/30 border border-white/5 rounded-lg text-white placeholder-gray-600 text-center text-sm focus:outline-none focus:border-cyan-500"
                placeholder="email@athos.com"
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-800/30 border border-white/5 rounded-lg text-white placeholder-gray-600 text-center text-sm focus:outline-none focus:border-cyan-500"
                placeholder="senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg text-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-3 text-center">
            <p className="text-[10px] text-gray-600">
              {usuariosValidos.map((u, i) => (
                <span key={i}>
                  <button onClick={() => fillCredentials(u)} className="hover:text-cyan-400 transition-colors">{u.nome.split(' ')[0]}</button>
                  {i < usuariosValidos.length - 1 && <span className="text-gray-700 mx-1">|</span>}
                </span>
              ))}
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          © 2026 ATHOS
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
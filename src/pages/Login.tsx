import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Zap, Lock, Mail, Eye, EyeOff, Shield, Brain, Building2, ChevronRight } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login } = useApp();
  const [email, setEmail] = useState('carlos@atos.com');
  const [password, setPassword] = useState('atos2025');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-athos-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-athos-900/20 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 w-full max-w-lg px-6">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-4 overflow-hidden rounded-2xl">
            <img src="/logo.png" alt="ATOS Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">ATOS</h1>
          <p className="text-sm text-gray-500 mt-1 tracking-[0.2em] uppercase">Centro de Organização</p>
        </div>

        {/* Login Card */}
        <div className="bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-slide-up">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">Bem-vindo de volta</h2>
            <p className="text-sm text-gray-500 mt-1">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-athos-500/50 transition-colors placeholder-gray-600"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-athos-500/50 transition-colors placeholder-gray-600"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-white/5 text-athos-500 focus:ring-athos-500" />
                <span className="text-xs text-gray-400">Lembrar-me</span>
              </label>
              <a href="#" className="text-xs text-athos-400 hover:underline">Esqueceu a senha?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl gradient-athos text-white text-sm font-semibold shadow-glow hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                <>Entrar <ChevronRight size={14} /></>
              )}
            </button>
          </form>

          <div className={`mt-6 pt-6 border-t border-white/5 flex items-center justify-center gap-6`}>
            <div className="flex items-center gap-1.5 text-gray-600">
              <Shield size={12} />
              <span className="text-[10px]">SSL Seguro</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <Brain size={12} />
              <span className="text-[10px]">IA Integrada</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <Building2 size={12} />
              <span className="text-[10px]">Multi-empresa</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">© 2025 ATOS - Escritório Virtual Administrativo. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useFormValidation, validationRules } from '../hooks/useFormValidation';
import { useTranslation } from 'react-i18next';
import { Zap, Lock, Mail, Eye, EyeOff } from 'lucide-react';

interface LoginFormValues extends Record<string, unknown> {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { addToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useFormValidation<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: [
        validationRules.required(t('auth.email_required')),
        validationRules.email(t('auth.invalid_email')),
      ],
      password: [
        validationRules.required(t('auth.password_required')),
        validationRules.minLength(6, t('auth.min_length', { count: 6 })),
      ],
    },
    onSubmit: async (formValues) => {
      const success = await login(formValues.email, formValues.password);
      
      if (success) {
        addToast({
          type: 'success',
          title: t('auth.welcome_back'),
          message: t('common.success'),
        });
        navigate('/dashboard');
      } else {
        addToast({
          type: 'error',
          title: t('auth.invalid_credentials'),
          message: t('common.error'),
        });
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-950">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full animate-morph" style={{
          background: 'radial-gradient(circle at center, rgba(0,255,255,0.12) 0%, rgba(0,204,204,0.04) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animationDuration: '20s',
        }} />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full animate-morph" style={{
          background: 'radial-gradient(circle at center, rgba(0,255,255,0.08) 0%, rgba(0,204,204,0.03) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animationDuration: '25s',
          animationDelay: '-7s',
        }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full animate-morph" style={{
          background: 'radial-gradient(circle at center, rgba(0,255,255,0.06) 0%, rgba(0,204,204,0.02) 40%, transparent 70%)',
          filter: 'blur(60px)',
          animationDuration: '18s',
          animationDelay: '-14s',
        }} />
      </div>

      <div className="absolute inset-0 bg-grid-teal opacity-50" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="absolute rounded-full animate-drift" style={{
            width: 2 + (i % 3) * 2,
            height: 2 + (i % 3) * 2,
            left: `${(i * 7 + 3) % 100}%`,
            top: `${(i * 13 + 7) % 100}%`,
            background: `rgba(0, 255, 255, ${0.1 + (i % 3) * 0.08})`,
            boxShadow: `0 0 ${(2 + (i % 3) * 2) * 2}px rgba(0, 255, 255, 0.15)`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${8 + (i % 5) * 2}s`,
          }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 animate-float">
            <img src="/logo.png" alt="ATHOS Logo" className="w-full h-full object-contain opacity-90 drop-shadow-[0_0_20px_rgba(0,255,255,0.3)]" />
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative glass-card rounded-2xl p-6">
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-white">{t('app.welcome')}</h2>
              <p className="text-xs text-gray-500 mt-1">{t('auth.enter_credentials')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    value={values.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                    className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none transition-all duration-300 ${
                      touched.email && errors.email 
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
                        : 'border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20'
                    }`}
                    placeholder={t('auth.email')}
                    disabled={isSubmitting || loading}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1 animate-fade-in">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    onBlur={handleBlur('password')}
                    className={`w-full pl-10 pr-12 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none transition-all duration-300 ${
                      touched.password && errors.password 
                        ? 'border-red-500/50 focus:border-red-500 focus:ring-1 focus:ring-red-500/20' 
                        : 'border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20'
                    }`}
                    placeholder={t('auth.password')}
                    disabled={isSubmitting || loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1 animate-fade-in">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:from-cyan-600/50 disabled:to-teal-600/50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
              >
                {isSubmitting || loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('auth.sign_in')}
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    {t('auth.sign_in')}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          © 2026 ATHOS Platform
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
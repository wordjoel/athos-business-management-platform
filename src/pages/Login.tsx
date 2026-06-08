import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useFormValidation, validationRules } from '../hooks/useFormValidation';
import { useTranslation } from 'react-i18next';
import { Zap, Lock, Mail, Eye, EyeOff } from 'lucide-react';

interface LoginFormValues {
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
            <h2 className="text-lg font-semibold text-white">{t('app.welcome')}</h2>
            <p className="text-xs text-gray-500 mt-1">{t('auth.enter_credentials')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  className={`w-full pl-10 pr-4 py-2.5 bg-gray-800/30 border rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none transition-colors ${
                    touched.email && errors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-white/5 focus:border-cyan-500'
                  }`}
                  placeholder={t('auth.email')}
                  disabled={isSubmitting || loading}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                className={`w-full pl-10 pr-12 py-2.5 bg-gray-800/30 border rounded-lg text-white placeholder-gray-600 text-sm focus:outline-none transition-colors ${
                  touched.password && errors.password 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-white/5 focus:border-cyan-500'
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
              <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-600/50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-all flex items-center justify-center gap-2"
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
                  <Zap size={16} />
                  {t('auth.sign_in')}
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-4">
          © 2026 ATHOS Platform
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
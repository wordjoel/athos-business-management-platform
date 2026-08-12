import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useFormValidation, validationRules } from '../hooks/useFormValidation';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

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
      ],
      password: [
        validationRules.required(t('auth.password_required')),
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

  const busy = isSubmitting || loading;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0B0E14]">
      <div className="absolute inset-0 bg-grid-teal opacity-60" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[560px] h-[560px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(201,169,97,0.14) 0%, transparent 68%)' }} />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="ATHOS" className="w-20 h-20 object-contain" />
        </div>

        <div className="glass-card overflow-hidden">
          <div className="px-6 pt-6 pb-5 text-center border-b border-[#232837]">
            <p className="module-eyebrow mb-2">Acesso Privado</p>
            <h1 className="font-display text-2xl text-[#F0E6CC]">{t('app.welcome')}</h1>
            <p className="text-xs text-[#8B93A6] mt-1.5">{t('auth.enter_credentials')}</p>
          </div>

          <div className="p-6 pt-5">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-[#8B93A6] mb-1.5">
                  <Mail size={13} />
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  className={`w-full py-2.5 px-3 bg-[#0B0E14] rounded-[10px] border text-[#F0E6CC] placeholder-[#4E5468] text-sm focus:outline-none transition-colors ${
                    touched.email && errors.email ? 'border-[#A6484A]' : 'border-[#232837] focus:border-[#C9A961]'
                  }`}
                  placeholder={t('auth.email')}
                  disabled={busy}
                />
                {touched.email && errors.email && (
                  <p className="text-[#C06A6C] text-xs mt-1.5 animate-fade-in">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs font-medium text-[#8B93A6] mb-1.5">
                  <Lock size={13} />
                  {t('auth.password')}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    onBlur={handleBlur('password')}
                    className={`w-full py-2.5 px-3 pr-10 bg-[#0B0E14] rounded-[10px] border text-[#F0E6CC] placeholder-[#4E5468] text-sm focus:outline-none transition-colors ${
                      touched.password && errors.password ? 'border-[#A6484A]' : 'border-[#232837] focus:border-[#C9A961]'
                    }`}
                    placeholder={t('auth.password')}
                    disabled={busy}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 px-3 text-[#8B93A6] hover:text-[#C9A961] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-[#C06A6C] text-xs mt-1.5 animate-fade-in">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 rounded-[10px] font-medium text-sm transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: busy ? '#232837' : 'linear-gradient(135deg, #E0C583 0%, #C9A961 55%, #A98A47 100%)', color: busy ? '#8B93A6' : '#12151E' }}
              >
                {busy ? 'Entrando…' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-[#4E5468] text-xs mt-6 tracking-wide">
          © 2026 ATHOS Platform
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

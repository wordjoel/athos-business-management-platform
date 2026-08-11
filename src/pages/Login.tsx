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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-grid-teal opacity-60" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="ATHOS Logo" className="w-24 h-24 object-contain" />
        </div>

        <div className="bg-[#0a0a0a] border border-[#1f521f]">
          <div className="px-4 py-2 border-b border-[#1f521f] flex items-center justify-between">
            <span className="text-xs text-[#33ff00] font-bold tracking-widest">+--- LOGIN ---+</span>
            <span className="text-[10px] text-[#1f521f]">v2.4.0</span>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <p className="text-sm text-[#33ff00]">{t('app.welcome')}</p>
              <p className="text-xs text-[#3f9e5c] mt-1">{t('auth.enter_credentials')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-xs text-[#33ff00] mb-1">
                  <Mail size={13} className="text-[#3f9e5c]" />
                  user@athos:~$
                </label>
                <input
                  type="email"
                  value={values.email}
                  onChange={handleChange('email')}
                  onBlur={handleBlur('email')}
                  className={`w-full py-2 bg-transparent border-0 border-b text-[#33ff00] placeholder-[#1f521f] text-sm focus:outline-none transition-colors ${
                    touched.email && errors.email ? 'border-[#ff3333]' : 'border-[#1f521f] focus:border-[#33ff00]'
                  }`}
                  placeholder={t('auth.email')}
                  disabled={busy}
                />
                {touched.email && errors.email && (
                  <p className="text-[#ff3333] text-xs mt-1.5 animate-fade-in">[ERR] {errors.email}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-[#33ff00] mb-1">
                  <Lock size={13} className="text-[#3f9e5c]" />
                  passwd:~$
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    onBlur={handleBlur('password')}
                    className={`w-full py-2 pr-10 bg-transparent border-0 border-b text-[#33ff00] placeholder-[#1f521f] text-sm focus:outline-none transition-colors ${
                      touched.password && errors.password ? 'border-[#ff3333]' : 'border-[#1f521f] focus:border-[#33ff00]'
                    }`}
                    placeholder={t('auth.password')}
                    disabled={busy}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#3f9e5c] hover:text-[#33ff00] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {touched.password && errors.password && (
                  <p className="text-[#ff3333] text-xs mt-1.5 animate-fade-in">[ERR] {errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3 border border-[#33ff00] text-[#33ff00] font-bold text-sm tracking-widest transition-all duration-150 flex items-center justify-center gap-2 hover:bg-[#33ff00] hover:text-[#0a0a0a] disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#33ff00]"
              >
                {busy ? (
                  <span className="animate-blink">CONECTANDO...</span>
                ) : (
                  <span>[ INITIATE ]</span>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-[#1f521f] text-xs mt-6">
          © 2026 ATHOS Platform <span className="animate-blink">_</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

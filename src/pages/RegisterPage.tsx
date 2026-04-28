import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../lib/notification.service';
import { registerUser } from '../api/services/auth.service';
import { useTranslation } from 'react-i18next';
import type { AuthResponse, User } from '../api/types/domain';
import { getAuthErrorMessage, getFieldErrorMessage } from '../lib/auth-error-message';

const toUserFromAuthResponse = (
  data: AuthResponse,
  fallbackUsername: string,
  fallbackEmail: string
): User => {
  const user = data.user;
  return {
    id: user?.id ?? data.id ?? 'new',
    username: user?.username ?? data.username ?? fallbackUsername,
    email: user?.email ?? data.email ?? fallbackEmail,
    role: user?.role ?? data.role,
  };
};

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Limpar erro do campo quando o usuário digita
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      notificationService.error(t('auth.register.passwordMismatch'));
      return;
    }

    setIsLoading(true);

    try {
      const data = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      login(data.token, toUserFromAuthResponse(data, formData.username, formData.email));

      notificationService.success(t('auth.register.success'));
      navigate('/');
    } catch (error) {
      // Tentar extrair erros de campo da resposta
      const passwordError = getFieldErrorMessage(error, 'password');
      if (passwordError) {
        setFieldErrors({ password: passwordError });
      }
      
      notificationService.error(getAuthErrorMessage(error, t, 'register'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center px-4 py-8 transition-colors">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-primary dark:text-brand-accent mb-2">
            flick.business
          </h1>
          <h2 className="text-xl font-semibold text-text-primary dark:text-[#F7F1ED]">
            {t('auth.register.title')}
          </h2>
          <p className="mt-2 text-sm text-text-secondary dark:text-[#CABEB6]">
            {t('auth.register.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-xl border border-border-light bg-card-light p-8 shadow-card dark:border-border-dark dark:bg-card-dark">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-text-primary dark:text-[#F7F1ED]">
              {t('common.username')}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full rounded-input border border-border-light bg-[#FFF8F4] px-3 py-2 text-text-primary placeholder-[#8A817B] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/50 dark:border-border-dark dark:bg-[#16372D] dark:text-[#F7F1ED] dark:placeholder-[#B7AAA2] dark:focus:ring-brand-accent/70"
              placeholder={t('auth.register.usernamePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-text-primary dark:text-[#F7F1ED]">
              {t('common.email')}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-input border border-border-light bg-[#FFF8F4] px-3 py-2 text-text-primary placeholder-[#8A817B] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/50 dark:border-border-dark dark:bg-[#16372D] dark:text-[#F7F1ED] dark:placeholder-[#B7AAA2] dark:focus:ring-brand-accent/70"
              placeholder={t('auth.register.emailPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-text-primary dark:text-[#F7F1ED]">
              {t('common.password')}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`w-full rounded-input border bg-[#FFF8F4] px-3 py-2 text-text-primary placeholder-[#8A817B] transition-colors focus:outline-none focus:ring-2 dark:bg-[#16372D] dark:text-[#F7F1ED] dark:placeholder-[#B7AAA2] ${
                fieldErrors.password
                  ? 'border-red-500 dark:border-red-500 focus:ring-red-500/50'
                  : 'border-border-light dark:border-border-dark focus:ring-brand-primary/50 dark:focus:ring-brand-accent/70'
              }`}
              placeholder={t('auth.register.passwordPlaceholder')}
            />
            {fieldErrors.password && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-text-primary dark:text-[#F7F1ED]">
              {t('auth.register.confirmPasswordLabel')}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-input border border-border-light bg-[#FFF8F4] px-3 py-2 text-text-primary placeholder-[#8A817B] transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary/50 dark:border-border-dark dark:bg-[#16372D] dark:text-[#F7F1ED] dark:placeholder-[#B7AAA2] dark:focus:ring-brand-accent/70"
              placeholder={t('auth.register.confirmPasswordPlaceholder')}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center rounded-btn border border-transparent bg-brand-primary px-4 py-3 text-sm font-medium text-[#1E1E1E] shadow-soft transition-colors hover:bg-brand-accent hover:text-[#F7F1ED] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/50 dark:bg-brand-primary dark:text-[#1E1E1E] dark:hover:bg-brand-accent dark:hover:text-[#F7F1ED] dark:focus:ring-brand-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? t('auth.register.loading') : t('auth.register.submit')}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-text-secondary dark:text-[#CABEB6]">
              {t('auth.register.hasAccount')}{' '}
              <Link
                to="/login"
                className="font-medium text-brand-primary hover:text-brand-primary/80 dark:text-brand-accent dark:hover:text-brand-accent/80 transition-colors"
              >
                {t('auth.register.loginLink')}
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;

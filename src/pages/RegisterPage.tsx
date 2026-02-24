import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { notificationService } from '../lib/notification.service';
import { registerUser } from '../api/services/auth.service';
import { useTranslation } from 'react-i18next';
import type { AuthResponse, User } from '../api/types/domain';
import { getAuthErrorMessage } from '../lib/auth-error-message';

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
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
          <h2 className="text-xl font-semibold text-text-primary dark:text-gray-200">
            {t('auth.register.title')}
          </h2>
          <p className="mt-2 text-sm text-text-secondary dark:text-gray-400">
            {t('auth.register.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-card-light dark:bg-card-dark p-8 rounded-xl shadow-lg border border-border-light dark:border-border-dark">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-primary dark:text-gray-200 mb-2">
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
              className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-input bg-transparent text-text-primary dark:text-gray-200 placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 dark:focus:ring-brand-accent/70 transition-colors"
              placeholder={t('auth.register.usernamePlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary dark:text-gray-200 mb-2">
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
              className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-input bg-transparent text-text-primary dark:text-gray-200 placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 dark:focus:ring-brand-accent/70 transition-colors"
              placeholder={t('auth.register.emailPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary dark:text-gray-200 mb-2">
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
              className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-input bg-transparent text-text-primary dark:text-gray-200 placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 dark:focus:ring-brand-accent/70 transition-colors"
              placeholder={t('auth.register.passwordPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary dark:text-gray-200 mb-2">
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
              className="w-full px-3 py-2 border border-border-light dark:border-border-dark rounded-input bg-transparent text-text-primary dark:text-gray-200 placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-primary/50 dark:focus:ring-brand-accent/70 transition-colors"
              placeholder={t('auth.register.confirmPasswordPlaceholder')}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-btn shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 dark:bg-brand-accent dark:hover:bg-brand-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/50 dark:focus:ring-brand-accent/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? t('auth.register.loading') : t('auth.register.submit')}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-text-secondary dark:text-gray-400">
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

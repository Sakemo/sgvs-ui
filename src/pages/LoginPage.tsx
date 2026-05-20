import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { notificationService } from "../lib/notification.service";
import { loginUser } from "../api/services/auth.service";
import { useTranslation } from "react-i18next";
import type { AuthResponse, User } from "../api/types/domain";
import { getAuthErrorMessage } from "../lib/auth-error-message";
import { useSettings } from "../contexts/utils/UseSettings";

const toUserFromAuthResponse = (
  data: AuthResponse,
  fallbackIdentifier: string
): User => {
  const user = data.user;
  return {
    id: user?.id ?? data.id ?? "unknown",
    username: user?.username ?? data.username ?? fallbackIdentifier,
    email: user?.email ?? data.email ?? "",
    role: user?.role ?? data.role,
  };
};

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { defaultStartPage } = useSettings();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser({
        username: identifier,
        password,
      });

      login(data.token, toUserFromAuthResponse(data, identifier));
      notificationService.success(t("auth.login.success"));
      navigate(defaultStartPage, { replace: true });

    } catch (error) {
      notificationService.error(getAuthErrorMessage(error, t, "login"));
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark flex items-center justify-center px-4 py-8 transition-colors duration-200 ease-in-out">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-primary dark:text-brand-accent mb-2">
            flick.business
          </h1>
          <h2 className="text-xl font-semibold text-text-primary dark:text-[#F7F1ED]">
            {t("auth.login.title")}
          </h2>
          <p className="mt-2 text-sm text-text-secondary dark:text-[#CABEB6]">
            {t("auth.login.subtitle")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 rounded-xl border border-border-light bg-card-light p-8 shadow-card transition-colors dark:border-border-dark dark:bg-card-dark"
        >
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-text-primary dark:text-[#F7F1ED]"
            >
              {t("auth.login.identifierLabel")}
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-lg border border-border-light bg-[#FFF8F4] px-3 py-2 text-text-primary placeholder-[#8A817B] transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary/50 dark:border-border-dark dark:bg-[#16372D] dark:text-[#F7F1ED] dark:placeholder-[#B7AAA2] dark:focus:ring-brand-accent/70"
              placeholder={t("auth.login.identifierPlaceholder")}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-text-primary dark:text-[#F7F1ED]"
            >
              {t("common.password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border-light bg-[#FFF8F4] px-3 py-2 text-text-primary placeholder-[#8A817B] transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-primary/50 dark:border-border-dark dark:bg-[#16372D] dark:text-[#F7F1ED] dark:placeholder-[#B7AAA2] dark:focus:ring-brand-accent/70"
              placeholder={t("auth.login.passwordPlaceholder")}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center rounded-lg border border-transparent bg-brand-primary px-4 py-3 text-sm font-medium text-[#1E1E1E] shadow-soft transition-colors hover:bg-brand-accent hover:text-[#F7F1ED] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/50 dark:bg-brand-primary dark:text-[#1E1E1E] dark:hover:bg-brand-accent dark:hover:text-[#F7F1ED] dark:focus:ring-brand-accent/70 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? t("auth.login.loading") : t("auth.login.submit")}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-text-secondary dark:text-[#CABEB6]">
              {t("auth.login.noAccount")}{" "}
              <Link
                to="/register"
                className="font-medium text-brand-primary hover:text-brand-primary/80 dark:text-brand-accent dark:hover:text-brand-accent/80 transition-colors"
              >
                {t("auth.login.registerLink")}
              </Link>
            </span>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-text-secondary dark:text-[#9E938C]">
            {t("auth.systemCaption")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

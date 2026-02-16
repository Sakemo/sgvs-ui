import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { notificationService } from "../lib/notification.service";
import { loginUser } from "../api/services/auth.service";

const LoginPage: React.FC = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser({
        username: identifier,
        password,
      });

      login(data.token, data.user || { id: '1', username: identifier, email: '' });
      notificationService.success("Login realizado com sucesso!");
      navigate("/");

    } catch (error) {
      notificationService.error("Erro de conexão. Tente novamente.");
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
            SGVS
          </h1>
          <h2 className="text-xl font-semibold text-text-primary dark:text-gray-200">
            Entre na sua conta
          </h2>
          <p className="mt-2 text-sm text-text-secondary dark:text-gray-400">
            Gerencie suas vendas e estoque
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-text-primary dark:text-gray-200 mb-2"
            >
              User or E-mail
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-primary dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 dark:focus:ring-brand-accent/70 focus:border-transparent transition-colors"
              placeholder="Your username or e-mail"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary dark:text-gray-200 mb-2"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-text-primary dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 dark:focus:ring-brand-accent/70 focus:border-transparent transition-colors"
              placeholder="Your password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 dark:bg-brand-accent dark:hover:bg-brand-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary/50 dark:focus:ring-brand-accent/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-text-secondary dark:text-gray-400">
              Não tem uma conta?{" "}
              <Link
                to="/register"
                className="font-medium text-brand-primary hover:text-brand-primary/80 dark:text-brand-accent dark:hover:text-brand-accent/80 transition-colors"
              >
                Cadastre-se
              </Link>
            </span>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-text-secondary dark:text-gray-500">
            Sistema de Gestão de Vendas Simplificado
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

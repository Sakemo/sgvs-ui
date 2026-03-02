import axios, { AxiosError } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const AUTH_EVENT_KEY = "auth:event";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Resposta (para tratamento de erros global)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const { response } = error;
    if (response) {
      const requestUrl = error.config?.url ?? "";
      const isAuthEndpoint = requestUrl.includes("/auth/");

      if (response.status === 401 && !isAuthEndpoint) {
        // Ensure stale sessions are immediately dropped in the current tab.
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Notify other tabs to logout too.
        localStorage.setItem(
          AUTH_EVENT_KEY,
          JSON.stringify({
            type: "LOGOUT",
            sourceTabId: "api-client",
            at: Date.now(),
          })
        );

        if (!window.location.pathname.startsWith("/login")) {
          window.location.assign("/login");
        }
      }

      // Lógica de tratamento de erro (ex: deslogar em 401, mostrar toast de erro, etc.)
      console.error(`API Error: ${response.status}`, response.data);
    } else {
      // Erro de rede ou timeout
      console.error("Network or request error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

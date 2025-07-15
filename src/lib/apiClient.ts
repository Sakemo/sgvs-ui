import axios, { AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor de Requisição (ex: para adicionar token de autenticação)
apiClient.interceptors.request.use(
  (config) => {
    // Lógica de autenticação virá aqui no futuro
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
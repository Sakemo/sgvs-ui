import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { googleLogin as googleLoginService } from '../../api/services/auth.service';
import { notificationService } from '../../lib/notification.service';
import './GoogleLoginButton.css';

/**
 * Componente botão de login com Google
 * Usa Google Sign-in para autenticar usuários
 */
export function GoogleLoginButton() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error('Nenhum token recebido do Google');
      }

      const idToken = credentialResponse.credential;

      // Chamar serviço de autenticação com o token Google
      const authResponse = await googleLoginService(idToken);

      // Armazenar JWT em sessionStorage
      if (authResponse.token) {
        sessionStorage.setItem('authToken', authResponse.token);
      }

      // Atualizar contexto de autenticação
      const userData = {
        id: authResponse.id || '',
        username: authResponse.username || '',
        email: authResponse.email || '',
      };

      login(authResponse.token, userData);

      // Notificar sucesso
      notificationService.success(`Bem-vindo, ${authResponse.username || authResponse.email}!`);

      // Redirecionar para dashboard
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Erro ao fazer login com Google:', error);

      // Tratar diferentes tipos de erro
      if (error.response?.status === 401) {
        notificationService.error('Token Google inválido ou expirado. Tente novamente.');
      } else if (error.response?.status === 429) {
        notificationService.error('Muitas tentativas de login. Tente em 15 minutos.');
      } else {
        notificationService.error(
          error.message || 'Erro ao autenticar com Google. Tente novamente.'
        );
      }
    }
  };

  const handleGoogleError = () => {
    console.error('Erro ao fazer login com Google');
    notificationService.error('Erro ao conectar com Google. Tente novamente.');
  };

  return (
    <div className="google-login-button-container">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        theme="outline"
        size="large"
        width="300"
      />
      <p className="google-login-divider">ou</p>
    </div>
  );
}

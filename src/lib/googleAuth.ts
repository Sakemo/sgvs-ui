/**
 * Configuração para Google OAuth 2.0
 * Este arquivo centraliza as configurações do Google Sign-in
 */

export const GOOGLE_CLIENT_ID = 
  import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

export const GOOGLE_CONFIG = {
  clientId: GOOGLE_CLIENT_ID,
  scope: 'openid email profile',
};

/**
 * Valida se o Client ID foi configurado
 */
export function validateGoogleConfig(): boolean {
  if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID.includes('YOUR_GOOGLE')) {
    console.warn(
      'Google Client ID não foi configurado. ' +
      'Configure VITE_GOOGLE_CLIENT_ID no arquivo .env.local'
    );
    return false;
  }
  return true;
}

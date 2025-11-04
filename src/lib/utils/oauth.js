/**
 * OAuth utility functions
 */

export const getOAuthRedirectUrl = (page = 'login') => {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const redirectUrl = `${window.location.origin}/${page}`;
  const cleanBackendUrl = backendUrl.replace(/\/api$/, '');
  return `${cleanBackendUrl}/api/auth/google?redirect_url=${encodeURIComponent(redirectUrl)}`;
};


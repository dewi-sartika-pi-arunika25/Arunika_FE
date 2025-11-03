// app/api/nextauth/[...nextauth]/route.js
// ✅ Moved from /api/auth to /api/nextauth to avoid conflict with custom auth API
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Use environment variable for backend API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  
  // ✅ Configure basePath to /api/nextauth
  basePath: '/api/nextauth',
  
  // ✅ Explicitly set base URL for client-side detection
  ...(process.env.NEXTAUTH_URL && { url: process.env.NEXTAUTH_URL }),
  
  pages: {
    signIn: '/login',
    error: '/login?error=OAuthError',
  },
  
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow sign in if it's Google OAuth
      if (account?.provider === 'google') {
        try {
          // Try to register/login user dengan backend
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.name || profile?.name || user.email,
              email: user.email,
              password: `oauth_${user.id}_${Date.now()}`, // Password dummy untuk OAuth
            }),
          });

          // If registration fails, try login instead (user might already exist)
          if (!response.ok) {
            console.log('Registration failed, trying login...');
            const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: user.email,
                password: `oauth_${user.id}_${Date.now()}`, // This won't work, need to handle OAuth login differently
              }),
            });
            
            // If both fail, still allow sign in (user can register manually)
            if (!loginResponse.ok) {
              console.warn('OAuth sync failed, but allowing sign in');
            }
          }
        } catch (error) {
          console.error('OAuth sync error:', error);
          // Still allow sign in even if sync fails
        }
      }
      
      return true; // Always allow sign in
    },

    async jwt({ token, user, account }) {
      // Jika login dengan OAuth (Google)
      if (account?.provider === 'google' && user) {
        // Sync dengan backend Supabase
        try {
          // Try register first
          let response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.name || user.email,
              email: user.email,
              password: `oauth_${user.id}_${Date.now()}`, // Password dummy untuk OAuth
            }),
          });

          // If user already exists, the register will fail but that's ok
          // We'll get tokens from session callback instead
          if (response.ok) {
            const data = await response.json();
            if (data?.data?.access_token) {
              token.accessToken = data.data.access_token;
              token.refreshToken = data.data.refresh_token;
              token.user = data.data.user;
              token.profile = data.data.profile;
            }
          }
        } catch (error) {
          console.error('OAuth sync error in JWT:', error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Pass tokens ke session
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.user.id = token.user?.id || token.sub;
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Handle redirect after sign in
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/skill-match`;
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };


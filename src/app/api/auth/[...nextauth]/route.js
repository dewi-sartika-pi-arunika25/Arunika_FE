// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Redirect ke frontend setelah OAuth
      // Supabase akan handle OAuth flow
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Jika login dengan OAuth (Google)
      if (account?.provider === 'google' && user) {
        // Sync dengan backend Supabase
        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              password: `oauth_${user.id}_${Date.now()}`, // Password dummy untuk OAuth
            }),
          });

          if (response.ok) {
            const data = await response.json();
            token.accessToken = data.data?.access_token;
            token.refreshToken = data.data?.refresh_token;
          }
        } catch (error) {
          console.error('OAuth sync error:', error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Pass tokens ke session
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
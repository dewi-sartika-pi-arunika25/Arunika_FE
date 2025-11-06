// app/api/auth/[...nextauth]/route.js
// ✅ Duplicate handler for /api/auth/* path (Google OAuth might use this path)
// This is needed because NextAuth might not respect basePath correctly
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from "next/server";
import { API_BASE_URL, forwardSetCookieHeaders } from '@/lib/utils/errorHandler';

// Validate required environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error('❌ Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
  throw new Error('Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

if (!process.env.NEXTAUTH_SECRET) {
  console.error('❌ Missing NEXTAUTH_SECRET - sessions will not work properly');
  throw new Error('Missing NEXTAUTH_SECRET - sessions will not work properly');
}

// Validate GOOGLE_CLIENT_SECRET format (should not be API Key)
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (clientSecret && clientSecret.startsWith('AIza')) {
  console.error('❌ CRITICAL ERROR: GOOGLE_CLIENT_SECRET appears to be an API Key!');
  console.error('   GOOGLE_CLIENT_SECRET should be OAuth 2.0 Client Secret from Google Cloud Console');
  console.error('   NOT the API Key (which starts with "AIza...")');
  console.error('   Get OAuth Client Secret from: Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client ID');
  console.error('   Current value starts with:', clientSecret.substring(0, 20) + '...');
  throw new Error('GOOGLE_CLIENT_SECRET is incorrect - appears to be API Key instead of OAuth Client Secret');
}

console.log('✅ NextAuth environment variables validated:', {
  hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
  hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  clientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
  clientSecretPreview: process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET.substring(0, 10) + '...' : 'missing',
  hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  nextAuthUrl: process.env.NEXTAUTH_URL || 'not set'
});

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  
  // Set NEXTAUTH_URL explicitly to prevent CLIENT_FETCH_ERROR
  ...(process.env.NEXTAUTH_URL && { url: process.env.NEXTAUTH_URL }),
  
  // ✅ Use default path /api/auth (no basePath)
  pages: {
    signIn: '/login',
    error: '/login?error=OAuthError',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Cookie configuration
  useSecureCookies: process.env.NODE_ENV === 'production',
  
  // Trust proxy for cookie setting (important for development)
  trustHost: true,
  
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
              password: `oauth_${user.id}_${Date.now()}`,
            }),
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(10000), // 10 seconds timeout
          });

          // If registration fails, try login instead (user might already exist)
          if (!response.ok) {
            console.log('Registration failed, trying login...');
            try {
              const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email: user.email,
                  password: `oauth_${user.id}_${Date.now()}`,
                }),
              });
              
              if (!loginResponse.ok) {
                const contentType = loginResponse.headers.get('content-type');
                const isJSON = contentType && contentType.includes('application/json');
                
                if (!isJSON) {
                  const text = await loginResponse.text().catch(() => '');
                  if (text.includes('<!DOCTYPE') || text.includes('<html')) {
                    console.error('❌ OAuth login: Backend tidak berjalan!');
                    console.error('   URL yang dicoba:', `${API_BASE_URL}/auth/login`);
                    console.error('   Pastikan backend berjalan di', API_BASE_URL);
                  } else {
                    console.warn('OAuth login failed - non-JSON response:', text.substring(0, 200));
                  }
                } else {
                  const errorData = await loginResponse.json().catch(() => ({}));
                  console.warn('OAuth login failed:', errorData);
                }
              }
            } catch (loginError) {
              console.warn('OAuth login attempt error:', loginError.message);
            }
          }
        } catch (error) {
          // Handle fetch errors gracefully
          if (error.name === 'AbortError') {
            console.warn('⚠️ OAuth sync: Backend request timeout');
          } else if (error.message?.includes('fetch')) {
            console.warn('⚠️ OAuth sync: Backend not reachable:', error.message);
          } else {
            console.error('OAuth sync error:', error.message || error);
          }
        }
      }
      
      return true;
    },

    async jwt({ token, user, account, trigger }) {
      // Only log detail for actual sign-in events, not for session validation
      const isSignIn = !!user && !!account;
      
      if (isSignIn) {
        console.log('🔄 JWT callback: Sign-in event', { 
          provider: account?.provider,
          email: user?.email,
          trigger
        });
      } else if (trigger === 'update') {
        console.log('🔄 JWT callback: Token update triggered');
      }
      // Silent for normal session validation (no user/account)
      
      // Initial sign in - store tokens from backend
      if (account?.provider === 'google' && user) {
        console.log('🔄 JWT callback: Processing Google OAuth sign-in...', { email: user.email });
        
        // CRITICAL: Always store user info in token FIRST (before async operations)
        // This ensures token is always valid even if backend call fails
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.sub = user.id || account.providerAccountId || user.email;
        
        console.log('✅ JWT callback: User info stored in token', { 
          email: token.email, 
          sub: token.sub 
        });
        
        // Try to sync with backend (non-blocking)
        try {
          console.log('🔄 JWT callback: Syncing OAuth user with backend...', { email: user.email });
          
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.name || user.email,
              email: user.email,
              password: `oauth_${user.id}_${Date.now()}`,
            }),
            // Add timeout to prevent hanging
            signal: AbortSignal.timeout(10000), // 10 seconds timeout
          });

          // Check if backend is reachable
          if (!response) {
            console.warn('⚠️ JWT callback: Backend tidak merespons - pastikan backend berjalan di', API_BASE_URL);
            return;
          }

          const contentType = response.headers.get('content-type');
          const isJSON = contentType && contentType.includes('application/json');

          if (response.ok && isJSON) {
            const data = await response.json();
            console.log('✅ JWT callback: Backend registration successful');
            if (data?.data?.access_token) {
              token.accessToken = data.data.access_token;
              token.refreshToken = data.data.refresh_token;
              token.user = data.data.user;
              token.profile = data.data.profile;
              console.log('✅ JWT callback: Tokens stored in token');
            } else {
              console.warn('⚠️ JWT callback: No tokens in response data');
            }
          } else {
            // Backend mengembalikan HTML atau error page
            if (!isJSON) {
              const text = await response.text().catch(() => '');
              if (text.includes('<!DOCTYPE') || text.includes('<html')) {
                console.error('❌ JWT callback: Backend tidak berjalan atau endpoint tidak ditemukan!');
                console.error('   URL yang dicoba:', `${API_BASE_URL}/auth/register`);
                console.error('   Response adalah HTML (bukan JSON) - pastikan backend berjalan');
                console.error('   Status:', response.status, response.statusText);
              } else {
                console.warn('⚠️ JWT callback: Backend returned non-JSON response:', text.substring(0, 200));
              }
            } else {
              const errorData = await response.json().catch(() => ({}));
              console.warn('⚠️ JWT callback: Registration failed (user might exist):', errorData);
            }
            // Don't fail - user info is already in token
          }
        } catch (error) {
          // Handle fetch errors gracefully (network errors, timeouts, etc.)
          if (error.name === 'AbortError') {
            console.warn('⚠️ JWT callback: Backend request timeout - continuing without sync');
          } else if (error.message?.includes('fetch')) {
            console.warn('⚠️ JWT callback: Backend not reachable - continuing without sync:', error.message);
          } else {
            console.error('❌ JWT callback: OAuth sync error:', error.message || error);
          }
          // Don't fail - user info is already in token, cookie will still be set
        }
      }

      // Only log on sign-in or if token is missing critical data
      if (isSignIn || !token.email) {
        console.log('✅ JWT callback: Returning token', { 
          hasEmail: !!token.email,
          hasSub: !!token.sub,
          isSignIn
        });
      }
      return token;
    },

    async session({ session, token }) {
      console.log('🔄 Session callback:', { 
        hasToken: !!token,
        hasEmail: !!token.email,
        hasAccessToken: !!token.accessToken 
      });
      
      // Pass tokens ke session
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (token.refreshToken) {
        session.refreshToken = token.refreshToken;
      }
      
      // Ensure user data is populated
      if (token.email) {
        session.user.email = token.email;
      }
      if (token.name) {
        session.user.name = token.name;
      }
      if (token.picture) {
        session.user.image = token.picture;
      }
      
      // Set user ID
      if (token.user?.id) {
        session.user.id = token.user.id;
      } else if (token.sub) {
        session.user.id = token.sub;
      }
      
      // Pass has_assessment from token to session
      if (token.user?.has_assessment !== undefined) {
        session.user.has_assessment = token.user.has_assessment;
      } else if (token.profile?.has_assessment !== undefined) {
        session.user.has_assessment = token.profile.has_assessment;
      }
      
      console.log('✅ Session callback result:', { 
        email: session.user.email,
        hasAccessToken: !!session.accessToken,
        hasAssessment: session.user.has_assessment || false
      });
      
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Handle redirect after OAuth callback
      console.log('🔄 NextAuth redirect callback:', { url, baseUrl });
      
      // Don't redirect to /login if we have a valid callbackUrl
      // Instead, redirect to skill-match - frontend will handle redirect based on assessment
      if (url.startsWith('/')) {
        // If it's /login, redirect to skill-match instead
        // Frontend will handle OAuth callback and redirect appropriately
        if (url === '/login' || url.startsWith('/login?')) {
          console.log('⚠️ Redirecting to /login, but session should be set. Redirecting to /skill-match instead.');
          return `${baseUrl}/skill-match`;
        }
        return `${baseUrl}${url}`;
      }
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default redirect to skill-match (frontend will handle redirect based on assessment)
      return `${baseUrl}/skill-match`;
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
});

// NextAuth v4 exports handlers directly
// For Next.js 15, we need to export the handler directly
// Wrap with logging to debug
export async function GET(req, context) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const searchParams = Object.fromEntries(url.searchParams);
  
  console.log('📥 NextAuth GET handler called:', {
    pathname,
    searchParams,
    hasCode: !!searchParams.code,
    hasError: !!searchParams.error
  });
  
  try {
    const response = await handler(req, context);
    
    // Check if cookie is set in response
    const setCookieHeader = response.headers.get('set-cookie');
    const allHeaders = Array.from(response.headers.entries());
    
    console.log('📤 NextAuth GET response:', {
      status: response?.status,
      hasSetCookie: !!setCookieHeader,
      cookieHeader: setCookieHeader ? setCookieHeader.substring(0, 100) + '...' : 'None',
      allHeaders: allHeaders.map(([k]) => k)
    });
    
    // If callback failed, log detailed error
    if (pathname.includes('/callback') && response.status === 302 && !setCookieHeader) {
      console.error('❌ OAuth callback failed - no cookie set');
      console.error('   Check GOOGLE_CLIENT_SECRET in .env - it should be OAuth Client Secret, not API Key');
      console.error('   Current clientSecret starts with:', process.env.GOOGLE_CLIENT_SECRET?.substring(0, 20) + '...');
    }
    
    return response;
  } catch (error) {
    console.error('❌ NextAuth GET error:', error);
    console.error('   Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack?.split('\n').slice(0, 3).join('\n')
    });
    
    // If it's OAuth callback error, provide helpful message
    if (error.message?.includes('invalid_client') || error.message?.includes('Unauthorized')) {
      console.error('❌ CRITICAL: GOOGLE_CLIENT_SECRET is incorrect!');
      console.error('   This should be the OAuth 2.0 Client Secret from Google Cloud Console');
      console.error('   NOT the API Key!');
      console.error('   Get it from: Google Cloud Console > APIs & Services > Credentials > OAuth 2.0 Client ID');
    }
    
    throw error;
  }
}

export async function POST(req, context) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  
  // ✅ CRITICAL: Skip /api/auth/login and /api/auth/register - these should be proxied to backend
  // NextAuth handler should only handle OAuth routes (signin, signout, callback, session, etc.)
  if (pathname === '/api/auth/login' || pathname === '/api/auth/register') {
    console.log('⚠️ NextAuth POST: Skipping backend auth route (should be handled by catch-all proxy):', pathname);
    
    // ✅ Fix: Remove /api prefix from pathname since API_BASE_URL already includes /api
    // pathname: /api/auth/login → backendPath: /auth/login
    // API_BASE_URL: http://localhost:5000/api
    // Result: http://localhost:5000/api/auth/login (correct)
    const backendPath = pathname.startsWith('/api/') ? pathname.slice(4) : pathname;
    const backendUrl = `${API_BASE_URL}${backendPath}${url.search || ''}`;
    
    console.log('📤 NextAuth POST: Proxying to backend:', {
      pathname,
      backendPath,
      backendUrl,
      API_BASE_URL
    });
    
    try {
      const body = await req.text();
      const headers = {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || '',
        'Authorization': req.headers.get('authorization') || '',
      };
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers,
        body: body || undefined,
      });
      
      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }
      
      // Create NextResponse with proper status and forward Set-Cookie headers
      const nextResponse = NextResponse.json(responseData, {
        status: response.status,
      });
      
      // Forward Set-Cookie headers from backend using centralized utility
      forwardSetCookieHeaders(response, nextResponse);
      
      console.log('✅ NextAuth POST: Proxied backend auth route:', pathname, '→', backendUrl);
      return nextResponse;
    } catch (error) {
      console.error('❌ NextAuth POST: Error proxying backend auth route:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to proxy request to backend',
        message: error.message,
      }, {
        status: 502,
      });
    }
  }
  
  console.log('📥 NextAuth POST handler called:', {
    pathname
  });
  
  try {
    const response = await handler(req, context);
    
    // Check if cookie is set in response
    const setCookieHeader = response.headers.get('set-cookie');
    
    console.log('📤 NextAuth POST response:', {
      status: response?.status,
      hasSetCookie: !!setCookieHeader,
      cookieHeader: setCookieHeader ? setCookieHeader.substring(0, 100) + '...' : 'None'
    });
    
    return response;
  } catch (error) {
    console.error('❌ NextAuth POST error:', error);
    throw error;
  }
}

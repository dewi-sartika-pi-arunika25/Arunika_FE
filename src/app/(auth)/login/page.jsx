"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Lock, LogIn, Chrome, Home } from "lucide-react";
import { signIn, useSession, getSession } from "next-auth/react";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "@/lib/store/auth";

const Separator = () => (
  <div className="relative my-4">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t border-gray-200 dark:border-gray-700" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-white px-2 text-muted-foreground dark:bg-gray-900">
        Atau
      </span>
    </div>
  </div>
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle OAuth callback and error
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const code = searchParams.get('code');
    const callbackUrl = searchParams.get('callbackUrl');
    
    console.log('🔍 Login page loaded:', { errorParam, code, callbackUrl, status });
    
    // "OAuthCallback" is not an error, it's part of the OAuth flow
    // Only show error for actual error codes
    if (errorParam && errorParam !== 'OAuthCallback') {
      console.error('❌ OAuth error from URL:', errorParam);
      setError("Terjadi kesalahan saat login dengan Google. Silakan coba lagi.");
    } else if (errorParam === 'OAuthCallback') {
      console.log('ℹ️ OAuthCallback detected (not an error, just OAuth flow)');
    }

    // Handle OAuth success - sync dengan backend dan login ke Zustand
    const checkOAuthSession = async () => {
      // Skip if already processing redirect
      if (isLoading) {
        console.log('⏸️ Already processing OAuth, skipping...');
        return;
      }
      
      if (status === 'authenticated' && session) {
        console.log('✅ NextAuth session authenticated:', { 
          user: session.user, 
          hasTokens: !!(session.accessToken && session.refreshToken),
          email: session.user?.email,
          callbackUrl
        });
        setIsLoading(true); // Prevent multiple calls
        await handleOAuthSuccess(session);
      } else if (status === 'loading') {
        console.log('⏳ NextAuth status: loading...', { code, callbackUrl, errorParam });
        // Wait for session to be ready - useEffect will re-run when status changes
      } else if (status === 'unauthenticated') {
        // If we have callbackUrl or error=OAuthCallback, we're coming from OAuth - session might still be loading
        if (callbackUrl || code || errorParam === 'OAuthCallback') {
          console.log('⏳ OAuth callback detected, checking cookies...', { code, callbackUrl, errorParam });
          
          // Check if NextAuth session cookie exists
          if (typeof document !== 'undefined') {
            const cookies = document.cookie.split(';').reduce((acc, cookie) => {
              const [key, value] = cookie.trim().split('=');
              acc[key] = value;
              return acc;
            }, {});
            
            console.log('📋 Available cookies:', Object.keys(cookies));
            console.log('🍪 NextAuth session cookie:', cookies['next-auth.session-token'] ? 'Found' : 'Not found');
            console.log('🍪 Secure NextAuth session cookie:', cookies['__Secure-next-auth.session-token'] ? 'Found' : 'Not found');
          }
          
          // Force session refresh after OAuth callback
          if (errorParam === 'OAuthCallback' || callbackUrl) {
            console.log('🔄 Forcing session refresh...');
            // Try multiple times to get session (cookie might not be set immediately)
            let attempts = 0;
            const maxAttempts = 5;
            
            const checkSession = async () => {
              attempts++;
              try {
                const refreshedSession = await getSession();
                console.log(`🔄 Session refresh attempt ${attempts}/${maxAttempts}:`, { 
                  hasSession: !!refreshedSession,
                  email: refreshedSession?.user?.email 
                });
                
                if (refreshedSession) {
                  console.log('✅ Session found! Processing OAuth success...');
                  // Session is ready, trigger handleOAuthSuccess
                  await handleOAuthSuccess(refreshedSession);
                } else if (attempts < maxAttempts) {
                  // Try again after delay
                  setTimeout(checkSession, 1000);
                } else {
                  console.warn('⚠️ Session not found after multiple attempts');
                }
              } catch (err) {
                console.error('❌ Session refresh error:', err);
                if (attempts < maxAttempts) {
                  setTimeout(checkSession, 1000);
                }
              }
            };
            
            // Start checking after initial delay
            setTimeout(checkSession, 500);
          }
        } else {
          console.log('ℹ️ NextAuth status: unauthenticated (no OAuth callback)');
        }
      }
    };
    
    checkOAuthSession();
  }, [searchParams, status, session, isLoading]);

  const handleOAuthSuccess = async (session) => {
    try {
      console.log('🔄 Processing OAuth session...', { session });
      
      // Get tokens from NextAuth session
      const { accessToken, refreshToken } = session;
      
      if (accessToken && refreshToken) {
        console.log('✅ Tokens found in NextAuth session, syncing to Zustand...');
        // Tokens sudah ada dari NextAuth, langsung simpan ke Zustand
        login({
          access_token: accessToken,
          refresh_token: refreshToken,
          user: session.user,
          profile: session.user,
        });
        
        // Wait a bit for Zustand state to update and cookies to be set
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Get assessment status and redirect
        try {
          const meResponse = await authAPI.me();
          console.log('✅ me() response:', meResponse?.data);
          if (meResponse?.data?.success) {
            const hasAssessment = meResponse.data.data?.has_assessment || false;
            const redirectPath = hasAssessment ? '/personalized' : '/skill-match';
            console.log('🔀 Redirecting to:', redirectPath, 'hasAssessment:', hasAssessment);
            // Use window.location for full page redirect to avoid redirect loop
            window.location.href = redirectPath;
            return;
          } else {
            console.log('⚠️ me() response not successful, redirecting to skill-match');
            window.location.href = '/skill-match';
            return;
          }
        } catch (profileErr) {
          console.warn('⚠️ Failed to fetch profile:', profileErr);
          console.warn('⚠️ Error details:', {
            status: profileErr?.response?.status,
            data: profileErr?.response?.data,
            message: profileErr?.message
          });
          // Fallback: redirect to skill-match even if me() fails
          console.log('🔀 Fallback: Redirecting to skill-match');
          window.location.href = '/skill-match';
          return;
        }
      } else {
        console.log('⚠️ Tokens not in session, syncing with backend...');
        // Tokens belum ada, perlu sync dengan backend
        try {
          // Try register first
          const registerResponse = await authAPI.register({
            name: session.user.name || session.user.email,
            email: session.user.email,
            password: `oauth_${session.user.id}_${Date.now()}`,
          });

          if (registerResponse?.data?.success) {
            console.log('✅ Backend registration successful, syncing to Zustand...');
            login(registerResponse.data.data);
            
            // Redirect berdasarkan has_assessment
            const hasAssessment = registerResponse.data.data?.has_assessment || false;
            const redirectPath = hasAssessment ? '/personalized' : '/skill-match';
            console.log('🔀 Redirecting to:', redirectPath);
            window.location.href = redirectPath;
            return;
          } else {
            // User might already exist - redirect to skill-match
            console.log('⚠️ Registration failed, user might exist. Redirecting to skill-match...');
            window.location.href = '/skill-match';
            return;
          }
        } catch (registerErr) {
          console.error('❌ Backend registration error:', registerErr);
          
          // If user exists (409 Conflict), that's ok - redirect to skill-match
          if (registerErr?.response?.status === 409) {
            console.log('ℹ️ User already exists (409), redirecting to skill-match');
            window.location.href = '/skill-match';
            return;
          }
          
          setError("Gagal menyinkronkan akun Google. Silakan coba lagi.");
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.error('❌ OAuth sync error:', err);
      setError("Gagal menyinkronkan akun Google. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData.email, formData.password);
      if (response?.data?.success) {
        // ✅ Simpan ke Zustand store (otomatis persist ke localStorage)
        login(response.data.data);

        // Redirect ke personalized (kalau sudah punya akun, langsung ke personalized)
        router.push("/personalized");
      } else {
        setError(response?.data?.message || "Login gagal. Periksa kredensial Anda.");
      }
    } catch (err) {
      console.error('Login error:', err);
      // Extract error message with better handling
      let errorMessage = "Terjadi kesalahan saat login. Silakan coba lagi.";
      
      if (err?.response?.data) {
        // Try multiple error message locations
        const errorData = err.response.data;
        errorMessage = errorData?.error?.message || 
                      errorData?.error || 
                      errorData?.message || 
                      errorData?.data?.message ||
                      (typeof errorData === 'string' ? errorData : errorMessage);
      } else if (err?.response?.status === 401) {
        errorMessage = "Email atau kata sandi salah. Silakan coba lagi.";
      } else if (err?.response?.status === 404) {
        errorMessage = "Backend tidak dapat diakses. Pastikan server backend berjalan.";
      } else if (err?.response?.status >= 500) {
        errorMessage = "Terjadi kesalahan pada server. Silakan coba lagi nanti.";
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // ✅ Use default NextAuth path (/api/auth)
    signIn("google", { 
      callbackUrl: "/personalized",
      redirect: true
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex justify-center items-center"
            >
              <Home className="w-4 h-4 mr-1" /> Kembali ke Beranda
            </Link>
          </div>
          <CardTitle className="text-3xl font-bold flex items-center justify-center">
            <LogIn className="w-7 h-7 mr-2 text-primary" /> Masuk
          </CardTitle>
          <CardDescription>
            Selamat datang kembali. Masuk ke akun Anda.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4">
          {error && (
            <div className="p-3 rounded-md bg-red-100 text-red-700 text-sm border border-red-300">
              {error}
            </div>
          )}

          <Button
                              variant="outline"
                              onClick={handleGoogleSignIn}
                              className="w-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                              <FcGoogle className="mr-2 h-5 w-5" />
                              Masuk dengan Google
                              </Button>

          <Separator />

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Kata Sandi</Label>
                <a
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline text-primary hover:text-primary/80"
                >
                  Lupa kata sandi?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan kata sandi Anda"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? "Memproses..." : "Masuk"}
              {!isLoading && <LogIn className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-0">
          <p className="text-sm text-center text-gray-500">
            Belum punya akun?
            <a
              href="/register"
              className="ml-1 font-medium text-primary hover:underline"
            >
              Daftar di sini
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

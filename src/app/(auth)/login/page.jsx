"use client";
import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { Mail, Lock, LogIn, Home, Eye, EyeOff } from "lucide-react";
import { signIn, useSession, getSession } from "next-auth/react";
import Link from "next/link";
import { authAPI } from "@/lib/api";
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "@/lib/store/auth";
import { extractErrorMessage, formatApiError } from "@/lib/utils/errorHandler";

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

const getRedirectPath = (hasAssessment) => hasAssessment ? '/personalized' : '/skill-match';

function LoginContent() {
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const processingOAuthRef = useRef(false);
  const hasProcessedRef = useRef(false);

  const resetLoadingState = useCallback(() => {
    processingOAuthRef.current = false;
    setIsLoading(false);
  }, []);

  const redirectAfterAuth = useCallback((hasAssessment) => {
    resetLoadingState();
    window.location.href = getRedirectPath(hasAssessment);
  }, [resetLoadingState]);

  const handleOAuthSuccess = useCallback(async (session) => {
    if (processingOAuthRef.current || hasProcessedRef.current) {
      return;
    }

    if (isAuthenticated) {
      const hasAssessment = useAuthStore.getState().user?.has_assessment || false;
      redirectAfterAuth(hasAssessment);
      return;
    }

    processingOAuthRef.current = true;
    setIsLoading(true);

    try {
      // Use NextAuth session data directly - backend sync is handled in NextAuth callbacks
      const { accessToken, refreshToken, user } = session;
      
      // Cek apakah user sudah punya assessment dari token atau user data
      // Backend sync sudah dilakukan di NextAuth JWT callback, token mungkin sudah ada
      const hasAssessment = session.user?.has_assessment || 
                           user?.has_assessment || 
                           false;
      
      // Login dengan data dari NextAuth session
      login({
        access_token: accessToken || 'oauth_token',
        refresh_token: refreshToken || 'oauth_refresh',
        user: {
          id: user?.id || user?.email,
          email: user?.email,
          name: user?.name || user?.email,
          has_assessment: hasAssessment,
          ...user,
        },
        profile: {
          user_id: user?.id || user?.email,
          email: user?.email,
          name: user?.name || user?.email,
          has_assessment: hasAssessment,
          ...user,
        },
      });
      
      hasProcessedRef.current = true;
      // Redirect berdasarkan assessment status
      redirectAfterAuth(hasAssessment);
    } catch (err) {
      console.error('OAuth sync error:', err);
      setError("Gagal menyinkronkan akun Google. Silakan coba lagi.");
      resetLoadingState();
    }
  }, [isAuthenticated, login, redirectAfterAuth, resetLoadingState]);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const code = searchParams.get('code');
    const callbackUrl = searchParams.get('callbackUrl');
    
    if (isAuthenticated || hasProcessedRef.current) {
      return;
    }
    
    if (errorParam && errorParam !== 'OAuthCallback') {
      setError("Terjadi kesalahan saat login dengan Google. Silakan coba lagi.");
      return;
    }
    
    if (status === 'authenticated' && session) {
      handleOAuthSuccess(session);
    } else if (status === 'unauthenticated') {
      if (callbackUrl || code || errorParam === 'OAuthCallback') {
        if (isAuthenticated) {
          const hasAssessment = useAuthStore.getState().user?.has_assessment || false;
          redirectAfterAuth(hasAssessment);
          return;
        }
        
        if (!processingOAuthRef.current) {
          processingOAuthRef.current = true;
          
          let attempts = 0;
          const maxAttempts = 5;
          
          const checkSession = async () => {
            attempts++;
            try {
              if (isAuthenticated) {
                processingOAuthRef.current = false;
                return;
              }
              
              const refreshedSession = await getSession();
              
              if (refreshedSession) {
                await handleOAuthSuccess(refreshedSession);
              } else if (attempts < maxAttempts) {
                setTimeout(checkSession, 1000);
              } else {
                resetLoadingState();
              }
            } catch (err) {
              console.error('Session refresh error:', err);
              if (attempts < maxAttempts) {
                setTimeout(checkSession, 1000);
              } else {
                resetLoadingState();
              }
            }
          };
          
          setTimeout(checkSession, 500);
        }
      }
    }
  }, [searchParams, status, session, isAuthenticated, handleOAuthSuccess, redirectAfterAuth, resetLoadingState]);

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
        const userData = response.data.data;
        login(userData);
        
        // Check has_assessment untuk redirect yang tepat
        const hasAssessment = userData?.user?.has_assessment || 
                             userData?.profile?.has_assessment || 
                             userData?.has_assessment || 
                             false;
        
        window.location.href = getRedirectPath(hasAssessment);
      } else {
        setError(response?.data?.message || "Login gagal. Periksa kredensial Anda.");
      }
    } catch (err) {
      // Only log meaningful errors in development
      if (process.env.NODE_ENV === 'development') {
        const errorMsg = extractErrorMessage(err);
        if (errorMsg) {
          console.error('Login error:', errorMsg);
        }
      }
      
      // Use centralized error formatting
      const errorMessage = formatApiError(err, "Terjadi kesalahan saat login. Silakan coba lagi.");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
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
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi Anda"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none z-10"
                  disabled={isLoading}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

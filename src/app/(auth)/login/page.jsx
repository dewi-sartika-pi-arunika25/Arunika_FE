"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { Mail, Lock, LogIn, Home } from "lucide-react";
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

const getRedirectPath = (hasAssessment) => hasAssessment ? '/personalized' : '/skill-match';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
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
      const { accessToken, refreshToken } = session;
      
      if (accessToken && refreshToken) {
        login({
          access_token: accessToken,
          refresh_token: refreshToken,
          user: session.user,
          profile: session.user,
        });
        
        await new Promise(resolve => setTimeout(resolve, 200));
        
        try {
          const meResponse = await authAPI.me();
          if (meResponse?.data?.success) {
            const hasAssessment = meResponse.data.data?.has_assessment || false;
            hasProcessedRef.current = true;
            redirectAfterAuth(hasAssessment);
            return;
          }
        } catch (profileErr) {
          console.warn('Failed to fetch profile:', profileErr);
        }
        
        hasProcessedRef.current = true;
        redirectAfterAuth(false);
        return;
      }
      
      const authState = useAuthStore.getState();
      if (authState.isAuthenticated && authState.accessToken) {
        const hasAssessment = authState.user?.has_assessment || false;
        hasProcessedRef.current = true;
        redirectAfterAuth(hasAssessment);
        return;
      }
      
      try {
        const meResponse = await authAPI.me();
        if (meResponse?.data?.success) {
          login({
            access_token: session.accessToken || 'oauth_token',
            refresh_token: session.refreshToken || 'oauth_refresh',
            user: meResponse.data.data,
            profile: meResponse.data.data,
          });
          const hasAssessment = meResponse.data.data?.has_assessment || false;
          hasProcessedRef.current = true;
          redirectAfterAuth(hasAssessment);
          return;
        }
      } catch (meErr) {
        console.log('User might not exist, trying register...');
      }
      
      try {
        const registerResponse = await authAPI.register({
          name: session.user.name || session.user.email,
          email: session.user.email,
          password: `oauth_${session.user.id}_${Date.now()}`,
        });

        if (registerResponse?.data?.success) {
          login(registerResponse.data.data);
          const hasAssessment = registerResponse.data.data?.has_assessment || false;
          hasProcessedRef.current = true;
          redirectAfterAuth(hasAssessment);
          return;
        }
      } catch (registerErr) {
        if (registerErr?.response?.status === 409) {
          hasProcessedRef.current = true;
          redirectAfterAuth(false);
          return;
        }
        throw registerErr;
      }
      
      hasProcessedRef.current = true;
      redirectAfterAuth(false);
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
        login(response.data.data);
        window.location.href = "/personalized";
      } else {
        setError(response?.data?.message || "Login gagal. Periksa kredensial Anda.");
      }
    } catch (err) {
      console.error('Login error:', err);
      let errorMessage = "Terjadi kesalahan saat login. Silakan coba lagi.";
      
      if (err?.response?.data) {
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

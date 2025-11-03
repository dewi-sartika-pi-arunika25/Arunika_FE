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
    if (errorParam) {
      setError("Terjadi kesalahan saat login dengan Google. Silakan coba lagi.");
      return;
    }

    // Handle OAuth success - sync dengan backend dan login ke Zustand
    const checkOAuthSession = async () => {
      if (status === 'authenticated' && session) {
        await handleOAuthSuccess(session);
      }
    };
    
    checkOAuthSession();
  }, [searchParams, status]);

  const handleOAuthSuccess = async (session) => {
    try {
      // Get tokens from NextAuth session
      const { accessToken, refreshToken } = session;
      
      if (accessToken && refreshToken) {
        // Tokens sudah ada dari NextAuth, langsung simpan ke Zustand
        login({
          access_token: accessToken,
          refresh_token: refreshToken,
          user: session.user,
          profile: session.user,
        });
        
        // Redirect ke skill-match
        router.push('/skill-match');
      } else {
        // Tokens belum ada, perlu sync dengan backend
        const response = await authAPI.register({
          name: session.user.name || session.user.email,
          email: session.user.email,
          password: `oauth_${session.user.id}_${Date.now()}`,
        });

        if (response?.data?.success) {
          login(response.data.data);
          router.push('/skill-match');
        }
      }
    } catch (err) {
      console.error('OAuth sync error:', err);
      setError("Gagal menyinkronkan akun Google. Silakan coba lagi.");
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

        // Redirect ke skill-match
        router.push("/skill-match");
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
    // ✅ Updated to use /api/nextauth path
    // Explicitly set basePath to ensure client knows about custom path
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
};
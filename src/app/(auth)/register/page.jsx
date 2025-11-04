"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, ArrowRight, Chrome, Home, Eye, EyeOff } from 'lucide-react'; 
import Link from 'next/link';
import { authAPI } from '@/lib/api';
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "@/lib/store/auth";
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { getOAuthRedirectUrl } from "@/lib/utils/oauth";


const Separator = () => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <span className="w-full border-t" />
    </div>
    <div className="relative flex justify-center text-xs uppercase">
      <span className="bg-white px-2 text-muted-foreground dark:bg-gray-900">
        Atau
      </span>
    </div>
  </div>
);

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle OAuth callback from backend
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const successParam = searchParams.get('success');
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const userId = searchParams.get('user_id');
    const hasAssessment = searchParams.get('has_assessment') === 'true';

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      return;
    }

    // Handle successful OAuth callback
    if (successParam === 'true' && accessToken && refreshToken) {
      handleOAuthCallback(accessToken, refreshToken, userId, hasAssessment);
    }
  }, [searchParams]);
  
  const handleOAuthCallback = async (accessToken, refreshToken, userId, hasAssessment) => {
    try {
      // Save tokens first to Zustand store
      login({
        access_token: accessToken,
        refresh_token: refreshToken,
        user: { id: userId },
        profile: { user_id: userId },
      });

      // Try to get user profile from backend (optional)
      try {
        const meResponse = await authAPI.me();
        if (meResponse?.data?.success) {
          login({
            access_token: accessToken,
            refresh_token: refreshToken,
            user: meResponse.data.data.auth_user,
            profile: meResponse.data.data.profile,
          });
        }
      } catch (profileErr) {
        console.warn('Failed to fetch profile, using tokens only:', profileErr);
      }

      // Redirect based on assessment status
      if (hasAssessment) {
        router.push('/personalized');
      } else {
        router.push('/skill-match');
      }
    } catch (err) {
      console.error('OAuth callback error:', err);
      setError("Gagal memuat profil. Silakan coba lagi.");
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Kata sandi dan konfirmasi tidak cocok!');
      return;
    }

    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      
      });

      if (response.data.success) {
        login(response.data.data);

        // Redirect berdasarkan apakah user sudah punya assessment data
        const hasAssessment = response.data.data?.has_assessment || false;
        const redirectMessage = hasAssessment 
          ? 'Pendaftaran berhasil! Anda akan diarahkan ke dashboard...'
          : 'Pendaftaran berhasil! Anda akan diarahkan ke skill-match...';
        
        setSuccess(redirectMessage);
        setTimeout(() => {
          if (hasAssessment) {
            router.push('/personalized');
          } else {
            router.push('/skill-match');
          }
        }, 2000);
      }
    } catch (err) {
      setError(err?.response?.data?.error || 'Pendaftaran gagal. Silakan coba lagi.');
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = getOAuthRedirectUrl('register');
  };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1 text-center">
                    <div className="mb-4">
                        <Link href="/" passHref className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex justify-center items-center">
                            <Home className="w-4 h-4 mr-1" /> Kembali ke Beranda
                        </Link>
                    </div>
                    <CardTitle className="text-2xl font-bold flex items-center justify-center">
                        <User className="w-6 h-6 mr-2 text-primary" /> Buat Akun Baru
                    </CardTitle>
                    <CardDescription>
                        Daftar dengan email atau gunakan akun sosial Anda.
                    </CardDescription>
                </CardHeader>

        <CardContent className="grid gap-4">
          {error && (
            <div className="p-3 rounded-md bg-red-100 text-red-700 text-sm border border-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-md bg-green-100 text-green-700 text-sm border border-green-300">
              {success}
            </div>
          )}

                    <Button
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    className="w-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <FcGoogle className="mr-2 h-5 w-5" />
                    Daftar dengan Google
                    </Button>

          <Separator />

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m.doe@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ketik ulang kata sandi"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="pl-10 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              disabled={isLoading || !!success}
            >
              {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
              {!isLoading && !success && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pt-0">
          <p className="text-sm text-center text-gray-500">
            Sudah punya akun?
            <a href="/login" className="ml-1 font-medium text-primary hover:underline">
              Masuk di sini
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

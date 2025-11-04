"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock, ArrowRight, Chrome, Home, Eye, EyeOff } from 'lucide-react'; 
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { authAPI } from '@/lib/api'; // ✅ FIX: sebelumnya '@/app/lib/api'
import { FcGoogle } from "react-icons/fc";
import { useAuthStore } from "@/lib/store/auth";


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
        // ✅ Simpan ke Zustand store (otomatis persist ke localStorage)
        login(response.data.data);

        setSuccess('Pendaftaran berhasil! Anda akan diarahkan...');
        setTimeout(() => {
          // Redirect ke skill-match untuk user baru (belum ada assessment)
          router.push('/skill-match');
        }, 2000);
      }
    } catch (err) {
      console.error('Register error:', err);
      console.error('Error response data:', err?.response?.data);
      
      // Extract error message dari berbagai kemungkinan struktur
      let errorMessage = 'Pendaftaran gagal. Silakan coba lagi.';
      
      if (err?.response?.data) {
        const errorData = err.response.data;
        
        // Handle error object dengan keys {code, message, details}
        // Format: { success: false, error: { code: "...", message: "..." } }
        if (errorData?.error) {
          if (typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          } else if (typeof errorData.error === 'object') {
            // Extract message dari error object
            if (errorData.error.message) {
              errorMessage = errorData.error.message;
            } else if (errorData.error.code) {
              // Use code as fallback if no message
              errorMessage = errorData.error.code;
            } else if (errorData.error.details) {
              // Handle details - bisa string atau object
              if (typeof errorData.error.details === 'string') {
                errorMessage = errorData.error.details;
              } else if (Array.isArray(errorData.error.details)) {
                errorMessage = errorData.error.details.join(', ');
              } else if (typeof errorData.error.details === 'object') {
                errorMessage = Object.values(errorData.error.details).filter(v => typeof v === 'string').join(', ') || errorMessage;
              }
            } else {
              // Fallback: coba extract dari keys yang ada
              errorMessage = Object.values(errorData.error).find(v => typeof v === 'string') || errorMessage;
            }
          }
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (err?.response?.status === 400) {
        errorMessage = 'Data yang dimasukkan tidak valid. Periksa kembali semua field.';
      } else if (err?.response?.status === 409) {
        errorMessage = 'Email sudah terdaftar. Gunakan email lain atau login.';
      } else if (err?.response?.status === 401) {
        errorMessage = 'Autentikasi gagal. Silakan coba lagi.';
      } else if (err?.response?.status === 404) {
        errorMessage = 'Backend tidak dapat diakses. Pastikan server backend berjalan.';
      } else if (err?.response?.status >= 500) {
        errorMessage = 'Terjadi kesalahan pada server. Silakan coba lagi nanti.';
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      // Pastikan errorMessage selalu string (jika masih object, stringify)
      if (typeof errorMessage !== 'string') {
        console.warn('Error message is not a string, stringifying:', errorMessage);
        errorMessage = JSON.stringify(errorMessage);
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // ✅ Use default NextAuth path (/api/auth)
    signIn('google', { callbackUrl: '/personalized' });
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
}


"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, CheckCheck, AlertCircle } from 'lucide-react';
import { authAPI } from '@/app/lib/api';

const ResetPasswordPage = () => {
  const router = useRouter();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validasi
    if (!password || !confirmPassword) {
      setError('Harap isi semua kolom.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Kata sandi tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.');
      return;
    }

    setIsLoading(true);

    try {
      // Token otomatis ambil dari Authorization header (localStorage)
      // Backend verify dengan token dari header
      const response = await authAPI.resetPassword(password);

      if (response.data.success) {
        setSuccess(true);
        setPassword('');
        setConfirmPassword('');

        // Redirect ke login setelah 2 detik
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Gagal mengatur ulang password. Silakan coba lagi.'
      );
      console.error('Reset password error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Jika reset berhasil
  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-sm text-center shadow-2xl">
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <CheckCheck className="w-16 h-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Sukses!</CardTitle>
            <CardDescription>
              Kata sandi Anda telah berhasil diubah. 
              Anda akan diarahkan ke halaman login dalam beberapa detik...
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Link href="/login" className="w-full">
              <Button className="w-full">
                Masuk Sekarang
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Atur Ulang Kata Sandi</CardTitle>
          <CardDescription>
            Masukkan kata sandi baru untuk akun Anda.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {error && (
              <div className="p-3 rounded-md bg-red-100 text-red-700 text-sm border border-red-300 flex gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="password">Kata Sandi Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  required
                  minLength={6}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ketik ulang kata sandi"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  required
                  minLength={6}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <p className="text-xs text-gray-500">
              Kata sandi harus minimal 6 karakter dan kedua kata sandi harus cocok.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-0">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Ubah Kata Sandi'}
            </Button>

            <Link href="/login" className="w-full">
              <Button 
                variant="outline"
                className="w-full"
                type="button"
              >
                Kembali ke Login
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
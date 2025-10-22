"use client";
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, CheckCheck } from 'lucide-react'; 

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <Card className="w-full max-w-sm text-center">
          <CardTitle className="text-2xl text-red-600">Token Hilang</CardTitle>
          <CardDescription className="mt-2">
            Token reset kata sandi tidak ditemukan. Silakan coba langkah lupa kata sandi lagi.
          </CardDescription>
          <CardContent className="pt-4">
            <Link href="/login">
              <Button variant="link">Kembali ke Halaman Masuk</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'Kata sandi tidak cocok.' });
      return;
    }

    if (password.length < 8) {
      setStatusMessage({ type: 'error', text: 'Kata sandi minimal 8 karakter.' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setStatusMessage({ type: 'success', text: data.message || 'Kata sandi berhasil diubah!' });
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2500);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Token tidak valid atau kadaluarsa.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Terjadi kesalahan jaringan.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Atur Ulang Kata Sandi</CardTitle>
          <CardDescription>Masukkan kata sandi baru untuk akun Anda.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {statusMessage.text && (
              <div className={`p-3 rounded-md text-sm ${
                statusMessage.type === 'success'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {statusMessage.text}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="password">Kata Sandi Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                  disabled={isLoading || statusMessage.type === 'success'}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="pl-10"
                  disabled={isLoading || statusMessage.type === 'success'}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2 pt-0">
            <Button type="submit" disabled={isLoading || statusMessage.type === 'success'}>
              {isLoading ? 'Memproses...' : (
                statusMessage.type === 'success' ? (
                  <>Sandi Berhasil Diubah <CheckCheck className="ml-2 h-4 w-4" /></>
                ) : 'Ubah Kata Sandi'
              )}
            </Button>

            <Link href="/login" className="text-sm font-medium text-primary hover:underline w-full text-center">
              {statusMessage.type === 'success' ? 'Masuk Sekarang' : 'Batal dan Kembali ke Login'}
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
